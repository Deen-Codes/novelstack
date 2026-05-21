# NovelStack — Build & Run

How to run both apps on your Mac, and how to get the app onto your iPhone.

## 0. Prerequisites

- Node.js 20+ and npm.
- The Supabase project exists; schema + seed + migrations 001/002/003 + the
  catalog seed are all applied (done in-session).
- `web/.env.local` has the Supabase URL + key. `mobile/app.json` has them under
  `expo.extra`.

Verified in-session: `tsc --noEmit` passes clean on **both** web and mobile,
and a clean `npm install` works for both.

## 1. The website (Next.js 15)

```
cd ~/Documents/novelstack/web
npm install
npm run dev          # http://localhost:3000
```

Open http://localhost:3000 — the seeded catalog appears (19 stories across the
genre taxonomy). To deploy to novelstack.app, see `DEPLOY.md`.

## 2. The app — quick run in the simulator / Expo Go

```
cd ~/Documents/novelstack/mobile
npm install
npx expo start       # press i for iOS simulator, or scan the QR with Expo Go
```

If Expo flags package versions: `npx expo install --fix`.

Note: the magic-link auth deep link (`novelstack://auth-callback`) needs a real
dev build, not plain Expo Go. Everything else works in Expo Go.

---

## 3. Build the app onto your physical iPhone (via Xcode)

This produces a real app installed on your phone, signed with your Apple
Developer account.

### One-time setup

- **Xcode 16+** from the Mac App Store.
- Command line tools: `xcode-select --install`
- **CocoaPods**: `brew install cocoapods` (or `sudo gem install cocoapods`).
- Sign in to your Apple Developer account in Xcode:
  **Xcode → Settings → Accounts → +** → Apple ID.
- On the iPhone: enable **Developer Mode**
  (Settings → Privacy & Security → Developer Mode), then connect by USB and tap
  **Trust** when prompted.

### Build steps

```
cd ~/Documents/novelstack/mobile
npm install
npx expo prebuild --platform ios --clean
```

`prebuild` generates the native `ios/` project from `app.json` (app name, icon,
splash, the `novelstack://` URL scheme, bundle id `app.novelstack`) and runs
`pod install`. The branded app icon and splash are already in `mobile/assets/`.

```
open ios/novelstack.xcworkspace
```

In Xcode:

1. In the left sidebar pick the **novelstack** project, then the **novelstack**
   target → **Signing & Capabilities** tab.
2. Tick **Automatically manage signing** and pick your **Team** (your Apple
   Developer account).
3. If it complains the bundle id `app.novelstack` is taken, change it to
   something unique (e.g. `app.novelstack.deen`) — change it in both Xcode and
   `mobile/app.json` (`ios.bundleIdentifier`), then re-run `prebuild`.
4. Plug in the iPhone and select it in the run-destination dropdown (top
   toolbar, next to the scheme name).
5. Press **▶ Run** (Cmd+R). Xcode builds, installs, and launches the app.
6. First launch only: on the iPhone go to **Settings → General → VPN & Device
   Management**, tap your developer profile, and **Trust** it. Re-run.

While developing, keep `npx expo start` running in the `mobile/` folder — a
Debug build loads JavaScript from that Metro bundler. For a build that runs
standalone (no Mac needed), switch the scheme to **Release**:
Xcode → Product → Scheme → Edit Scheme → Run → Build Configuration → Release.

With your paid Developer Program account the install lasts a year (a free
account would expire after 7 days).

### Magic-link sign-in on the phone

For the email sign-in link to open back into the app, the Supabase project must
allow the deep link. Supabase dashboard → **Authentication → URL Configuration
→ Redirect URLs** → add `novelstack://auth-callback`. Then open the magic-link
email on the iPhone itself and tap the link.

### Alternative — EAS Build (cloud, no Xcode)

If you'd rather not use Xcode: `npm i -g eas-cli`, then
`eas build --platform ios --profile development`. It builds in Expo's cloud and
manages signing for you; install the result via the QR code it returns. Needs a
free Expo account.

---

## Troubleshooting

- **`pod install` fails** — make sure CocoaPods is installed and you're on a
  recent Ruby; re-run `npx expo prebuild --platform ios --clean`.
- **"Untrusted Developer" on the phone** — Settings → General → VPN & Device
  Management → Trust your profile.
- **App opens to a blank/old screen** — the Metro bundler isn't running or is on
  a different network; restart `npx expo start` and reload.
- **Type errors after moving code** — `tsc --noEmit` currently passes; if it
  breaks, the message names the file and line.
- Any build error not covered here — paste it over and I'll give the fix.
