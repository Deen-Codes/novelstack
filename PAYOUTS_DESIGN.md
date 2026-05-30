# NovelStack Payouts — System Design

This is the spec for how writers get paid. Three sources, one rule for each, plus one anti-bankruptcy guardrail that applies across all three.

Goal: never pay out more money than the platform has received. Always reflect real numbers, never estimates. Writers see what they actually earned, paid out on a predictable monthly cycle.

---

## Money flow at a glance

Every flow follows the same shape: **upstream payment processor takes its fee first**, **NovelStack takes 30%** of what's left, **writer gets 70%** of what's left (or their share of the pool, for NovelStack+).

```
                              ┌────────────────────────────────────────────┐
                              │            ALL THREE FLOWS                 │
                              │                                            │
  Reader pays $X    ─────►   Apple / Google / Stripe takes processor fee  │
                              ↓                                            │
                              NovelStack takes 30% platform cut            │
                              ↓                                            │
                              Writer gets 70% (or pool share for NS+)      │
                              └────────────────────────────────────────────┘
```

Concrete fee stack for each path:

| Path                      | Processor cut    | NovelStack cut | Writer share | Notes                                       |
| ------------------------- | ---------------- | -------------- | ------------ | ------------------------------------------- |
| iOS subscription (Apple)  | 15% (or 30%)     | 30% of net     | 70% of net   | 15% under $1M lifetime, 30% above           |
| iOS tip (Apple)           | 15% (or 30%)     | 30% of net     | 70% of net   | Same as above                               |
| iOS rewarded ad (AdMob)   | None upfront     | 30% of net     | 70% of net   | AdMob pays NovelStack, we split             |
| Android sub/tip (future)  | 15% (or 30%)     | 30% of net     | 70% of net   | Google Play matches Apple's 15/30 structure |
| Web subscription (Stripe) | 2.9% + $0.30/txn | 30% of net     | 70% of net   | Stripe processing fee per charge            |
| Web tip (Stripe)          | 2.9% + $0.30/txn | 30% of net     | 70% of net   | Same as above                               |
| Banner ads (AdMob)        | None upfront     | **100%**       | 0%           | Discovery subsidy — see Source 4 below      |

**RevenueCat fee:** RevenueCat is free up to $10K MTR (monthly tracked revenue). Above that they charge 1% of revenue above the threshold. We're at $0 right now so it's 0% in practice for v1. When we hit $10K MTR we deduct it between the processor fee and the NovelStack 30% line.

---

## Part 1 — Industry research summary

These are the systems NovelStack's payouts model is built on. I've stolen the strongest idea from each.

### Kindle Unlimited — the closest analogue

Amazon's KU is a $11.99/month all-you-can-read subscription. Authors get paid out of a monthly pool, in proportion to how many pages of their work KU subscribers read.

The mechanic that matters: Amazon publishes both the **pool size** AND the **per-page rate** each month. So an author with 100,000 pages read in March 2024 (when the rate was $0.00399/page) gets a payout of ~$399. The rate fluctuates based on (pool ÷ total pages read across all authors).

Recent KU rates: $0.004-$0.005 per "KENPC" (Kindle Edition Normalized Page Count). Pool typically $40-$50M/month.

**What NovelStack takes:** monthly pool, pro-rata distribution based on engagement, transparent per-unit rate published in the writer's dashboard.

### Spotify — the proportional-pool reference

Spotify pays artists a fraction of subscription revenue equal to their share of total streams. Per-stream rate is $0.003-$0.005, but the actual model is "your-streams ÷ all-streams × pool". Not a fixed per-stream payment.

**What NovelStack takes:** the proportional-share framing. Your-minutes ÷ all-minutes × pool. No per-unit promise that we have to honor in down months.

### Medium Partner Program — the engagement-unit lesson

Medium pays writers based on member-paid reading time. Specifically, minutes of attention from paying members. They publish detailed breakdowns to writers monthly.

**What NovelStack takes:** **minutes** as the engagement unit, not page-views or chapter-finishes. Minutes capture genuine attention — someone bouncing off chapter 1 in 20 seconds doesn't earn the writer the same as someone reading all of chapter 1 over 12 minutes.

### Wattpad Paid Stories — the genre-specific baseline

Wattpad pays authors via a coin model. Readers buy coins, spend them per chapter. Author gets ~50-60% of the coin revenue for their chapters. Not pool-based — direct chapter purchases.

**What NovelStack takes:** nothing for the subscription side, but the tip flow already mirrors this (direct purchase, writer gets the share immediately).

### Substack / Patreon — the direct-creator baseline

