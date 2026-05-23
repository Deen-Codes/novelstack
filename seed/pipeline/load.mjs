// NovelStack — seed catalogue loader (batched).
//
// Ingests generated author + book data into the live Render Postgres database.
// Idempotent and partial-run-safe:
//   - authors already present (username/email) are skipped
//   - stories already present (slug) are skipped
//   - chapters are (re)inserted for any of our stories that currently have
//     ZERO chapters, so a run interrupted between the story and chapter
//     inserts is fully repaired by simply running again.
// Uses batched multi-row inserts so a full wave loads in seconds.
//
// Data layout (see seed/README.md):
//   seed/data/authors/<username>.json
//   seed/data/books/<slug>.json
//   seed/data/chapters/<slug>/<n>.txt
//
// Usage:  DATABASE_URL='postgres://…' node seed/pipeline/load.mjs
//
import postgres from 'postgres';
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('FATAL: set DATABASE_URL (the Render Postgres connection string).');
  process.exit(1);
}

const DATA = path.resolve(import.meta.dirname, '..', 'data');
const AUTHORS_DIR = path.join(DATA, 'authors');
const BOOKS_DIR = path.join(DATA, 'books');
const CHAPTERS_DIR = path.join(DATA, 'chapters');

const sql = postgres(DB_URL, { ssl: 'require', connect_timeout: 30, max: 4 });

// --- helpers ---------------------------------------------------------------
function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function popularityStats(p) {
  switch (p) {
    case 'hit':    return { reads: rnd(25000, 220000), followers: rnd(900, 9000) };
    case 'rising': return { reads: rnd(4000, 26000), followers: rnd(150, 1300) };
    case 'modest': return { reads: rnd(350, 4200), followers: rnd(15, 220) };
    default:       return { reads: rnd(0, 380), followers: rnd(0, 35) };
  }
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
function daysAgo(n) { return new Date(Date.now() - n * 86_400_000); }
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}
async function readJsonDir(dir) {
  if (!existsSync(dir)) return [];
  const files = (await readdir(dir)).filter((f) => f.endsWith('.json'));
  const out = [];
  for (const f of files) {
    try {
      out.push({ file: f, data: JSON.parse(await readFile(path.join(dir, f), 'utf8')) });
    } catch (e) {
      console.warn(`  ! skipped malformed JSON: ${dir}/${f} — ${e.message}`);
    }
  }
  return out;
}

const report = { authorsNew: 0, storiesNew: 0, chaptersNew: 0, errors: [] };

