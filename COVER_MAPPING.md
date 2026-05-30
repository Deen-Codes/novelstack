# Cover Image → Book Mapping

Save each GPT-generated cover image into `/Users/deen/Documents/novelstack/assets/covers/` with the exact filename shown below. The bulk uploader (`scripts/upload-covers.mjs`) reads this folder and pushes each one to R2.

| Save as filename | Book | What the image shows |
|---|---|---|
| `06_the_housekeepers_lie.png` | The Housekeeper's Lie | Half-open mahogany bedside drawer · silk eye mask · lavender cream jar · brass lamp base · dark damask wallpaper |
| `07_bound_by_the_don.png` | Bound by the Don | Man's hand on dark walnut leather desk · signet ring on smallest finger · Montblanc fountain pen lying parallel |
| `08_the_frostbound_court.png` | The Frostbound Court | Frozen lake · solitary figure in fur-trimmed coat walking toward giant pale-bone gate made of interlocking carved hands · snowy mountains |
| `09_the_almost.png` | The Almost | Two coffee mugs on sunlit kitchen counter · black coffee + flat white with foam · sprig of rosemary · laptop with spreadsheet · white brick wall |
| `10_the_hollow_hour.png` | The Hollow Hour | Cream letter with broken red wax seal (two crossed quills) · black envelope · green glass reading lamp · walnut desk · leather books |
| `11_the_daughter_they_kept.png` | The Daughter They Kept | Brass key being inserted into weathered green-painted door handle · darkened Highland-stone corridor beyond · single oil lamp in distance |
| `17_the_brother_of_the_don.png` | The Brother of the Don | Hand with cuffed dark sleeve holding small glass of espresso · gold signet ring · brown marble side table · leather portfolio in shadow |
| `25_the_crown_of_hollow_years.png` | The Crown of Hollow Years | Open green leather-bound book with hand-inked star chart ("Caelum Boreale") · silver leaf-shaped brooch · frozen lake through stone window |
| `32_the_wedding_off_season.png` | The Wedding Off-Season | Green leather "Cuillin Hotel Bookings Ledger" · fountain pen · framed sepia photo of young woman on hotel steps · wet grey loch + fishing boat through window |
| `39_the_forwards.png` | The Forwards | Two navy ice-hockey jerseys with white C captain patches hanging on the same brushed-steel hook · pale wood locker-room bench · cold blue lighting |
| `43_the_library_at_vellichor.png` | The Library at Vellichor | Single white camellia · "Caledonian Library Reader's Slip" · black-bound book with red ribbon · green-shaded brass reading lamp · green leather blotter |
| `48_the_other_girl_in_the_photograph.png` | The Other Girl in the Photograph | Framed sepia photo of two young women in matching dresses (faces cropped above chin, identical braids) · held over Welsh kitchen table · reading glasses · cup of tea |
| `52_the_beech_hill_reading_society.png` | The Beech Hill Reading Society | Dark green Chesterfield wing-back leather armchair · grey cardigan draped over · china teacup with cold tea · saucer with two ginger biscuits · library bookshelves behind |

---

## Step-by-step

1. **Save each PNG out of GPT** to your Mac with the exact filenames above (right-click the image → Save As, use the filename from the table). Put them all in `/Users/deen/Documents/novelstack/assets/covers/`.

   You can verify the folder exists / files are there with:

   ```
   ls -la /Users/deen/Documents/novelstack/assets/covers/
   ```

   (If the folder doesn't exist yet, create it: `mkdir -p /Users/deen/Documents/novelstack/assets/covers`)

2. **Install the new dependency** (one-time, adds `@aws-sdk/client-s3` to `scripts/`):

   ```
   cd /Users/deen/Documents/novelstack/scripts
   npm install
   ```

3. **Grab the R2 credentials from your Render dashboard.** Go to: Render → your web service → **Environment**. Copy these four values:
   - `R2_ENDPOINT`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET` (probably `novelstack-covers`)

4. **Run the uploader** with all env vars on one line:

   ```
   cd /Users/deen/Documents/novelstack
   DATABASE_URL='postgres://…' \
   R2_ENDPOINT='https://<account-id>.r2.cloudflarestorage.com' \
   R2_ACCESS_KEY_ID='…' \
   R2_SECRET_ACCESS_KEY='…' \
   R2_BUCKET='novelstack-covers' \
   NEXT_PUBLIC_SITE_URL='https://novelstack.app' \
   node scripts/upload-covers.mjs
   ```

   Expected output:

   ```
   NovelStack Originals — bulk cover uploader
     covers dir: /Users/deen/Documents/novelstack/assets/covers
     ...
     ✓ 06_the_housekeepers_lie  — 412 KB (replaced)
     ✓ 07_bound_by_the_don      — 388 KB (was empty)
     ✓ 08_the_frostbound_court  — 521 KB (was empty)
     ... (one line per book)
   Done.
     uploaded : 13
     skipped  : 0
   ```

5. **Open the iOS app and pull-to-refresh** on Home / Library / a persona profile — the real covers should now display instead of the typographic defaults.

## To iterate on one cover

Re-export the image, drop it into the same filename, then run with `--only=NN`:

```
node scripts/upload-covers.mjs --only=06
```

Each re-upload generates a new R2 key, so the old image stays in R2 as an orphan. Fine for now; we can sweep them later.

## Adding `assets/covers/` to git

If you want the source covers committed alongside the books:

```
cd /Users/deen/Documents/novelstack
git add assets/covers/ scripts/upload-covers.mjs scripts/package.json scripts/package-lock.json COVER_MAPPING.md
git commit -m "Originals v3: bulk cover uploader + 13 GPT-generated cover images"
git push origin render-migration
```

Or if you'd rather keep them out of git (covers are large), add to `.gitignore`:

```
echo "assets/covers/*.png" >> .gitignore
echo "assets/covers/*.jpg" >> .gitignore
```
