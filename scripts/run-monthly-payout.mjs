// NovelStack — monthly subscription pool payout job.
//
// Run on the 7th of each month for the prior month's pool. See
// PAYOUTS_DESIGN.md for the full math + research summary.
//
// Defaults to DRY-RUN: prints the breakdown but doesn't mutate the DB.
// Pass --commit to actually write the payout_periods + payouts rows.
//
// Usage (dry-run for verification):
//
//   PAYOUT_CAP_CENTS_PER_MINUTE=2 \
//   DATABASE_URL='postgres://…' \
//   node scripts/run-monthly-payout.mjs --period=2025-03
//
// Usage (commit for real after dry-run looks right):
//
//   PAYOUT_CAP_CENTS_PER_MINUTE=2 \
//   DATABASE_URL='postgres://…' \
//   node scripts/run-monthly-payout.mjs --period=2025-03 --commit
//
// Reads env vars from scripts/.env.covers if present (same file as the
// cover uploader uses — keep all script credentials in one place). Pass
// --confirm-overwrite to re-run a period that already has a payout_periods
// row (refuses by default to prevent accidental double-pays).

import postgres from 'postgres';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const ENV_FILE = path.join(__dirname, '.env.covers');

// Auto-load env from scripts/.env.covers if present.
if (existsSync(ENV_FILE)) {
  const lines = readFileSync(ENV_FILE, 'utf8').split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith("'") && val.endsWith("'")) ||
      (val.startsWith('"') && val.endsWith('"'))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function arg(name, fallback) {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (found) return found.slice(`--${name}=`.length);
  if (process.argv.includes(`--${name}`)) return true;
  return fallback;
}

// --- args + env ------------------------------------------------------------
const DRY_RUN = !arg('commit', false);
const CONFIRM_OVERWRITE = !!arg('confirm-overwrite', false);

const PERIOD = arg('period');
if (!PERIOD || !/^\d{4}-\d{2}$/.test(PERIOD)) {
  console.error('FATAL: --period=YYYY-MM required (e.g. --period=2025-03)');
  process.exit(1);
}

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('FATAL: DATABASE_URL required.');
  process.exit(1);
}

const CAP_CENTS_PER_MIN = parseInt(process.env.PAYOUT_CAP_CENTS_PER_MINUTE ?? '', 10);
if (!Number.isFinite(CAP_CENTS_PER_MIN) || CAP_CENTS_PER_MIN <= 0) {
  console.error('FATAL: PAYOUT_CAP_CENTS_PER_MINUTE must be a positive integer.');
  console.error('  Recommended: 2 (= $0.02 per minute, $1.20 per hour of reading)');
  console.error('  See PAYOUTS_DESIGN.md Part 2 / Source 2 / "Cap value" for context.');
  process.exit(1);
}

// Apple's small-developer rate is 15%. The standard rate (30%) kicks in
// above $1M lifetime proceeds. Keep this configurable so we can flip it
// later without a code change.
const APPLE_FEE_PCT = parseFloat(process.env.APPLE_FEE_PCT ?? '0.15');
const PLATFORM_CUT_PCT = parseFloat(process.env.PLATFORM_CUT_PCT ?? '0.30');

// Words-per-minute used to derive minutes-read from chapter word_count ×
// progress_pct. Industry standard adult prose reading speed.
const WORDS_PER_MINUTE = parseInt(process.env.WORDS_PER_MINUTE ?? '250', 10);

// Subscription price (cents). Pulled from env so we can flex pricing later.
const SUB_PRICE_CENTS = parseInt(process.env.SUB_PRICE_CENTS ?? '699', 10);

const sql = postgres(DB_URL, { ssl: 'require', connect_timeout: 30, max: 2 });

