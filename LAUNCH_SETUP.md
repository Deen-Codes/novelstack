# NovelStack — Launch Setup Checklist

This is the account-side setup needed to finish the app. Code is mostly done or
queued; these are the steps only you can do (they need your logins). Do them and
hand me the values in **bold**, and I wire everything into one native rebuild.

---

## 0. The native rebuild

The new native modules (expo-image, expo-speech, expo-notifications,
expo-tracking-transparency, react-native-purchases) are added. After the account
steps below are done, the rebuild is:

```bash
cd ~/Documents/novelstack/mobile
npm install
npx expo prebuild --clean
npx expo run:ios
```

`prebuild --clean` regenerates the native `ios/` project from `app.json` (picks
up every new module + Info.plist string). `run:ios` runs `pod install` and
builds — this is the clean rebuild that was skipped last time and caused the
expo-image crash. Do it once, with everything in.

---

## 1. Push notifications

**Why:** deliver lock-screen notifications (new chapter, tip, follow, comment)
even when the app is closed. The in-app notification feed already exists.

Steps:

1. `cd ~/Documents/novelstack/mobile && npx eas-cli init` — signs into your Expo
   account and creates an EAS project. This writes a project ID into `app.json`
   (needed to mint Expo push tokens).
2. `npx eas-cli credentials` → iOS → set up a **Push Notifications key (APNs)**.
   EAS can generate and store it for you using your Apple Developer login.

The project ID lands in `app.json` automatically — no value to paste.

The permission prompt, token registration and server-side push send are
**already built**. One server step: run
`node scripts/create-device-tokens-table.mjs` once to create the `device_tokens`
table on Render.

---

## 2. NovelStack+ subscription (in-app purchase)

**Why:** this is the real launch blocker — Apple tests that the subscription
works during review.

In **App Store Connect** (appstoreconnect.apple.com):

1. My Apps → NovelStack → Subscriptions → create a Subscription Group
   (e.g. "NovelStack+").
2. Add an **auto-renewable subscription**. Note the **Product ID** you choose
   (suggest `novelstack.plus.monthly`) and set the **price** ($6.99/mo).
3. Add a localized display name + description, and an App Store promotional
   image if prompted.
4. App Store Connect → Users & Access → Integrations → generate an
   **App-Specific Shared Secret** — copy it.

In **RevenueCat** (revenuecat.com — free tier covers early revenue):

5. Create an account → new Project "NovelStack" → add an **App Store** app
   (bundle ID `app.novelstack`), paste the shared secret from step 4.
6. Create an **Entitlement** called `plus`, attach the product from step 2.
7. Copy the **public SDK API key** (starts with `appl_`).

The NovelStack+ purchase + restore flow and the server webhook are **already
built**. To activate them:

- Hand me the **RevenueCat public API key** — it goes in `app.json`
  (`extra.revenueCatKey`).
- Set a **`REVENUECAT_WEBHOOK_SECRET`** environment variable on Render (any
  long random string).
- In RevenueCat → Project Settings → Webhooks, point the webhook at
  `https://novelstack.onrender.com/api/revenuecat-webhook` and set its
  Authorization header to that same secret.

---

## 3. Ads (AdMob)

**Why:** rewarded ads to unlock gated chapters, banners on free chapters.

**AdMob account setup is done** — the iOS and Android apps and their ad units
were created. The captured IDs:

| | iOS | Android |
|---|---|---|
| App ID | `ca-app-pub-4785473067647076~8254338656` | `ca-app-pub-4785473067647076~7241851333` |
| Rewarded unit | `ca-app-pub-4785473067647076/5628175310` | `ca-app-pub-4785473067647076/3055880079` |
| Banner unit | `ca-app-pub-4785473067647076/9580240065` | `ca-app-pub-4785473067647076/3725278154` |

Remaining: wire `react-native-google-mobile-ads` into the app using these IDs
(rewarded ad on the chapter-unlock screen, banner on free chapters) and the ATT
prompt. The App IDs go into `app.json` so they're part of the native rebuild.

New AdMob apps show only limited/test ads until the app is live on the App
Store and AdMob finishes its review — normal, and it flips automatically.

---

## 4. Print-on-demand hardcopies — post-launch

Genuinely possible, but it's a standalone feature, not a quick add. The shape:

- **Provider:** Lulu has the only real book-print API (Lulu Print API). It
  prints + ships; you set retail price = print cost + your 30% margin.
- **Print files:** each completed book needs a print-ready interior PDF at a
  real trim size (e.g. 5×8″) with bleed, gutter and page numbers, plus a
  wraparound cover PDF whose spine width depends on page count. That's real
  typesetting work generated from the chapter Markdown.
- **Payment:** important Apple rule — physical goods **cannot** use in-app
  purchase, and Apple requires they use a different method. So this uses Stripe
  (or Lulu's checkout) + a shipping-address form + order tracking.
- **Revenue:** your 30% is the margin between retail and Lulu's print+ship cost.

Recommendation: launch with the digital app + NovelStack+ + ads, then ship
print-on-demand as the first post-launch feature. It's worth doing — just not
worth delaying launch for.

---

## Summary of what to send back

- Push: just confirm `eas init` is done.
- NovelStack+: **Product ID** + **RevenueCat public API key**.
- Ads: **iOS App ID** + **Rewarded unit ID** + **Banner unit ID**.
