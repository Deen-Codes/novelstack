import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { viewerIsAdult } from '@/lib/age';
import { AppHeader } from '@/components/AppHeader';
import { StoryCard } from '@/components/StoryCard';
import type { Story, User } from '@/lib/types';

export const metadata = { title: 'Search — NovelStack' };

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: qParam } = await searchParams;
  const raw = (qParam ?? '').trim();
  // Strip characters that would break a PostgREST .or() filter string.
  const q = raw.replace(/[(),{}]/g, ' ').trim();

  let stories: Story[] = [];
  let writers: User[] = [];

  if (q) {
    const supabase = await createClient();
    const adult = await viewerIsAdult();

    // Stories — title, description, genre, and tags.
    const storyQuery = supabase
      .from('stories')
      .select('*, author:users(id, username, display_name, is_verified)')
      .neq('status', 'draft')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,genre.ilike.%${q}%,tags.cs.{${q}}`)
      .limit(24);
    if (!adult) storyQuery.eq('is_mature', false);
    const { data: storyData } = await storyQuery;
    stories = (storyData ?? []) as Story[];

    // Writers — by display name or username.
    const { data: writerData } = await supabase
      .from('users')
      .select('id, username, display_name, bio, avatar_url, is_verified')
      .or(`display_name.ilike.%${q}%,username.ilike.%${q}%`)
      .limit(8);
    writers = (writerData ?? []) as User[];
  }

  return (
    <>
      <AppHeader />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl font-medium mb-5">Search</h1>

        <form action="/search" method="get" className="mb-10">
          <input
            name="q"
            defaultValue={raw}
            placeholder="Search stories, writers, genres, tags…"
            className="w-full max-w-md border border-border-soft rounded-full px-4 py-2.5 text-[15px] bg-white"
          />
        </form>

        {q && writers.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-xl font-medium mb-4">Writers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {writers.map((w) => (
                <Link
                  key={w.id}
                  href={`/u/${w.username}`}
                  className="flex items-center gap-3 border border-border-soft rounded-lg p-3 bg-white"
                >
                  <div className="w-9 h-9 rounded-full bg-signal/10 text-signal flex items-center justify-center font-medium text-sm">
                    {w.display_name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium truncate">
                      {w.display_name}
                      {w.is_verified && <span className="text-signal"> ✓</span>}
                    </div>
                    <div className="text-[12px] text-ink-faint truncate">@{w.username}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {q && (
          <section>
            <h2 className="font-serif text-xl font-medium mb-4">Stories</h2>
            {stories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stories.map((s) => (
                  <StoryCard key={s.id} story={s} />
                ))}
              </div>
            ) : (
              <p className="text-ink-muted text-[14px]">No stories matched &ldquo;{raw}&rdquo;.</p>
            )}
          </section>
        )}

        {!q && (
          <p className="text-ink-muted text-[14px]">
            Search by story title, writer name, genre, or tag.
          </p>
        )}
      </main>
    </>
  );
}
