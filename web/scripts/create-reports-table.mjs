// Creates the `reports` table (content moderation) on the live Render
// database. Idempotent.  node scripts/create-reports-table.mjs
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
  create table if not exists reports (
    id uuid primary key default gen_random_uuid(),
    reporter_id uuid not null references users(id) on delete cascade,
    story_id uuid references stories(id) on delete cascade,
    chapter_id uuid references chapters(id) on delete cascade,
    reason text not null,
    detail text,
    status text not null default 'open',
    created_at timestamptz not null default now()
  )
`;
await sql`create index if not exists idx_reports_status on reports (status, created_at)`;
const [{ count }] = await sql`select count(*)::int as count from reports`;
console.log(`reports table ready — ${count} rows.`);
await sql.end();
