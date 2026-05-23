# NovelStack — MVP Progress

## Current status — 8-bullet summary (latest)

- **Project lives in `~/Documents/novelstack`** — canonical source; commit/push from here.
- **Backend fully live.** Supabase project + schema + seed + migration 001 applied — DOB, reports, blocks, reading_events, takedown/admin flags all live.
- **Web app upgraded to Next.js 15 + React 19** and wired for **Cloudflare Workers** via the OpenNext adapter (`open-next.config.ts`, `wrangler.jsonc`). Deploy steps in `DEPLOY.md`.
- **Web + mobile both de-stubbed** — auth, write, library, ranked home feed, search, profile, comments, moderation, tipping, age-gating all on real data. Mobile has the PKCE deep-link auth callback and a Search tab.
- **Audit done, bugs fixed** — critical: the `follows` query (broken FK embed that emptied "writers you follow") fixed on web + mobile. Also: published-only chapter lists, `reads.is_subscriber` now recorded for the payout split, sitemap fixed, DOB editor added to web Settings, fake landing-page stats replaced with honest figures.
- **Nothing is compiled yet** — the sandbox can't `npm install`. First `npm run dev` / `npm run preview` is the first real build; expect a few first-build fixes (esp. from the Next 15 upgrade).
- **Testing runbook:** `TESTING.md` — web local + Cloudflare preview, mobile Expo Go + dev build, plus a feature checklist.
- **Mobile story-detail screen built** — mobile users can now bookmark, follow, tip and report from a real story page. Remaining feature gaps: Stripe (subscriptions + payouts) and a real ad network, plus the ~100-account seed run. See "What's left" below.

## What's left before MVP launch

**1 — Get it compiling (do first).** `npm install` then `npm run dev` in `web/`,
fix first-build errors (the Next 15 upgrade was done without a compiler).
Then `npm run preview` for the Cloudflare build. Then `npm install` +
`npx expo start` in `mobile/`.

**2 — Real feature gaps still to build:**
- Subscriptions / NovelStack+ — no checkout, no billing page; nothing writes to
  the `subscriptions` table. Needs Stripe.
- Writer payouts — the 70/30 pool split + payout runs are not built. Needs
  Stripe Connect (and an LLC/EIN).
- Real ad network — the banner ad and the "watch an ad" gate are placeholders;
  ad revenue is recorded as 0.

**3 — Smaller polish:**
- Mobile profile: add a date-of-birth editor (web Settings already has one).
- Mobile search: free-text covers titles only (web also matches description/tags).

**4 — Ops / non-code (Deen):**
- Run the deploy — see `DEPLOY.md` (push, install, preview, `wrangler login`,
  deploy, connect `novelstack.app`).
- Supabase auth URL config for the live domain.
- Publish an abuse-contact email + a content-policy/ToS page; set up an NCMEC
  reporting account (the moderation legal floor).
- The ~100-account catalog seed run — see `CATALOG_SEED_PLAN.md`.
- Apple Developer app-store listing + assets for the mobile submission.
- Open decision: seed-account transparency (house accounts vs ordinary writers).

## Summary for Deen

- **The web app is functionally MVP-complete** across all eight feature areas you listed — auth, write flow, library, reading view, browse/discovery, community, profile, monetisation ad-gate, and search — all wired to Supabase.
- **Auth is done end to end on web**: magic-link sign-in, `/auth/callback` session exchange, middleware session refresh, sign-out. No passwords, as agreed.
- **It is all code-complete but UNRUN.** There is no Supabase project yet, so nothing has executed or been tested. This is blocker #1 — see Flagged. Expect to fix a few compile errors on first `npm run build`; this is a lot of code written without a compiler in the loop.
- **Mobile is deliberately behind web (~40%).** Navigation, theme, auth hook, and the Home + Reader screens (wired to live data, including the ad-gate) are done. Write, Library, Community, Profile, Settings on mobile are still placeholder screens. The mobile magic-link deep-link callback is not implemented — that's the main mobile auth gap.
- **Monetisation works as a flow but the ad is simulated.** "Watch a short ad to continue" records a real `ad_unlocks` row and unlocks the chapter, but there is no ad-network SDK — ad revenue is recorded as $0 pending a real ad-network callback. Author payouts (pool split / cron) are NOT built — needs Stripe.
- **Schema changed — re-run `schema.sql`.** Chapter bodies were split into a gated `chapter_content` table so chapter rows stay public for SEO. `seed.sql` added for test data.
- **Several default calls were made** (markdown editor instead of rich-text, mark-on-open reading progress, community threads still sample data, solid-colour covers) — all listed in Flagged for Deen so you can override.
- **Local-only.** No git remote was configured; files live in the workspace folder. Initialise a repo and push when ready.

