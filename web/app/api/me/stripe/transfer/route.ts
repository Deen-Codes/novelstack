import { NextResponse } from 'next/server';
import { and, desc, eq, gt, isNull, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
  adUnlocks,
  chapters,
  payouts,
  stories,
  tips,
  users,
} from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import {
  stripeConfigured,
  createTransfer,
  getConnectStatus,
} from '@/lib/stripe';

// POST /api/me/stripe/transfer — writer-initiated cashout.
//
// Flow:
//   1. Auth + verify the writer has a Stripe Connect account with payouts
//      enabled.
//   2. Compute the available balance:
//        - sum of all `payouts` rows with status='pending' for this writer
//        - PLUS any tips/confirmed ad share that hasn't been rolled into a
//          payout yet (a "sweep" row gets created for these so the ledger
//          stays clean).
//   3. Create a Stripe transfer for the total.
//   4. Mark every consumed payouts row as 'paid' with the transfer id.
//   5. Return { ok, amountCents, transferId }.
//
// The earnings dashboard's "Withdraw" button calls this. House/seed
// accounts (users.isSeed) can never call it — their earnings settle to
// NovelStack, not to them.
export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  if (user.isSeed) {
    return NextResponse.json(
      { error: 'House accounts settle internally — no withdrawal needed.' },
      { status: 400 },
    );
  }
  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: 'Payouts aren’t switched on just yet — this is coming very soon.' },
      { status: 503 },
    );
  }
  if (!user.stripeConnectId) {
    return NextResponse.json(
      { error: 'Connect a Stripe account first (Earnings → Setup payouts).' },
      { status: 400 },
    );
  }

  // Verify the connected account is actually payout-eligible — Stripe
  // rejects transfers to accounts that haven't completed onboarding.
  const status = await getConnectStatus(user.stripeConnectId);
  if (!status.payoutsEnabled) {
    return NextResponse.json(
      {
        error: status.needsOnboarding
          ? 'Finish Stripe onboarding before withdrawing (Earnings → Setup payouts).'
          : 'Your Stripe account isn’t payout-enabled yet. Check Stripe dashboard.',
      },
      { status: 400 },
    );
  }

  // 1. Pull existing pending payouts (these have already been computed by
  //    the monthly pool job — subscription + ad + tip cents per period).
  const pendingPayouts = await db
    .select()
    .from(payouts)
    .where(and(eq(payouts.writerId, user.id), eq(payouts.status, 'pending')));

  const pendingPayoutsTotal = pendingPayouts.reduce((s, p) => s + p.totalCents, 0);
  const consumedPayoutIds = pendingPayouts.map((p) => p.id);

  // 2. Find money that's been earned but hasn't been swept into a payout
  //    row yet — tips and confirmed ad unlocks newer than the latest payout.
  //    For writers with zero payouts so far, that means ALL their tips +
  //    confirmed ad unlocks are unswept.
  const [latestPayout] = await db
    .select({ periodMonth: payouts.periodMonth, createdAt: payouts.createdAt })
    .from(payouts)
    .where(eq(payouts.writerId, user.id))
    .orderBy(desc(payouts.createdAt))
    .limit(1);
  // Sweep tips/ads strictly newer than the latest payout's createdAt — the
  // monthly job rolls everything up to its run-time into the period payout.
  const sinceTs = latestPayout?.createdAt ?? new Date('1970-01-01');

  const [tipSweep] = await db
    .select({ cents: sql<number>`coalesce(sum(${tips.amountCents}), 0)` })
    .from(tips)
    .where(and(eq(tips.recipientId, user.id), gt(tips.createdAt, sinceTs)));
  const tipSweepCents = Math.round(Number(tipSweep?.cents ?? 0));

  const [adSweep] = await db
    .select({ cents: sql<number>`coalesce(sum(${adUnlocks.authorPayoutCents}), 0)` })
    .from(adUnlocks)
    .innerJoin(chapters, eq(chapters.id, adUnlocks.chapterId))
    .innerJoin(stories, eq(stories.id, chapters.storyId))
    .where(
      and(
        eq(stories.authorId, user.id),
        eq(adUnlocks.status, 'confirmed'),
        gt(adUnlocks.createdAt, sinceTs),
      ),
    );
  const adSweepCents = Math.round(Number(adSweep?.cents ?? 0));

  const sweepTotal = tipSweepCents + adSweepCents;
  const totalCents = pendingPayoutsTotal + sweepTotal;

  if (totalCents <= 0) {
    return NextResponse.json({ error: 'No funds available to withdraw.' }, { status: 400 });
  }

  // 3. Trigger the Stripe transfer FIRST so we don't mark anything paid
  //    if Stripe rejects (e.g. insufficient platform balance).
  let transferId: string;
  try {
    transferId = await createTransfer(user.stripeConnectId, totalCents, {
      writerId: user.id,
      consumedPayouts: String(consumedPayoutIds.length),
      sweepCents: String(sweepTotal),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe transfer failed.';
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // 4a. Write a "sweep" payouts row for the tips+ads not in a prior payout.
  const nowMonth = new Date();
  nowMonth.setUTCDate(1);
  nowMonth.setUTCHours(0, 0, 0, 0);
  if (sweepTotal > 0) {
    await db.insert(payouts).values({
      writerId: user.id,
      periodMonth: nowMonth.toISOString().slice(0, 10),
      subscriptionCents: 0,
      adCents: adSweepCents,
      tipCents: tipSweepCents,
      totalCents: sweepTotal,
      status: 'paid',
      stripePayoutId: transferId,
    });
  }

  // 4b. Mark all pre-existing pending payouts as paid with the transfer id.
  if (consumedPayoutIds.length > 0) {
    await db
      .update(payouts)
      .set({ status: 'paid', stripePayoutId: transferId })
      .where(and(eq(payouts.writerId, user.id), eq(payouts.status, 'pending')));
  }

  return NextResponse.json({
    ok: true,
    transferId,
    amountCents: totalCents,
    breakdown: {
      fromPriorPayoutsCents: pendingPayoutsTotal,
      sweptTipsCents: tipSweepCents,
      sweptAdCents: adSweepCents,
    },
  });
}
