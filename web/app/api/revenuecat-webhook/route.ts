import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { subscriptions, users } from '@/db/schema';

// RevenueCat server-to-server webhook. Configure RevenueCat to POST here with
// an Authorization header equal to REVENUECAT_WEBHOOK_SECRET.
//
// We keep one subscription row per reader and move its status as events
// arrive. NovelStack+ entitlement checks elsewhere read `status = 'active'`.
const WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET ?? '';

// Events that mean the membership is currently good.
const GRANTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'PRODUCT_CHANGE',
  'NON_RENEWING_PURCHASE',
]);

type RCEvent = {
  type?: string;
  app_user_id?: string;
  expiration_at_ms?: number;
};

export async function POST(req: NextRequest) {
  // Reject anything without the shared secret once one is configured.
  if (WEBHOOK_SECRET) {
    const auth = req.headers.get('authorization') ?? '';
    if (auth !== WEBHOOK_SECRET && auth !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
  }

  let payload: { event?: RCEvent };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const event = payload.event;
  const userId = event?.app_user_id;
  const type = event?.type;
  // Always 200 on a malformed/irrelevant event so RevenueCat doesn't retry it.
  if (!event || !userId || !type) return NextResponse.json({ ok: true });

  try {
    // Ignore events for an app_user_id that isn't one of our users (e.g. a
    // RevenueCat anonymous id from before the user signed in).
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user) return NextResponse.json({ ok: true });

    const endsAt = event.expiration_at_ms ? new Date(event.expiration_at_ms) : null;
    const [existing] = await db
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(eq(subscriptions.readerId, userId))
      .limit(1);

    if (GRANTS.has(type)) {
      if (existing) {
        await db
          .update(subscriptions)
          .set({ status: 'active', endsAt })
          .where(eq(subscriptions.id, existing.id));
      } else {
        await db.insert(subscriptions).values({ readerId: userId, status: 'active', endsAt });
      }
    } else if (type === 'EXPIRATION' || type === 'SUBSCRIPTION_PAUSED') {
      if (existing) {
        await db
          .update(subscriptions)
          .set({ status: 'canceled' })
          .where(eq(subscriptions.id, existing.id));
      }
    } else if (type === 'BILLING_ISSUE') {
      if (existing) {
        await db
          .update(subscriptions)
          .set({ status: 'past_due' })
          .where(eq(subscriptions.id, existing.id));
      }
    }
    // CANCELLATION (auto-renew turned off) leaves access until EXPIRATION, so
    // it's intentionally a no-op here.
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
