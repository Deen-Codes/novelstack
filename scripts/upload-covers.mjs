// NovelStack Originals — bulk cover uploader.
//
// Reads cover image files from assets/covers/, uploads each to Cloudflare R2,
// patches the matching story.cover_url in Render Postgres. Use this when
// you've generated cover art for the seed catalogue (e.g. via GPT image-gen)
// and want it live without manually uploading each one through the app.
//
// Lookup convention: for each entry in scripts/originals-catalogue.json
// the script looks for an image at:
//
//   assets/covers/<NN>_<slug>.<ext>
//
// where <NN>_<slug> is the same prefix as the markdown filename (e.g.
// "06_the_housekeepers_lie") and <ext> is one of png / jpg / jpeg / webp.
// If no image is found, that book is skipped (logged, not an error).
//
// Idempotent on intent: re-running will re-upload + re-patch. Each upload
// gets a fresh R2 key (uuid), so old keys are orphaned in R2 — fine for
// the small seed catalogue, can be cleaned up later if needed.
//
// Usage:
//
//   DATABASE_URL='postgres://…' \
//   R2_ENDPOINT='https://<account>.r2.cloudflarestorage.com' \
//   R2_ACCESS_KEY_ID='…' \
//   R2_SECRET_ACCESS_KEY='…' \
//   R2_BUCKET='novelstack-covers' \
//   NEXT_PUBLIC_SITE_URL='https://novelstack.app' \
//   node scripts/upload-covers.mjs
//
// Filter to specific books with --only=06,17:
//
//   node scripts/upload-covers.mjs --only=06,17
//

import postgres from 'postgres';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const COVERS_DIR = path.join(REPO, 'assets', 'covers');
const CATALOGUE_FILE = path.join(__dirname, 'originals-catalogue.json');
const ENV_FILE = path.join(__dirname, '.env.covers');

// Auto-load env from scripts/.env.covers if it exists. One-time setup: copy
// the 5 R2 + DB credentials into that file (KEY=value lines, gitignored),
// then every subsequent run is just `node scripts/upload-covers.mjs` with
// no env vars on the command line. Inline env vars override the file.
if (existsSync(ENV_FILE)) {
  const lines = readFileSync(ENV_FILE, 'utf8').split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith("'") && val.endsWith("'")) ||
      (val.startsWith('"') && val.endsWith('"'))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
  console.log(`  (env loaded from ${path.relative(REPO, ENV_FILE)})\n`);
}

// --- env --------------------------------------------------------------------
function reqEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`FATAL: ${name} is required. See top of file for the full env list.`);
    process.exit(1);
  }
  return v;
}
const DB_URL = reqEnv('DATABASE_URL');
const R2_ENDPOINT = reqEnv('R2_ENDPOINT');
const R2_ACCESS_KEY_ID = reqEnv('R2_ACCESS_KEY_ID');
const R2_SECRET_ACCESS_KEY = reqEnv('R2_SECRET_ACCESS_KEY');
const R2_BUCKET = process.env.R2_BUCKET || 'novelstack-covers';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://novelstack.app';

const ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith('--only='));
  if (!arg) return null;
  return new Set(arg.slice('--only='.length).split(',').map((s) => s.trim()));
})();

// --- clients ---------------------------------------------------------------
const sql = postgres(DB_URL, { ssl: 'require', connect_timeout: 30, max: 2 });
const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

// --- helpers ---------------------------------------------------------------
const EXT_BY_MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };
const TRY_EXTS = ['png', 'jpg', 'jpeg', 'webp'];

// Walks through the candidate extensions until it finds one that exists.
async function findCoverFile(prefix) {
  for (const ext of TRY_EXTS) {
    const p = path.join(COVERS_DIR, `${prefix}.${ext}`);
    if (existsSync(p)) return { path: p, ext };
  }
  return null;
}

// Upload a single file buffer to R2 with a UUID key, return the full cover URL
// that gets stored on stories.cover_url.
async function uploadAndGetUrl(buffer, ext) {
  const key = `${randomUUID()}.${ext}`;
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: EXT_BY_MIME[ext] || 'image/png',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return `${SITE_URL}/api/covers/${key}`;
}

// --- main ------------------------------------------------------------------
const report = { uploaded: 0, skipped: 0, errors: [] };

(async () => {
  console.log('NovelStack Originals — bulk cover uploader');
  console.log(`  covers dir: ${COVERS_DIR}`);
  console.log(`  catalogue : ${CATALOGUE_FILE}`);
  console.log(`  R2 bucket : ${R2_BUCKET}`);
  console.log(`  site url  : ${SITE_URL}`);

  const catalogue = JSON.parse(await readFile(CATALOGUE_FILE, 'utf8'));
  const work = catalogue.filter((c) => {
    if (!ONLY) return true;
    const num = c.file.match(/^(\d+)/)?.[1];
    return num && ONLY.has(num);
  });
  console.log(`  entries   : ${work.length}${ONLY ? ` (filtered: ${[...ONLY].join(',')})` : ''}\n`);

  for (const entry of work) {
    // Strip the ".md" → look for matching cover image with same prefix.
    const prefix = entry.file.replace(/\.md$/, '');

    const found = await findCoverFile(prefix);
    if (!found) {
      console.log(`  · ${prefix}  — no image on disk (tried .${TRY_EXTS.join(', .')}), skipping`);
      report.skipped += 1;
      continue;
    }

    try {
      // Pull the story id by (author username + title) — title is read from
      // the markdown file's `# NN · Title` line.
      const md = await readFile(path.join(REPO, 'originals', entry.file), 'utf8');
      const titleMatch = md.match(/^#\s+\d+\s*·\s*(.+?)\s*$/m);
      if (!titleMatch) throw new Error(`No title in ${entry.file}`);
      const title = titleMatch[1].trim();

      const author = await sql`
        SELECT id FROM users WHERE username = ${entry.persona.username} LIMIT 1
      `;
      if (!author.length) throw new Error(`Author @${entry.persona.username} not found — run load-originals-v4.mjs first`);

      const story = await sql`
        SELECT id, cover_url FROM stories
        WHERE author_id = ${author[0].id} AND title = ${title}
        LIMIT 1
      `;
      if (!story.length) throw new Error(`Story "${title}" not found for @${entry.persona.username}`);

      // Upload and patch.
      const stats = await stat(found.path);
      const buf = await readFile(found.path);
      const newUrl = await uploadAndGetUrl(buf, found.ext);
      await sql`
        UPDATE stories SET cover_url = ${newUrl}, updated_at = now()
        WHERE id = ${story[0].id}
      `;

      const sizeKb = Math.round(stats.size / 1024);
      const old = story[0].cover_url ? '(replaced)' : '(was empty)';
      console.log(`  ✓ ${prefix}  — ${sizeKb} KB ${old}`);
      report.uploaded += 1;
    } catch (e) {
      report.errors.push(`${prefix}: ${e.message}`);
      console.log(`  ✗ ${prefix}  — ${e.message}`);
    }
  }

  console.log('');
  console.log('Done.');
  console.log(`  uploaded : ${report.uploaded}`);
  console.log(`  skipped  : ${report.skipped}`);
  if (report.errors.length) {
    console.log(`  errors   : ${report.errors.length}`);
    for (const e of report.errors) console.log(`    - ${e}`);
  }

  await sql.end({ timeout: 5 });
  process.exit(report.errors.length ? 1 : 0);
})();
