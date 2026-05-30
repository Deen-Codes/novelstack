# Payment testing walkthrough — pre-submission

*Three money flows have to work end-to-end before you submit to the App Store. Tip flow, NovelStack+ subscription flow, ad-unlock flow. Each has the same three-question shape: did the money show up where it should, did the right entitlement get granted, and did the writer's share land in their balance.*

*This guide is in the order you should run it. Use the reviewer account or any account flagged for sandbox.*

---

## Before you start — environment check

Run these in order:

### 1. Confirm Stripe is in TEST mode

In your Render dashboard → web service → Environment, check:

- `STRIPE_SECRET_KEY` starts with `sk_test_…`
- `STRIPE_WEBHOOK_SECRET` is the webhook secret from your test webhook endpoint, not the live one
- `STRIPE_PUBLISHABLE_KEY` (if set) starts with `pk_test_…`

If any of these say `_live_`, **stop**. Switch to test keys, redeploy, come back.

### 2. Confirm RevenueCat is in sandbox

In RevenueCat dashboard → Projects → NovelStack → API keys, the iOS app should be using the **sandbox** key for these tests. Sandbox IAPs don't charge real money. Production swap happens just before App Store submission.

### 3. Confirm the iOS app is signed with a sandbox-capable Apple ID

On your iPhone: Settings → App Store → Sandbox Account. Sign in with a Sandbox Apple ID (create one in App Store Connect → Users and Access → Sandbox if you don't have one). The reviewer account `reviewer@novelstack.app` should also exist as a Sandbox Apple ID for App Review purposes — but for your own testing your personal sandbox account is fine.

---

## Flow 1 — Tip a writer (iOS IAP → Stripe Connect transfer → withdraw)

This is the most important flow to verify because if any link in this chain breaks, writers literally cannot get paid.

### Setup

- Open the iOS app on a real device, signed in as your sandbox Apple ID.
- Sign into NovelStack as a reader account (not @novelstackoriginals — you can't tip yourself).
- Navigate to one of the new NovelStack Originals stories (which you publish from @novelstackoriginals).
- Tap **Tip the author** at the bottom of any chapter.

### The 4-tier IAP

You should see the tip sheet with four pre-set amounts ($0.99, $4.99, $9.99, $19.99 or whatever you set in App Store Connect). Tap $4.99 ("Buy a coffee" tier).

iOS sandbox will show a fake purchase dialog. Tap **Buy**. You'll be asked to confirm with Face ID — that's fine, no real charge happens.

### Verify (a) RevenueCat got it

Open RevenueCat dashboard → Customers → search by your reader account's user ID → look at the transaction log. You should see a `non_consumable` / `consumable` purchase entry for the tip product in the last minute. **If you don't, the IAP didn't fire — check your product IDs match between App Store Connect and RevenueCat.**

### Verify (b) Render Postgres has the row

Open Render Postgres SQL shell:

```sql
SELECT id, sender_id, recipient_id, story_id, amount_cents, created_at
FROM tips
ORDER BY created_at DESC
LIMIT 5;
```

You should see your tip at the top with `amount_cents = 499` (or whatever tier). **If the row isn't there, the RevenueCat webhook isn't firing into your `/api/iap/revenuecat-webhook` route — check that the webhook URL in RevenueCat dashboard points at your Render URL.**

### Verify (c) Earnings dashboard reflects it

Sign in on the **web** as @novelstackoriginals (the recipient). Open `/earnings`. You should see:

- **Available balance** increased by the post-Apple-cut, post-platform-cut share. Math: $4.99 tip → Apple keeps 30% ($1.50) → $3.49 net → 70% to writer ($2.44, rounded) → that's what should land in the balance.
- **Recent activity** row showing the tip from your reader account, with the correct amount.

If the math doesn't match, check `web/lib/earnings.ts` for the cut calculation.

### Verify (d) Stripe Connect transfer

Once you have a positive balance, the @novelstackoriginals account should be able to withdraw. On `/earnings`, click **Withdraw**.

If you haven't completed Stripe Connect onboarding for this account yet, you'll be redirected to onboarding first. Complete it (use Stripe's test bank details: routing `110000000`, account `000123456789`, any UK test postcode like `EC1A 1BB`). You'll be sent back to `/earnings` once onboarding completes.

Click **Withdraw** again. Confirm the amount. Watch the network tab in your browser — the POST should go to `/api/stripe/transfer` and return `{ ok: true, transferId: 'tr_…' }`.

### Verify (e) Stripe dashboard shows the transfer

Stripe dashboard → Connect → Transfers. You should see a recent transfer to the @novelstackoriginals connected account for the correct amount, with status `paid`.

**If all five verifications pass, Flow 1 is green.**

---

## Flow 2 — NovelStack+ subscription (iOS IAP → entitlement → ad-free reading)

### Setup

- Sign in on iOS as a **different** reader account (one that doesn't have NovelStack+ yet).
- Navigate to a locked chapter (any chapter past the third free one in a NovelStack Originals book).
- You should see the ad-unlock CTA + a "Or go all-access with NovelStack+" link. Tap NovelStack+.

### Subscribe

You'll see the NovelStack+ screen with two options: Monthly ($6.99) and Annual ($59.99 or whatever you set). Tap **Monthly**.

iOS sandbox will show the subscription confirmation. Confirm.

### Verify (a) Entitlement granted

Within ~10 seconds you should see the NovelStack+ badge appear in your profile. The ad-unlock CTA on the locked chapter should be replaced with **Read now** (or similar) — the chapter should open without an ad-wall.

### Verify (b) RevenueCat shows active entitlement

RevenueCat dashboard → Customers → your user → Entitlements → "novelstack_plus" should show `Active`. Renewal date set to a future date.

### Verify (c) Render Postgres has the subscription row

```sql
SELECT id, reader_id, status, started_at, renews_at, tier
FROM subscriptions
WHERE reader_id = '<your reader user id>'
ORDER BY started_at DESC;
```

Should show one row with `status = 'active'`, `tier = 'monthly'`.

### Verify (d) No ads served

Open a free chapter (the first three are always free, banner ads show on those). With NovelStack+ active, the banner should NOT render. If it does, check `/web/components/BannerAd.tsx` for the subscription check.

### Verify (e) Cancel + verify expiry

In iOS Settings → Apple ID → Subscriptions → NovelStack+ → Cancel. RevenueCat should reflect the cancellation. Your Render `subscriptions.status` should flip to `cancelled` once the period ends (or `pending_cancel` until then, depending on how you've wired it).

**If all five verifications pass, Flow 2 is green.**

---

## Flow 3 — Ad-unlock (rewarded ad → chapter unlock → pool credit)

### Setup

- Sign in on iOS as a reader account WITHOUT NovelStack+.
- Navigate to a locked chapter.
- Tap **Watch a short ad to continue**.

### Watch the ad

In sandbox/test mode AdMob serves a test ad. Watch it through (or tap close after 5 seconds — sandbox test ads have a skip).

### Verify (a) Chapter unlocks

The chapter body should appear immediately after the ad closes. If it doesn't, check `/web/app/read/actions.ts` `recordAdUnlock` and the entitlement check in `getChapterForReader`.

### Verify (b) Render Postgres logged the unlock

```sql
SELECT id, reader_id, chapter_id, status, author_payout_cents, created_at
FROM ad_unlocks
ORDER BY created_at DESC
LIMIT 5;
```

Should show a row with `status = 'pending'` and `author_payout_cents = null` (the payout amount gets stamped later when you reconcile against AdMob's monthly payout report — that's the admin form at `/admin/payouts/ImportAdRevenueForm.tsx`).

### Verify (c) Same chapter, second visit, no ad-wall

Refresh the chapter. You should land on the body without the ad-wall — the unlock is sticky for that reader on that chapter.

**If all three verifications pass, Flow 3 is green.**

---

## What to do if anything fails

Most failures fall into one of three categories:

- **The webhook didn't fire.** Check the webhook destination URL in the upstream dashboard (RevenueCat, Stripe, AdMob) matches your Render URL exactly. Check the secret matches what's in Render's env. Check the route handler is responding 2xx in Render's logs.
- **The math is off.** Check `web/lib/earnings.ts` for the cut percentages. Apple takes 30%, NovelStack platform takes its cut, the remaining 70% goes to the writer's balance. Round to nearest cent on the writer side.
- **The entitlement isn't reflecting.** RevenueCat is the source of truth for subscriptions; if RevenueCat says active and your DB says inactive, your webhook handler isn't writing the row. Tail Render logs while you reproduce.

---

## Once all three flows are green

1. Swap to **live** keys for Stripe (`sk_live_…`) and RevenueCat. Update Render env. Redeploy.
2. Confirm test webhook endpoint is deactivated in Stripe dashboard — the live webhook should be the only active one.
3. On iOS, switch off the sandbox Apple ID (Settings → App Store → Sandbox Account → Sign out).
4. Run one **real** $0.99 tip on your own account to confirm live keys work end-to-end. You'll get the $0.69 back into your own balance ($0.99 - Apple 30% = $0.69, all to you because you're tipping yourself the platform-cut doesn't apply — or whatever your platform-fee logic does).
5. Submit to App Store.

You're done.
