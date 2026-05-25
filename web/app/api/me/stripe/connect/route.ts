import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import { stripeConfigured, createConnectAccount, createOnboardingLink } from '@/lib/stripe';

// POST /api/me/stripe/connect — start (or resume) Stripe Connect onboarding.
// Returns { url } — a Stripe-hosted onboarding page for the writer to open.
export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  // House / seed accounts settle to NovelStack — they never connect a payout
  // account of their own.
  if (user.isSeed) {
    return NextResponse.json(
      { error: 'This is a NovelStack house account — payouts are handled internally.' },
      { status: 400 },
    );
  }

  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: 'Payouts aren’t switched on just yet — this is coming very soon.' },
      { status: 503 },
    );
  }

  try {
    // Re-use an existing Connect account, or create one on first setup.
    let accountId = user.stripeConnectId;
    if (!accountId) {
      accountId = await createConnectAccount(user.email);
      await db.update(users).set({ stripeConnectId: accountId }).where(eq(users.id, user.id));
    }
    const url = await createOnboardingLink(accountId);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not start payout setup.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
