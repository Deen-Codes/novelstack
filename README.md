# NovelStack — codebase

The bones of the platform. Shared Supabase backend, a Next.js website, and an Expo (iOS + Android) app.

```
novelstack/
  db/
    schema.sql        Full Postgres schema — tables, indexes, RLS, triggers
  web/                Next.js 14 website (novelstack.app)
  mobile/             Expo / React Native app (iOS + Android)
```

The brand, architecture, monetization model, and roadmap docs live one level up in the workspace folder. `../monetization.md` is the canonical revenue model.

---

## 1. Set up the backend (do this first)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor, paste in `db/schema.sql`, and run it. That creates every table, index, row-level-security policy, and the new-user trigger.
3. From Project Settings → API, copy the Project URL and the anon public key. You'll need them below.

---

## 2. Run the website

```bash
cd web
npm install
```

Create `web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev          # http://localhost:3000
```

Routes scaffolded: `/` (home), `/story/[slug]` (SEO-indexed book page with metadata + JSON-LD), `/read/[chapterId]` (reading view), `/community`, `/signin` (magic link), plus generated `sitemap.xml` and `robots.txt`. Stubs to build next: `/browse`, `/write` (writer dashboard), `/auth/callback`.

---

## 3. Run the app

```bash
cd mobile
npm install
npx expo start        # press i for iOS sim, a for Android
```

Set Supabase keys either in `mobile/app.json` under `expo.extra`, or as `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` env vars.

Screens scaffolded: Home, Library, Community, Write, Profile tabs, the `read/[id]` reading view, and `signin` (magic link). The 5-tab bar, brand theme (`theme/tokens.ts`), and Supabase client are wired.

You'll need to add `assets/icon.png` and a splash image before a production build — see `app.json`.

---

## What's real vs. what's next

**Real and wired:** the database schema with RLS, both apps' project config, the NovelStack brand theme (cream + coral), navigation, the Supabase clients, the home and reading screens.

**Still stubbed (the next build phases — see `../build-roadmap.md`):**
- Auth screens + Supabase Auth integration
- Writer dashboard and the chapter editor
- The rewarded-ad flow and the `ad_unlocks` write
- Stripe: NovelStack+ subscription + Connect Express payouts
- The monthly payout cron (subscription pool split + ad attribution)
- Search, social (follows, comments), notifications

**Placeholder data:** the home screens use hardcoded sample stories. Swap these for Supabase queries once the schema is deployed and seeded.
