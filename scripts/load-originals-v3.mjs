// NovelStack Originals — V3 loader.
//
// Loads the 8 new ★ books from `originals/11..52*.md` into the live Render
// Postgres database, alongside the 5 books already seeded by
// SEED_ORIGINALS_V2.sql. Adds 8 new seed-author personas to host the new
// books (one persona per book, spread across 8 genre lanes — see
// SEED_CATALOGUE_LOG.md for the catalogue).
//
// Idempotent and partial-run-safe:
//   - seed personas already present (by username) are skipped
//   - stories already present (by slug) are skipped
//   - chapters are inserted only for our stories that currently have ZERO
//     chapters, so an interrupted run is fully repaired by re-running
//
// Usage:
//   DATABASE_URL='postgres://…' node scripts/load-originals-v3.mjs
//
// In the Render shell (where DATABASE_URL is already set):
//   cd /opt/render/project/src && node scripts/load-originals-v3.mjs
//
import postgres from 'postgres';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const ORIGINALS = path.join(REPO, 'originals');

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('FATAL: set DATABASE_URL (the Render Postgres connection string).');
  process.exit(1);
}
const sql = postgres(DB_URL, { ssl: 'require', connect_timeout: 30, max: 2 });

// --- Catalogue --------------------------------------------------------------
// One entry per ★ book. Persona metadata is collocated so it's obvious which
// books belong to which house pen-name. See SEED_CATALOGUE_LOG.md for the
// full editorial context, blurbs, and lane assignments.
const CATALOGUE = [
  {
    file: '11_the_daughter_they_kept.md',
    persona: {
      username: 'hannahglass',
      email: 'hannahglass+seed@novelstack.local',
      displayName: 'Hannah Glass',
      bio: 'Bristol-based crime writer. Domestic suspense and quiet-room thrillers.',
    },
    coverColor: '#2E3B33',
  },
  {
    file: '17_the_brother_of_the_don.md',
    persona: {
      username: 'romyhall',
      email: 'romyhall+seed@novelstack.local',
      displayName: 'Romy Hall',
      bio: 'Dark romance. Mafia, kings, monsters with manners.',
    },
    coverColor: '#1A1714',
  },
  {
    file: '25_the_crown_of_hollow_years.md',
    persona: {
      username: 'elenavasse',
      email: 'elenavasse+seed@novelstack.local',
      displayName: 'Elena Vasse',
      bio: 'Fae courts and cold rooms. Companion novels to the Frostbound world.',
    },
    coverColor: '#1F2A33',
  },
  {
    file: '32_the_wedding_off_season.md',
    persona: {
      username: 'callielowe',
      email: 'callielowe+seed@novelstack.local',
      displayName: 'Callie Lowe',
      bio: 'Soft contemporary romance. Hotels, islands, the weather as a third character.',
    },
    coverColor: '#3F4956',
  },
  {
    file: '39_the_forwards.md',
    persona: {
      username: 'blakerivers',
      email: 'blakerivers+seed@novelstack.local',
      displayName: 'Blake Rivers',
      bio: 'College sports romance. Hockey, hot drinks, two captains.',
    },
    coverColor: '#0E2236',
  },
  {
    file: '43_the_library_at_vellichor.md',
    persona: {
      username: 'blackwellpress',
      email: 'blackwellpress+seed@novelstack.local',
      displayName: 'Blackwell Press',
      bio: 'Imprint pen-name. Dark academia, paranormal, the long shelf.',
    },
    coverColor: '#1B2A22',
  },
  {
    file: '48_the_other_girl_in_the_photograph.md',
    persona: {
      username: 'catrionafield',
      email: 'catrionafield+seed@novelstack.local',
      displayName: 'Catriona Field',
      bio: 'Quiet domestic dramas. Wales, Cornwall, kitchens with photographs on the wall.',
    },
    coverColor: '#2C2722',
  },
  {
    file: '52_the_beech_hill_reading_society.md',
    persona: {
      username: 'hennegrover',
      email: 'hennegrover+seed@novelstack.local',
      displayName: 'Henne Grover',
      bio: 'Village mysteries. Reading societies, fishing boats, a body or two.',
    },
    coverColor: '#23362F',
  },
];

