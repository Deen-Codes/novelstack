// End-to-end test of the writing experience: create a story, add a chapter
// with NovelStack's fiction-Markdown, read it back, verify the excerpt is
// stripped of markup, edit it, then delete it and clean up.
//   node scripts/e2e-write-test.mjs
//
// Run this AFTER the latest commit has deployed to Render — it exercises the
// new /api/me/image route, chapter DELETE and the markdown-aware excerpt.
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

// 1. Mint a session for the reviewer account through the real auth flow.
const raw = randomBytes(32).toString('base64url');
const hash = createHash('sha256').update(raw).digest('hex');
await sql`
  insert into auth_tokens (email, token_hash, expires_at)
  values ('reviewer@novelstack.app', ${hash}, now() + interval '1 hour')
`;
const vr = await fetch(`${BASE}/api/auth/verify`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ token: raw }),
});
const vj = await vr.json().catch(() => ({}));
const TOKEN = vj.token;
log(vr.status === 200 && !!TOKEN, 'auth/verify → session JWT', `status ${vr.status}`);
if (!TOKEN) {
  console.log('\nNo session token — aborting.');
  await sql.end();
  process.exit(1);
}
const H = { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` };
const api = (p, method = 'GET', body) =>
  fetch(`${BASE}${p}`, {
    method,
    headers: H,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

// The markdown body a writer would produce in the immersive editor.
const MD = [
  '## The Harbour',
  '',
  'The water was **still** that morning — the kind of *stillness* that comes before a storm.',
  '',
  '> She had written a single line in her notebook, and underlined it twice.',
  '',
  '* * *',
  '',
  'By the time the bells rang noon, nothing was where she had left it.',
].join('\n');

let storyId, slug, chapterId;
try {
  // 2. Create a story.
  const csR = await api('/api/me/stories', 'POST', {
    title: 'E2E Writing Test Story',
    description: 'Temporary story created by e2e-write-test.mjs.',
    genre: 'fantasy',
  });
  const story = await csR.json().catch(() => ({}));
  storyId = story.id;
  slug = story.slug;
  log(csR.status === 200 && !!storyId, 'POST /api/me/stories', `status ${csR.status}`);

  // 3. Create a chapter with a markdown body.
  const ccR = await api(`/api/me/stories/${storyId}/chapters`, 'POST', {
    title: 'Chapter 1',
    body: MD,
    isFree: true,
  });
  const chapter = await ccR.json().catch(() => ({}));
  chapterId = chapter.id;
  log(ccR.status === 200 && !!chapterId, 'POST chapters (markdown body)', `status ${ccR.status}`);

  // 4. Read the chapter back and confirm the body round-tripped intact.
  const gR = await api(`/api/chapters/${chapterId}`);
  const got = await gR.json().catch(() => ({}));
  log(gR.status === 200 && got.body === MD, 'GET /api/chapters/:id — body intact');

  // 5. The excerpt must NOT contain raw markdown syntax.
  const ex = got.excerpt || '';
  const cleanExcerpt =
    !ex.includes('**') && !ex.includes('## ') && !ex.includes('> ') && !ex.includes('* * *');
  log(cleanExcerpt, 'excerpt is stripped of markdown', JSON.stringify(ex.slice(0, 60)));

  // 6. Edit the chapter.
  const patchR = await api(`/api/me/chapters/${chapterId}`, 'PATCH', {
    title: 'Chapter 1 — Revised',
    body: MD + '\n\nA new closing paragraph, added on edit.',
  });
  log(patchR.status === 200, 'PATCH /api/me/chapters/:id', `status ${patchR.status}`);
  const afterEdit = await (await api(`/api/chapters/${chapterId}`)).json().catch(() => ({}));
  log(afterEdit.title === 'Chapter 1 — Revised', 'edit persisted');

  // 7. The image route must exist and reject an empty/unauthed request cleanly.
  const imgNoFile = await api('/api/me/image', 'POST', {});
  log(
    imgNoFile.status === 400 || imgNoFile.status === 503,
    'POST /api/me/image — exists, rejects no-file',
    `status ${imgNoFile.status}`,
  );

  // 8. Delete the chapter.
  const delR = await api(`/api/me/chapters/${chapterId}`, 'DELETE');
  log(delR.status === 200, 'DELETE /api/me/chapters/:id', `status ${delR.status}`);
  const gone = await api(`/api/chapters/${chapterId}`);
  log(gone.status === 404, 'deleted chapter is gone (404)', `status ${gone.status}`);
  chapterId = null;
} finally {
  // 9. Clean up — remove the test story (chapters cascade).
  if (storyId) {
    const dR = await api(`/api/me/stories/${storyId}`, 'DELETE');
    log(dR.status === 200, 'cleanup — DELETE test story', `status ${dR.status}`);
  }
}

console.log(`\n${pass} passed, ${fail} failed.`);
await sql.end();
process.exit(fail > 0 ? 1 : 0);
