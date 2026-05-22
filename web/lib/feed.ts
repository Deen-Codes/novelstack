import { createClient } from '@/lib/supabase/server';
import { viewerIsAdult } from '@/lib/age';
import type { Story } from '@/lib/types';

// Q3 home feed — transparent rule-based ranking.
// score = follow-graph + genre-affinity + recency + popularity.
// Weights are deliberately readable, not a black box. Tune here.
const WEIGHTS = {
  follow: 4.0,   // a story by a writer you follow
  affinity: 2.5, // genre matches what you've been reading
  recency: 2.0,  // freshness
  popular: 1.5,  // overall popularity (baseline so new users see good stuff)
};

export type FeedStory = Story & { _score: number; _reason: string };

export async function getFeed(genreFilter?: string, query?: string): Promise<FeedStory[]> {
  const supabase = await createClient();
  const adult = await viewerIsAdult();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Candidate set — recent published stories.
  let q = supabase
    .from('stories')
    .select('*, author:users!stories_author_id_fkey(id, username, display_name, is_verified)')
    .neq('status', 'draft')
    .order('published_at', { ascending: false })
    .limit(80);
  if (!adult) q = q.eq('is_mature', false);
  if (genreFilter) q = q.eq('genre', genreFilter);
  if (query && query.trim()) {
    const term = query.trim();
    q = q.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }
  const { data } = await q;
  const stories = (data ?? []) as Story[];

  // Viewer signals: who they follow + which genres they read.
  let followedAuthors = new Set<string>();
  const genreAffinity: Record<string, number> = {};
  if (user) {
    const { data: follows } = await supabase
      .from('follows')
      .select('author_id')
      .eq('follower_id', user.id);
    followedAuthors = new Set((follows ?? []).map((f: { author_id: string }) => f.author_id));

    const { data: events } = await supabase
      .from('reading_events')
      .select('genre')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);
    const evs = (events ?? []) as { genre: string | null }[];
    const total = evs.length || 1;
    for (const e of evs) {
      if (e.genre) genreAffinity[e.genre] = (genreAffinity[e.genre] ?? 0) + 1 / total;
    }
  }

  const now = Date.now();
  const scored: FeedStory[] = stories.map((s) => {
    const published = s.published_at ? new Date(s.published_at).getTime() : now;
    const days = Math.max(0, (now - published) / 86_400_000);
    const recency = 1 / (1 + days / 7);
    const popular = Math.min(1, Math.log10((s.total_reads ?? 0) + 1) / 6);
    const followed = followedAuthors.has(s.author_id);
    const affinity = genreAffinity[s.genre] ?? 0;

    const score =
      WEIGHTS.follow * (followed ? 1 : 0) +
      WEIGHTS.affinity * affinity +
      WEIGHTS.recency * recency +
      WEIGHTS.popular * popular;

    const reason = followed
      ? 'From a writer you follow'
      : affinity > 0
      ? `Because you've been reading ${s.genre}`
      : days < 7
      ? 'New this week'
      : 'Popular on NovelStack';

    return { ...s, _score: score, _reason: reason };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored;
}