Both pay-per-creator-subscription models. Substack takes 10%, Stripe takes ~3%, writer keeps the rest. Not pool-based — money flows direct.

**What NovelStack takes:** the per-writer-direct path already mirrors this for tips. The pool model is for NovelStack+ all-access subscribers (a different reader category).

### Lag — universal across all platforms

Every platform on this list pays for **last month's reads this month**, with a 30-60 day lag:

- KU: pays around the 29th of the month, two months after the reads
- Spotify: monthly statements lag ~60 days (March reads → May statement)
- Medium: pays around the 5th of the following month
- Patreon: monthly to creators after ~5 day Stripe hold

**NovelStack timing decision:** pay on the 7th of the next month. So March 1-31 reads → April 7th payout to writers' available-balance. This gives every webhook 7 days to fully settle, refund window to close, dispute period to pass.

---

## Part 2 — The three payout sources

### Source 1 — Tips

Already shipped + working. Reader pays $0.99 / $4.99 / $9.99 / $19.99 via Apple IAP. RevenueCat webhook fires `/api/tips/iap-credit`. Cut math:

```
gross         = $4.99                  (what reader pays)
apple_net     = gross × 0.85            ($4.24)  Apple takes 15% (small dev rate)
platform_cut  = apple_net × 0.30        ($1.27)  NovelStack keeps 30%
writer_share  = apple_net × 0.70        ($2.97)  → writer's available balance
```

Tips land in `tips` table immediately. Available-balance reflects them instantly. No lag, no pool — the money is already attributable to a specific writer.

**Cap?** No cap on tips. Per-reader cap on Apple IAP is the natural one ($999.99/transaction).

### Source 2 — NovelStack+ subscription pool (the new thing)

This is the gap we're closing.

#### Pool computation (runs monthly, for prior month)

```
gross_revenue   = sum(active subscription × $6.99/mo across the period)
apple_net       = gross_revenue × 0.85              Apple takes 15%
platform_cut    = apple_net × 0.30                  NovelStack keeps 30%
distributable   = apple_net − platform_cut          (= apple_net × 0.70)
```

So for 100 NovelStack+ subscribers in a month:

```
gross_revenue   = 100 × $6.99 = $699.00
apple_net       = $699.00 × 0.85 = $594.15
platform_cut    = $594.15 × 0.30 = $178.25
distributable   = $594.15 × 0.70 = $415.91  ← this is the pool
```

#### Engagement measurement

Engagement = subscriber-minutes-read per writer's work during the period.

Minutes-read is derived from `reads.progressPct` × `chapters.wordCount` ÷ 250 (typical adult prose reading speed). Only `reads` rows with `isSubscriber = true` and `completedAt` (or `progressPct >= 10`) count, and only on chapters that are paid (`is_free = false`).

#### Per-minute rate with cap

```
natural_rate    = distributable ÷ total_subscriber_minutes
per_minute_rate = min(natural_rate, CAP_CENTS_PER_MINUTE)
```

#### Per-writer payout

```
writer_minutes  = sum of subscriber-minutes for that writer's paid chapters in the period
writer_payout   = writer_minutes × per_minute_rate
```

#### The surplus rule (anti-bankruptcy guardrail)

```
total_paid      = sum of all writer_payouts
surplus         = distributable − total_paid    ← stays with NovelStack
```

Surplus exists ONLY when `natural_rate > CAP`. In a low-engagement month the cap doesn't bite, surplus is zero, every cent of `distributable` goes to writers. In a high-engagement / low-subscriber month the cap protects NovelStack from per-minute payouts exceeding the cap.

**Why this never bankrupts NovelStack:**

