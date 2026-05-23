# NovelStack — seed catalogue log

## Summary (read this first)

An overnight seed run populated the **live Render Postgres** database with a
tiered catalogue of author personas and books. The run was stopped on Deen's
call to pivot back to app functionality — it "chipped away" at the long-term
target rather than completing it, exactly as planned.

**Database — before → after this run:**

| | Before | After | Added |
|---|---|---|---|
| Seed authors | 89 | **272** | +183 |
| Stories | 90 | **320** | +230 |
| Chapters | 393 | **904** | +511 |

All new authors carry `is_seed = true` (earnings route to the company, not a
user-facing account). The content is live — it shows in the app feed, search,
and on indexable story pages right now.

**Books by tier (the 230 new books + pipeline files = 231 on disk):**

| Tier | Count | What it is |
|---|---|---|
| **A — fully written** | 20 | Complete short novels, 8–11 chapters each, real beginning/middle/end. The showcase books a visitor reads end to end. |
| **B — opening chapters** | 62 | Full metadata + the first 2–3 chapters written. Real, readable, indexable; later chapters queued. |
| **C — metadata + opener** | 149 | Full persona + metadata + 1 opening chapter. Never hollow, grows the catalogue count; later chapters queued. |

~511 chapters of original prose were written and loaded.

**Honest accounting:** the brief's headline targets were ~1,000 accounts and
~3,000 books. This run delivered ~183 accounts and ~230 books — a real dent,
not the whole thing. 3,000 fully-written novels is tens of millions of words
and was never a one-night job; the value of this run is (a) a meaningful live
catalogue and (b) a **repeatable pipeline** so future runs continue the fill
without re-planning.

## Genre distribution (all seed stories in the DB)

fantasy 54 · romance 41 · scifi 33 · horror 24 · thriller 21 · drama 20 ·
mystery 19 · contemporary 13 · paranormal 11 · historical 10 · werewolf 9 ·
crime 8 · vampire 7 · adventure 7 · young_adult 7 · fanfiction 6 · dystopian 6 ·
teen_fiction 5 · humor 4 · poetry 4 · short_story 3 · action 2 · lgbtq 2 ·
other 2 · nonfiction 1.

Romance is strongly represented: counting the romance-family genres
(romance + paranormal + werewolf + vampire + much of contemporary/drama) it is
the largest cluster, as intended. 56 seed stories are flagged mature (18+).

## How it was built

Generation ran as waves of parallel content-generation subagents. Each subagent
owned a shard (`w1s3`, `w3s5`, …), created ~9 author personas and ~16 books
with a tier mix, and wrote them as data files. Personas, voices, tenses, POV,
prose polish (deliberately including rough/amateur writers), chapter lengths,
join dates and popularity were all varied to avoid a uniform "AI catalogue"
tell. Titles, blurbs, tags and genres were written SEO-first.

## The pipeline (repeatable — for future runs)

Everything lives in `seed/` and is documented in `seed/README.md`.

```
seed/
  pipeline/load.mjs     — batched, idempotent, partial-run-safe loader
  pipeline/package.json — depends on `postgres`
  data/authors/*.json   — author personas
  data/books/*.json     — book metadata + chapter list
  data/chapters/<slug>/<n>.txt — plain-text chapter bodies
```

To run a future wave:
1. Generate more `authors/*.json`, `books/*.json`, `chapters/<slug>/*.txt`
   (use the subagent prompt pattern; give each subagent a unique shard id).
2. `cd seed/pipeline && npm install`
3. `DATABASE_URL='<render-external-url>' node load.mjs`

The loader is **idempotent**: it skips authors/stories already in the DB and
only inserts new ones, and it repairs any story left without chapters by a
previous interrupted run. Safe to re-run any time.

## Queued for future runs

- **Backfill Tier B / C books** toward their `plannedChapters` count. The
  loader currently skips a book whose slug already exists, so backfilling
  existing books needs an `--update-chapters` mode added to `load.mjs`.
- **Continue toward ~1,000 authors / ~3,000 books** — more generation waves.
- **AI-generated author faces** — each persona file carries a `faceConcept`
  string for this. Avatars currently render as initials (the app's built-in
  fallback). A future pass can generate portraits and set `avatar_url`.
- **Real cover images** — books currently use the coloured-block cover
  (the app's designed fallback) via `coverColor`. A future pass can generate
  or source genre-matched cover art.
- **Seed-account cross-commenting** — deliberately left for later per Deen.

## Known minor issues

- `the-long-way-to-orchard-street-w2s2a3f1`: its JSON lists 10 chapters but a
  generation subagent was cut off before writing chapter 10's text file. The
  book loaded fine with chapters 1–9 and is fully readable.

## Backend note

NovelStack's live backend is **Render Postgres + the Next.js API** — the old
Supabase setup is fully superseded. There is no Django here (unlike the sibling
project GymFlow), so there is no `seed_*` management command; seed data is
inserted by `seed/pipeline/load.mjs` via direct SQL. The repo's env files
(`web/.env.local`, `mobile/app.json`) already point at Render — verified, no
stale Supabase config.
