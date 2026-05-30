# Payouts Runbook — sandbox to live

This is the step-by-step for testing the monthly subscription pool payout job in sandbox and then flipping to live. Designed so you can run it confidently the first time.

Read this **alongside** [PAYOUTS_DESIGN.md](./PAYOUTS_DESIGN.md) which has the math + research summary. This file is the operational checklist.

---

## Pre-flight (one-time setup)

### 1. Apply the schema migration

The new `payout_periods` table + the additions to `payouts` need to land in your Render Postgres before you run anything.

```
psql "$DATABASE_URL" -f web/db/migrations/0003_payout_periods.sql
```

(`$DATABASE_URL` is the External Database URL from your Render dashboard → Postgres service → Connect.)

You should see `BEGIN`, `CREATE TABLE`, `ALTER TABLE`, `COMMIT`. Re-running is safe (the migration uses `IF NOT EXISTS` everywhere).

### 2. Set the payout cap env var

The monthly job refuses to run if the cap isn't set. **Required.** Recommended starting value: 2 (= $0.02 per minute of reading, $1.20 per hour).

Add to `scripts/.env.covers` (same file the cover uploader uses — it doubles as the script-runner credentials store):

```
PAYOUT_CAP_CENTS_PER_MINUTE=2
```

Optional knobs (defaults shown):

```
APPLE_FEE_PCT=0.15           # 15% small-dev rate; flip to 0.30 above $1M lifetime
PLATFORM_CUT_PCT=0.30        # NovelStack's 30%
WORDS_PER_MINUTE=250         # used to derive minutes from progress + word count
SUB_PRICE_CENTS=699          # NovelStack+ monthly price
```

### 3. (One-time) install script deps

If you haven't already from the cover uploader:

```
cd scripts && npm install && cd ..
```

---

## Sandbox test — first run

This walks through running the job against your real Render Postgres in **dry-run mode**. No DB writes happen. Just verifies the math against your actual data.

### Pick a period

Use a recent calendar month that's fully closed. If today is May 15, use `--period=2025-04`. Don't use the current month — pool windows close at month-end.

### Run dry

```
cd /Users/deen/Documents/novelstack
node scripts/run-monthly-payout.mjs --period=2025-04
```

Expected output:

```
═══════════════════════════════════════════════════════════════
NovelStack monthly payout — period 2025-04
DRY-RUN (no writes)
═══════════════════════════════════════════════════════════════

POOL COMPUTATION
───────────────────────────────────────────────────────────────
  Active subscribers in period         : 12
  Sub price per month (cents)          : 699
  Gross revenue                        : $83.88
  Apple fee (15%)                      : -$12.58
  Apple net                            : $71.30
  Platform cut (30%)                   : -$21.39
  Distributable pool                   : $49.91

ENGAGEMENT
───────────────────────────────────────────────────────────────
  Total subscriber-minutes             : 1,847.3
  Natural rate (cents/min)             : 2.701463
  Cap (cents/min)                      : 2
  Actual rate (cents/min)              : 2.000000  ← cap applied

PAYOUT BREAKDOWN
───────────────────────────────────────────────────────────────
  Writers earning subscription pool    : 7
  Writers earning confirmed ad share   : 3
  Writers earning tips in period       : 5
  Total writers receiving a payout row : 9
  Total subscription paid out          : $36.94
  Confirmed ad revenue rolled in       : $4.20
  Surplus retained by NovelStack       : $12.97

DRY-RUN — no rows written.
  Re-run with --commit to apply.
```

### What to look at

1. **Gross revenue** — does it match what you'd expect from RevenueCat's monthly report for that period? If not, the `subscriptions` table is out of sync with RevenueCat — fix that first.
2. **Total subscriber-minutes** — sanity check: if you have ~10 subscribers and the month had reasonable reading, you'd expect 500-5000 minutes. If it's zero, no NS+ subscribers are reading paid chapters in the period.
3. **Per-minute rate** — should be ≤ cap. If natural > cap, you'll see "← cap applied" and a positive surplus. Both are fine.
4. **Surplus** — this is what stays with NovelStack. In low-engagement months this is the protective buffer.

### If anything looks off

- **Zero subscribers** — means RevenueCat webhook isn't writing subscription rows. Check `/api/revenuecat-webhook` is reachable + its secret matches.
- **Zero minutes** — means `reads.is_subscriber` is never being set true. Check the reader's subscription state is being stamped on the read row at chapter-open time.
- **Numbers way off your mental model** — re-read PAYOUTS_DESIGN.md Part 2 / Source 2 and check the cap/cut env vars match what you intended.

---

## Sandbox test — commit

When the dry-run looks right, commit:

```
node scripts/run-monthly-payout.mjs --period=2025-04 --commit
```

You'll see the same breakdown plus:

```
COMMITTING TO DATABASE…
───────────────────────────────────────────────────────────────
  ✓ payout_periods row written (a3b9c7d1-…)
  ✓ 9 writer payouts rows written

SANITY CHECK
───────────────────────────────────────────────────────────────
  Subscription cents written : $36.94 (expected $36.94)
  Total cents written        : $48.11
  ✓ Numbers match.

DONE.
```

### Verify in Postgres

```sql
-- The pool audit row:
SELECT * FROM payout_periods WHERE period_month = '2025-04-01';

-- The per-writer payouts that came out of it:
SELECT writer_id, subscriber_minutes, subscription_cents, ad_cents, tip_cents, total_cents, status
FROM payouts
WHERE period_month = '2025-04-01'
ORDER BY total_cents DESC;
```

