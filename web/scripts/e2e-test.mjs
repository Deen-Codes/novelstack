// End-to-end API test pass. Mints a magic-link token for the reviewer
// account through the real auth flow, then exercises every protected
// endpoint and reports pass/fail.  node scripts/e2e-test.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import postgres from 'postgres';

const here = dirname(fileURLToPath(import.meta.url));
try {
  for (const line of readFileSync(join(here, '..', '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const BASE = 'https://novelstack.onrender.com';
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

let pass = 0;
let fail = 0;
const log = (ok, name, extra = '') => {
  if (ok) pass += 1;
  else fail += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
};

// 1. Mint a magic-link token for the reviewer account.
const raw = randomBytes(32).toString('base64url');
const hash = createHash('sha256').update(raw).digest('hex');
await sql`
  insert into auth_tokens (email, token_hash, expires_at)
  values ('reviewer@novelstack.app', ${hash}, now() + interval '1 hour')
`;

// 2. Exchange it for a session JWT.
const vr = await fetch(`${BASE}/api/auth/verify`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ token: raw }),
});
const vj = await vr.json().catch(() => ({}));
const TOKEN = vj.token;
log(vr.status === 200 && !!TOKEN, 'auth/verify → session JWT', `status ${vr.status}`);
if (!TOKEN) {
  console.log('\nNo session token — aborting authed tests.');
  await sql.end();
  process.exit(1);
}
const me = vj.user;
const H = { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` };
const get = (p) => fetch(`${BASE}${p}`, { headers: H });
const post = (p, body) =>
  fetch(`${BASE}${p}`, { method: 'POST', headers: H, body: JSON.stringify(body ?? {}) });

// 3. Authed reads.
const sessionR = await get('/api/auth/session');
log(sessionR.status === 200, 'GET /api/auth/session');

const shelfR = await get('/api/me/shelf');
const shelf = await shelfR.json().catch(() => ({}));
log(shelfR.status === 200 && Array.isArray(shelf.saved), 'GET /api/me/shelf');

const homeR = await get('/api/me/home');
log(homeR.status === 200, 'GET /api/me/home');

const feedR = await get('/api/feed');
const feed = await feedR.json().catch(() => []);
log(feedR.status === 200 && feed.length > 0, 'GET /api/feed', `${feed.length} stories`);

const communityR = await get('/api/community');
const community = await communityR.json().catch(() => []);
log(communityR.status === 200 && Array.isArray(community), 'GET /api/community', `${community.length} posts`);

const notifR = await get('/api/notifications');
const notifs = await notifR.json().catch(() => []);
log(notifR.status === 200 && Array.isArray(notifs), 'GET /api/notifications', `${notifs.length} items`);

// 4. Pick a story + author to act against.
const story = feed.find((s) => s.author && s.author.id !== me.id);
const author = story?.author;

// 5. Follow → tip → bookmark.
if (author) {
  const followR = await post('/api/follows', { authorId: author.id });
  log(followR.status === 200, 'POST /api/follows');

  const tipR = await post('/api/tips', {
    recipientId: author.id,
    storyId: story.id,
    amount: 500,
    message: 'e2e test tip',
  });
  log(tipR.status === 200, 'POST /api/tips', `status ${tipR.status}`);

  const bmR = await post('/api/bookmarks', { storyId: story.id });
  log(bmR.status === 200, 'POST /api/bookmarks');

  const reportR = await post('/api/reports', {
    storyId: story.id,
    reason: 'spam',
    detail: 'e2e test report',
  });
  log(reportR.status === 200, 'POST /api/reports', `status ${reportR.status}`);
}

// 6. Post an update → fetch it → comment → like.
const createPostR = await post('/api/posts', { body: 'e2e test update from the reviewer.' });
const newPost = await createPostR.json().catch(() => ({}));
log(createPostR.status === 200 && !!newPost.id, 'POST /api/posts', `status ${createPostR.status}`);

if (newPost.id) {
  const postR = await get(`/api/posts/${newPost.id}`);
  const postDetail = await postR.json().catch(() => ({}));
  log(postR.status === 200 && postDetail.id === newPost.id, 'GET /api/posts/:id');

  const commentR = await post(`/api/posts/${newPost.id}/comments`, { body: 'e2e test comment' });
  log(commentR.status === 200, 'POST /api/posts/:id/comments', `status ${commentR.status}`);

  const likeR = await post(`/api/posts/${newPost.id}/like`, {});
  const likeJ = await likeR.json().catch(() => ({}));
  log(likeR.status === 200 && likeJ.liked === true, 'POST /api/posts/:id/like');
}

// 7. Chapter read + ad-unlock.
const storyDetailR = await get(`/api/stories/${story?.slug}`);
const storyDetail = await storyDetailR.json().catch(() => ({}));
log(storyDetailR.status === 200 && Array.isArray(storyDetail.chapters), 'GET /api/stories/:slug');
const firstChapter = storyDetail.chapters?.find((c) => c.publishedAt);
if (firstChapter) {
  const readR = await post('/api/reads', {
    chapterId: firstChapter.id,
    progressPct: 100,
    completed: true,
  });
  log(readR.status === 200, 'POST /api/reads');

  const unlockR = await post('/api/ad-unlocks', { chapterId: firstChapter.id });
  log(unlockR.status === 200, 'POST /api/ad-unlocks', `status ${unlockR.status}`);
}

// 8. Verify rows actually landed in the database.
const [{ tips: tipCount }] = await sql`select count(*)::int as tips from tips`;
const [{ posts: postCount }] = await sql`select count(*)::int as posts from posts`;
const [{ rep: repCount }] = await sql`select count(*)::int as rep from reports`;
const [{ no: notifCount }] = await sql`select count(*)::int as no from notifications`;
const [{ un: unlockCount }] = await sql`select count(*)::int as un from ad_unlocks`;
console.log(
  `\nDB rows — tips:${tipCount} posts:${postCount} reports:${repCount} notifications:${notifCount} ad_unlocks:${unlockCount}`,
);

console.log(`\n${pass} passed, ${fail} failed.`);
await sql.end();
