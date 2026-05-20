# NovelStack — Catalog Seed Plan

Goal: make the app feel alive on day one — roughly **100 author accounts, each with 1+ books**, varied genres, so a new visitor lands in a populated catalog and community feed rather than an empty shell.

Status: **planning + small prototype only.** The full 100-account run is a follow-up batch task — see "Execution" below.

---

## The "no AI telltale" problem

The single biggest risk: 100 books that all read like the same competent-but-bland AI voice. Real reading platforms (Wattpad, Royal Road, AO3) have wildly uneven writing — that unevenness IS the texture of an authentic catalog. The seed has to reproduce that.

Concrete rules to avoid AI tells:

- **Vary quality on purpose.** Target mix: ~15% genuinely polished, ~55% solid-amateur, ~30% rough (clunky dialogue, overwrought description, pacing wobble, the occasional typo). A catalog where every book is clean is the tell.
- **Vary voice hard.** Different sentence-length rhythms, different vocabulary registers, first vs third person, present vs past tense, different chapter-opening habits. No shared "As the sun dipped below the horizon" cadence.
- **Kill the AI hallmarks:** no "Little did they know," no "a testament to," no tidy three-item lists, no every-chapter-ends-on-a-clean-button, no uniformly perfect grammar, no em-dash overuse, no "In a world where…" blurbs.
- **Believable authors:** varied usernames (some lazy — `xX_raven_Xx`, `mias.stories`, `chapter_addict`; some plain — `t.holloway`), short imperfect bios, mixed casing, a few near-empty profiles.
- **Believable cadence:** some stories complete, most ongoing, some abandoned mid-arc; uneven chapter counts; "last updated" spread across weeks/months.

---

## Distribution targets (~100 authors / ~130 stories)

| Genre | Share | Notes |
|---|---|---|
| Romance | 28% | The volume genre — split contemporary, historical, fantasy-romance |
| Fantasy | 20% | |
| Sci-fi | 12% | |
| Thriller / Mystery | 14% | |
| Drama | 10% | |
| Horror | 6% | |
| Fanfiction | 6% | Generic original-universe stand-ins — avoid real IP |
| Poetry / Other | 4% | |

- Chapters per story: ~25% have 1-3, ~45% have 4-12, ~20% have 13-30, ~10% have 30+.
- Mature flag: ~20% of stories flagged `is_mature` (so age-gating has something to gate).
- Free vs locked: most chapters free (matches the Q4 nudge); a minority of authors lock chapters 4+.

---

## Execution

1. **Prototype (this session / next):** 3-5 fully-written sample stories across different genres + quality tiers, to validate the voice-variation approach. Hand-review for AI tells.
2. **Full run (follow-up batch task — flagged):** generate the remaining ~95 in genre batches, each batch with an explicit distinct voice brief, then a human spot-check pass. Insert via a `seed_catalog.sql` or a scripted Supabase insert.
3. Seed authors are created the same way as `seed.sql` does it (auth.users insert → trigger → public.users), with `date_of_birth` set to varied adult dates.

## Flagged for Deen

- **Volume of generated fiction is large** — this is a real content-production task, not a quick script. Budget a dedicated batch run.
- **Decision needed:** are seed accounts ever disclosed as seed/house accounts, or presented as ordinary authors? (Transparency / trust call — and relevant if any seed story later gets real traction or tips.)
- Fanfiction seed must use invented universes only — no real IP, to avoid copyright exposure in the catalog itself.
