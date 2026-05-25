import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAuthorEarnings } from '@/lib/earnings';
import { getConnectStatus } from '@/lib/stripe';

// GET /api/me/earnings — the signed-in author's earnings + payout status.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const [earnings, stripe] = await Promise.all([
    getAuthorEarnings(user.id, user.isSeed),
    getConnectStatus(user.stripeConnectId),
  ]);

  return NextResponse.json({ ...earnings, stripe });
}
