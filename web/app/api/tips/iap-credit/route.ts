import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { tips, users } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';

// Apple's Small Business Program commission — 15% of gross.
const APPLE_COMMISSION = 0.15;
// NovelStack's platform cut, taken from what reaches us after Apple.
const PLATFORM_CUT = 0.30;

// IAP tip product map. Must match mobile/lib/iap.ts TIP_PRODUCT_CENTS.
const PRODUCT_CENTS: Record<string, number> = {
  'novelstack.tip.099': 99,
  'novelstack.tip.199': 199,
  'novelstack.tip.499': 499,
  'novelstack.tip.999': 999,
};

// POST /api/tips/iap-credit
// Body: { productId, recipientUserId, storyId?, transactionId }
//
// Called by the mobile app immediately after StoreKit confirms a tip
// purchase. Computes the writer-share split from the Apple-net cents and
// writes one row to the `tips` table, keyed on the StoreKit transactionId
// (unique constraint) so a retry never double-credits.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let body: {
    productId?: string;
    recipientUserId?: string;
    storyId?: string | null;
    transactionId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const productId = String(body.productId || '');
  const transactionId = String(body.transactionId || '');
  const recipientUserId = String(body.recipientUserId || '');
  if (!productId || !PRODUCT_CENTS[productId]) {
    return NextResponse.json({ error: 'Unknown tip product.' }, { status: 400 });
  }
  if (!recipientUserId) {
    return NextResponse.json({ error: 'Missing recipient.' }, { status: 400 });
  }
  if (recipientUserId === user.id) {
    return NextResponse.json({ error: 'You cannot tip yourself.' }, { status: 400 });
  }
  if (!transactionId) {
    return NextResponse.json({ error: 'Missing transaction id.' }, { status: 400 });
  }

  // Dedup — if this transactionId is already credited, return that fact
  // rather than erroring on the unique constraint.
  const [existing] = await db
    .select({ id: tips.id })
    .from(tips)
    .where(eq(tips.transactionId, transactionId))
    .limit(1);
  if (existing) {
    return NextResponse.json({ ok: true, alreadyCredited: true });
  }

  // The recipient: an internal seed/house user's tips route to NovelStack
  // bookkeeping, not to them personally — match the existing tips action
  // pattern by sending them to the seed bucket via a flag the earnings
  // module already understands (`users.isSeed`).
  const [recipient] = await db
    .select({ id: users.id, isSeed: users.isSeed })
    .from(users)
    .where(eq(users.id, recipientUserId))
    .limit(1);
  if (!recipient) {
    return NextResponse.json({ error: 'Recipient not found.' }, { status: 404 });
  }

  // Split.
  const gross = PRODUCT_CENTS[productId];
  const appleNetCents = Math.round(gross * (1 - APPLE_COMMISSION));
  const platformCents = Math.round(appleNetCents * PLATFORM_CUT);
  const writerCents = appleNetCents - platformCents;

  try {
    const [row] = await db
      .insert(tips)
      .values({
        senderId: user.id,
        recipientId: recipient.id,
        storyId: body.storyId ?? null,
        amountCents: writerCents,
        message: null,
        transactionId,
      })
      .returning();
    return NextResponse.json({ ok: true, tip: row });
  } catch (e) {
    // Most likely a race that hit the unique constraint after our select —
    // treat the same as already-credited.
    const msg = e instanceof Error ? e.message : '';
    if (/unique|duplicate/i.test(msg)) {
      return NextResponse.json({ ok: true, alreadyCredited: true });
    }
    return NextResponse.json({ error: 'Could not credit tip.' }, { status: 500 });
  }
}
