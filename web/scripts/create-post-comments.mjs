// Creates the `post_comments` table (replies on community updates) on the
// live Render database. Idempotent.  node scripts/create-post-comments.mjs
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
  create table if not exists post_comments (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references posts(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    body text not null,
    created_at timestamptz not null default now()
  )
`;
await sql`create index if not exists idx_post_comments_post on post_comments (post_id, created_at)`;
await sql`
  create table if not exists post_likes (
    post_id uuid not null references posts(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (post_id, user_id)
  )
`;
const [{ c1 }] = await sql`select count(*)::int as c1 from post_comments`;
const [{ c2 }] = await sql`select count(*)::int as c2 from post_likes`;
console.log(`post_comments: ${c1} rows · post_likes: ${c2} rows.`);
await sql.end();
