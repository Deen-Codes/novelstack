# NovelStack — migration to Render

Moving off Supabase. New stack is database + API + hosting all on Render,
email on Resend, domain stays at Cloudflare (DNS only, pointing at Render).

## Why this is phased

The website and iPhone app currently work against Supabase. We do **not** rip
that out on day one. The new stack is built on a `render-migration` branch and
proven end to end *before* anything cuts over. Until the final cutover, the
live site and app keep running on Supabase. Nothing breaks in between.

## Target architecture

| Layer | Now (Supabase) | After (Render) |
|---|---|---|
| Database | Supabase Postgres | Render PostgreSQL |
| API | Supabase auto-API (PostgREST) | Next.js route handlers (`web/app/api/*`) — hand-built |
| Auth | Supabase Auth (magic link) | Magic-link auth we own — tokens emailed via Resend, JWT sessions |
| Email | Supabase built-in mailer | Resend |
| Web hosting | Cloudflare Workers | Render Web Service (auto-deploys on `git push`) |
| Domain | Cloudflare | Cloudflare DNS → Render |

Database access uses **Drizzle ORM** (typed SQL, no dashboard). The schema
lives in the repo as code; changes are commit-and-push.

The Next.js app serves both the website and the API. The iPhone app calls the
same API route handlers over HTTPS.

## Phases

1. **Foundation** — Render Postgres provisioned; schema ported to Drizzle;
   Resend wired in. No user impact.
2. **Auth** — magic-link sign-in we own (request → Resend email → verify →
   JWT). Web uses an httpOnly cookie; mobile stores the token.
3. **API** — a route handler for every operation the apps need (feed, story,
   chapters, bookmarks, follows, reading progress, write/publish, comments,
   search). Supabase row-level security rules become authorization checks in
   these handlers.
4. **Web rewrite** — swap every Supabase call in the website for the new API /
   direct Drizzle queries.
5. **Mobile rewrite** — swap every Supabase call in the Expo app for the new
   API; wire the new auth flow.
6. **Data migration + cutover** — copy users/stories/chapters across, deploy on
   Render, point Cloudflare DNS at Render, rebuild the iOS app. Retire Supabase.

## What you need to provision (I can't create accounts)

1. **Render account** — connect the `Deen-Codes/novelstack` GitHub repo.
2. **Render PostgreSQL** instance — send me its connection string.
3. **Render Web Service** — root directory `web`, build `npm run build`,
   auto-deploy on push. (Set up at cutover; details later.)
4. **Resend account** — verify `novelstack.app`, create an API key, send it to
   me (or set it as a Render env var).

### Heads-up on cost

Supabase's free tier was genuinely free. Render PostgreSQL is free only for a
limited trial period, then ~$7/mo; a Render Web Service that doesn't sleep is
also ~$7/mo. Budget roughly **$14/mo**. Not a blocker — just so it's not a
surprise.

## Status

Tracked in the task list. Phase 1 code starts now; it doesn't need your
accounts, so we work in parallel — you provision, I build.
