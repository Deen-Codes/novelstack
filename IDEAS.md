# NovelStack — ideas & backlog

A running list of ideas and fixes. Items move from **Open** to **Done** as we
build them. Newest ideas go at the top of Open.

## Open

### Experience
- **Bottom sheets** — open a story/reader as a full-screen bottom sheet; make
  tip / report / share actions bottom sheets rather than full screens.
- **Social sharing** — share a story/chapter link to all major platforms
  (native iOS share sheet on mobile, share + copy-link on web).

### Backend
- **Moderation tables** — add `reports` / `blocks` tables to the Drizzle schema;
  report/block actions are currently stubbed no-ops.

## Done
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
- Reader-screen age gate — mature stories are gated at the story screen; a
  direct deep link to a chapter could still bypass it. Add a gate in the
  reader too.
