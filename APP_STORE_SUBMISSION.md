# NovelStack — App Store Submission Prep

Everything to fill out App Store Connect well, the website pages Apple requires,
the SEO/marketing plan, and where the ad banner goes. Work through it top to
bottom. Items marked **⚠ BUILD** still need code before submission.

---

## 1. App Store listing (ASO)

The App Store only searches three fields — **name, subtitle, keywords**. The
description does *not* affect ranking. A word counts once across all three, so
never repeat a word.

**App name (30 char max) — recommended:**
> `NovelStack: Read Web Novels`  (27 chars)

Brand first, then the highest-volume keyword ("web novels").

**Subtitle (30 char max) — recommended:**
> `Fan fiction, romance & stories`  (30 chars)

"Serialized" was dropped — it's industry jargon, not a high-volume search term.
This subtitle instead spends its 30 characters on terms people actually search:
**fan fiction** (very high volume), **romance** (the biggest fiction category),
**fiction**, and **stories**. "Web novels" is already covered by the app name.

**Keywords field (100 char max) — recommended:**
> `fantasy,wattpad,chapter,ebook,reading,drama,teen,offline,saga,author,romcom,booktok,serial,books`

Rules followed: comma-separated, **no spaces**, no plurals (Apple matches them
automatically), no words already in the name/subtitle (so `romance`, `fan`,
`fiction`, `stories` are deliberately *not* repeated here), no filler. Note:
`wattpad` is a competitor brand — Apple *usually* allows competitor terms in
this field but occasionally rejects them; if it's flagged, swap it for
`webnovel`.

**Categories:** Primary **Books**, Secondary **Entertainment**.

**Promotional text (170 char, editable any time without review):**
> New chapters drop every day. Follow your favourite writers, get notified the
> moment a story updates, and read it your way.

**Description** (not indexed, but it converts — and Apple checks the EULA link
is at the end):
> NovelStack is where serialized stories live. Follow ongoing novels chapter by
> chapter, discover new writers, and build a library you actually finish.
>
> • Thousands of stories — romance, fantasy, drama, fan favourites and more
> • New chapters from the writers you follow, with push notifications
> • A clean, distraction-free reader with light and dark modes
> • Listen to any chapter read aloud
> • A community feed to cheer writers on
>
> Writers keep most of what they earn — NovelStack is built to pay the people
> who make the stories.
>
> NovelStack+ — an optional $6.99/month membership: ad-free reading, every
> chapter unlocked, and offline downloads. Subscriptions are billed through
> your Apple ID and auto-renew unless cancelled at least 24 hours before the
> period ends; manage or cancel in your Account Settings.
>
> Terms of Use: https://novelstack.app/terms
> Privacy Policy: https://novelstack.app/privacy

**Screenshots (first 3 matter most):** vertical, real in-app UI with bold
caption overlays. Suggested order: (1) the reader on a beautiful chapter —
"Lose yourself in a story", (2) the home/discovery feed — "Thousands of serials,
updated daily", (3) the immersive writing editor — "Anyone can publish", then
(4) NovelStack+ benefits, (5) the community feed. Add a 15–30s app preview
video leading with the reading experience. Use App Store Connect's Product Page
Optimization to A/B test after launch.

---

## 2. App Store Connect requirements

**Required URLs** (these need the website pages in section 3 live first):
- **Privacy Policy URL** — `https://novelstack.app/privacy` (mandatory)
- **Support URL** — `https://novelstack.app/support` (mandatory)
- **Marketing URL** — `https://novelstack.app` (optional, recommended)

**App Privacy "nutrition label"** — declare, per data type: collected? linked
to the user? used for tracking? For NovelStack:
- *Contact Info — Email address:* collected, linked, App Functionality. Not tracking.
- *User Content* (stories, comments, photos): collected, linked, App Functionality.
- *Identifiers — User ID:* collected, linked, App Functionality.
- *Identifiers — Device ID:* collected, linked, **used for tracking** (AdMob).
- *Usage Data — Product Interaction:* collected, linked, Analytics + **Tracking** (AdMob).
- *Purchases:* collected, linked, App Functionality.
- *Diagnostics — Crash/Performance:* collected, not linked, App Functionality.

Because AdMob shares data with third parties, the **App Tracking Transparency**
prompt must show before tracking — ✅ already built (`expo-tracking-transparency`,
fires on launch).

**Auto-renewable subscription rules (Guideline 3.1.2):** the NovelStack+ screen
where the user taps to subscribe must show, on that same screen: the plan name,
length, price per period, the standard auto-renew disclosure text, and
**tappable links to the Terms of Use and Privacy Policy**.
⚠ **BUILD** — add to the NovelStack+ screen: the auto-renew disclosure sentence
and two tappable links (Terms, Privacy). Without these, 3.1.2 rejection is
near-certain.