1. `distributable` is computed from money we've actually received (via RevenueCat webhook → `subscriptions` table). If the money isn't in the bank, it's not in the pool.
2. `total_paid` is mathematically capped at `distributable` (because per-minute rate × total minutes can't exceed the pool by definition of how natural_rate is computed).
3. If a refund comes in after the pool is computed (rare — refund window for Apple IAP is short), we record it as a chargeback against next month's pool. We never claw back from writers.

#### Cap value

Recommended starting cap: **$0.02 per minute** ($1.20 per hour of reading).

This is generous. For comparison, Medium pays ~$0.01-$0.03/min. KU works out to roughly $0.012/min if you assume 250 words/min reading speed and the recent $0.005/page rate.

At $0.02/min, a writer whose work gets 100 hours of subscriber reading per month earns $120. The cap protects against a scenario where pool stays small but a single writer disproportionately captures all the engagement.

**Where the cap lives:** env var `PAYOUT_CAP_CENTS_PER_MINUTE` on Render. Default 2 (cents). Tunable without redeploy.

### Source 3 — Rewarded-ad unlocks (delayed honest)

Reader watches a rewarded ad → `ad_unlocks` row created with `status='pending'`, `author_payout_cents=null`. **Dashboard shows zero ad earnings for that row** until AdMob's real revenue figure lands.

**Why null and zero, not an estimate:** the old code had `PENDING_AD_ESTIMATE_CENTS = 1` (a placeholder 1¢ per unlock shown as "rough estimate"). Killing this. Reasons:

1. Estimates lie. If writers see "estimate: $4.32" and then actual is $1.85 they (rightly) feel cheated.
2. AdMob's per-impression yield varies wildly by geography and demographic. A 1¢ estimate can be 10x off in either direction.
3. Honest accounting: until real data lands, that row earns zero. When real data lands, the row gets backfilled.

**Reconciliation cycle — the 60-day lag explained:**

AdMob runs on a two-stage settlement. The numbers don't become final until 30 days after month-end (AdMob waits to finalize impression revenue and refund any invalid traffic), and AdMob doesn't actually wire the money to NovelStack until ~30 days after that. So:

- **Day 1** (e.g. March 15) — reader watches ad, row created `status='pending'`, `author_payout_cents=null`
- **End of March** — month closes. Revenue is "earned" but not finalized.
- **~Apr 30** — AdMob finalizes April-1-payable March numbers (their "estimated → finalized" transition)
- **~May 21** — AdMob wires the March revenue to NovelStack's bank
- **June 7** — monthly pool payout job picks up all March-period `status='confirmed'` rows and pays writers their 70% share via the normal monthly payout

So an ad-unlock from March 15 lands as cash in the writer's available balance around **June 7** — roughly an 85-day lag from watch to payout. This is industry-standard for ad-rev-share programs (YouTube AdSense follows a near-identical cadence).

Writer dashboard shows `pendingAdUnlocks` as a count (e.g. "23 unlocks awaiting AdMob reconciliation") but no fictional dollar estimate. The writer-facing explainer ([PAYOUT_FAQ.md](./PAYOUT_FAQ.md)) tells writers in plain language why the lag exists so they don't read pending counts as missing money.

After reconciliation, the cut split kicks in: AdMob pays $X to NovelStack for a given unlock → NovelStack keeps 30% → 70% credited to the writer via `author_payout_cents`.

### Source 4 — Banner ads on free chapters (100% NovelStack, by design)

Banner ads run only on the first three (free) chapters of each book. **All banner revenue stays with NovelStack.** Writers get zero from banners.

This is intentional and is documented in PAYOUT_FAQ.md so writers know upfront:

- Free chapters exist as the **discovery funnel**. Their purpose is to hook readers who then either subscribe (NovelStack+ pool, 70% to writers) or watch a rewarded ad on chapter 4+ (70% to writers).
- Banner revenue funds the discovery — server costs, content moderation, app-store distribution, the platform itself. Without banner-supported free chapters, paid chapters would have no audience.
- The rewarded-ad path on paid chapters is where writers earn from ad views. That's a deliberate choice on the reader's part (they actively watched an ad to unlock a chapter), and the writer gets the 70% share for that.
- Subscription + rewarded ads + tips are the three ways a writer earns. Banners are the cost of the free-chapter shop window.

If we ever change this (e.g. give writers a small slice of banner revenue), we update PAYOUT_FAQ.md, give writers 30 days' notice, and apply prospectively.

---

## Part 3 — Timing & cash flow

**Subscription pool — 7 day lag** (March reads → April 7 payout)

```
March 1 ─────────────────── March 31 ───────── April 7
  │                            │                  │
  │ subscribers pay            │ pool window     │ pool job runs
  │ readers read paid          │  closes          │ writers see March
  │  chapters                  │                  │  pool share land
  │                            │                  │  in available balance
```

**Rewarded ad unlocks — ~85 day lag** (March watches → June 7 payout)

```
March 1 ─── March 31 ─── ~April 30 ───── ~May 21 ────── June 7
  │           │             │                │              │
  │ readers   │ month       │ AdMob          │ AdMob wires  │ pool job rolls
  │  watch    │  closes     │  finalises     │  the cash    │  confirmed ad
  │  ads      │             │  numbers       │  to us       │  cents into
  │           │             │  (status=      │              │  writer payouts
  │           │             │  confirmed)    │              │
```

The two-stage AdMob lag is unavoidable (AdMob's payment terms) but writers know about it upfront via PAYOUT_FAQ.md.

**On April 7 (subscription pool only):**
1. Pool job computes March pool from `subscriptions` active during March 1-31
2. Per-minute rate calculated using March subscriber-reads
3. Per-writer payouts written to `payouts` (one row per writer who earned anything)
4. `payout_periods` row written with full audit trail (pool size, cap, rate, surplus)
5. Writers see "March 2025 payout: $X" appear in their available balance
6. Writers can `Withdraw` if they've completed Stripe Connect onboarding

**On June 7 (the same April 7 job, two months later, picks up March's confirmed ad unlocks):**
- All `ad_unlocks` from March that have been `status='confirmed'` by then get their writer-70% share rolled into the writer's June payout under `payouts.adCents`

---

## Part 4 — Schema additions

New table `payout_periods` to record per-month pool computation (the audit trail). Existing `payouts` table extended with `payoutPeriodId` foreign key.

```sql
CREATE TABLE payout_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_month date NOT NULL UNIQUE,           -- 2025-03-01
  gross_revenue_cents bigint NOT NULL,
  apple_fees_cents bigint NOT NULL,
  apple_net_cents bigint NOT NULL,
  platform_cut_cents bigint NOT NULL,
  distributable_cents bigint NOT NULL,
  total_subscriber_minutes bigint NOT NULL,
  natural_rate_cents_per_min numeric(10, 6) NOT NULL,
  cap_cents_per_min integer NOT NULL,          -- snapshotted at run time
  per_minute_rate_cents_per_min numeric(10, 6) NOT NULL,
  total_paid_cents bigint NOT NULL,
  surplus_cents bigint NOT NULL,
  ad_unlocks_confirmed_cents bigint NOT NULL,  -- sum of confirmed ad share rolled in
  status text NOT NULL DEFAULT 'calculated',   -- calculated | disbursed
  calculated_at timestamptz NOT NULL DEFAULT now()
);
```

Add to `payouts`:

```sql
ALTER TABLE payouts ADD COLUMN payout_period_id uuid REFERENCES payout_periods(id);
ALTER TABLE payouts ADD COLUMN subscriber_minutes bigint NOT NULL DEFAULT 0;
```

---

## Part 5 — Sandbox testing strategy

The whole stack runs against **Stripe test mode** + **RevenueCat sandbox** + **AdMob test ads** without any code change. The env vars switch what's hit.

Walkthrough (full version in `PAYOUTS_RUNBOOK.md`):

1. Seed sandbox data: 5 fake subscribers via RevenueCat's sandbox-purchase emulator
2. Seed reads: SQL insert ~20 `reads` rows with `isSubscriber=true` against various chapters
3. Run `node scripts/run-monthly-payout.mjs --period=2025-03 --dry-run`
4. Inspect output: pool size, per-minute rate, per-writer breakdown, surplus
5. If math looks right, re-run without `--dry-run` to commit
6. Inspect `payout_periods` and `payouts` tables in Postgres
7. Open the iOS app, signed in as a seeded writer, check earnings dashboard reflects the payout
8. Flip to live keys, repeat with one real $0.99 subscription

The **dry-run flag is critical** — every run defaults to printing the math without writing to the DB. You have to explicitly opt-in with `--commit` to mutate.

---

## Part 6 — Anti-bankruptcy guardrails (recap)

1. **Pool computed from received money only.** No projections.
2. **Mathematical impossibility of overpayment.** `total_paid ≤ distributable` by construction.
3. **Dry-run by default.** Job won't mutate without explicit `--commit`.
4. **Cap is required.** Job refuses to run if `PAYOUT_CAP_CENTS_PER_MINUTE` env is not set.
5. **Refunds never claw back from writers.** They net against next month's pool.
6. **Honest pending state.** AdMob unlocks show as zero until real revenue lands, not as estimates.

---

## Part 7 — What's not in v1 (deferred to post-launch)

- AdMob Reporting API integration (currently still requires manual monthly CSV import via the existing admin form; nightly auto-reconciliation is post-launch). Needs Google Cloud service account setup which is a separate prerequisite Deen has to complete.
- Cron scheduling — for v1 the monthly job is run manually on the 7th (set a calendar reminder). Cron via Render Cron Jobs or GitHub Actions can land in v1.1.
- Multi-currency. Everything is USD-cents for v1.
- Pool transparency page (`/earnings/pool` showing the month's pool size, rate, top earners). UI polish for v2.

What IS in v1:
- Monthly subscription pool job (cap, surplus, audit trail) — buildable + testable tonight
- Earnings dashboard updated to remove pending estimates
- Ad-unlock honest accounting (zero until confirmed)
- Sandbox-testable end-to-end
