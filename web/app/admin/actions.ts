'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/db';
import { reports, stories } from '@/db/schema';

// Admin-only moderation actions. Gated on `users.role === 'admin'`.
//
// Status flow for a report: open → reviewing → actioned | dismissed.
// Removing a story is a hard delete — the FK cascades wipe chapters,
// chapter content, comments, ad-unlocks, etc. for that story.

const VALID_STATUS = new Set(['open', 'reviewing', 'actioned', 'dismissed']);

async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === 'admin';
}

export async function setReportStatus(formData: FormData) {
  if (!(await isAdmin())) return;

  const reportId = String(formData.get('reportId') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();
  if (!reportId || !VALID_STATUS.has(status)) return;

  await db.update(reports).set({ status }).where(eq(reports.id, reportId));
  revalidatePath('/admin/reports');
}

// Hard-delete a story. Auto-resolves the originating report as
// `actioned` so it drops out of the queue.
export async function removeStory(formData: FormData) {
  if (!(await isAdmin())) return;

  const storyId = String(formData.get('storyId') ?? '').trim();
  const reportId = String(formData.get('reportId') ?? '').trim();
  if (!storyId) return;

  await db.delete(stories).where(eq(stories.id, storyId));
  if (reportId) {
    await db
      .update(reports)
      .set({ status: 'actioned' })
      .where(eq(reports.id, reportId));
  }
  revalidatePath('/admin/reports');
}
