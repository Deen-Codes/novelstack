// NovelStack Originals — V4 loader (multi-chapter).
//
// Successor to load-originals-v3.mjs. Key difference: parses ALL `## Chapter N`
// sections in each /originals/*.md file (not just chapter 1) and inserts each
// as a separate chapter row. Use this loader from now on for any seed book
// that is being grown past chapter 1.
//
// Idempotent and safe to re-run:
//   - seed personas already present (by username) are skipped
//   - stories already present (by slug) are skipped — story metadata is NOT
//     re-applied on re-run (so changes to description/genre in markdown
//     won't be pushed unless you wipe + reseed). Story creation is one-shot.
//   - chapters: looks up the highest existing `number` for the story and
//     only inserts chapters with a higher number. Means you can add a new
//     `## Chapter N+1` to any markdown file and run the loader again to
//     ingest just the new chapter.
//   - chapter content (the body) is upserted — re-running with an edited
//     existing chapter body WILL overwrite the body in chapter_content.
//     (Chapter metadata — title, word count — is NOT updated on rerun.)
//
// Catalogue is read from scripts/originals-catalogue.json so v4 doesn't
// need a hardcoded list — adding a new book = adding a JSON entry +
// dropping a markdown file in /originals.
//
// Usage:
//   DATABASE_URL='postgres://…' node scripts/load-originals-v4.mjs
//   DATABASE_URL='postgres://…' node scripts/load-originals-v4.mjs --only=11,17
//

import postgres from 'postgres';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const ORIGINALS = path.join(REPO, 'originals');
const CATALOGUE_FILE = path.join(__dirname, 'originals-catalogue.json');

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('FATAL: set DATABASE_URL (the Render Postgres connection string).');
  process.exit(1);
}

// --only=11,17,32  → process just those book numbers
const ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith('--only='));
  if (!arg) return null;
  return new Set(arg.slice('--only='.length).split(',').map((s) => s.trim()));
})();

const sql = postgres(DB_URL, { ssl: 'require', connect_timeout: 30, max: 2 });

// --- Catalogue --------------------------------------------------------------
const CATALOGUE = JSON.parse(await readFile(CATALOGUE_FILE, 'utf8'));

