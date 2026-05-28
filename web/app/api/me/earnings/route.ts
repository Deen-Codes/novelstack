import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAuthorEarnings, isReviewerEmail, reviewerEarnings } from '@/lib/earnings';
import { getConnectStatus } from '@/lib/stripe';

// GET /api/me/earnings — the signed-in author's earnings + payout status.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  // App Review test account — return a pre-baked, populated dashboard so
  // reviewers see a working business (lifetime earnings, monthly run rate,
  // recent tips, paid-out history) instead of an empty just-signed-up
  // shell. Payouts are reported as already active with `hidePayoutSetup`
  // so the client hides the connect/manage CTAs — no real Stripe account
  // is attached to this email and we don't want a broken button.
  if (isReviewerEmail(user.email)) {
    return NextResponse.json({
      ...reviewerEarnings(),
      stripe: {
        connected: true,
        payoutsEnabled: true,
        detailsSubmitted: true,
        needsOnboarding: false,
      },
      hidePayoutSetup: true,
    });
  }

  const [earnings, stripe] = await Promise.all([
    getAuthorEarnings(user.id, user.isSeed),
    getConnectStatus(user.stripeConnectId),
  ]);

  return NextResponse.json({ ...earnings, stripe });
}