---

## DECISIONS — answered by Deen

1. **Mature content — ALLOWED, age-gated by date of birth.** Collect DOB at signup, compute age, gate `is_mature` content behind 18+. Under-18 and logged-out users do not see mature stories. No stricter ID check for MVP. (Migration 001 adds `users.date_of_birth` + an `is_adult()` SQL helper.)
2. **Content moderation — reactive, research-driven.** Report button on stories/chapters/comments/profiles; block-user; an admin review queue; soft-takedown. No heavy pre-publish review. (Migration 001 adds `reports`, `blocks`, `stories.is_removed`, `users.is_admin`.)
3. **Community = a TikTok-style interest feed, merged into Home.** Not a forum. Home becomes one fast scrollable feed mixing followed authors, popular stories, topics, and inferred interests, with transparent rule-based ranking. The fake-threads Community tab is killed. (Migration 001 adds `reading_events` for interest tracking.)
4. **Free/locked — writer-controlled, nudge-to-free; tipping IS in MVP.** No forced "first N free". New chapters default to free; a gentle nudge appears when a writer locks a lot. Free chapters carry banner ads (writer earns ad share); locked chapters use the watch-ad gate. Reader→writer tipping ships in MVP — capture + ledger real; only the Stripe payout rail is deferred (needs LLC/EIN).
5. **Seed accounts — presented as ordinary writers; earnings route to the company.** The ~100 launch seed authors are NOT disclosed as house/seed accounts — they appear as normal writers to seed a lively catalog and community at launch. All money a seed account earns (ad revenue AND tips) routes to the company, not to an individual: migration 003 adds an internal-only `users.is_seed` flag, and the payout system (when built) must settle seed earnings to a company account rather than a payout-eligible author balance. The flag is never user-visible. Seed profile pictures are AI-generated faces of non-existent people; names are written to suit the face, voice and subject matter of each account.
6. **Genre taxonomy — expanded to the full reader-expected set.** Researched against Wattpad / Royal Road / Inkitt / Webnovel. Final set (25): Romance, Fantasy, Science Fiction, Thriller, Mystery, Crime, Horror, Paranormal, Werewolf, Vampire, Young Adult, Teen Fiction, Contemporary, Historical Fiction, Adventure, Action, Dystopian, Drama, LGBTQ+, Humor, Fanfiction, Poetry, Short Story, Non-Fiction, Other. Canonical list lives in `web/lib/genres.ts` + `mobile/lib/genres.ts`; migration 003 expands the `story_genre` enum. Wired into the Write flow and browse/search; the Q3 feed's genre-affinity scoring is genre-agnostic and picks up the new values automatically.

### Risks / for Deen's awareness

- **Seed accounts presented as real writers, with their tips routed to the company, is a disclosure/trust consideration.** If it surfaces publicly it can read as deceptive, and some jurisdictions have consumer-protection rules around fake reviews/endorsements. Many platforms seed catalogs this way; it is Deen's call, it is logged here, and the `is_seed` flag is internal-only as he specified. Noted once for the record.

### Moderation research (Q2 basis)

- **Competitors** (Wattpad et al.): report a story/user via a menu, pick a reason, routed to a support team; reports anonymous. Prohibited: CSAM and illegal sex acts, graphic abuse, hate content, harassment/bullying, spam.
- **Legal floor** — UK Online Safety Act 2023: UGC services must have systems to swiftly remove illegal content (CSAM/CSEA absolute, plus terrorism, harassment, fraud, self-harm promotion); ToS must state protections; Ofcom enforces. US: Section 230 intermediary protection, but CSAM is a federal crime with mandatory NCMEC reporting; DMCA safe harbour requires notice-and-takedown. Apple Guideline 1.2 (UGC): filter objectionable content, provide report + block, allow content removal and ejection of abusive users, publish contact info.
- **Report categories implemented:** CSAM / child exploitation, Harassment or bullying, Hate speech, Graphic violence or abuse, Spam, Copyright / plagiarism (DMCA), Self-harm promotion, Other. CSAM is flagged for the most urgent review.
- **Owned by Deen (operational, not code):** publish an abuse-contact email + a content-policy / ToS page; set up the NCMEC reporting account.

