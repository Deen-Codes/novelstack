'use server';

import { createClient } from '@/lib/supabase/server';

// Records a reader-to-writer tip. This IS the ledger (one row per tip).
// The actual charge/payout rail is Stripe — deferred until Deen has an
// LLC/EIN; until then a tip is captured here and settles when Stripe is wired.
export async function sendTip(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const recipientId = String(formData.get('recipientId'));
  const storyId = String(formData.get('storyId') || '') || null;
  const amount = parseInt(String(formData.get('amount') || '0'), 10);
  const message = String(formData.get('message') || '').trim() || null;

  if (!recipientId || recipientId === user.id) return; // can't tip yourself
  if (!Number.isFinite(amount) || amount < 300) return; // tips table enforces >= $3

  await supabase.from('tips').insert({
    sender_id: user.id,
    recipient_id: recipientId,
    story_id: storyId,
    amount_cents: amount,
    message,
  });
}