// --- Helpers ---------------------------------------------------------------
function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[''‘’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
function words(s) {
  return s.trim().split(/\s+/).filter(Boolean);
}
function summarise(body) {
  const w = words(body);
  return {
    wordCount: w.length,
    pageCount: Math.max(1, Math.ceil(w.length / 250)),
    excerpt: w.slice(0, 60).join(' '),
  };
}

// Parses one of our `originals/NN_*.md` files into { title, genre, status,
// mature, description, chapterTitle, body }. The parser is intentionally
// strict about the format — it expects the exact header layout used by
// books 06-10 and 11-52.
function parseOriginal(md) {
  const titleMatch = md.match(/^#\s+\d+\s*·\s*(.+?)\s*$/m);
  if (!titleMatch) throw new Error('No title line (`# NN · Title`)');
  const title = titleMatch[1].trim();

  const get = (label) => {
    const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+?)\\s*$`, 'm');
    const m = md.match(re);
    return m ? m[1].trim() : null;
  };
  const author = get('Author');
  const genreRaw = get('Genre');
  const statusRaw = get('Status to set');
  const matureRaw = get('Mature');

  const genreMap = {
    thriller: 'thriller',
    mystery: 'mystery',
    crime: 'crime',
    horror: 'horror',
    romance: 'romance',
    fantasy: 'fantasy',
    'science fiction': 'scifi',
    scifi: 'scifi',
    'young adult': 'young_adult',
    ya: 'young_adult',
    contemporary: 'contemporary',
    historical: 'historical',
    drama: 'drama',
    paranormal: 'paranormal',
  };
  const genre = genreMap[(genreRaw || '').toLowerCase()] || 'other';

  const statusMap = {
    ongoing: 'ongoing',
    complete: 'complete',
    draft: 'draft',
  };
  const status = statusMap[(statusRaw || '').toLowerCase()] || 'ongoing';

  const mature = /^yes/i.test(matureRaw || '');

  // Description sits in a blockquote after "**Description (paste into …):**"
  const descMatch = md.match(/\*\*Description[^*]*?\*\*\s*\n\n>\s*([\s\S]+?)\n\n---/);
  if (!descMatch) throw new Error('No description block');
  const description = descMatch[1].replace(/\n>\s*/g, ' ').trim();

  // Chapter 1 — title is `## Chapter 1 — <title>` (or `· <pov> · <title>`)
  const chapHeader = md.match(/^##\s+Chapter\s+1\s+[—·-]\s+(.+?)\s*$/m);
  if (!chapHeader) throw new Error('No `## Chapter 1` heading');
  const chapterTitle = chapHeader[1].trim();

  // Body — everything after the chapter-1 heading line.
  const bodyStart = md.indexOf(chapHeader[0]) + chapHeader[0].length;
  const body = md.slice(bodyStart).trim();
  if (body.length < 800) throw new Error('Chapter body unexpectedly short');

  return { title, author, genre, status, mature, description, chapterTitle, body };
}

// --- Main ------------------------------------------------------------------
const report = {
  personasCreated: 0,
  personasExisting: 0,
  storiesCreated: 0,
  storiesExisting: 0,
  chaptersCreated: 0,
  errors: [],
};

async function ensurePersona(p) {
  // Lookup by username first — that's the unique surface we care about.
  const existing = await sql`
    SELECT id FROM users WHERE username = ${p.username} LIMIT 1
  `;
  if (existing.length) {
    report.personasExisting += 1;
    return existing[0].id;
  }
  // Insert. is_seed=true; role='writer'; no DOB. Email is fake (+seed
  // suffix) so it won't collide with any real signup.
  const [row] = await sql`
    INSERT INTO users (email, username, display_name, bio, role, is_seed)
    VALUES (${p.email}, ${p.username}, ${p.displayName}, ${p.bio}, 'writer', true)
    RETURNING id
  `;
  report.personasCreated += 1;
  return row.id;
}

async function ensureStory(authorId, entry) {
  const parsed = entry.parsed;
  // Stable slug per title — append a 6-char hex if we ever need disambig
  // but the catalogue titles are unique so the slug is the canonical key.
  const slug = slugify(parsed.title);

  const existing = await sql`SELECT id FROM stories WHERE slug = ${slug} LIMIT 1`;
  if (existing.length) {
    report.storiesExisting += 1;
    return { storyId: existing[0].id, created: false };
  }

  const [row] = await sql`
    INSERT INTO stories
      (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
    VALUES
      (${authorId}, ${parsed.title}, ${slug}, ${parsed.description},
       ${parsed.genre}, ${parsed.status}, ${entry.coverColor}, ${parsed.mature}, now())
    RETURNING id
  `;
  report.storiesCreated += 1;
  return { storyId: row.id, created: true };
}

async function ensureChapter(storyId, parsed) {
  // Only insert a chapter if the story currently has none — keeps the
  // loader idempotent. (Authors who want more chapters add them via the app.)
  const existing = await sql`
    SELECT count(*)::int AS n FROM chapters WHERE story_id = ${storyId}
  `;
  if (existing[0].n > 0) return;

  const { wordCount, pageCount, excerpt } = summarise(parsed.body);
  const [ch] = await sql`
    INSERT INTO chapters
      (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
    VALUES
      (${storyId}, 1, ${parsed.chapterTitle}, ${excerpt}, ${wordCount}, ${pageCount}, true, now())
    RETURNING id
  `;
  await sql`
    INSERT INTO chapter_content (chapter_id, body) VALUES (${ch.id}, ${parsed.body})
  `;
  report.chaptersCreated += 1;
}

(async () => {
  console.log('NovelStack Originals — V3 loader');
  console.log(`  reading from: ${ORIGINALS}`);
  console.log(`  ${CATALOGUE.length} catalogue entries\n`);

  // Parse first so we fail fast on any malformed markdown.
  const entries = [];
  for (const c of CATALOGUE) {
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

  // Now talk to the DB, one entry at a time so the log reads cleanly.
  for (const entry of entries) {
    try {
      const authorId = await ensurePersona(entry.persona);
      const { storyId } = await ensureStory(authorId, entry);
      await ensureChapter(storyId, entry.parsed);
      console.log(`  ✓ ${entry.parsed.title}  (@${entry.persona.username})`);
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
  if (report.errors.length) {
    console.log(`  errors           : ${report.errors.length}`);
    for (const e of report.errors) console.log(`    - ${e}`);
  }

  await sql.end({ timeout: 5 });
  process.exit(report.errors.length ? 1 : 0);
})();
