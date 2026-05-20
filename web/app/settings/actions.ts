'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const display_name = String(formData.get('display_name') || '').trim();
  const username = String(formData.get('username') || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
  const bio = String(formData.get('bio') || '').trim();

  await supabase
    .from('users')
    .update({ display_name, username, bio, updated_at: new Date().toISOString() })
    .eq('id', user.id);
  revalidatePath('/settings');
}
