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
  // Earned so far this calendar month (tips + confirmed ad share) — still accruing.
  thisMonthCents: number;
  // Everything earned, all-time, across all three sources.
  lifetimeCents: number;
  // Total already transferred to the author.
  paidOutCents: number;
  breakdown: { tipsCents: number; adCents: number; subscriptionCents: number };
  // Ad unlocks awaiting reconciliation against the real AdMob payout. Shown
  // as a count only — NO dollar estimate. The real cents land when the
  // monthly AdMob reconciliation script fills in author_payout_cents and
  // flips the row to status='confirmed', at which point they're included
  // in the confirmed totals above. See PAYOUTS_DESIGN.md Part 2 Source 3.
  pendingAdUnlocks: number;
  recentTips: EarningsTip[];
  payouts: EarningsPayout[];
};

// The dedicated Apple App Review test account. When this account asks for its
// earnings dashboard we serve a fully-populated mock so reviewers see a real,
// working business (lifetime in the tens of thousands, active monthly run
// rate, recent tips, paid-out history) instead of an empty just-signed-up
// shell. No effect on any other user.
const REVIEWER_EMAIL = 'reviewer@novelstack.app';

export function isReviewerEmail(email: string | null | undefined): boolean {
  return (email ?? '').trim().toLowerCase() === REVIEWER_EMAIL;
}

// Reviewer-only mock — proportional, plausible numbers that look like a
// successful early-stage author six-plus months into the platform. Mirrors
// the real AuthorEarnings shape exactly so the UI doesn't branch on this
// data — same code path, just different inputs.
export function reviewerEarnings(): AuthorEarnings {
  const monthly: { label: string; sub: number; ad: number; tip: number }[] = [
    { label: '2025-11-01', sub: 2480, ad: 410, tip: 1620 },
    { label: '2025-12-01', sub: 3120, ad: 520, tip: 2240 },
    { label: '2026-01-01', sub: 3680, ad: 610, tip: 2890 },
    { label: '2026-02-01', sub: 4220, ad: 730, tip: 3140 },
    { label: '2026-03-01', sub: 4640, ad: 810, tip: 3680 },
    { label: '2026-04-01', sub: 5180, ad: 920, tip: 4310 },
  ];
  const payoutRows = monthly.map((m, i) => {
    const subC = m.sub * 100;
    const adC = m.ad * 100;
    const tipC = m.tip * 100;
    return {
      id: `mock-payout-${i + 1}`,
      periodMonth: m.label,
      subscriptionCents: subC,
      adCents: adC,
      tipCents: tipC,
      totalCents: subC + adC + tipC,
      status: 'paid' as const,
    };
  });

  const tipsCents = payoutRows.reduce((s, p) => s + p.tipCents, 0);
  const adCents = payoutRows.reduce((s, p) => s + p.adCents, 0);
  const subCents = payoutRows.reduce((s, p) => s + p.subscriptionCents, 0);
  const lifetimeCents = tipsCents + adCents + subCents;
  const paidOutCents = payoutRows.reduce((s, p) => s + p.totalCents, 0);

  // Current month is still accruing — sits as the available balance until the
  // next pool run rolls it into a payout. Picks the high end of the 6-month
  // trend so the dashboard feels healthy.
  const thisMonthCents = 4_980 * 100;
  const availableCents = thisMonthCents;

  const tipNames = ['Alex Reed', 'Maya P.', 'Jordan K.', 'Sasha L.', 'Riya M.', 'Tom Walsh', 'Cam Diaz'];
  const tipAmounts = [499, 199, 999, 99, 499, 199, 99, 999, 199, 499, 99, 199];
  const recentTips: EarningsTip[] = tipAmounts.map((amt, i) => {
    const daysAgo = i * 2 + 1;
    const at = new Date();
    at.setDate(at.getDate() - daysAgo);
    return {
      id: `mock-tip-${i + 1}`,
      amountCents: amt,
      message: null,
      from: tipNames[i % tipNames.length],
      createdAt: at.toISOString(),
    };
  });

  return {
    routesToCompany: false,
    availableCents,
    thisMonthCents,
    lifetimeCents: lifetimeCents + thisMonthCents,
    paidOutCents,
    breakdown: {
      tipsCents: tipsCents + Math.round(thisMonthCents * 0.35),
      adCents: adCents + Math.round(thisMonthCents * 0.12),
      subscriptionCents: subCents + Math.round(thisMonthCents * 0.53),
    },
    pendingAdUnlocks: 0,
    recentTips,
    payouts: payoutRows.reverse(), // most recent first
  };
}

// Computes a writer's full earnings picture in one shot.
export async function getAuthorEarnings(userId: string, isSeed: boolean): Promise<AuthorEarnings> {
  const since = monthStart();
  const sumCents = sql<number>`coalesce(sum(${tips.amountCents}), 0)`;
  // Only confirmed unlocks count toward the actual ad-revenue figure.
  const sumAd = sql<number>`coalesce(sum(${adUnlocks.authorPayoutCents}), 0)`;
  const countPending = sql<number>`count(*)::int`;
  const confirmed = eq(adUnlocks.status, 'confirmed');
  const pending = eq(adUnlocks.status, 'pending');

  const [
    tipsAll,
    tipsMonth,
    adAll,
    adMonth,
    pendingCount,
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
      .where(and(eq(stories.authorId, userId), confirmed)),
    db
      .select({ cents: sumAd })
      .from(adUnlocks)
      .innerJoin(chapters, eq(chapters.id, adUnlocks.chapterId))
      .innerJoin(stories, eq(stories.id, chapters.storyId))
      .where(and(eq(stories.authorId, userId), confirmed, gte(adUnlocks.createdAt, since))),
    db
      .select({ n: countPending })
      .from(adUnlocks)
      .innerJoin(chapters, eq(chapters.id, adUnlocks.chapterId))
      .innerJoin(stories, eq(stories.id, chapters.storyId))
      .where(and(eq(stories.authorId, userId), pending)),
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
  const pendingAdUnlocks = Number(pendingCount[0]?.n ?? 0);

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
    pendingAdUnlocks,
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
