# NovelStack — Status

The single source of truth for what's built, what's left, and how to ship.
Last updated: 2026-05-25.

## The stack

- **Web + API + database**: one Next.js 15 / React 19 service on **Render**
  (`novelstack.onrender.com`), Postgres on Render, Drizzle ORM. Auto-deploys
  from the `render-migration` branch.
- **Mobile**: Expo / React Native app (SDK 52), iOS + Android.
- **Auth**: passwordless magic-link (Resend email). Web uses a cookie session,
  mobile a Bearer JWT.
- **Storage**: Cloudflare R2 for cover images.
- **Payments**: RevenueCat for NovelStack+ subscriptions; Stripe Connect
  (planned) for author payouts.
- **Ads**: Google AdMob.

## What's done

The product is feature-complete for an MVP across web and mobile: magic-link
auth, story writing with a WYSIWYG chapter editor, the reader (with read-aloud),
library and reading progress, discovery feed and search, community feed,
profiles, age-gating, moderation surfaces, tipping, the NovelStack+ subscription
screen, and the ad-gate. The ~270-author seed catalogue is loaded in the live
Render database.

Recently finished:

- **Author payouts (code).** `web/lib/earnings.ts` computes each author's
  earnings (tips, ad share, NovelStack+ pool share, running balance, history).
  `web/lib/stripe.ts` is the Stripe Connect Express helper. API routes:
  `GET /api/me/earnings`, `POST /api/me/stripe/connect`,
  `GET /api/me/stripe/dashboard`. Earnings dashboard at `/earnings` (web) and
  `mobile/app/earnings.tsx`. Seed (`is_seed`) accounts route earnings to the
  company with no personal payout. Everything degrades gracefully until
  `STRIPE_SECRET_KEY` is set.
- **RevenueCat — fully configured.** App Store app with the In-App Purchase
  `.p8` key; products `novelstack.plus.monthly` / `novelstack.plus.annual`;
  `plus` entitlement; the `default` offering's Monthly/Annual packages; public
  SDK key in `mobile/app.json`; the "NovelStack server" webhook (Active) +
  `REVENUECAT_WEBHOOK_SECRET` set on Render.
- **App Store Connect.** Content Rights answered; App Review notes written
  (magic-link sign-in + reviewer login link); "Sign-in required" unchecked.

## What's left

### Agent can finish (code only)

- Restore the moderation `reports` / `blocks` tables to the Drizzle schema.
- Minor polish: mobile search matching description/tags.

### Deen must do (accounts, hardware, a real business)

1. **Push `render-migration`** — the web app redeploys on push. Until then the
   earnings dashboard, Stripe routes, the RevenueCat webhook route, and the
   legal pages (`/privacy`, `/terms`, `/support`) are not live.
2. **Native iOS rebuild** (EAS) — needed so the RevenueCat SDK key and other
   native config take effect; this is the build that goes to App Review.
3. **App Store Connect — subscription metadata.** Both subscriptions are
   "Missing Metadata": each needs a localized display name + description, a
   price, and a review screenshot. Blocks submission.
4. **App Store screenshots** — 6.5" display set (1242×2688 / 2688×1242 or
   1284×2778 / 2778×1284).
5. **App Review Contact Information** — your name, phone, email on the version
   page.
6. **Upload a build** to the App Store Connect version (after the rebuild).
7. **`support@` / `privacy@` mailboxes** for novelstack.app.
8. **Stripe** — set up the fresh NovelStack Stripe account, complete business
   verification, enable Connect, then set `STRIPE_SECRET_KEY` on Render. This
   flips author payouts from "coming soon" to live.
9. **On-device testing** — sandbox purchases, ads, reviewer deep-link sign-in.
10. **`eas init` + APNs key** for push notifications.

## Deploy the web app

The repo is on the `render-migration` branch, which Render auto-deploys.

```
cd ~/Documents/novelstack
git add -A
git commit -m "Describe the change"
git push
```

That triggers a Render build + deploy of `novelstack.onrender.com`. Render
environment variables (set in the Render dashboard, not committed):
`DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`,
the four `R2_*` keys, `REVENUECAT_WEBHOOK_SECRET`, and `STRIPE_SECRET_KEY`
(once the Stripe account is live).

## Other docs

- `README.md` — repo layout.
- `BUILD_AND_RUN.md` — run both apps locally / get the app on an iPhone.
- `APP_STORE_SUBMISSION.md` — detailed App Store Connect submission checklist.
- `IDEAS.md` — backlog.
- `archive/` — superseded docs kept for reference (the Supabase→Render
  migration, the seed-run log, etc.). Safe to delete.
