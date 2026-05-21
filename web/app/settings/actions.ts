'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
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
  const dob = String(formData.get('date_of_birth') || '').trim();

  await supabase
    .from('users')
    .update({
      display_name,
      username,
      bio,
      // Only write DOB when supplied, so a blank field never clears a stored one.
      ...(dob ? { date_of_birth: dob } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);
  revalidatePath('/settings');
}
