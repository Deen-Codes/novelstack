import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppHeader } from '@/components/AppHeader';
import { createChapter, toggleChapterFree } from '../actions';
import type { Story, Chapter } from '@/lib/types';

export default async function ManageStory({
  params,
}: {
  params: { storyId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: storyData } = await supabase
    .from('stories')
    .select('*')
    .eq('id', params.storyId)
    .single();
  const story = storyData as Story | null;
  if (!story || story.author_id !== user.id) notFound();

  const { data: chapterData } = await supabase
    .from('chapters')
    .select('*')
    .eq('story_id', story.id)
    .order('number');
  const chapters = (chapterData ?? []) as Chapter[];

  return (
    <>
      <AppHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/write" className="text-[13px] text-signal">‹ Your stories</Link>
        <h1 className="font-serif text-3xl font-medium mt-3">{story.title}</h1>
        <p className="text-[13px] text-ink-faint capitalize mt-1">
          {story.genre} · {story.status}
        </p>

        <div className="flex justify-between items-center mt-8 mb-3">
          <h2 className="font-serif text-xl font-medium">Chapters</h2>
          <form action={createChapter.bind(null, story.id)}>
            <button className="bg-signal text-paper px-4 py-2 rounded-full text-sm font-medium">
              Add chapter
            </button>
          </form>
        </div>

        {chapters.length === 0 ? (
          <p className="text-ink-muted text-[14px]">
            No chapters yet. The first three you add are free for readers automatically.
          </p>
        ) : (
          <div className="divide-y divide-border-soft border-y border-border-soft">
            {chapters.map((ch) => (
              <div key={ch.id} className="flex justify-between items-center py-3">
                <Link
                  href={`/write/${story.id}/chapter/${ch.id}`}
                  className="text-[15px] hover:text-signal"
                >
                  {ch.number}. {ch.title}
                  {!ch.published_at && (
                    <span className="text-[12px] text-ink-faint ml-2">Draft</span>
                  )}
                </Link>
                <form action={toggleChapterFree}>
                  <input type="hidden" name="chapterId" value={ch.id} />
                  <input type="hidden" name="storyId" value={story.id} />
                  <input type="hidden" name="makeFree" value={(!ch.is_free).toString()} />
                  <button className="text-[12px] text-ink-muted border border-border-soft rounded-full px-3 py-1">
                    {ch.is_free ? 'Free' : 'Locked'}
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
