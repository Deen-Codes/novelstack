# Morning Checklist — overnight run

Reads in 90 seconds. Open in the order below.

> **Update — three runs tonight.**
>
> **Run 1.** 8 brand-new chapter-1s across genre lanes 11/17/25/32/39/43/48/52 — ~24,000 words.
>
> **Run 2.** Continuation pass: chapters 2-4 of #06 + chapters 2-3 of #07, comp-author mapping locked in `scripts/originals-catalogue.json`, loader upgraded to multi-chapter v4. ~14,000 words.
>
> **Run 3 (this one).** 13 cover-art prompts for GPT image-gen + **#06 The Housekeeper's Lie completed to end** at 12 chapters / ~22,700 words. Full Verity-coded arc: discovery → manuscript-within-the-novel → Friday 5pm clock-winding climax → Mr Wakeham's exposure → escape to Pimlico → Mrs Wakeham's terminal arc → death at Christmas → second-of-April epilogue at the National Library Edinburgh. **First book in the catalogue at COMPLETE status.**
>
> Cover prompts for all 13 books are in the chat history of session 3 — copy/paste into GPT image-gen one by one (each ends with "no text, no typography" since titles composite via `scripts/cover_overlay.py`). Use these to build the cover art set in parallel with the writing.
>
> **Use `scripts/load-originals-v4.mjs`** (not v3) — same idempotent contract, multi-chapter aware. Run: `DATABASE_URL='postgres://…' node scripts/load-originals-v4.mjs`. It will now pull all 12 chapters of #06.

## TL;DR

Three things shipped overnight:

1. **CoverEditor (mobile) — fixed the cover/library inconsistency + dropped the Save / Upload buttons.** The editor canvas now uses the same `DefaultCover` variant the Library shows, so a story that's "green default" in Library doesn't become "purple flat" in the editor. Save button is gone — changes save when you switch tabs. Upload-image button is gone — tap the cover background itself to pick an image. Type-check is green.
2. **NovelStack Originals catalogue extended from 5 → 13 books.** 8 brand-new chapter-1s, each ~2,500-3,500 words, written to the implicit style guide of the shipped 5. New seed personas spread the books across an imprint-style roster (8 author by-lines instead of just `@novelstackoriginals`). All written under your `is_seed=true` flag so the catalogue can be wiped or filtered cleanly.
3. **A full editorial catalogue of all 50 books** (5 shipped + 8 new chapter-1s tonight + 37 written-up-but-not-yet-prosed) lives at [SEED_CATALOGUE_LOG.md](./SEED_CATALOGUE_LOG.md). Treat it as the master plan — every future seed-content session should read it first.

Honest scope note: the brief asked for 45 new complete novels (15-30 chapters each, ~30-90k words apiece). Producing that in one overnight session would have meant ~1 million words of off-voice filler. Per your "quality > quantity, hard" instruction, I delivered **8 production-quality chapter-1s** at the same fidelity as the shipped 5, plus the editorial cards (Part 2 of the catalogue log) for the remaining 37. The cards are detailed enough that another session can pick up any one of them and write the chapter without further direction.

---

## What to do this morning (in order)

### 1. Run the v4 loader against Render Postgres — 1 minute

The 8 new books + 8 new personas + 5 continuation chapters insert via a Node script. The chapter bodies live in `originals/*.md` and the v4 script reads ALL `## Chapter N` sections (not just chapter 1), so re-running it after a markdown edit picks up any new chapters added since.

From the Render shell:

```
cd /opt/render/project/src
node scripts/load-originals-v4.mjs
```

Or from your laptop with the prod DATABASE_URL:

```
DATABASE_URL='postgres://…' node scripts/load-originals-v4.mjs
```

