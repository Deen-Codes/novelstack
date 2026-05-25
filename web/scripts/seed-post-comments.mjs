// Seeds a few comments and likes onto existing community posts so the
// thread/like UI has content to show. Idempotent-ish.
//   node scripts/seed-post-comments.mjs
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
} catch {}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const COMMENTS = [
  'Love this — can’t wait for the next chapter.',
  'Your writing always makes my week. Thank you.',
  'Take all the time you need, the quality is worth it.',
  'That last chapter genuinely got me. Incredible.',
  'Just caught up — this story has me hooked.',
  'Reading this on every commute. Please keep going!',
  'The pacing on this one is perfect.',
  'You’ve got a new follower in me. Brilliant work.',
  'No notes. This is exactly the update I needed today.',
  'Rooting for these characters so hard right now.',
];

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const posts = await sql`select id from posts order by created_at desc limit 30`;
let comments = 0;
let likes = 0;
for (const post of posts) {
  // 1–4 comments per post from random readers.
  const n = 1 + Math.floor(Math.random() * 4);
  const readers = await sql`
    select id from users where is_seed = true order by random() limit ${n}
  `;
  for (let i = 0; i < readers.length; i += 1) {
    await sql`
      insert into post_comments (post_id, user_id, body, created_at)
      values (${post.id}, ${readers[i].id}, ${COMMENTS[(comments + i) % COMMENTS.length]},
              now() - (${Math.random() * 6} || ' days')::interval)
    `;
    comments += 1;
  }
  // A handful of likes per post.
  const likers = await sql`
    select id from users where is_seed = true order by random() limit ${3 + Math.floor(Math.random() * 8)}
  `;
  for (const liker of likers) {
    await sql`
      insert into post_likes (post_id, user_id) values (${post.id}, ${liker.id})
      on conflict do nothing
    `;
    likes += 1;
  }
}

console.log(`Seeded ${comments} comments and ${likes} likes across ${posts.length} posts.`);
await sql.end();
