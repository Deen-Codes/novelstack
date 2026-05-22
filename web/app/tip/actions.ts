'use server';

import { db } from '@/db';
import { tips } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';

// Records a reader-to-writer tip. This IS the ledger (one row per tip).
// The actual charge/payout rail is Stripe — deferred until Deen has an
// LLC/EIN; until then a tip is captured here and settles when Stripe is wired.
export async function sendTip(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return;

  const recipientId = String(formData.get('recipientId'));
  const storyId = String(formData.get('storyId') || '') || null;
  const amount = parseInt(String(formData.get('amount') || '0'), 10);
  const message = String(formData.get('message') || '').trim() || null;

  if (!recipientId || recipientId === user.id) return; // can't tip yourself
  if (!Number.isFinite(amount) || amount < 300) return; // tips table enforces >= $3

  await db.insert(tips).values({
    senderId: user.id,
    recipientId,
    storyId,
    amountCents: amount,
    message,
  });
}
