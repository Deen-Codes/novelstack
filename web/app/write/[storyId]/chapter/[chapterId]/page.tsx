import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { chapters } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import { AppHeader } from '@/components/AppHeader';
import { saveChapter, publishChapter } from '../../../actions';

export default async function ChapterEditor({
  params,
}: {
  params: Promise<{ storyId: string; chapterId: string }>;
}) {
  const { storyId, chapterId } = await params;
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  const chapter = await db.query.chapters.findFirst({
    where: eq(chapters.id, chapterId),
    with: { story: true, content: true },
  });
  if (!chapter || chapter.story.authorId !== user.id) notFound();

  const body = chapter.content?.body ?? '';

  return (
    <>
      <AppHeader />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <Link href={`/write/${storyId}`} className="text-[13px] text-signal">
          ‹ {chapter.story.title}
        </Link>

        <form action={saveChapter} className="mt-4 space-y-4">
          <input type="hidden" name="chapterId" value={chapter.id} />
          <input type="hidden" name="storyId" value={storyId} />
          <input
            name="title"
            defaultValue={chapter.title}
            className="w-full font-display text-2xl font-medium border-0 border-b border-border-soft bg-transparent pb-2 focus:outline-none"
          />
          <textarea
            name="body"
            defaultValue={body}
            rows={22}
            placeholder="Write your chapter…"
            className="w-full font-display text-[17px] leading-[1.7] border border-border-soft rounded-lg px-4 py-3 bg-card"
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
          <input type="hidden" name="storyId" value={storyId} />
          <button
            type="submit"
            className="bg-signal text-cream px-5 py-2.5 rounded-full font-medium text-sm"
          >
            {chapter.publishedAt ? 'Re-publish' : 'Publish chapter'}
          </button>
          <span className="text-[12px] text-ink-faint ml-3">
            {chapter.isFree ? 'Free chapter' : 'Locked — readers watch an ad or subscribe'}
          </span>
        </form>
      </main>
    </>
  );
}
