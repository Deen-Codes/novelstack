# NovelStack

A serialized-fiction platform — a Next.js web app + API and an Expo (iOS +
Android) mobile app, sharing one Render-hosted Postgres backend.

```
novelstack/
  web/        Next.js 15 / React 19 — website + API routes (hosted on Render)
  mobile/     Expo / React Native app (SDK 52, iOS + Android)
  db/         Drizzle schema + migrations
  seed/       Seed-catalogue pipeline
  archive/    Superseded docs, kept for reference
```

## Stack

Web, API, and Postgres all run as one service on **Render**
(`novelstack.onrender.com`), auto-deployed from the `render-migration` branch.
Auth is passwordless magic-link (Resend). Cover images live in Cloudflare R2.
Subscriptions go through RevenueCat; author payouts through Stripe Connect.

## Where to look

- **`STATUS.md`** — what's built, what's left, and how to deploy + submit.
  Start here.
- **`BUILD_AND_RUN.md`** — run both apps locally and get the app on an iPhone.
- **`APP_STORE_SUBMISSION.md`** — detailed App Store Connect checklist.
- **`IDEAS.md`** — backlog.

## Run it quickly

```bash
# Web
cd web && npm install && npm run dev          # http://localhost:3000

# Mobile
cd mobile && npm install && npx expo start    # press i (iOS) or a (Android)
```

Both read their config from environment variables / `app.json` — see
`BUILD_AND_RUN.md` for the full list.