### Seed-account transparency — ANSWERED

- Resolved in DECISIONS #5 above: seed authors are presented as ordinary writers, not disclosed; their earnings route to the company via the internal `is_seed` flag (migration 003).

## Feature status snapshot — after the full de-stub pass

| Feature | Web | Mobile |
|---|---|---|
| Auth (magic-link) | DONE | DONE — PKCE deep-link callback wired |
| Write flow | DONE | DONE — story list + chapter editor/publish |
| Library | DONE | DONE — continue-reading, follows, saved |
| Reading view | DONE | DONE — prev/next nav + progress tracking |
| Home / discovery | DONE | DONE — same ranked interest feed |
| Community | Merged into Home feed (Q3) | Merged into Home feed (Q3) |
| Profile + settings | DONE | DONE — profile edit, NovelStack+, sign-out |
| Monetisation (ad-gate) | DONE — gate real, "ad" is a bare timer | DONE — same |
| Search | DONE | DONE — new Search tab (titles + writers + genre) |

Caveat: neither app has been compiled or run yet. "DONE" = real implementation, not runtime-verified.

## De-stub pass — progress

### Q1-Q4 decisions build (latest session)

- Decisions logged (DECISIONS section above); moderation research done.
- `db/migrations/001_q1_q4_decisions.sql` written — DOB column, `is_adult()` helper, `reports`, `blocks`, `reading_events`, `stories.is_removed`, `users.is_admin`, RLS, updated new-user trigger. **Action: run it in the Supabase SQL editor (after schema.sql + seed.sql).**
- `CATALOG_SEED_PLAN.md` written — the ~100-account launch-catalog seed spec.
- Moderation core built (Q2): `app/moderation/actions.ts` (submitReport, toggleBlock), `components/ReportButton.tsx`, `app/admin/actions.ts`, `app/admin/reports/page.tsx` (review queue, CSAM-prioritised, soft-takedown).
- **Immediate next:** drop `<ReportButton>` onto story / chapter / comment / profile pages + a Block button on profiles; then DOB age-gating app-side, the Q3 home feed, Q4 tipping + banner ads, then the mobile de-stub.


**Web — de-stubbed, now real end-to-end against the live Supabase backend:**
- Landing page trending row — was a hardcoded array, now a real `total_reads` query (`app/page.tsx`).
- Search — added writer search (name / username) and tag search; was title/description/genre only (`app/search/page.tsx`).
- Library — added a "Writers you follow" feed (`app/library/page.tsx`).
- Story page — real Save/bookmark button, and the author name now links to their profile (`app/story/[slug]/page.tsx`, `components/BookmarkButton.tsx`, `app/story/actions.ts`).
- Web is now real end-to-end **except** the two parked items: Community threads tab (Q3) and tipping UI (Q4).

**Mobile — still to de-stub (next work block, task #34):**
- Write, Library, Profile screens are placeholder text → need real Supabase-wired builds.
- Search screen — not started.
- Reader — needs chapter prev/next nav + reading prefs.
- Magic-link deep-link callback — completes the session in-app.

---

## Live setup status — browser session (Supabase + GitHub)

Done by driving Deen's Chrome:

- **Supabase project created** — "NovelStack", org Deen-Codes, region North EU (Stockholm). Project URL: `https://kgjstbfgqzxxtyjidapq.supabase.co`. The DB password was generated strong; it's resettable anytime in Project Settings → Database (the app uses the publishable key, not that password).
- **schema.sql run** — all tables, indexes, RLS policies, and the new-user trigger created. Verified.
- **seed.sql run** — 3 writers, 3 stories, 6 chapters + bodies. Verified by count query (users 3 / stories 3 / chapters 6 / bodies 6).
- **Auth configured** — magic-link email is on by default; Site URL `http://localhost:3000`; redirect URLs added: `http://localhost:3000/**` and `novelstack://**`.
- **API keys wired** — `web/.env.local` and `mobile/app.json` (`expo.extra`) now hold the project URL + publishable key. Both apps are pointed at the live backend.
- **GitHub repo created** — `https://github.com/Deen-Codes/novelstack` (public, currently empty).

### Action needed from Deen — push the code

The sandbox can't run git against the workspace folder (the mounted filesystem blocks git's file operations), and a push needs your GitHub auth anyway. A half-initialised `.git` folder was left in `novelstack/` — delete it and run git fresh on your Mac:

    cd <path-to>/novelstack
    rm -rf .git
    git init && git add -A && git commit -m "Initial commit: NovelStack MVP"
    git branch -M main
    git remote add origin https://github.com/Deen-Codes/novelstack.git
    git push -u origin main

