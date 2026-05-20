import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppHeader } from '@/components/AppHeader';

export const metadata = { title: 'Your library — NovelStack' };

export default async function Library() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  // Continue reading — most recent chapters opened.
  const { data: readsData } = await supabase
    .from('reads')
    .select('chapter_id, created_at, chapter:chapters(number, title, story:stories(title, slug, cover_color))')
    .eq('reader_id', user.id)
    .order('created_at', { ascending: false })
    .limit(8);
  const reads = (readsData ?? []) as any[];

  // Writers the reader follows.
  const { data: followData } = await supabase
    .from('follows')
    .select('author:users!follows_author_id_fkey(id, username, display_name, is_verified)')
    .eq('follower_id', user.id);
  const following = (followData ?? []) as any[];

  // Saved stories.
  const { data: bmData } = await supabase
    .from('bookmarks')
    .select('story:stories(id, title, slug, genre, cover_color)')
    .eq('reader_id', user.id);
  const saved = (bmData ?? []) as any[];

  return (
    <>
      <AppHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl font-medium mb-8">Your library</h1>

        <h2 className="font-serif text-xl font-medium mb-3">Continue reading</h2>
        {reads.length === 0 ? (
          <p className="text-ink-muted text-[14px] mb-10">
            Nothing yet. Stories you read show up here so you can pick up where you left off.
          </p>
        ) : (
          <div className="divide-y divide-border-soft border-y border-border-soft mb-10">
            {reads.map((r) => (
              <Link
                key={r.chapter_id}
                href={`/read/${r.chapter_id}`}
                className="flex items-center gap-3 py-3 group"
              >
                <div
                  className="w-9 h-12 rounded shrink-0"
                  style={{ background: r.chapter?.story?.cover_color ?? '#D85A30' }}
                />
                <div>
                  <div className="text-[15px] font-medium group-hover:text-signal">
                    {r.chapter?.story?.title}
                  </div>
                  <div className="text-[12px] text-ink-faint">
                    Chapter {r.chapter?.number} · {r.chapter?.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <h2 className="font-serif text-xl font-medium mb-3">Writers you follow</h2>
        {following.length === 0 ? (
          <p className="text-ink-muted text-[14px] mb-10">
            Follow writers from their profile to keep up with their new chapters.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3 mb-10">
            {following.map((f) => (
              <Link
                key={f.author?.id}
                href={`/u/${f.author?.username}`}
                className="flex items-center gap-2.5 border border-border-soft rounded-full pl-1.5 pr-4 py-1.5 bg-white"
              >
                <div className="w-7 h-7 rounded-full bg-signal/10 text-signal flex items-center justify-center font-medium text-[12px]">
                  {(f.author?.display_name ?? '?').slice(0, 1).toUpperCase()}
                </div>
                <span className="text-[13px] font-medium">{f.author?.display_name}</span>
              </Link>
            ))}
          </div>
        )}

        <h2 className="font-serif text-xl font-medium mb-3">Saved stories</h2>
        {saved.length === 0 ? (
          <p className="text-ink-muted text-[14px]">
            Tap &ldquo;Save story&rdquo; on any story page to keep it here.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {saved.map((b) => (
              <Link key={b.story?.id} href={`/story/${b.story?.slug}`} className="group">
                <div
                  className="aspect-[3/4] rounded-[10px] transition-transform group-hover:-translate-y-1"
                  style={{ background: b.story?.cover_color ?? '#4F4AAA' }}
                />
                <div className="text-[13px] font-medium mt-2">{b.story?.title}</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
