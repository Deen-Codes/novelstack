'use server';

import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth';

// NOTE: the moderation tables (`reports`) and the `stories.is_removed` column
// were not part of the Render/Drizzle migration. The new `users` table carries
// a `role` enum, so admin gating now uses `role === 'admin'`. The report/
// takedown actions are kept as admin-gated no-ops until those tables land.

async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === 'admin';
}

export async function setReportStatus(_formData: FormData) {
  if (!(await isAdmin())) return;
  // TODO: persist once a `reports` table exists in the new schema.
  revalidatePath('/admin/reports');
}

// Soft takedown — hides the story from all public reads.
export async function removeStory(_formData: FormData) {
  if (!(await isAdmin())) return;
  // TODO: persist once `stories.is_removed` exists in the new schema.
  revalidatePath('/admin/reports');
}
