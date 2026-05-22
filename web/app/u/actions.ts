'use server';

import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth';
import { toggleFollow as toggleFollowMutation } from '@/lib/mutations';

export async function toggleFollow(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return;

  const authorId = String(formData.get('authorId'));
  const username = String(formData.get('username'));

  await toggleFollowMutation(user.id, authorId);
  revalidatePath(`/u/${username}`);
}