// --- helpers ---------------------------------------------------------------
function fmtCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
function fmt(n, digits = 0) {
  return n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

const periodStart = `${PERIOD}-01`;
// Last day of the period — exclusive upper bound.
const [yr, mo] = PERIOD.split('-').map(Number);
const periodEnd = new Date(Date.UTC(yr, mo, 1)).toISOString().slice(0, 10);

// --- main ------------------------------------------------------------------
(async () => {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`NovelStack monthly payout — period ${PERIOD}`);
  console.log(`${DRY_RUN ? 'DRY-RUN (no writes)' : 'COMMIT MODE — will mutate DB'}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Refuse to re-run an existing period unless explicitly overridden.
  const existing = await sql`
    SELECT id, calculated_at, total_paid_cents FROM payout_periods
    WHERE period_month = ${periodStart} LIMIT 1
  `;
  if (existing.length) {
    if (!CONFIRM_OVERWRITE) {
      console.error(`✗ Period ${PERIOD} already has a payout_periods row from ${existing[0].calculated_at.toISOString()}.`);
      console.error(`  total_paid_cents = ${existing[0].total_paid_cents}`);
      console.error(`  Pass --confirm-overwrite to re-run (it will DELETE the existing payouts for this period and rewrite them).`);
      process.exit(1);
    }
    if (!DRY_RUN) {
      console.log(`⚠ --confirm-overwrite set: deleting existing payouts and period row for ${PERIOD}`);
      await sql`DELETE FROM payouts WHERE payout_period_id = ${existing[0].id}`;
      await sql`DELETE FROM payout_periods WHERE id = ${existing[0].id}`;
    }
  }

  // Step 1 — compute gross subscription revenue for the period.
  // An "active in period" subscription is one whose [started_at, ends_at]
  // window overlaps [periodStart, periodEnd). For monthly billing we count
  // each subscription as $6.99 if it was active for any portion of the
  // period — proportional billing is a v2 refinement.
  const [revRow] = await sql`
    SELECT count(*)::int AS active_subs
    FROM subscriptions
    WHERE started_at < ${periodEnd}::timestamptz
      AND (ends_at IS NULL OR ends_at >= ${periodStart}::timestamptz)
  `;
  const activeSubs = Number(revRow.active_subs || 0);
  const grossRevenueCents = activeSubs * SUB_PRICE_CENTS;

  // Step 2 — apply Apple fee + platform cut.
  const appleFeesCents = Math.round(grossRevenueCents * APPLE_FEE_PCT);
  const appleNetCents = grossRevenueCents - appleFeesCents;
  const platformCutCents = Math.round(appleNetCents * PLATFORM_CUT_PCT);
  const distributableCents = appleNetCents - platformCutCents;

  // Step 3 — compute subscriber-minutes-read per writer.
  // Minutes = (chapter.word_count × progress_pct / 100) / WORDS_PER_MINUTE
  // Only paid chapters (is_free = false) count toward the pool — free
  // chapters aren't part of the value subscribers pay for.
  const writerMinutes = await sql`
    SELECT
      stories.author_id AS writer_id,
      sum(
        (chapters.word_count::numeric * reads.progress_pct / 100.0) / ${WORDS_PER_MINUTE}
      )::numeric AS minutes
    FROM reads
    INNER JOIN chapters ON chapters.id = reads.chapter_id
    INNER JOIN stories ON stories.id = chapters.story_id
    WHERE reads.is_subscriber = true
      AND chapters.is_free = false
      AND reads.created_at >= ${periodStart}::timestamptz
      AND reads.created_at < ${periodEnd}::timestamptz
      AND reads.progress_pct > 0
    GROUP BY stories.author_id
  `;

  const totalSubscriberMinutes = writerMinutes.reduce(
    (acc, row) => acc + Number(row.minutes || 0),
    0,
  );

  // Step 4 — compute per-minute rate with cap.
  const naturalRate = totalSubscriberMinutes > 0
    ? distributableCents / totalSubscriberMinutes
    : 0;
  const perMinuteRate = Math.min(naturalRate, CAP_CENTS_PER_MIN);

  // Step 5 — compute per-writer payouts.
  // subscriptionCents is rounded down (Math.floor) so we never overpay.
  const writerPayouts = writerMinutes.map((row) => {
    const writerId = row.writer_id;
    const minutes = Number(row.minutes || 0);
    const subscriptionCents = Math.floor(minutes * perMinuteRate);
    return { writerId, minutes, subscriptionCents };
  });

  const totalPaidCents = writerPayouts.reduce((s, w) => s + w.subscriptionCents, 0);
  const surplusCents = distributableCents - totalPaidCents;

  // Step 6 — pull confirmed ad-revenue per writer for the same period and
  // unpaid tips so the payout row reflects the writer's full take for the month.
  const writerAd = await sql`
    SELECT
      stories.author_id AS writer_id,
      coalesce(sum(ad_unlocks.author_payout_cents), 0)::numeric AS cents
    FROM ad_unlocks
    INNER JOIN chapters ON chapters.id = ad_unlocks.chapter_id
    INNER JOIN stories ON stories.id = chapters.story_id
    WHERE ad_unlocks.status = 'confirmed'
      AND ad_unlocks.created_at >= ${periodStart}::timestamptz
      AND ad_unlocks.created_at < ${periodEnd}::timestamptz
    GROUP BY stories.author_id
  `;
  const writerTip = await sql`
    SELECT
      recipient_id AS writer_id,
      sum(amount_cents)::int AS cents
    FROM tips
    WHERE created_at >= ${periodStart}::timestamptz
      AND created_at < ${periodEnd}::timestamptz
    GROUP BY recipient_id
  `;
  const adByWriter = new Map(writerAd.map((r) => [r.writer_id, Math.round(Number(r.cents || 0))]));
  const tipByWriter = new Map(writerTip.map((r) => [r.writer_id, Number(r.cents || 0)]));
  const adUnlocksConfirmedCents = [...adByWriter.values()].reduce((s, v) => s + v, 0);

  const allWriterIds = new Set([
    ...writerPayouts.map((w) => w.writerId),
    ...adByWriter.keys(),
    ...tipByWriter.keys(),
  ]);

  // --- print breakdown ----------------------------------------------------
  console.log('POOL COMPUTATION');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  Active subscribers in period         : ${fmt(activeSubs)}`);
  console.log(`  Sub price per month (cents)          : ${SUB_PRICE_CENTS}`);
  console.log(`  Gross revenue                        : ${fmtCents(grossRevenueCents)}`);
  console.log(`  Apple fee (${(APPLE_FEE_PCT * 100).toFixed(0)}%)                       : -${fmtCents(appleFeesCents)}`);
  console.log(`  Apple net                            : ${fmtCents(appleNetCents)}`);
  console.log(`  Platform cut (${(PLATFORM_CUT_PCT * 100).toFixed(0)}%)                : -${fmtCents(platformCutCents)}`);
  console.log(`  Distributable pool                   : ${fmtCents(distributableCents)}`);
  console.log('');
  console.log('ENGAGEMENT');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  Total subscriber-minutes             : ${fmt(totalSubscriberMinutes, 1)}`);
  console.log(`  Natural rate (cents/min)             : ${naturalRate.toFixed(6)}`);
  console.log(`  Cap (cents/min)                      : ${CAP_CENTS_PER_MIN}`);
  console.log(`  Actual rate (cents/min)              : ${perMinuteRate.toFixed(6)}  ${perMinuteRate < naturalRate ? '← cap applied' : ''}`);
  console.log('');
  console.log('PAYOUT BREAKDOWN');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  Writers earning subscription pool    : ${fmt(writerPayouts.length)}`);
  console.log(`  Writers earning confirmed ad share   : ${fmt(adByWriter.size)}`);
  console.log(`  Writers earning tips in period       : ${fmt(tipByWriter.size)}`);
  console.log(`  Total writers receiving a payout row : ${fmt(allWriterIds.size)}`);
  console.log(`  Total subscription paid out          : ${fmtCents(totalPaidCents)}`);
  console.log(`  Confirmed ad revenue rolled in       : ${fmtCents(adUnlocksConfirmedCents)}`);
  console.log(`  Surplus retained by NovelStack       : ${fmtCents(surplusCents)}`);
  console.log('');

  // --- write or skip ------------------------------------------------------
  if (DRY_RUN) {
    console.log('DRY-RUN — no rows written.');
    console.log('  Re-run with --commit to apply.');
    await sql.end({ timeout: 5 });
    process.exit(0);
  }

  console.log('COMMITTING TO DATABASE…');
  console.log('───────────────────────────────────────────────────────────────');

  // Write payout_periods row.
  const [periodRow] = await sql`
    INSERT INTO payout_periods (
      period_month, gross_revenue_cents, apple_fees_cents, apple_net_cents,
      platform_cut_cents, distributable_cents, total_subscriber_minutes,
      natural_rate_cents_per_min, cap_cents_per_min, per_minute_rate_cents_per_min,
      total_paid_cents, surplus_cents, ad_unlocks_confirmed_cents
    ) VALUES (
      ${periodStart}, ${grossRevenueCents}, ${appleFeesCents}, ${appleNetCents},
      ${platformCutCents}, ${distributableCents}, ${Math.round(totalSubscriberMinutes)},
      ${naturalRate.toFixed(6)}, ${CAP_CENTS_PER_MIN}, ${perMinuteRate.toFixed(6)},
      ${totalPaidCents}, ${surplusCents}, ${adUnlocksConfirmedCents}
    )
    RETURNING id
  `;
  const periodId = periodRow.id;
  console.log(`  ✓ payout_periods row written (${periodId})`);

  // Write one payouts row per writer (subscription + ad + tip combined).
  let writerCount = 0;
  for (const writerId of allWriterIds) {
    const subCents = writerPayouts.find((w) => w.writerId === writerId)?.subscriptionCents ?? 0;
    const subMinutes = Math.round(writerPayouts.find((w) => w.writerId === writerId)?.minutes ?? 0);
    const adCents = adByWriter.get(writerId) ?? 0;
    const tipCents = tipByWriter.get(writerId) ?? 0;
    const totalCents = subCents + adCents + tipCents;
    if (totalCents === 0) continue;

    await sql`
      INSERT INTO payouts (
        writer_id, period_month, payout_period_id, subscriber_minutes,
        subscription_cents, ad_cents, tip_cents, total_cents, status
      ) VALUES (
        ${writerId}, ${periodStart}, ${periodId}, ${subMinutes},
        ${subCents}, ${adCents}, ${tipCents}, ${totalCents}, 'pending'
      )
    `;
    writerCount += 1;
  }
  console.log(`  ✓ ${writerCount} writer payouts row${writerCount === 1 ? '' : 's'} written`);

  // Sanity check: total written should equal totalPaidCents + ad + tip sums.
  const [check] = await sql`
    SELECT
      coalesce(sum(subscription_cents), 0)::bigint AS sub_total,
      coalesce(sum(total_cents), 0)::bigint AS total
    FROM payouts WHERE payout_period_id = ${periodId}
  `;
  const writtenSub = Number(check.sub_total);
  const writtenTotal = Number(check.total);
  console.log('');
  console.log('SANITY CHECK');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  Subscription cents written : ${fmtCents(writtenSub)} (expected ${fmtCents(totalPaidCents)})`);
  console.log(`  Total cents written        : ${fmtCents(writtenTotal)}`);
  if (writtenSub !== totalPaidCents) {
    console.error('  ✗ Subscription total mismatch — investigate before paying out.');
    process.exit(2);
  }
  console.log(`  ✓ Numbers match.`);
  console.log('');
  console.log('DONE.');

  await sql.end({ timeout: 5 });
  process.exit(0);
})().catch(async (e) => {
  console.error('FATAL:', e?.message ?? e);
  try { await sql.end({ timeout: 5 }); } catch {}
  process.exit(1);
});
