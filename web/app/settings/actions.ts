'use server';

import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth';
import { updateProfile as updateProfileMutation } from '@/lib/mutations';

export async function updateProfile(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return;

  const displayName = String(formData.get('displayName') || '').trim();
  const username = String(formData.get('username') || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
  const bio = String(formData.get('bio') || '').trim();
  const dob = String(formData.get('dateOfBirth') || '').trim();

  await updateProfileMutation(user.id, {
    displayName,
    username,
    bio,
    // Only write DOB when supplied, so a blank field never clears a stored one.
    ...(dob ? { dateOfBirth: dob } : {}),
  });
  revalidatePath('/settings');
}
