import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { reads, chapters, stories } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import { getFollowing, getSavedStories } from '@/lib/queries';
import { AppHeader } from '@/components/AppHeader';
import { Cover } from '@/components/Cover';

export const metadata = { title: 'Your library — NovelStack' };

export default async function Library() {
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  // Continue reading — most recent chapters opened.
  const recentReads = await db
    .select({
      chapterId: reads.chapterId,
      chapterNumber: chapters.number,
      chapterTitle: chapters.title,
      storyTitle: stories.title,
      storyCoverColor: stories.coverColor,
      storyCoverUrl: stories.coverUrl,
    })
    .from(reads)
    .innerJoin(chapters, eq(chapters.id, reads.chapterId))
    .innerJoin(stories, eq(stories.id, chapters.storyId))
    .where(eq(reads.readerId, user.id))
    .orderBy(desc(reads.createdAt))
    .limit(8);

  // Writers the reader follows + saved stories.
  const following = await getFollowing(user.id);
  const saved = await getSavedStories(user.id);

  return (
    <>
      <AppHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl font-medium mb-8">Your library</h1>

        <h2 className="font-serif text-xl font-medium mb-3">Continue reading</h2>
        {recentReads.length === 0 ? (
          <p className="text-ink-muted text-[14px] mb-10">
            Nothing yet. Stories you read show up here so you can pick up where you left off.
          </p>
        ) : (
          <div className="divide-y divide-border-soft border-y border-border-soft mb-10">
            {recentReads.map((r) => (
              <Link
                key={r.chapterId}
                href={`/read/${r.chapterId}`}
                className="flex items-center gap-3 py-3 group"
              >
                <Cover
                  coverUrl={r.storyCoverUrl}
                  coverColor={r.storyCoverColor}
                  title={r.storyTitle}
                  className="w-9 h-12 rounded shrink-0 overflow-hidden"
                />
                <div>
                  <div className="text-[15px] font-medium group-hover:text-signal">
                    {r.storyTitle}
                  </div>
                  <div className="text-[12px] text-ink-faint">
                    Chapter {r.chapterNumber} · {r.chapterTitle}
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
            {following.map((a) => (
              <Link
                key={a.id}
                href={`/u/${a.username}`}
                className="flex items-center gap-2.5 border border-border-soft rounded-full pl-1.5 pr-4 py-1.5 bg-white"
              >
                <div className="w-7 h-7 rounded-full bg-signal/10 text-signal flex items-center justify-center font-medium text-[12px]">
                  {(a.displayName ?? '?').slice(0, 1).toUpperCase()}
                </div>
                <span className="text-[13px] font-medium">{a.displayName}</span>
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
            {saved.map((s) => (
              <Link key={s.id} href={`/story/${s.slug}`} className="group">
                <Cover
                  coverUrl={s.coverUrl}
                  coverColor={s.coverColor}
                  title={s.title}
                  className="aspect-[3/4] rounded-[10px] overflow-hidden transition-transform group-hover:-translate-y-1"
                />
                <div className="text-[13px] font-medium mt-2">{s.title}</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
