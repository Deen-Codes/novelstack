'use server';

import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth';
import { createReport } from '@/lib/mutations';

// File a content report — persisted to the `reports` table.
export async function submitReport(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return;
  const storyId = String(formData.get('storyId') || '') || null;
  const chapterId = String(formData.get('chapterId') || '') || null;
  const reason = String(formData.get('reason') || '');
  const detail = String(formData.get('detail') || '') || null;
  try {
    await createReport(user.id, { storyId, chapterId, reason, detail });
  } catch {
    // Best-effort — the web report form surfaces nothing on validation errors.
  }
}

// Block / unblock another user.
export async function toggleBlock(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return;
  const username = String(formData.get('username'));
  // TODO: persist block once a `blocks` table exists in the new schema.
  revalidatePath(`/u/${username}`);
}
