'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleFollow(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const authorId = String(formData.get('authorId'));
  const username = String(formData.get('username'));
  const following = formData.get('following') === 'true';

  if (following) {
    await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('author_id', authorId);
  } else {
    await supabase.from('follows').insert({ follower_id: user.id, author_id: authorId });
  }
  revalidatePath(`/u/${username}`);
}