// --- Helpers ---------------------------------------------------------------
function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[''‘’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
function words(s) { return s.trim().split(/\s+/).filter(Boolean); }
function summarise(body) {
  const w = words(body);
  return {
    wordCount: w.length,
    pageCount: Math.max(1, Math.ceil(w.length / 250)),
    excerpt: w.slice(0, 60).join(' '),
  };
}

// Strip editorial markers ([FADE TO BLACK — …]) before computing word count
// and excerpt — they're for the human editor, not the reader. The body is
// inserted as-is though (with the marker) so a future pass can find them.
function stripEditorial(body) {
  return body.replace(/\[FADE TO BLACK[^\]]*\]/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

// Parse the file metadata header (Author/Genre/Status/Mature/Description)
// and the list of chapters. Each chapter is a `## Chapter N — Title` heading
// followed by prose until the next `## Chapter` heading (or EOF).
function parseOriginal(md) {
  const titleMatch = md.match(/^#\s+\d+\s*·\s*(.+?)\s*$/m);
  if (!titleMatch) throw new Error('No title line (`# NN · Title`)');
  const title = titleMatch[1].trim();

  const get = (label) => {
    const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+?)\\s*$`, 'm');
    const m = md.match(re);
    return m ? m[1].trim() : null;
  };

  const genreMap = {
    thriller: 'thriller', mystery: 'mystery', crime: 'crime', horror: 'horror',
    romance: 'romance', fantasy: 'fantasy', 'science fiction': 'scifi', scifi: 'scifi',
    'young adult': 'young_adult', ya: 'young_adult', contemporary: 'contemporary',
    historical: 'historical', drama: 'drama', paranormal: 'paranormal',
  };
  const genre = genreMap[(get('Genre') || '').toLowerCase()] || 'other';

  const statusMap = { ongoing: 'ongoing', complete: 'complete', draft: 'draft' };
  const status = statusMap[(get('Status to set') || '').toLowerCase()] || 'ongoing';
  const mature = /^yes/i.test(get('Mature') || '');

  const descMatch = md.match(/\*\*Description[^*]*?\*\*\s*\n\n>\s*([\s\S]+?)\n\n---/);
  if (!descMatch) throw new Error('No description block');
  const description = descMatch[1].replace(/\n>\s*/g, ' ').trim();

  // Find every `## Chapter N — Title` heading. Use a global match so we get
  // every chapter, then slice the body between each heading and the next.
  const chapterRe = /^##\s+Chapter\s+(\d+)\s+[—·-]\s+(.+?)\s*$/gm;
  const heads = [];
  let m;
  while ((m = chapterRe.exec(md)) !== null) {
    heads.push({
      number: parseInt(m[1], 10),
      heading: m[0],
      title: m[2].trim(),
      start: m.index + m[0].length,
    });
  }
  if (!heads.length) throw new Error('No `## Chapter N` headings');

  const chapters = heads.map((h, i) => {
    const end = i + 1 < heads.length ? heads[i + 1].start - heads[i + 1].heading.length : md.length;
    const body = stripEditorial(md.slice(h.start, end).trim());
    if (body.length < 200) throw new Error(`Chapter ${h.number} body unexpectedly short`);
    return { number: h.number, title: h.title, body };
  });

  // Validate chapter numbers are 1..N with no gaps.
  chapters.sort((a, b) => a.number - b.number);
  for (let i = 0; i < chapters.length; i += 1) {
    if (chapters[i].number !== i + 1) {
      throw new Error(`Chapter numbering gap at chapter ${i + 1} (found ${chapters[i].number})`);
    }
  }

  return { title, genre, status, mature, description, chapters };
}

// --- DB layer --------------------------------------------------------------
const report = {
  personasCreated: 0, personasExisting: 0,
  storiesCreated: 0, storiesExisting: 0,
  chaptersCreated: 0, chaptersExisting: 0, chapterContentReplaced: 0,
  errors: [],
};

async function ensurePersona(p) {
  const existing = await sql`SELECT id FROM users WHERE username = ${p.username} LIMIT 1`;
  if (existing.length) {
    report.personasExisting += 1;
    return existing[0].id;
  }
  const [row] = await sql`
    INSERT INTO users (email, username, display_name, bio, role, is_seed)
    VALUES (${p.email}, ${p.username}, ${p.displayName}, ${p.bio}, 'writer', true)
    RETURNING id
  `;
  report.personasCreated += 1;
  return row.id;
}

async function ensureStory(authorId, entry, parsed) {
  // Canonical lookup is (author_id, title) — not slug. V2's seeder used a
  // random 6-char hex suffix on every slug, so re-deriving the slug from
  // the title would miss the existing row and produce a duplicate.
  const existing = await sql`
    SELECT id FROM stories
    WHERE author_id = ${authorId} AND title = ${parsed.title}
    LIMIT 1
  `;
  if (existing.length) {
    report.storiesExisting += 1;
    return existing[0].id;
  }
  // New books only — fresh slug derived from the title. Append random hex
  // to be safe against a (unlikely) cross-account title collision.
  const slug = (entry.slugOverride || slugify(parsed.title)) + '-' +
    Math.random().toString(16).slice(2, 8);
  const [row] = await sql`
    INSERT INTO stories
      (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
    VALUES
      (${authorId}, ${parsed.title}, ${slug}, ${parsed.description},
       ${parsed.genre}, ${parsed.status}, ${entry.coverColor}, ${parsed.mature}, now())
    RETURNING id
  `;
  report.storiesCreated += 1;
  return row.id;
}

async function ensureChapters(storyId, parsedChapters) {
  // Look up the highest chapter number already in DB for this story. Insert
  // only chapters whose number is greater. Replaces only the body of any
  // existing chapter we have a markdown source for (so edits propagate).
  const existing = await sql`
    SELECT id, number FROM chapters WHERE story_id = ${storyId}
  `;
  const byNumber = new Map(existing.map((r) => [r.number, r.id]));

  for (const ch of parsedChapters) {
    const { wordCount, pageCount, excerpt } = summarise(ch.body);
    if (byNumber.has(ch.number)) {
      // Body might have been edited — refresh chapter_content only.
      const chId = byNumber.get(ch.number);
      await sql`
        UPDATE chapter_content SET body = ${ch.body} WHERE chapter_id = ${chId}
      `;
      report.chaptersExisting += 1;
      report.chapterContentReplaced += 1;
    } else {
      const [row] = await sql`
        INSERT INTO chapters
          (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
        VALUES
          (${storyId}, ${ch.number}, ${ch.title}, ${excerpt}, ${wordCount}, ${pageCount},
           ${ch.number === 1}, now())
        RETURNING id
      `;
      await sql`INSERT INTO chapter_content (chapter_id, body) VALUES (${row.id}, ${ch.body})`;
      report.chaptersCreated += 1;
    }
  }
}

// --- Main ------------------------------------------------------------------
(async () => {
  console.log('NovelStack Originals — V4 loader (multi-chapter)');
  console.log(`  reading from: ${ORIGINALS}`);
  console.log(`  catalogue   : ${CATALOGUE_FILE}`);
  console.log(`  entries     : ${CATALOGUE.length}${ONLY ? ` (filtered: ${[...ONLY].join(',')})` : ''}\n`);

  const work = CATALOGUE.filter((c) => {
    if (!ONLY) return true;
    const num = c.file.match(/^(\d+)/)?.[1];
    return num && ONLY.has(num);
  });

  // Parse first so we fail fast on malformed markdown.
  const entries = [];
  for (const c of work) {
    try {
      const md = await readFile(path.join(ORIGINALS, c.file), 'utf8');
      entries.push({ ...c, parsed: parseOriginal(md) });
    } catch (e) {
      report.errors.push(`parse ${c.file}: ${e.message}`);
    }
  }
  if (report.errors.length) {
    console.error('Parse errors:\n  ' + report.errors.join('\n  '));
    process.exit(1);
  }

  for (const entry of entries) {
    try {
      const authorId = await ensurePersona(entry.persona);
      const storyId = await ensureStory(authorId, entry, entry.parsed);
      await ensureChapters(storyId, entry.parsed.chapters);
      const n = entry.parsed.chapters.length;
      console.log(`  ✓ ${entry.parsed.title}  (@${entry.persona.username}) — ${n} chapter${n === 1 ? '' : 's'}`);
    } catch (e) {
      report.errors.push(`${entry.file}: ${e.message}`);
      console.log(`  ✗ ${entry.parsed.title}  — ${e.message}`);
    }
  }

  console.log('');
  console.log('Done.');
  console.log(`  personas created : ${report.personasCreated}`);
  console.log(`  personas existing: ${report.personasExisting}`);
  console.log(`  stories  created : ${report.storiesCreated}`);
  console.log(`  stories  existing: ${report.storiesExisting}`);
  console.log(`  chapters created : ${report.chaptersCreated}`);
  console.log(`  chapters existing: ${report.chaptersExisting} (${report.chapterContentReplaced} content refreshed)`);
  if (report.errors.length) {
    console.log(`  errors           : ${report.errors.length}`);
    for (const e of report.errors) console.log(`    - ${e}`);
  }
  await sql.end({ timeout: 5 });
  process.exit(report.errors.length ? 1 : 0);
})();
