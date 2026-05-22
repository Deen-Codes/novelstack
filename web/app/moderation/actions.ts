'use server';

import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth';

// NOTE: the moderation tables (`reports`, `blocks`) were not part of the
// Render/Drizzle migration — the new data layer has no moderation surface yet.
// These actions are kept as authenticated no-ops so the report/block UI still
// renders and submits without error. Re-wire them once the moderation tables
// land in db/schema.ts and lib/mutations.ts (tracked as future work).

// File a content report.
export async function submitReport(_formData: FormData) {
  const user = await getSessionUser();
  if (!user) return;
  // TODO: persist report once a `reports` table exists in the new schema.
}

// Block / unblock another user.
export async function toggleBlock(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return;
  const username = String(formData.get('username'));
  // TODO: persist block once a `blocks` table exists in the new schema.
  revalidatePath(`/u/${username}`);
}