### Verify in the iOS app

1. Sign in as one of the writers who got a payout (the @novelstackoriginals account if you tested with that, or one of the seed personas).
2. Open the Earnings tab.
3. The new payout should appear in the Payout history list with the correct totals.
4. Available balance should reflect the new earnings (sum of unpaid payouts + unpaid tips).

### If something is wrong

Re-run with `--confirm-overwrite` to delete and rewrite that period's data:

```
node scripts/run-monthly-payout.mjs --period=2025-04 --commit --confirm-overwrite
```

Without `--confirm-overwrite` the script refuses to touch an already-computed period (safety).

---

## Going live

When you're confident the job runs correctly against test data:

### 1. Flip Stripe to live keys

In Render → web service → Environment, swap:

- `STRIPE_SECRET_KEY` `sk_test_…` → `sk_live_…`
- `STRIPE_WEBHOOK_SECRET` → the live webhook's secret (create a new live webhook endpoint in Stripe dashboard pointing at your Render URL)
- `STRIPE_PUBLISHABLE_KEY` `pk_test_…` → `pk_live_…`

Redeploy.

### 2. Flip RevenueCat to production keys

In Render web env + in your `mobile/app.json` (or env-injected RevenueCat key for the iOS bundle), swap from sandbox API key to production. Rebuild the iOS binary if needed.

### 3. Confirm one real $0.99 tip works end-to-end

Sign in on iOS as a real reader. Tip yourself $0.99. Within seconds:
- `tips` table has the new row (`amount_cents = 99`)
- Earnings page shows the tip on your account (you'll see ~$0.59 land in available balance — the platform doesn't double-tax you tipping yourself, the math is just `(99 × 0.85) × 0.70 = 58.91` rounded to 59)

### 4. Schedule the monthly job

Two options:

**Option A: calendar reminder.** Set a recurring monthly calendar reminder on the 7th. Open your laptop, run:

```
cd /Users/deen/Documents/novelstack
node scripts/run-monthly-payout.mjs --period=<last-month> --commit
```

This is fine for v1 — takes 30 seconds, you have eyes on every run, no surprise auto-disbursements.

**Option B: Render Cron Job.** In Render dashboard → New → Cron Job, point it at:

```
node scripts/run-monthly-payout.mjs --period=$(date -d "$(date +%Y-%m-01) -1 month" +%Y-%m) --commit
```

Schedule: `0 9 7 * *` (9am UTC on the 7th of each month). Make sure the env on the cron service includes `DATABASE_URL` and `PAYOUT_CAP_CENTS_PER_MINUTE`.

For v1 I recommend Option A — eyes-on for the first 3-4 months while you build confidence in the numbers.

### 5. Stripe Connect transfers

The payout job writes `payouts` rows with `status='pending'`. The writer-facing **Withdraw** button on `/earnings` (web) triggers `/api/stripe/transfer` which fires the actual Stripe Connect transfer. That part already exists. The job just makes the rows exist for transfers to fire against.

---

## Anti-bankruptcy invariants — what to look for if you're nervous

These are the four checks that mean you cannot ever pay out more than you've received:

1. **`payout_periods.distributable_cents = apple_net - platform_cut`** — derived from money already in your Stripe balance. Never projected.
2. **`payout_periods.total_paid_cents ≤ payout_periods.distributable_cents`** — mathematically guaranteed because `per_minute_rate = min(natural, cap)` and `total_paid = per_minute_rate × total_minutes ≤ natural × total_minutes = distributable`.
3. **Sum of `payouts.subscription_cents` for the period = `payout_periods.total_paid_cents`** — sanity check at the end of every run. The script asserts this; if it ever fails it exits with code 2 and doesn't claim DONE.
4. **No row gets refunded out from under a writer.** If a subscriber refunds in April, RevenueCat sends the refund webhook → `subscriptions` row updates → next pool calculation (May's pool for April reads) reflects the lower count. Writers' April payouts already exist and are not reduced. Net cost to NovelStack is at most one period of one subscriber's share.

You can re-verify any historical period at any time:

```sql
SELECT
  period_month,
  distributable_cents,
  total_paid_cents,
  surplus_cents,
  distributable_cents - total_paid_cents AS computed_surplus,
  CASE WHEN distributable_cents = total_paid_cents + surplus_cents
       THEN '✓' ELSE '✗ MISMATCH' END AS check
FROM payout_periods
ORDER BY period_month DESC;
```

If you ever see ✗ in the check column, stop and investigate.

---

## What's NOT in this v1 (and what to do instead)

| Thing | v1 status | Workaround |
|---|---|---|
| AdMob Reporting API auto-reconciliation | Not built | Manual monthly CSV import via `/admin/payouts/ImportAdRevenueForm.tsx` |
| Monthly cron auto-run | Not built | Calendar reminder + manual `--commit` run |
| Pool transparency page for writers | Not built | Writers see their own minutes + total payout; pool-wide numbers in admin only |
| Refund clawback automation | Not built | Refunds reduce next month's `subscriptions` count automatically; if a single writer's payout needs reversing you do it manually via SQL |
| Multi-currency | Not built | Everything USD-cents |

These are post-launch, in priority order. For v1 launch the four invariants above are the actual safety net.
