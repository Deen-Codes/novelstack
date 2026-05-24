// Seeds a handful of community update posts from seed authors so the feed
// has life. Idempotent-ish — running twice just adds more.
//   node scripts/seed-posts.mjs
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

const MESSAGES = [
  'New chapter goes up tonight — thank you all for reading. 🕯️',
  'Halfway through the next arc and it is going somewhere I did not expect.',
  'Reached a milestone this week I never thought I would. Genuinely speechless — thank you.',
  'Taking the weekend to outline the final stretch. Back Monday with two chapters.',
  'Your comments on the last chapter kept me writing through a rough week. Thank you.',
  'Small update: edited chapters 3 and 4 — the pacing should read much better now.',
  'Wrote 4,000 words today and I think it is some of my favourite work yet.',
  'A reader asked if there will be a sequel. The honest answer: yes, eventually. 🙂',
  'Slow week for writing, but the next chapter is worth the wait — I promise.',
  'Thinking about the ending a lot lately. It is going to hurt. In a good way.',
  'Thank you to everyone who has been leaving reviews — they genuinely make my day.',
  'New chapter is with my beta reader. If all goes well, it is up by Friday.',
  'I do not say it enough: this community is the reason I keep showing up to the page.',
  'Quiet announcement — I have started something new on the side. More soon.',
];

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const authors = await sql`
  select u.id from users u
  where u.is_seed = true
    and exists (select 1 from stories s where s.author_id = u.id)
  order by random()
  limit 16
`;

let inserted = 0;
for (let i = 0; i < authors.length; i += 1) {
  const author = authors[i];
  const body = MESSAGES[i % MESSAGES.length];
  let storyId = null;
  if (Math.random() < 0.6) {
    const [s] = await sql`
      select id from stories where author_id = ${author.id} order by random() limit 1
    `;
    storyId = s?.id ?? null;
  }
  const daysAgo = Math.random() * 12;
  await sql`
    insert into posts (author_id, body, story_id, created_at)
    values (${author.id}, ${body}, ${storyId}, now() - (${daysAgo} || ' days')::interval)
  `;
  inserted += 1;
}

console.log(`Seeded ${inserted} community posts.`);
await sql.end();
