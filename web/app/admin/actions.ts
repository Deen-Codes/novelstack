'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';

async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  return !!data?.is_admin;
}

export async function setReportStatus(formData: FormData) {
  const supabase = createClient();
  if (!(await isAdmin(supabase))) return;
  await supabase
    .from('reports')
    .update({ status: String(formData.get('status')) })
    .eq('id', String(formData.get('reportId')));
  revalidatePath('/admin/reports');
}

// Soft takedown — hides the story from all public reads (RLS uses is_removed).
export async function removeStory(formData: FormData) {
  const supabase = createClient();
  if (!(await isAdmin(supabase))) return;
  await supabase
    .from('stories')
    .update({ is_removed: true })
    .eq('id', String(formData.get('storyId')));
  revalidatePath('/admin/reports');
}