### Still walls — need you

- **Run the apps:** `cd web && npm install && npm run build` (fix any compile errors), then `npm run dev`. For mobile: `cd mobile && npm install && npx expo start`.
- **Stripe:** needs a registered business entity (LLC + EIN) before Connect payouts can be set up. Later.
- **Ad network:** AppLovin MAX — sign up near launch (networks want a live or near-live app to approve a publisher account).
- **Vercel:** deploy the web app and point novelstack.app at it; then add the production URL to Supabase Site URL + redirect URLs.

---

## Done this session

### Auth (web + mobile)
- `web/lib/supabase/server.ts`, `web/lib/supabase/client.ts` — SSR-aware Supabase clients (carry the session).
- `web/middleware.ts` — refreshes the session on every request.
- `web/app/auth/callback/route.ts` — exchanges the magic-link code for a session.
- `web/app/auth/signout/route.ts` — sign-out.
- `web/app/signin/page.tsx` — magic-link sign-in (rewired to the browser SSR client).
- `web/package.json` — added `@supabase/ssr`.
- `mobile/hooks/useAuth.ts` — app-wide session hook (persists via AsyncStorage).

### Write flow (web)
- `web/components/AppHeader.tsx` — shared app nav, session-aware.
- `web/app/write/actions.ts` — server actions: createStory, createChapter, saveChapter, publishChapter, toggleChapterFree.
- `web/app/write/page.tsx` — writer dashboard (list your stories).
- `web/app/write/new/page.tsx` — new story form.
- `web/app/write/[storyId]/page.tsx` — story management, chapter list, add chapter, free/locked toggle.
- `web/app/write/[storyId]/chapter/[chapterId]/page.tsx` — markdown chapter editor, save draft, publish.

### Reading view + monetisation (web)
- `web/components/Reader.tsx` — client reader: font-size + light/sepia/night themes (localStorage), prev/next nav, the ad-gate.
- `web/app/read/[chapterId]/page.tsx` — server page: fetches chapter, gated body, prev/next; renders Reader + Comments; SEO metadata + JSON-LD.
- `web/app/read/actions.ts` — recordAdUnlock (writes `ad_unlocks`), markProgress (writes `reads`).

### Library (web)
- `web/app/library/page.tsx` — continue-reading list + saved stories.

### Browse / discovery + search (web)
- `web/app/browse/page.tsx` — discovery feed: trending, new this week, genre filter chips.
- `web/app/search/page.tsx` — search stories by title / description / genre.

### Community + profile (web)
- `web/components/Comments.tsx` — per-chapter comments + like/unlike, wired into the reader.
- `web/app/u/[username]/page.tsx` — public profile, story grid, follow/unfollow.
- `web/app/u/actions.ts` — toggleFollow.
- `web/app/settings/page.tsx` + `web/app/settings/actions.ts` — edit display name / username / bio, sign out.

### Database
- `db/schema.sql` — split chapter body into a gated `chapter_content` table; `chapters` row is now public for SEO; added `ad_unlocks` self-insert RLS policy.
- `db/seed.sql` — 3 writers, 3 stories, 6 chapters with bodies (NEW).

### Mobile
- `mobile/app/(tabs)/_layout.tsx` — Home centered (Community · Library · Home · Write · Profile).
- `mobile/app/(tabs)/index.tsx` — Home wired to live Supabase data (with fallback).
- `mobile/app/read/[id].tsx` — Reader wired to live data, with the simulated ad-gate.

---

## Flagged for Deen

