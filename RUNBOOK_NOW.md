# Runbook — what to do right now

Two tracks running in parallel. **You** handle Track A (covers + seed). **I** handle Track B (app fixes).

---

## Track A — your work (covers + seed)

### A1. Push to git first (recommended)

So the new files are on the Render server if you ever want to run the seed from the Render shell. Skip this if you're only going to run the seed from your laptop.

```
cd /Users/deen/Documents/novelstack
git add originals/ scripts/ SEED_CATALOGUE_LOG.md SEED_ORIGINALS_V3.sql MORNING_CHECKLIST.md COVER_PROMPTS.md RUNBOOK_NOW.md mobile/components/CoverEditor.tsx mobile/app/write/[storyId].tsx
git commit -m "Originals v3: complete #06 + 8 new chapter-1s + multi-chapter loader + cover prompts"
git push origin main
```

### A2. Run the seed against Render Postgres

**From your laptop** (simplest — you don't need to wait for Render to redeploy):

```
cd /Users/deen/Documents/novelstack
DATABASE_URL='postgres://<paste your prod connection string>' node scripts/load-originals-v4.mjs
```

The Render connection string is in your Render dashboard → your Postgres service → Connect → "External Connection String". Paste it in place of `<paste your prod connection string>` (keep the single quotes).

**Or from the Render shell** (only if A1 was done and Render has redeployed):

```
cd /opt/render/project/src
node scripts/load-originals-v4.mjs
```

Expected output (first run):

```
NovelStack Originals — V4 loader (multi-chapter)
  reading from: /Users/deen/Documents/novelstack/originals
  catalogue   : .../scripts/originals-catalogue.json
  entries     : 13

  ✓ The Housekeeper's Lie  (@novelstackoriginals) — 12 chapters
  ✓ Bound by the Don  (@novelstackoriginals) — 3 chapters
  ✓ The Frostbound Court  (@novelstackoriginals) — 1 chapter
  ✓ The Almost  (@novelstackoriginals) — 1 chapter
  ✓ The Hollow Hour  (@novelstackoriginals) — 1 chapter
  ✓ The Daughter They Kept  (@hannahglass) — 1 chapter
  ✓ The Brother of the Don  (@romyhall) — 1 chapter
  ✓ The Crown of Hollow Years  (@elenavasse) — 1 chapter
  ✓ The Wedding Off-Season  (@callielowe) — 1 chapter
  ✓ The Forwards  (@blakerivers) — 1 chapter
  ✓ The Library at Vellichor  (@blackwellpress) — 1 chapter
  ✓ The Other Girl in the Photograph  (@catrionafield) — 1 chapter
  ✓ The Beech Hill Reading Society  (@hennegrover) — 1 chapter

Done.
  personas created : 8
  personas existing: 1
  stories  created : 8
  stories  existing: 5
  chapters created : 26
  chapters existing: 0 (0 content refreshed)
```

The 5 "stories existing" are the ones V2 already created (06-10). The loader detects them by `(author_id, title)` match and adds the new chapters (chapters 2-12 of #06, chapters 2-3 of #07) without duplicating the story rows.

### A3. Generate covers from `COVER_PROMPTS.md`

Open [COVER_PROMPTS.md](./COVER_PROMPTS.md), copy each prompt + the boilerplate, paste into GPT image-gen, save the returned image as `assets/covers/<NN>_<slug>.png` (e.g. `assets/covers/06_the_housekeepers_lie.png`).

Once you have the images, the existing `scripts/cover_overlay.py` script (already in the repo) will composite the title typography on top in the right font for the lane. Then the cover-upload flow in the mobile app picks them up.

### A4. Verify it's live

Open the iOS app → Home tab → the spotlight should now show one of the 13 books. Library tab (signed in as `@novelstackoriginals` or any test account) should show the books. Open #06 The Housekeeper's Lie → you should see 12 chapters listed.

---

## Track B — what I'm doing in parallel

Working through the pending app fixes from the task list while you handle Track A. In priority order:

1. **#305** DefaultCover variants — title in top 2/3 only, default position = center
2. **#307** Home spotlight — hide duplicate title overlay when cover is a default variant
3. **#296** Chapter editor — remove publish confirmation bottom sheet
4. **#306** CoverEditor focus modes — cover isolates above keyboard while editing; fullscreen while dragging
5. **#293** CoverEditor keyboard toolbar — alignment (L/C/R) + font picker docked above keyboard
6. **#294** CoverEditor drag-to-position with PanResponder
7. **#295** "Rigged into a book" — composite default cover once + save to R2
8. **#297** 18+ age-gate — DOB prompt on first mature access, save to profile, never re-ask

The first three are quick (15-30 min each). The next three are more substantive. The last two are largish. I'll work through as many as fit before context budget runs low and report back with what's landed + type-check status.

---

## Questions for you

None blocking. If the GPT image-gen needs a tweak (palette wrong, composition off), feel free to iterate — the prompts in `COVER_PROMPTS.md` are starting points, not gospel. The "no text" clause is the only part that's non-negotiable (because we composite the title separately).
