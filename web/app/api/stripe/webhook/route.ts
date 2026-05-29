// Stripe webhook receiver — verifies the signature, dispatches per event type.
//
// The signing secret must match the destination set up in Stripe Dashboard:
//   Developers → Webhooks → your endpoint → Signing secret (starts whsec_…)
// stored as STRIPE_WEBHOOK_SECRET on Render.
//
// We currently care about ONE event: `account.updated` — fired when a
// writer's Connect Express account changes verification or payouts state.
// Handling it server-side means the moment Stripe flips their account to
// "payouts enabled" we know about it (no polling, no waiting for the user
// to refocus the earnings screen). Other events are accepted but ignored
// for now — adding handlers later is just a switch-case addition.
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? '';

// Stripe requires the raw body to verify the signature — Next App Router
// doesn't parse JSON unless we ask, but we explicitly read it as text.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!stripe || !WEBHOOK_SECRET) {
    // Without a configured client + secret we can't safely verify the
    // signature; reply 200 so Stripe doesn't retry forever, but log nothing.
    return NextResponse.json({ ok: true, note: 'webhook unconfigured' });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'No signature.' }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Bad signature.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // We only care about Connect account events right now. Logging happens
  // through Render's request logs — there's no app-level event log yet.
  //
  // Stripe has migrated account events from v1 (`account.updated`) to the
  // v2 router (`v2.core.account.updated` and per-configuration capability
  // events). We handle both — `v2.core.*` for new destinations set up
  // today, plus the legacy `account.updated` for older destinations that
  // haven't been re-pointed. We compare as a string because the Stripe
  // SDK's union of known event names hasn't caught up with the v2
  // additions yet, so `switch` on `event.type` would fail to type-check.
  const t = event.type as string;
  const isAccountUpdate =
    t === 'account.updated' ||
    t === 'v2.core.account.updated' ||
    t.startsWith('v2.core.account[') && t.endsWith('updated');
  const isTransferEvent =
    t === 'transfer.created' || t === 'transfer.updated' || t === 'transfer.reversed';

  if (isAccountUpdate) {
    // No DB write needed today — the earnings endpoint reads live status
    // from Stripe on every request. The webhook exists as the hook point
    // we'll extend when we add (a) push notifications to the writer when
    // verification status changes, and (b) a cached `payouts_enabled`
    // flag on the users row to skip the per-request Stripe call.
    //
    // The event shape differs between v1 and v2 — v1 carries a full
    // Account object; v2 carries a thin event whose payload has to be
    // fetched. For logging we just note the type and id.
    const obj = event.data.object as { id?: string; account?: string };
    const id = obj?.id ?? obj?.account ?? 'unknown';
    console.log(`[stripe webhook] ${t} id=${id}`);
  } else if (isTransferEvent) {
    // Hook point for the future payout-confirmation flow — when we move
    // from manual monthly transfers to automated, we'll mark the matching
    // payouts row as paid/failed here using the transfer's metadata.
    console.log(`[stripe webhook] ${t}`);
  }
  // Anything else: ack 200 (handled by the return below) so Stripe stops
  // retrying. We don't act on unknown events.

  return NextResponse.json({ ok: true });
}
