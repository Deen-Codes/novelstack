// Sandbox-only earnings simulator — POST a tip / ad-unlock / payout for the
// signed-in user so we can validate the full earnings dashboard flow without
// making real App Store IAPs or waiting for actual AdMob fills.
//
// Hard-gated behind an env-var token so this endpoint is impossible to call
// in production (the token is never set on the live Render service). Each
// row is tagged with `transactionId: 'simulate-…'` so you can find and
// delete the test data later via a SQL clean-up.
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { tips, adUnlocks, payouts, chapters, stories } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';

const TOKEN = process.env.SIMULATE_EARNINGS_TOKEN ?? '';

export async function POST(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json(
      { error: 'Simulator disabled (SIMULATE_EARNINGS_TOKEN not set).' },
      { status: 404 },
    );
  }
  if (req.headers.get('x-simulate-token') !== TOKEN) {
    return NextResponse.json({ error: 'Bad token.' }, { status: 401 });
  }
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  // Find one of the user's chapters to attach an ad-unlock to. If they have
  // no stories yet, we skip the ad-unlock half and just credit a tip.
  const myStory = await db.query.stories.findFirst({
    where: eq(stories.authorId, user.id),
  });
  let firstChapterId: string | null = null;
  if (myStory) {
    const ch = await db.query.chapters.findFirst({
      where: eq(chapters.storyId, myStory.id),
    });
    firstChapterId = ch?.id ?? null;
  }

  const stamp = Date.now();

  // 1. A tip from themselves to themselves — purely cosmetic; gives the
  //    dashboard a non-zero "tips from readers" row + a Recent tips entry.
  await db.insert(tips).values({
    senderId: user.id,
    recipientId: user.id,
    storyId: myStory?.id ?? null,
    amountCents: 499,
    message: 'Simulated tip — sandbox testing.',
    transactionId: `simulate-tip-${stamp}`,
  });

  // 2. A confirmed ad-unlock against one of their chapters (if they have one)
  //    — flows into the Ad revenue share line of the breakdown.
  if (firstChapterId) {
    await db.insert(adUnlocks).values({
      readerId: user.id,
      chapterId: firstChapterId,
      adRevenueCents: '2.5',          // raw AdMob figure (4dp precision)
      authorPayoutCents: '1.8',       // writer's split
      status: 'confirmed',
    });
  }

  // 3. A previous-month payout row so Payout history isn't empty.
  const prevMonth = new Date();
  prevMonth.setDate(1);
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  await db.insert(payouts).values({
    writerId: user.id,
    periodMonth: prevMonth.toISOString().slice(0, 10),
    subscriptionCents: 1245,
    adCents: 180,
    tipCents: 320,
    totalCents: 1245 + 180 + 320,
    status: 'paid',
    stripePayoutId: `simulate-payout-${stamp}`,
  });

  return NextResponse.json({
    ok: true,
    inserted: {
      tip: true,
      adUnlock: !!firstChapterId,
      payout: true,
    },
    note: firstChapterId
      ? 'Open Earnings — should show ~$5 tip + ad share + $17 payout.'
      : "No story owned by user — skipped the ad-unlock half. Create a story to test that path.",
  });
}
