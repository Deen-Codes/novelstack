// NovelStack — author earnings.
//
// Authors earn from three sources:
//   1. Tips        — reader → writer, one row per tip in `tips`.
//   2. Ad revenue  — the writer's share of a watch-ad chapter unlock, recorded
//                    on `ad_unlocks.author_payout_cents`.
//   3. Subscription pool — the 70/30 NovelStack+ pool, split monthly. A pool
//                    run writes one `payouts` row per writer; until a run
//                    exists for a month, that month's pool share is unknown.
//
// `tips` and `ad_unlocks` ARE the ledger for sources 1 and 2 — every credit is
// a real row. `payouts` is the monthly settlement ledger. Balance maths:
//
//   lifetime   = all tips + all ad share + Σ payout.subscriptionCents
//   available  = lifetime − Σ payout.totalCents      (i.e. unpaid tips + ad)
//   paid out   = Σ payout.totalCents where status = 'paid'
//
// Seed / house accounts (`users.is_seed`) still accrue, but their money routes
// to NovelStack — they never see payout setup. That is flagged, not computed
// away, so the numbers stay auditable.
import 'server-only';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { db } from '@/db';
import { tips, adUnlocks, chapters, stories, payouts, users } from '@/db/schema';

// First instant of the current UTC month.
function monthStart(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export type EarningsPayout = {
  id: string;
  periodMonth: string;
  subscriptionCents: number;
  adCents: number;
  tipCents: number;
  totalCents: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
};

export type EarningsTip = {
  id: string;
  amountCents: number;
  message: string | null;
  from: string;
  createdAt: string;
};

export type AuthorEarnings = {
  // A house/seed account — earnings route to NovelStack, no payout setup.
  routesToCompany: boolean;
  // Finalised earnings not yet paid out (unpaid tips + ad share).
  availableCents: number;
  // Earned so far this calendar month (tips + ad share) — still accruing.
  thisMonthCents: number;
  // Everything earned, all-time, across all three sources.
  lifetimeCents: number;
  // Total already transferred to the author.
  paidOutCents: number;
  breakdown: { tipsCents: number; adCents: number; subscriptionCents: number };
  recentTips: EarningsTip[];
  payouts: EarningsPayout[];
};

// Computes a writer's full earnings picture in one shot.
export async function getAuthorEarnings(userId: string, isSeed: boolean): Promise<AuthorEarnings> {
  const since = monthStart();
  const sumCents = sql<number>`coalesce(sum(${tips.amountCents}), 0)`;
  const sumAd = sql<number>`coalesce(sum(${adUnlocks.authorPayoutCents}), 0)`;

  const [
    tipsAll,
    tipsMonth,
    adAll,
    adMonth,
    payoutRows,
    recent,
  ] = await Promise.all([
    db.select({ cents: sumCents }).from(tips).where(eq(tips.recipientId, userId)),
    db
      .select({ cents: sumCents })
      .from(tips)
      .where(and(eq(tips.recipientId, userId), gte(tips.createdAt, since))),
    db
      .select({ cents: sumAd })
      .from(adUnlocks)
      .innerJoin(chapters, eq(chapters.id, adUnlocks.chapterId))
      .innerJoin(stories, eq(stories.id, chapters.storyId))
      .where(eq(stories.authorId, userId)),
    db
      .select({ cents: sumAd })
      .from(adUnlocks)
      .innerJoin(chapters, eq(chapters.id, adUnlocks.chapterId))
      .innerJoin(stories, eq(stories.id, chapters.storyId))
      .where(and(eq(stories.authorId, userId), gte(adUnlocks.createdAt, since))),
    db
      .select()
      .from(payouts)
      .where(eq(payouts.writerId, userId))
      .orderBy(desc(payouts.periodMonth)),
    db
      .select({
        id: tips.id,
        amountCents: tips.amountCents,
        message: tips.message,
        createdAt: tips.createdAt,
        from: users.displayName,
      })
      .from(tips)
      .innerJoin(users, eq(users.id, tips.senderId))
      .where(eq(tips.recipientId, userId))
      .orderBy(desc(tips.createdAt))
      .limit(12),
  ]);

  const tipCentsAll = Math.round(Number(tipsAll[0]?.cents ?? 0));
  const tipCentsMonth = Math.round(Number(tipsMonth[0]?.cents ?? 0));
  const adCentsAll = Math.round(Number(adAll[0]?.cents ?? 0));
  const adCentsMonth = Math.round(Number(adMonth[0]?.cents ?? 0));

  const subCentsAll = payoutRows.reduce((s, p) => s + p.subscriptionCents, 0);
  const payoutsTotalAll = payoutRows.reduce((s, p) => s + p.totalCents, 0);
  const paidOutCents = payoutRows
    .filter((p) => p.status === 'paid')
    .reduce((s, p) => s + p.totalCents, 0);

  const lifetimeCents = tipCentsAll + adCentsAll + subCentsAll;
  // Unpaid tips + ad share — what's owed but not yet in a settled payout.
  const availableCents = Math.max(0, lifetimeCents - payoutsTotalAll);

  return {
    routesToCompany: isSeed,
    availableCents,
    thisMonthCents: tipCentsMonth + adCentsMonth,
    lifetimeCents,
    paidOutCents,
    breakdown: {
      tipsCents: tipCentsAll,
      adCents: adCentsAll,
      subscriptionCents: subCentsAll,
    },
    recentTips: recent.map((r) => ({
      id: r.id,
      amountCents: r.amountCents,
      message: r.message,
      from: r.from,
      createdAt: r.createdAt.toISOString(),
    })),
    payouts: payoutRows.map((p) => ({
      id: p.id,
      periodMonth: p.periodMonth,
      subscriptionCents: p.subscriptionCents,
      adCents: p.adCents,
      tipCents: p.tipCents,
      totalCents: p.totalCents,
      status: p.status,
    })),
  };
}
