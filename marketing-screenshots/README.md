# NovelStack — App Store marketing screenshots

Premium-feel marketing shots wrapped around your raw simulator screenshots,
sized for iPhone 6.9" (1320×2868) which is the only size Apple actually
requires — they auto-scale for older devices.

## How to use

1. **Take your raw screenshots** with the iPhone 16 Pro Max simulator
   - Get your Mac's status bar pristine first:
     ```
     xcrun simctl status_bar booted override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3
     ```
   - For each screen, position the simulator and press **⌘+S** to save to Desktop

2. **Drop them into `./raw/`** with these exact names so the script pairs
   them with the right tagline:

   | File | Suggested screen |
   |------|------------------|
   | `01-home.png` | Home tab — discovery feed with the hero spotlight |
   | `02-reader.png` | A chapter open, mid-paragraph |
   | `03-story.png` | Story detail page — cover + Read/Save + chapters |
   | `04-library.png` | Library with saved books + In progress / Completed |
   | `05-community.png` | Community feed with posts |
   | `06-write.png` | Write tab OR the chapter editor with keyboard |

3. **Build**:
   ```
   python3 build.py
   ```

4. **Result** lands in `./out/` as `01.png` .. `06.png` — drag them into
   App Store Connect's screenshots section in the right order.

## Editing the taglines

Open `build.py` and edit the `SHOTS` list — each entry is
`(filename, headline, subtitle)`. Change anything you don't love.

The current set:
- 01 — Stories that pull you in.
- 02 — Read serialised fiction.
- 03 — Every story, beautifully.
- 04 — Your shelf in your pocket.
- 05 — A real readers' community.
- 06 — Get paid to write.

## Tip

App Store Connect shows the screenshots in upload order. Put your strongest
one (the Home hero or Reader view) **first** — it's what people see in
search results before scrolling.
