// Creates the `posts` table (author updates / community feed) on the live
// Render database. Idempotent — safe to run more than once.
//   node scripts/create-posts-table.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import postgres from 'postgres';

const here = dirname(fileURLToPath(import.meta.url));
try {
  for (const line of readFileSync(join(here, '..', '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  // rely on the environment
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
await sql`
  create table if not exists posts (
    id uuid primary key default gen_random_uuid(),
    author_id uuid not null references users(id) on delete cascade,
    body text not null,
    story_id uuid references stories(id) on delete set null,
    created_at timestamptz not null default now()
  )
`;
await sql`create index if not exists idx_posts_author on posts (author_id)`;
await sql`create index if not exists idx_posts_created on posts (created_at desc)`;
const [{ count }] = await sql`select count(*)::int as count from posts`;
console.log(`posts table ready — ${count} rows.`);
await sql.end();
