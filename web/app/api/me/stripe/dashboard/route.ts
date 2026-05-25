import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { createDashboardLink } from '@/lib/stripe';

// GET /api/me/stripe/dashboard — a login link into the writer's Stripe
// Express dashboard (view payouts, change bank details). Connected authors
// only.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  if (!user.stripeConnectId) {
    return NextResponse.json({ error: 'No payout account connected yet.' }, { status: 400 });
  }

  const url = await createDashboardLink(user.stripeConnectId);
  if (!url) {
    return NextResponse.json({ error: 'Could not open the payout dashboard.' }, { status: 400 });
  }
  return NextResponse.json({ url });
}
