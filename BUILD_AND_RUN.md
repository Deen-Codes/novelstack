# NovelStack — Build & Run

The exact steps to get both apps running on your Mac. Should be ~15 minutes.

## 0. Prerequisites

- Node.js 20+ and npm.
- The Supabase project already exists, schema + seed + migration 001 are already applied (done in-session).
- `web/.env.local` already has the Supabase URL + key. `mobile/app.json` has them under `expo.extra`.

## 1. The website (Next.js)

```
cd novelstack/web
npm install
npm run build      # production build — surfaces any type errors
npm run dev        # http://localhost:3000
```

Open http://localhost:3000 — the seeded stories should appear (3 stories, 6 chapters).

## 2. The app (Expo / React Native)

```
cd novelstack/mobile
npm install
npx expo start     # press i for iOS simulator, a for Android, or scan the QR with Expo Go
```

If Expo complains about SDK/package versions: `npx expo install --fix`.

## 3. Deploy the website (later)

Push to GitHub, import the repo in Vercel, set the two `NEXT_PUBLIC_SUPABASE_*` env vars in Vercel, set the root directory to `web/`. Then in Supabase → Auth → URL Configuration, add the Vercel production URL to Site URL + redirect URLs.

---

## Likely first-build errors + fixes

This code was written without a compiler in the loop, so expect a few. Most likely:

- **`Cannot find module '@supabase/ssr'` or similar** — just means `npm install` hasn't run yet, or didn't finish. Re-run `npm install` in that app's folder.
- **TypeScript errors on Supabase nested selects** (`.select('*, author:users(...)')`) — Supabase's generated types don't always match hand-written interfaces. The data is already cast `as Story` / `as Chapter` etc. If the build still complains about a nested field, the quickest fix is to widen that cast to `as any` at the call site, or add the missing field to the interface in `web/lib/types.ts`.
- **`is_mature` / `published_at` / `updated_at` "does not exist on type Story"** — make sure `web/lib/types.ts` has them on the `Story` interface (they were added this session).
- **`'use client'` / server-action boundary errors** — server actions (`actions.ts` files) must stay server-only; components that call them with `useState` need `'use client'` at the top. All the ones written this session already have the right directive — but if you move code around, keep that boundary.
- **Env vars undefined at build** — `web/.env.local` must exist with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. It does; if the build can't see them, confirm the file is in `web/`, not the repo root.
- **Mobile: `expo-router` entry not found** — confirm `mobile/package.json` has `"main": "expo-router/entry"` (it does) and `expo-router` is installed.
- **Mobile: native ad / deep-link modules** — the mobile auth deep-link callback and any future ad SDK need a dev build (`npx expo prebuild` / EAS), not plain Expo Go. Plain Expo Go is fine for everything else.

If a build error isn't in this list, paste it to me and I'll give you the exact fix.