// --- main ------------------------------------------------------------------
try {
  const before = await sql`
    select (select count(*)::int from users where is_seed) as seed_users,
           (select count(*)::int from stories) as stories,
           (select count(*)::int from chapters) as chapters`;
  console.log('Before:', before[0]);

  // ---- AUTHORS ----
  const authorFiles = await readJsonDir(AUTHORS_DIR);
  const authorByUsername = new Map();
  for (const { file, data: a } of authorFiles) {
    if (!a.username || !a.email || !a.displayName) {
      report.errors.push(`author ${file}: missing username/email/displayName`);
      continue;
    }
    const created = daysAgo(a.joinedDaysAgo ?? rnd(20, 1400));
    authorByUsername.set(a.username.toLowerCase(), {
      email: a.email.toLowerCase(),
      username: a.username.toLowerCase(),
      display_name: a.displayName,
      bio: a.bio ?? null,
      role: 'writer',
      is_seed: true,
      created_at: created,
      updated_at: created,
    });
  }
  const authorRows = [...authorByUsername.values()];
  console.log(`Authors: ${authorRows.length} persona files.`);
  for (const b of chunk(authorRows, 200)) {
    await sql`insert into users ${sql(b, 'email', 'username', 'display_name', 'bio', 'role', 'is_seed', 'created_at', 'updated_at')} on conflict do nothing`;
  }
  const userRows = await sql`select id, username from users`;
  const userIdByName = new Map(userRows.map((r) => [r.username, r.id]));

  // ---- STORIES ----
  const bookFiles = await readJsonDir(BOOKS_DIR);
  const bookBySlug = new Map();
  const storyRows = [];
  for (const { file, data: bk } of bookFiles) {
    if (!bk.slug || !bk.title || !bk.authorUsername) {
      report.errors.push(`book ${file}: missing slug/title/authorUsername`);
      continue;
    }
    const authorId = userIdByName.get(bk.authorUsername.toLowerCase());
    if (!authorId) {
      report.errors.push(`book ${bk.slug}: unknown author "${bk.authorUsername}"`);
      continue;
    }
    bookBySlug.set(bk.slug, bk);
    const pub = daysAgo(bk.publishedDaysAgo ?? rnd(1, 900));
    const stats = popularityStats(bk.popularity ?? 'modest');
    storyRows.push({
      author_id: authorId,
      title: bk.title,
      slug: bk.slug,
      description: bk.description ?? null,
      cover_url: null,
      cover_color: bk.coverColor ?? '#D85A30',
      genre: bk.genre ?? 'other',
      tags: bk.tags ?? [],
      status: bk.status ?? 'ongoing',
      is_mature: bk.isMature ?? false,
      total_reads: stats.reads,
      total_followers: stats.followers,
      published_at: pub,
      created_at: pub,
      updated_at: pub,
    });
  }
  console.log(`Books: ${storyRows.length} valid book files.`);
  for (const b of chunk(storyRows, 150)) {
    await sql`insert into stories ${sql(b, 'author_id', 'title', 'slug', 'description', 'cover_url', 'cover_color', 'genre', 'tags', 'status', 'is_mature', 'total_reads', 'total_followers', 'published_at', 'created_at', 'updated_at')} on conflict (slug) do nothing`;
  }

  // ---- CHAPTERS ---- (for any of our stories that currently have none)
  const mySlugs = [...bookBySlug.keys()];
  const needChapters = [];
  for (const part of chunk(mySlugs, 500)) {
    const rows = await sql`
      select s.id, s.slug, s.published_at
      from stories s
      where s.slug = any(${part})
        and not exists (select 1 from chapters c where c.story_id = s.id)`;
    needChapters.push(...rows);
  }
  report.authorsNew = (await sql`select count(*)::int n from users where is_seed`)[0].n - before[0].seed_users;
  report.storiesNew = (await sql`select count(*)::int n from stories`)[0].n - before[0].stories;
  console.log(`Stories needing chapters: ${needChapters.length}`);

  const chapterRows = [];
  const bodies = []; // parallel: { slug, number, body }
  for (const st of needChapters) {
    const bk = bookBySlug.get(st.slug);
    if (!bk) continue;
    const pubMs = new Date(st.published_at).getTime();
    for (const ch of (bk.chapters ?? []).slice().sort((a, b) => a.number - b.number)) {
      const bodyPath = path.join(CHAPTERS_DIR, bk.slug, `${ch.number}.txt`);
      if (!existsSync(bodyPath)) {
        report.errors.push(`book ${bk.slug}: missing chapter file ${ch.number}.txt`);
        continue;
      }
      const body = await readFile(bodyPath, 'utf8');
      const { wordCount, pageCount, excerpt } = summarise(body);
      const chPub = new Date(Math.min(Date.now(), pubMs + (ch.number - 1) * 3 * 86_400_000));
      chapterRows.push({
        story_id: st.id,
        number: ch.number,
        title: ch.title ?? `Chapter ${ch.number}`,
        excerpt,
        word_count: wordCount,
        page_count: pageCount,
        is_free: ch.isFree ?? ch.number <= 3,
        published_at: chPub,
        created_at: chPub,
        updated_at: chPub,
      });
      bodies.push({ story_id: st.id, number: ch.number, body });
    }
  }

  const bodyByKey = new Map(bodies.map((b) => [`${b.story_id}|${b.number}`, b.body]));
  for (const b of chunk(chapterRows, 150)) {
    const inserted = await sql`
      insert into chapters ${sql(b, 'story_id', 'number', 'title', 'excerpt', 'word_count', 'page_count', 'is_free', 'published_at', 'created_at', 'updated_at')}
      returning id, story_id, number`;
    const contentRows = inserted.map((r) => ({
      chapter_id: r.id,
      body: bodyByKey.get(`${r.story_id}|${r.number}`) ?? '',
    }));
    for (const cb of chunk(contentRows, 150)) {
      await sql`insert into chapter_content ${sql(cb, 'chapter_id', 'body')} on conflict (chapter_id) do nothing`;
    }
    report.chaptersNew += inserted.length;
  }

  const after = await sql`
    select (select count(*)::int from users where is_seed) as seed_users,
           (select count(*)::int from stories) as stories,
           (select count(*)::int from chapters) as chapters`;

  console.log('\n=== LOAD REPORT ===');
  console.log(`Authors inserted this run: ${report.authorsNew}`);
  console.log(`Stories inserted this run: ${report.storiesNew}`);
  console.log(`Chapters inserted this run: ${report.chaptersNew}`);
  console.log('After:', after[0]);
  if (report.errors.length) {
    console.log(`\nErrors/warnings (${report.errors.length}):`);
    for (const e of report.errors.slice(0, 40)) console.log('  - ' + e);
    if (report.errors.length > 40) console.log(`  …and ${report.errors.length - 40} more`);
  }
} catch (e) {
  console.error('FATAL:', e.message);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
