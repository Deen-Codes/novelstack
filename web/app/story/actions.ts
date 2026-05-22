'use server';

import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth';
import { toggleBookmark as toggleBookmarkMutation } from '@/lib/mutations';

// Add or remove a story from the reader's saved list.
export async function toggleBookmark(
  storyId: string,
  slug: string,
  _currentlyBookmarked: boolean
) {
  const user = await getSessionUser();
  if (!user) return;

  await toggleBookmarkMutation(user.id, storyId);
  revalidatePath(`/story/${slug}`);
}
