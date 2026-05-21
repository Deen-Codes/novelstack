'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Records that a reader watched a rewarded ad to unlock a chapter.
// Revenue fields default to 0 — the ad-network server callback reconciles
// the real amount later (see monetization.md / Flagged for Deen).
export async function recordAdUnlock(chapterId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'sign_in_required' };

  const { error } = await supabase
    .from('ad_unlocks')
    .insert({ reader_id: user.id, chapter_id: chapterId });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/read/${chapterId}`);
  return { ok: true };
}

// Marks a chapter as read so the Library can show "continue reading".
export async function markProgress(chapterId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Snapshot whether the reader is a subscriber at read time — this is what
  // drives the writer-payout pool split, so it must be recorded per read.
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('reader_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  await supabase.from('reads').upsert(
    {
      reader_id: user.id,
      chapter_id: chapterId,
      progress_pct: 100,
      completed_at: new Date().toISOString(),
      is_subscriber: !!sub,
    },
    { onConflict: 'reader_id,chapter_id' }
  );

  // Interest tracking — powers the home feed's genre affinity (Q3).
  const { data: ch } = await supabase
    .from('chapters')
    .select('story_id, story:stories(genre)')
    .eq('id', chapterId)
    .single();
  if (ch) {
    const row = ch as { story_id: string; story: { genre: string } | null };
    await supabase.from('reading_events').insert({
      user_id: user.id,
      story_id: row.story_id,
      genre: row.story?.genre ?? null,
      event: 'read',
    });
  }
}