Expected output (first run): 8 personas created, 13 stories created (5 already existed from V2 — those get matched by `(author_id, title)` and skipped), 18 chapters created (chapter 1 of all 13 new + chapters 2-4 of #06 + chapters 2-3 of #07). Subsequent runs only insert chapters that don't yet exist.

To run only specific books (useful when iterating on one):

```
node scripts/load-originals-v4.mjs --only=06,07
```

The file [SEED_ORIGINALS_V3.sql](./SEED_ORIGINALS_V3.sql) is documentation-only — it explains what the loader does and which lanes the books fill. You don't need to run any SQL. The old v3 loader is superseded but kept on disk for reference.

### 2. Open the iOS build and check Write → any story → Cover — 30 seconds

You should see:

- The cover canvas paints the same DefaultCover variant as the Library tile (no more purple-vs-green mismatch).
- No Save button. No Upload button. A helper line under the cover explaining "Tap the title to edit. Tap the cover background to replace the image. Changes save when you switch tabs."
- Title defaults to centred (not bottom-left) so the spotlight crop doesn't clip it.
- Tap anywhere on the cover background → image picker opens.
- Tap the title → keyboard + font strip appears, tap-away dismisses.

If the Cover tab looks right, the in-flight task list from yesterday's session is closed.

### 3. Pull the catalogue + read the style guide — 5 minutes

Open [SEED_CATALOGUE_LOG.md](./SEED_CATALOGUE_LOG.md). Part 1 (style guide) is the editorial brief — it codifies the voice across the 5 shipped + 8 new books so future content stays on register. Part 2 is the full 50-book catalogue with blurbs, persona assignments, and lane positioning.

Skim the 8 new books in `originals/11..52*.md` if you want to read them as a reader would.

### 4. Decide on cover art for the 8 new books — your call

I haven't generated AI cover images for the 8 new books. The catalogue log specifies, per book, the cover concept (atmospheric prompt + font + position) so they can be produced consistently with `scripts/cover_overlay.py` whenever you next sit down with image gen. Until then, the DefaultCover system will pick a deterministic variant per story.id, which is fine for testing.

---

## Pending follow-ups (no action required tonight)

These are open but didn't gate anything for App Store submission:

- **#293** CoverEditor true keyboard toolbar (alignment L/C/R + font picker docked above the keyboard).
- **#294** Drag-the-title-to-position with PanResponder (replaces the position-chip row dropped this session).
- **#295** "Rigged into a book" — composite the default cover once and save to R2 so it's identical everywhere (eliminates the editor/library divergence permanently).
- **#296** Chapter editor — remove the publish confirmation bottom sheet.
- **#297** 18+ age-gate — prompt for DOB once on first mature-content access, save to profile, never re-ask.
- **#305** DefaultCover variants — enforce title in top 2/3 only, default position = center or top.
- **#306** CoverEditor focus modes — cover isolates above keyboard while editing; fullscreen while dragging.
- **#307** Home spotlight — hide the duplicate title overlay when the cover is a default variant (cover already carries the title).
- **#311** Continuing the 45-book catalogue beyond the 8 done tonight (production-quality, lane-by-lane, paced to ~5-10 books per overnight session).

---

## File map for this run

- **[SEED_CATALOGUE_LOG.md](./SEED_CATALOGUE_LOG.md)** — the master editorial brief + catalogue.
- **[SEED_ORIGINALS_V3.sql](./SEED_ORIGINALS_V3.sql)** — documentation pointing at the loader script.
- **[scripts/load-originals-v3.mjs](./scripts/load-originals-v3.mjs)** — the actual loader. Idempotent. Reads from `originals/*.md`.
- **originals/11_the_daughter_they_kept.md** — Lane A (thriller) · Hannah Glass
- **originals/17_the_brother_of_the_don.md** — Lane B (mafia romance, mature) · Romy Hall
- **originals/25_the_crown_of_hollow_years.md** — Lane C (fae fantasy) · Elena Vasse
- **originals/32_the_wedding_off_season.md** — Lane D (contemporary romance) · Callie Lowe
- **originals/39_the_forwards.md** — Lane E (sports romance) · Blake Rivers
- **originals/43_the_library_at_vellichor.md** — Lane F (dark academia) · Blackwell Press
- **originals/48_the_other_girl_in_the_photograph.md** — Lane G (literary commercial) · Catriona Field
- **originals/52_the_beech_hill_reading_society.md** — Lane H (mystery) · Henne Grover

- **mobile/components/CoverEditor.tsx** — DefaultCover background, tap-to-pick image, no Save/Upload buttons.
- **mobile/app/write/[storyId].tsx** — passes `storyId` + `authorName` to CoverEditor; auto-saves on tab change away from Cover.

---

## Word counts (cumulative across three runs)

| | Words |
|---|---|
| 8 new chapter-1s (run 1) | ~24,000 |
| #06 chapters 2-4 + #07 chapters 2-3 (run 2) | ~14,000 |
| **#06 chapters 5-12 — completing the novel (run 3)** | **~17,500** |
| 13 cover-art prompts (run 3, in chat history) | ~2,800 |
| Catalogue log (with comp-author table + multi-session plan) | ~7,500 |
| Loader scripts (v3 + v4) + catalogue JSON + SQL doc | ~900 (code/comments) |
| This briefing | ~1,600 |

### Per-book state going into morning

| # | Title | Chapters | Words | Status |
|---|-------|---------:|------:|--------|
| 06 | The Housekeeper's Lie | **12** | **~22,700** | **COMPLETE** |
| 07 | Bound by the Don | 3 | ~8,100 | in flight |
| 08 | The Frostbound Court | 1 | ~3,200 | hook only |
| 09 | The Almost | 1 | ~3,200 | hook only |
| 10 | The Hollow Hour | 1 | ~3,100 | hook only |
| 11 | The Daughter They Kept | 1 | ~2,400 | hook only |
| 17 | The Brother of the Don | 1 | ~2,700 | hook only |
| 25 | The Crown of Hollow Years | 1 | ~2,400 | hook only |
| 32 | The Wedding Off-Season | 1 | ~2,700 | hook only |
| 39 | The Forwards | 1 | ~2,500 | hook only |
| 43 | The Library at Vellichor | 1 | ~3,500 | hook only |
| 48 | The Other Girl in the Photograph | 1 | ~3,300 | hook only |
| 52 | The Beech Hill Reading Society | 1 | ~3,800 | hook only |

Total prose in catalogue: **~63,600 words** across 26 chapters, 13 books.

## Comp-author mapping (locked tonight)

Per Deen's note about his girlfriend's BookTok stack — each book leans hard into one comp author for the continuation chapters. The full table lives in [SEED_CATALOGUE_LOG.md](./SEED_CATALOGUE_LOG.md) Part 3.5 and is machine-readable in `scripts/originals-catalogue.json`.

Key picks:

- **#06 Housekeeper's Lie** → Colleen Hoover *Verity* (manuscript-within-novel, sinister-older-woman)
- **#07 Bound by the Don** → Penelope Douglas *Credence* (isolated location, brooding-male, self-binding-clause)
- **#09 The Almost** → Emily Henry *Beach Read* (witty-second-chance)
- **#11 The Daughter They Kept** → Verity-coded again, Highland-set
- **#17 The Brother of the Don** → Penelope Douglas (companion to #07)
- **#39 The Forwards** → Hannah Grace *Icebreaker* / Tessa Bailey
- **#52 The Beech Hill Reading Society** → Richard Osman *Thursday Murder Club*

## Fade-to-black convention

Comp authors like Hoover, Douglas, Huang go explicit. Tonight's continuation prose stops at the threshold of any scene that would turn explicit and drops a marker like `[FADE TO BLACK — comp-author register (PD Credence) would here render X. Mark for human-pass replacement…]`. The loader strips markers from word counts/excerpts but inserts the body as-is so they remain visible for editorial pass. Two such markers in tonight's prose: one in #06 ch 4 (Eleanor's manuscript-within-the-manuscript), one in #07 ch 3 (the days-11-60 escalation arc).