### Real blockers — need you / an external service
1. **No Supabase project exists.** Nothing runs until you: create a project at supabase.com, run `db/schema.sql` then `db/seed.sql` in the SQL editor, copy the Project URL + anon key into `web/.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and into `mobile/app.json` `expo.extra` (or `EXPO_PUBLIC_*` env vars).
2. **The code has not been built or run.** The sandbox here can't do a full `npm install` + typecheck. Run `npm install && npm run build` in `web/`, and `npm install && npx expo start` in `mobile/`. Expect a handful of compile errors to fix — this is ~35 files written without a compiler.
3. **No Stripe account** → the NovelStack+ subscription checkout and author payouts (pool split + monthly cron) are not built. Only the data model and `monetization.md` describe them.
4. **No ad-network account** → the rewarded ad is a simulated 2-second timer. Real AdMob/Unity Ads integration is needed; ad revenue stays $0 until then.
5. **Magic-link email**: Supabase's built-in email works for dev. For production, set a custom SMTP/Resend in Supabase Auth settings.

### Decisions I made (override if you disagree)
- **Chapter editor is a markdown `<textarea>`, not a rich-text editor.** MVP bar; "rich-ish" via markdown. A WYSIWYG (Tiptap/Lexical) is a polish item.
- **Reading progress = marked 100% on chapter open**, not scroll-based. Enough to power "continue reading". Real scroll-% is polish.
- **`ad_unlocks` has a reader self-insert RLS policy** so the ad-gate works without a server-side ad function. Risk: a technical user could call the unlock action directly and skip the ad. Acceptable for MVP; production should confirm unlocks via the ad-network's server-to-server callback (which also sets the real revenue).
- **Home/discovery = the `/browse` page.** "Recommended" is currently just trending — no personalised recommendations yet (post-MVP: pgvector / collaborative filtering).
- **Community = chapter comments + likes** (real, wired). The discussion-threads/clubs feed on `/community` and the mobile Community tab is still **sample data** — there is no `community_threads` table. Scoped that as post-MVP; needs a schema addition.
- **Covers are solid colours** (`cover_color`). `cover_url` exists but image upload isn't built.

### Half-built / needs your eyes
- **Mobile parity gap (~40%):** Write, Library, Community, Profile, Settings mobile screens are placeholder text. Only Home, Reader, Sign-in are functional. The **mobile magic-link deep-link callback** (`novelstack://auth-callback` handler) is not implemented — the email sends but the app won't complete the session yet. This is the mobile equivalent of `/auth/callback`.
- **Two marketing landing pages exist**: the standalone `outputs/index.html` and the Next.js `web/app/page.tsx`. They've drifted slightly. Pick one as canonical — I'd keep the Next.js one and retire `index.html`.
- **Two web Supabase clients coexist**: `lib/supabase.ts` (plain anon — used by `sitemap.ts` which has no session) and `lib/supabase/server.ts` (session-aware — used everywhere else). Deliberate, but worth a glance.
- **`seed.sql` inserts into `auth.users` directly.** Works on most Supabase versions; if it errors, create the 3 users from the Auth dashboard and run only the UPDATE + stories/chapters sections.
- **Sanity-check the `chapter_content` "gated read" RLS policy** — it's the most complex one (free / subscriber / ad-unlocked / author).

### Out of MVP scope — should be done eventually
- Stripe Connect Express onboarding + the monthly payout cron (subscription pool split + ad attribution).
- Real rewarded-video ads + the ad-network revenue callback.
- Push notifications; transactional email (Resend); content moderation + DMCA.
- Community threads/clubs backend; cover image uploads; the "Following" feed in Library.
- Search by tag and by author (currently title/description/genre only).
- Analytics (PostHog), error monitoring (Sentry), accessibility pass, mobile offline reading.

---

## Seed catalogue run (overnight)

Populated the live Render Postgres database with a tiered seed catalogue.
Database grew from 89 → **272 seed authors**, 90 → **320 stories**,
393 → **904 chapters**. Books by tier: 20 fully-written (Tier A), 62 with
opening chapters (Tier B), 149 metadata + opener (Tier C). All authors are
`is_seed = true`. Built a repeatable pipeline at `seed/` for future fill runs.

Full details, genre distribution, what's queued, and how to run future waves:
see `SEED_CATALOGUE_LOG.md`.
