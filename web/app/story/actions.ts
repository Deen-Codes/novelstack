'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Add or remove a story from the reader's saved list.
export async function toggleBookmark(
  storyId: string,
  slug: string,
  currentlyBookmarked: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (currentlyBookmarked) {
    await supabase
      .from('bookmarks')
      .delete()
      .eq('reader_id', user.id)
      .eq('story_id', storyId);
  } else {
    await supabase.from('bookmarks').insert({ reader_id: user.id, story_id: storyId });
  }
  revalidatePath(`/story/${slug}`);
}
