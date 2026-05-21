import { supabase } from '@/lib/supabase';
import { viewerIsAdult } from '@/lib/age';

// Q3 home feed — transparent rule-based ranking, mirrors web/lib/feed.ts.
// score = follow-graph + genre-affinity + recency + popularity.
const WEIGHTS = {
  follow: 4.0,   // a story by a writer you follow
  affinity: 2.5, // genre matches what you've been reading
  recency: 2.0,  // freshness
  popular: 1.5,  // overall popularity (baseline for new users)
};

export type FeedStory = {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  genre: string;
  cover_color: string;
  total_reads: number;
  is_mature: boolean;
  author: string;
  firstChapter: string | null;
  _reason: string;
};

export async function getFeed(genreFilter?: string): Promise<FeedStory[]> {
  const adult = await viewerIsAdult();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let q = supabase
    .from('stories')
    .select(
      'id, author_id, title, slug, genre, cover_color, total_reads, is_mature, published_at, author:users!stories_author_id_fkey(display_name), chapters(id, number, published_at)'
    )
    .neq('status', 'draft')
    .order('published_at', { ascending: false })
    .limit(80);
  if (!adult) q = q.eq('is_mature', false);
  if (genreFilter) q = q.eq('genre', genreFilter);
  const { data } = await q;
  const rows = (data ?? []) as any[];

  // Viewer signals: who they follow + which genres they read.
  let followed = new Set<string>();
  const affinity: Record<string, number> = {};
  if (user) {
    const { data: follows } = await supabase
      .from('follows')
      .select('author_id')
      .eq('follower_id', user.id);
    followed = new Set((follows ?? []).map((f: any) => f.author_id));

    const { data: events } = await supabase
      .from('reading_events')
      .select('genre')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);
    const evs = (events ?? []) as { genre: string | null }[];
    const total = evs.length || 1;
    for (const e of evs) {
      if (e.genre) affinity[e.genre] = (affinity[e.genre] ?? 0) + 1 / total;
    }
  }

  const now = Date.now();
  const scored = rows.map((s) => {
    const published = s.published_at ? new Date(s.published_at).getTime() : now;
    const days = Math.max(0, (now - published) / 86_400_000);
    const recency = 1 / (1 + days / 7);
    const popular = Math.min(1, Math.log10((s.total_reads ?? 0) + 1) / 6);
    const isFollowed = followed.has(s.author_id);
    const aff = affinity[s.genre] ?? 0;

    const score =
      WEIGHTS.follow * (isFollowed ? 1 : 0) +
      WEIGHTS.affinity * aff +
      WEIGHTS.recency * recency +
      WEIGHTS.popular * popular;

    const reason = isFollowed
      ? 'From a writer you follow'
      : aff > 0
      ? `Because you've been reading ${s.genre}`
      : days < 7
      ? 'New this week'
      : 'Popular on NovelStack';

    const chs = (s.chapters ?? []).filter((c: any) => c.published_at).sort((a: any, b: any) => a.number - b.number);
    return {
      id: s.id,
      author_id: s.author_id,
      title: s.title,
      slug: s.slug,
      genre: s.genre,
      cover_color: s.cover_color ?? '#D85A30',
      total_reads: s.total_reads ?? 0,
      is_mature: s.is_mature ?? false,
      author: s.author?.display_name ?? 'Unknown',
      firstChapter: chs[0]?.id ?? null,
      _reason: reason,
      _score: score,
    };
  });

  scored.sort((a: any, b: any) => b._score - a._score);
  return scored as FeedStory[];
}
