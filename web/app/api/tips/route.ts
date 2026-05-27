import { NextResponse } from 'next/server';

// Web tipping is parked for v1 — mobile uses Apple IAP via
// `/api/tips/iap-credit`. Until web gains a real payment rail (Stripe
// Checkout), this endpoint refuses tips so nothing can credit a tip
// without paying.
export async function POST() {
  return NextResponse.json(
    { error: 'Web tipping is not available yet. Please tip from the iOS app.' },
    { status: 410 },
  );
}