**Account deletion (Guideline 5.1.1(v)):** any app with accounts must let users
**delete their account from inside the app** — not just sign out, not via email.
⚠ **BUILD** — add a "Delete account" flow in Profile/Settings that calls a new
`DELETE /api/me` endpoint and removes the user + their data.

**ATT / ads:** ✅ built. Standard EULA can be replaced by the custom Terms URL.

---

## 3. Website pages Apple needs (Next.js site)

All three are submission blockers. ⚠ **BUILD** each as a real page on
`novelstack.app`:

- **/privacy** — Privacy Policy. Must state what's collected (email, reading
  activity, content, device identifiers), that AdMob is used for ads and may
  use identifiers for tracking, that RevenueCat/Apple process subscriptions,
  data retention, how to request deletion, and a contact email.
- **/terms** — Terms of Use (EULA). Covers acceptable use, user-generated
  content ownership and licence, the NovelStack+ subscription terms, and
  liability. Linked from the App Store description and in-app.
- **/support** — Support page: a contact email, an FAQ, and a link to report
  problems. This is the Support URL.

A `/delete-account` info page is also worth adding (explains the in-app
deletion path) — Apple reviewers like to see it.

---

## 4. Website SEO

**On-page basics:** unique title tag (50–60 chars) and meta description
(150–160 chars) per page; one H1 matching intent; internal links into genre and
story hubs; descriptive alt text on covers; `Book` / `Article` /
`BreadcrumbList` JSON-LD. The story and chapter pages are already indexable —
that long-tail (story titles, author names) is the biggest organic opportunity.

**SEO article topics** (a `/blog` or `/read` hub):
- Genre/trope hubs: "Best enemies-to-lovers web novels", "Top fantasy serials
  of 2026", "Free romance stories to read online"
- Intent pages: "Wattpad alternatives", "Best apps to read serialized fiction"
- Writer guides: "How to write serialized fiction", "How to publish a web
  novel", "How to make money writing online"
- Explainers: "What is a web novel", "What is serialized fiction"

---

## 5. Marketing / launch plan

- **Positioning:** differentiate on what incumbents *don't* push — writers keep
  most of what they earn, and reading is ad-light. "Serialized stories that
  actually pay their writers."
- **Pre-launch:** seed the catalogue (done), line up the writer accounts, set up
  an App Store "coming soon" page, collect emails on the website.
- **Launch:** Product Hunt, the r/wattpad and writing/reading subreddits,
  BookTok / writer TikTok, and outreach to the seeded writers to share.
- **Ongoing:** publish the SEO articles above; use push notifications (built)
  for retention; App Store PPO tests on screenshots.

---

## 6. Ad banner placement

