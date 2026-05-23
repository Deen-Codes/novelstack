# NovelStack seed catalogue pipeline

A repeatable pipeline for populating NovelStack with a believable catalogue of
authors and books. Built to be run in batches ("chip away") over multiple
overnight runs, toward a long-term target of ~1,000 author accounts and
~3,000+ books (eventual goal 10,000).

## Backend (important)

NovelStack's live backend is **Render Postgres** — *not* Supabase. The Supabase
setup is fully superseded. The web app (Next.js 15) talks to the database
through Drizzle ORM; the mobile app (Expo) talks to the Render-hosted API at
`https://novelstack.onrender.com`. There is **no Django** here (unlike the
sibling project GymFlow) and therefore no `seed_*` management command — seed
data is inserted with direct SQL by `pipeline/load.mjs`.

Connection string: the Render Postgres "External Database URL". It also lives
in `web/.env.local` as `DATABASE_URL`.

## Layout

```
seed/
  pipeline/
    load.mjs        — idempotent loader (author/book JSON + chapter txt → DB)
    package.json    — depends on `postgres`
  data/
    authors/<username>.json      — one author persona per file
    books/<slug>.json            — one book per file (metadata + chapter list)
    chapters/<slug>/<n>.txt      — plain-text body for chapter <n>
  README.md
```

Chapter prose lives in plain `.txt` files (not inside JSON) so long bodies
can't break JSON escaping. The loader reads them by `<slug>/<number>.txt`.

## Data formats

### Author — `data/authors/<username>.json`
```json
{
  "username": "marisol_vance_a3",
  "displayName": "Marisol Vance",
  "email": "marisol_vance_a3@seed.novelstack.app",
  "bio": "Short, in-voice author bio.",
  "joinedDaysAgo": 540,
  "faceConcept": "Description of the AI face for a future avatar-gen pass."
}
```
`faceConcept` is stored for a future avatar-generation run; the loader does not
insert it (seed accounts currently render initials avatars). `email` must be
unique — use `<username>@seed.novelstack.app`. Every author is inserted with
`is_seed = true` and `role = 'writer'`.

### Book — `data/books/<slug>.json`
```json
{
  "slug": "the-ashfall-crown-7f3a21",
  "authorUsername": "marisol_vance_a3",
  "title": "The Ashfall Crown",
  "description": "SEO-conscious blurb, 2–4 sentences with a strong hook.",
  "genre": "fantasy",
  "tags": ["enemies to lovers", "court intrigue", "slow burn"],
  "isMature": false,
  "coverColor": "#6B2D3C",
  "tier": "B",
  "status": "ongoing",
  "publishedDaysAgo": 210,
  "popularity": "modest",
  "plannedChapters": 30,
  "chapters": [
    { "number": 1, "title": "The Salt Gate", "isFree": true },
    { "number": 2, "title": "Ashes", "isFree": true }
  ]
}
```
`genre` must be one of the 25 values in the `story_genre` enum. `status` is
`ongoing` or `complete`. `popularity` (`new` | `modest` | `rising` | `hit`)
drives randomised read/follower counts. `plannedChapters` is the intended full
length for future fill; `chapters` lists what's written now. The loader
computes `excerpt`, `word_count` and `page_count` from the chapter text.

## Tiers

- **Tier A — fully written:** complete (or substantially written) books, the
  showcase catalogue a visitor actually reads end to end.
- **Tier B — opening chapters:** full metadata + the first 2–3 chapters,
  enough to be real, readable and indexable.
- **Tier C — metadata stub:** full persona + metadata + 1 opening chapter, so
  the book is never hollow and the catalogue count grows. Later chapters are
  queued for future runs (`plannedChapters`).

## Running

```bash
cd seed/pipeline
npm install
DATABASE_URL='<render-postgres-external-url>' node load.mjs
```

The loader is **idempotent**: authors already present (by username/email) and
books already present (by slug) are skipped, so re-runs are safe and future
runs only insert new files.

## Future runs

1. Generate more `authors/*.json`, `books/*.json` and `chapters/<slug>/*.txt`.
2. Re-run the loader — only the new files are inserted.
3. Backfill: add later chapters for Tier B/C books toward their
   `plannedChapters` count, then re-run (note: the loader currently skips a
   book whose slug already exists — backfilling existing books needs an
   `--update-chapters` mode, queued as a future enhancement).

## Content boundary

Seed romance is emotionally rich and "steamy" in the suggestive / fade-to-black
sense. The generator does **not** write sexually explicit prose. This is a
limit on the seed generator only, not on the platform.
