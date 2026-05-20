import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppHeader } from '@/components/AppHeader';
import { saveChapter, publishChapter } from '../../../actions';
import type { Chapter } from '@/lib/types';

export default async function ChapterEditor({
  params,
}: {
  params: { storyId: string; chapterId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: chapterData } = await supabase
    .from('chapters')
    .select('*, story:stories(author_id, title)')
    .eq('id', params.chapterId)
    .single();
  const chapter = chapterData as (Chapter & { story: { author_id: string; title: string } }) | null;
  if (!chapter || chapter.story.author_id !== user.id) notFound();

  const { data: contentRow } = await supabase
    .from('chapter_content')
    .select('body')
    .eq('chapter_id', chapter.id)
    .single();
  const body = contentRow?.body ?? '';

  return (
    <>
      <AppHeader />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <Link href={`/write/${params.storyId}`} className="text-[13px] text-signal">
          ‹ {chapter.story.title}
        </Link>

        <form action={saveChapter} className="mt-4 space-y-4">
          <input type="hidden" name="chapterId" value={chapter.id} />
          <input type="hidden" name="storyId" value={params.storyId} />
          <input
            name="title"
            defaultValue={chapter.title}
            className="w-full font-serif text-2xl font-medium border-0 border-b border-border-soft bg-transparent pb-2 focus:outline-none"
          />
          <textarea
            name="body"
            defaultValue={body}
            rows={22}
            placeholder="Write your chapter…"
            className="w-full font-serif text-[17px] leading-[1.7] border border-border-soft rounded-lg px-4 py-3 bg-white"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="border border-ink/25 px-5 py-2.5 rounded-full font-medium text-sm"
            >
              Save draft
            </button>
          </div>
        </form>

        <form action={publishChapter} className="mt-3">
          <input type="hidden" name="chapterId" value={chapter.id} />
          <input type="hidden" name="storyId" value={params.storyId} />
          <button
            type="submit"
            className="bg-signal text-paper px-5 py-2.5 rounded-full font-medium text-sm"
          >
            {chapter.published_at ? 'Re-publish' : 'Publish chapter'}
          </button>
          <span className="text-[12px] text-ink-faint ml-3">
            {chapter.is_free ? 'Free chapter' : 'Locked — readers watch an ad or subscribe'}
          </span>
        </form>
      </main>
    </>
  );
}