Recommended: a banner **at the end of a free chapter** — after the chapter text,
above the Previous/Next buttons — shown only to non-subscribers. This is the
least intrusive spot (a natural pause, never over the prose) and mirrors what
the website reader already does.
⚠ **BUILD** (#162) — needs the mobile app to know if the reader is a
NovelStack+ subscriber. Add an `isSubscriber` (or `showAds`) field to the
`/api/chapters/:id` response, then render `<BannerAd>` when
`chapter.isFree && showAds`.

---

## Submission blocker checklist

- [x] Terms + Privacy links and auto-renew text on the NovelStack+ screen — built
- [x] In-app "Delete account" flow + `DELETE /api/me` endpoint — built
- [x] `/privacy`, `/terms`, `/support` pages — built (deploy with the web app)
- [x] In-reader ad banner — built (shows for non-subscribers on every chapter)
- [ ] Set up the `support@` and `privacy@novelstack.app` mailboxes
- [ ] Screenshots + app preview video (you're handling these)
- [ ] App Privacy answers entered in App Store Connect (section 2)
- [ ] Native rebuild with all the new modules, then `git push` to deploy the web side

---

## Session progress — 25 May 2026

**Done in App Store Connect** (app created, Apple ID `6772877382`):
- Registered the bundle ID `app.novelstack` in the Apple Developer portal.
- Created the app record: name **NovelStack: Read Web Novels**, iOS, English (U.S.),
  SKU `novelstack-ios`.
- Filled + saved the version 1.0 metadata: promotional text, full description
  (with the NovelStack+ disclosure + Terms/Privacy links), keywords, Support URL
  (`/support`), Marketing URL, copyright.
- App Information page saved: **Subtitle** `Fan fiction, romance & stories`,
  Primary Category **Books**, Secondary **Entertainment**.

**Left to do in App Store Connect** — pick up here next session:
1. **Screenshots** — Deen is producing these (iPhone 6.5", first 3 matter most).
2. **App Privacy** — answer the data-collection questionnaire using section 2 above.
3. **Age rating** — complete the content questionnaire (will land 12+/17+ given
   user-generated content + mature stories).
4. **Pricing** — set the app to Free.
5. **NovelStack+ subscription product** — create it here, then the RevenueCat
   side (section 2). Needs the RevenueCat API key sent back for `app.json`.
6. **App Review information** — NovelStack uses magic-link sign-in (no password),
   so leave the demo-account user/password blank and add a review note: the app
   is fully usable signed-out, and a reviewer login link can be provided.
7. **Content Rights** question on the App Information page — answer it (NovelStack
   hosts user-generated stories).
8. **Upload the build** — after the native rebuild (`npx expo prebuild --clean`
   then `npx expo run:ios` / Xcode archive).

**Left to do in the app / repo:**
- `git push` to deploy the web side (privacy/terms/support pages, new APIs).
- Run `node scripts/create-device-tokens-table.mjs` on the DB.
- Set `REVENUECAT_WEBHOOK_SECRET` on Render; point the RevenueCat webhook at it.
- The native rebuild (all 6 native modules + AdMob are wired and type-check clean).
- `eas init` for push notifications; APNs key in EAS.
- Backlog features: print-on-demand (#165), background read-aloud for NovelStack+
  (#167, deferred — Apple TTS is unreliable in the background).

---

## Session progress — 25 May 2026 (continued)

**NovelStack+ subscriptions — both created in App Store Connect:**
- **NovelStack+ Monthly** — Apple ID `6773001190`, product ID
  `novelstack.plus.monthly`, 1-month duration. Base price **$6.99 (USD)**, Apple
  auto-calculated all 175 territories. English (U.S.) localization saved
  (display name "NovelStack+ Monthly", description "Ad-free reading, every
  chapter unlocked, offline.").
- **NovelStack+ Annual** — Apple ID `6773006010`, product ID
  `novelstack.plus.annual`, 1-year duration. Base price **$69.99 (USD)**,
  auto-calculated. Localization saved (display name "NovelStack+ Annual", same
  description). ≈16% cheaper than 12 monthly payments.
- **7-day free trial** added to *both* as an Introductory Offer — type Free,
  duration 1 week, all 175 countries, start 25 May 2026, no end date (ongoing).
- Both still show status **Missing Metadata** — the only outstanding item is the
  **Review Information screenshot** on each subscription page (Deen is producing
  app screenshots anyway; a shot of the NovelStack+ screen covers it).

**Mobile app updated for two plans:**
- `mobile/lib/iap.ts` — `PlusState` now exposes `monthly` + `annual` plans, each
  with price string and free-trial label; added `annualSavingsPercent()`.
- `mobile/app/plus.tsx` — NovelStack+ screen now shows an Annual/Monthly picker
  (annual pre-selected, "SAVE X%" tag), and the CTA reads "Start your 7-day free
  trial" when the offering carries the trial. Type-checks clean.

**RevenueCat — In-App Purchase key generated; .p8 download pending:**
The `novelstack` RevenueCat project exists (project id `a288c69c`). The App
Store Connect **In-App Purchase key has been generated** (named "RevenueCat"):

- **Key ID:** `JWW2NY3ZW6`
- **Issuer ID:** `999c6b7a-435b-4f8e-a18b-5d040e85f543`
- The `.p8` file (`SubscriptionKey_JWW2NY3ZW6.p8`) still needs to be **downloaded
  once** from App Store Connect → Users and Access → Integrations → In-App
  Purchase → "Download In-App Purchase Key". It downloads exactly once.

1. Download the `.p8` and keep a safe copy (it can't be re-downloaded).
2. RevenueCat → Project `novelstack` → **Apps** → New App Store app: app name
   `novelstack (App Store)`, bundle ID `app.novelstack`, upload the `.p8`, paste
   Key ID `JWW2NY3ZW6` + Issuer ID `999c6b7a-435b-4f8e-a18b-5d040e85f543`,
   **Save**.
3. RevenueCat → **Product catalog → Products** → add `novelstack.plus.monthly`
   and `novelstack.plus.annual` (App Store).
4. RevenueCat → **Entitlements** → create entitlement **`plus`**; attach both
   products to it.
5. RevenueCat → **Offerings** → create the default offering; add a **monthly**
   package → `novelstack.plus.monthly`, and an **annual** package →
   `novelstack.plus.annual`. (The app code reads `offerings.current.monthly`
   and `.annual`.)
6. RevenueCat → **API keys** → copy the **public Apple SDK key** (starts
   `appl_…`) into `mobile/app.json` → `extra.revenueCatKey`.
7. RevenueCat → **Integrations → Webhooks** → add a webhook to
   `https://novelstack.app/api/revenuecat-webhook`; copy its **Authorization
   header value** and set it as `REVENUECAT_WEBHOOK_SECRET` on Render.
