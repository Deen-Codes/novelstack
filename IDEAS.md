# NovelStack — ideas & backlog

A running list of ideas and fixes. Items move from **Open** to **Done** as we
build them. Newest ideas go at the top of Open.

## Open

### CRUD completeness / "go back on actions"
- **Web parity** for the CRUD controls just added on mobile — remove-from-saved
  and unfollow in the web library/following views (web SavedView/FollowingView
  are server components; needs small client components).
- **Delete a story / chapter** you wrote — the Write flow has no delete; an
  author can't remove a story or a chapter once created.
- **Reader dead-end** — locked chapters (4+) gate behind a *simulated* ad that
  never actually unlocks, and subscriptions aren't real, so a reader can't get
  past chapter 3 of most books. Make the ad-unlock real (insert `ad_unlocks`)
  or widen the free window.

### Offline reading
- **Offline reading for NovelStack+ members** — download chapters for offline
  reading, gated to subscribers. Large feature — dedicated pass.

### Experience
- **Bottom sheets** — open a story/reader as a full-screen bottom sheet; make
  tip / report / share actions bottom sheets rather than full screens.
- **Social sharing** — share a story/chapter link to all major platforms
  (native iOS share sheet on mobile, share + copy-link on web).
- **Real book covers** — most seed books use the coloured-block fallback; they
  don't look like real covers and make the catalogue look unfinished. Generate
  or source genre-matched cover art (UI phase).
- **UI faults pass** — Deen flagged multiple UI issues across app + web; a
  dedicated UI polish phase is planned after MVP functionality.

### Backend
- **Moderation tables** — add `reports` / `blocks` tables to the Drizzle schema;
  report/block actions are currently stubbed no-ops.
- **Tipping + reporting** — mobile tip/report just confirm locally; no backend.

## Done
- Mobile app redesign — dark cinematic theme + deep ember/ruby accent, 3-tab
  nav (Community · Home · Library), top bar (n. · search · write · avatar),
  profile bottom sheet, Community tab, collections-led Search, reader with
  dark/paper toggle + bigger buttons.
- Author cover image upload via Cloudflare R2 (web + mobile Write screens).
- Cover upload crash fixed — added NSPhotoLibraryUsageDescription to iOS.
- Mobile sign-in fix — https email bounce page + reliable deep-link token read.
- Mobile home screen redesign — Continue reading, streak, Trending rail,
  Spotlight, "From writers you follow".
- Date-of-birth date picker — native picker in the app, input[type=date] web.
- Confirm DOB before 18+ stories — inline age gate on the mobile story screen.
- Maturity visibility — "18+" badge on covers + story pages; mature toggle in
  the Write flow (create + manage) on web and mobile.

## Later / parked
- Apple sign-in and Google sign-in (queued — native Sign in with Apple +
  Google OAuth, plus backend identity linking).
- Seed catalogue — future fill waves toward ~1,000 authors / ~3,000 books,
  backfill Tier B/C chapters, AI author faces, real cover art. Repeatable
  pipeline + how-to in SEED_CATALOGUE_LOG.md. Also: seed-account
  cross-commenting (deliberately deferred).
- Reader-screen age gate — mature stories are gated at the story screen; a
  direct deep link to a chapter could still bypass it. Add a gate in the
  reader too.
