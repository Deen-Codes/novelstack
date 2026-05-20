'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// File a content report. Categories match the moderation research in
// MVP_PROGRESS.md (Wattpad-style + UK Online Safety Act / Apple 1.2 floor).
export async function submitReport(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('reports').insert({
    reporter_id: user.id,
    target_type: String(formData.get('targetType')),
    target_id: String(formData.get('targetId')),
    reason: String(formData.get('reason')),
    detail: String(formData.get('detail') || '') || null,
  });
}

// Block / unblock another user.
export async function toggleBlock(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const blockedId = String(formData.get('blockedId'));
  const username = String(formData.get('username'));
  const blocked = formData.get('blocked') === 'true';

  if (blocked) {
    await supabase
      .from('blocks')
      .delete()
      .eq('blocker_id', user.id)
      .eq('blocked_id', blockedId);
  } else {
    await supabase.from('blocks').insert({ blocker_id: user.id, blocked_id: blockedId });
  }
  revalidatePath(`/u/${username}`);
}
