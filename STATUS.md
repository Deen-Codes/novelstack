# NovelStack — Status

The single source of truth for what's built, what's left, and how to ship.
Last updated: 2026-05-29.

## Web rebuild — Phase A + Phase B done

- **Aesthetic research + 3 mockups delivered (Phase A).** `AESTHETIC_RESEARCH.md` covers premium reading-platform visual register (Substack / Medium / NYT / Stripe Press / Are.na, with concrete typographic specs), dark-mode discipline, three typography pairings with sizes/leadings, layout density, motion philosophy. Three standalone HTML mockups in `aesthetic_examples/` rendered to 6 screenshots in `outputs/aesthetic_screenshots/`. **You picked mockup #2 — App-Native (Bricolage + Newsreader + Inter, ember halo).**

- **Phase B parity rebuild shipped to `web/app/`.** v1 visual register applied 1:1 from mockup #2:
  - **Foundation.** `mobile/theme/tokens.ts` mirrored into `web/app/globals.css` as CSS custom properties; paper-mode scoped to `.paper-mode` (reader only); Tailwind aliased to the vars; Bricolage Grotesque + Newsreader + Inter wired in `layout.tsx`; `AppHeader` translucent blur + ember dot; `MobileTabBar` dark/ember icons. New brand atoms: `.ember-halo` (pulsing radial), `.btn-cream` / `.btn-ember`, `.cover-lift`, `.story-card`, `.chapter-spine`, `.resume-ribbon`, `.chapter-prose` with ember drop-cap.
  - **Home.** Rebuilt around the mockup-2 layout: ember-halo hero ("Stories worth following."), spotlight card (Continue-reading-aware CTA), and rails: Continue reading (signed-in) / Trending by read-through / From writers you follow / For tonight — cosy. Real Drizzle data through `getFeed` + `getContinueReading`. Cover component upgraded to display-font fallback with gradient covers when no image.
  - **Reader.** Paper-mode default with dark toggle. 68ch Newsreader column; Bricolage chapter title; ember drop-cap on the first paragraph; right-edge fixed chapter spine (with `current` notch glowing ember); resume ribbon ("You left here on Tuesday — …quote…") backed by per-chapter localStorage, surfaces after a 6h gap; TTS button using `SpeechSynthesisAPI`; settings drawer with font size +/−. Translucent top bar inside the reader carries the storyTitle back-link, TTS, settings, and Paper/Dark toggle. Adsense banner stays for free chapters; tip CTA + prev/next intact.
  - **Other routes.** Site-wide token swap (`bg-white` → `bg-card`, `text-paper` ember buttons → `text-cream`, `font-serif` chrome → `font-display`). Signin restyled (cream pill CTA, display logo). Library / Settings / Search / Browse / Story detail / Write / Earnings / Profile all inherit the dark/ember via tokens — no layout rebuilds needed in v1.
  - **Type-check clean** across the web app.

- **REDESIGN_ROADMAP.md** parks everything v2 + v3 so it doesn't fall off radar: public margin annotations (private → mutual → public), drop-off heatmap, A/B cliffhanger lab, mood-based discovery, scheduled-publish + NovelStack+ early-access tier, live earnings ticker, per-story RSS, PWA + offline, behaviour-signal weighting. v3 moonshots: Reader Clubs (>500 readers), per-paragraph tip jar, public annotations with moderation.

- **Not in this session — queued for next.** Web NovelStack+ via Stripe (subscription product + checkout), tipping via Stripe with credit-pack abstraction, new pages: `/about` (70/30 economics), `/writers` (earnings calculator), `/plus` (subscription pitch), public annotations infrastructure (DB schema for highlights + private notes). All locked in the v1 scope but they're net-new functionality, not pure rebrand — they want their own pass.

- **Verifying live look.** Sandbox can't keep `next dev` alive long enough to screenshot the rebuilt routes here (bash sessions kill child processes). Type-check is clean; the components are 1:1 with mockup #2 which you already saw. After a Render deploy, the live URL will look exactly like the mockup — open both side-by-side to confirm.

## Pickup queue when you're back

1. `cd web && npm run dev` locally, walk through Home + a chapter to feel the Bricolage hero, ember halo pulse, paper-mode reader, dark toggle, chapter spine, resume ribbon, TTS button — confirm it lands.
2. If approved, push to Render. Site rebuilds automatically from the deploy branch.
3. Mobile pickup queue from the prior session: push the build, set Render env vars, finish Stripe Marketplace verification, on-device test (iPhone + iPad), swap to live keys.
4. Then schedule the web v1 follow-up: Stripe checkout for `/plus`, tipping credit packs, `/about` + `/writers` pages, private annotations DB.
5. Long-standing pending: #77 bottom sheets, #78 social sharing, #94 offline reading, #136 community redesign, #137 status/ad entitlement logging, #165 POD hardcopies, #167 background read-aloud.

## Earlier — iPad + research + sandbox tooling

- **iPad pass (Task #247).** `supportsTablet: true` + `PageContainer.tsx` (`useReadingWidth`, `useGridItemWidth`). 3-col phone → 5-col iPad portrait → 6-col wide iPad. Wired into every tab + detail screen.
- **Website research (Task #248 / Phase A above).**
- **Stripe webhook + sandbox tools (Task #246).** `account.updated` (v1) + `v2.core.account.updated` via `STRIPE_WEBHOOK_SECRET`. Dev-only `/api/dev/simulate-earnings` gated by `SIMULATE_EARNINGS_TOKEN`.


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
