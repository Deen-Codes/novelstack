import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { reads, chapters, stories } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import { getFollowing, getSavedStories } from '@/lib/queries';
import { AppHeader } from '@/components/AppHeader';
import { Cover } from '@/components/Cover';

export const metadata = { title: 'Your library — NovelStack' };

// Library — mirrors the mobile In-progress / Completed / Saved layout.
// Desktop is a bigger canvas so everything goes in covers, not list rows.
export default async function Library() {
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  // Distinct "stories the reader is reading" — one row per story, latest
  // chapter opened. Covers + a "Ch. N" pip beats a wall of chapter rows.
  const inProgress = await db
    .select({
      chapterId: reads.chapterId,
      chapterNumber: chapters.number,
      chapterTitle: chapters.title,
      storyId: stories.id,
      storySlug: stories.slug,
      storyTitle: stories.title,
      coverColor: stories.coverColor,
      coverUrl: stories.coverUrl,
      isMature: stories.isMature,
      lastReadAt: sql<Date>`max(${reads.createdAt})`.as('last_read'),
    })
    .from(reads)
    .innerJoin(chapters, eq(chapters.id, reads.chapterId))
    .innerJoin(stories, eq(stories.id, chapters.storyId))
    .where(eq(reads.readerId, user.id))
    .groupBy(
      reads.chapterId,
      chapters.number,
      chapters.title,
      stories.id,
      stories.slug,
      stories.title,
      stories.coverColor,
      stories.coverUrl,
      stories.isMature,
    )
    .orderBy(desc(sql`max(${reads.createdAt})`))
    .limit(20);

  // Dedupe to one row per story (keep most recent), then cap.
  const byStory = new Map<string, typeof inProgress[number]>();
  for (const r of inProgress) {
    if (!byStory.has(r.storyId)) byStory.set(r.storyId, r);
  }
  const progress = Array.from(byStory.values()).slice(0, 18);

  const following = await getFollowing(user.id);
  const saved = await getSavedStories(user.id);

  return (
    <>
      <AppHeader />
      <main className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <h1 className="font-display font-extrabold text-[34px] md:text-[44px] tracking-[-0.02em] text-cream mb-2">
          Your library
        </h1>
        <p className="text-ink-muted text-[14px] mb-10 md:mb-12">
          Books you're reading, saved for later, and the writers you follow — all in one room.
        </p>

        <Section title="Continue reading" count={progress.length}>
          {progress.length === 0 ? (
            <Empty text="Stories you read show up here so you can pick up where you left off." />
          ) : (
            <CoverGrid>
              {progress.map((r) => (
                <Link key={r.storyId} href={`/read/${r.chapterId}`} className="block cover-lift group">
                  <Cover
                    coverUrl={r.coverUrl}
                    coverColor={r.coverColor}
                    title={r.storyTitle}
                    mature={r.isMature}
                    className="aspect-[3/4] rounded-[10px] overflow-hidden shadow-[0_10px_28px_-14px_rgba(0,0,0,0.55)]"
                  />
                  <div className="mt-3">
                    <div className="font-display font-bold text-[14px] md:text-[15px] leading-[1.2] text-ink line-clamp-2">
                      {r.storyTitle}
                    </div>
                    <div className="text-[12px] text-signal font-semibold mt-1">
                      Resume Ch. {r.chapterNumber} →
                    </div>
                  </div>
                </Link>
              ))}
            </CoverGrid>
          )}
        </Section>

        <Section title="Saved" count={saved.length}>
          {saved.length === 0 ? (
            <Empty text='Tap "Save story" on any story page to keep it on this shelf.' />
          ) : (
            <CoverGrid>
              {saved.map((s) => (
                <Link key={s.id} href={`/story/${s.slug}`} className="block cover-lift group">
                  <Cover
                    coverUrl={s.coverUrl}
                    coverColor={s.coverColor}
                    title={s.title}
                    mature={s.isMature}
                    className="aspect-[3/4] rounded-[10px] overflow-hidden shadow-[0_10px_28px_-14px_rgba(0,0,0,0.55)]"
                  />
                  <div className="mt-3">
                    <div className="font-display font-bold text-[14px] md:text-[15px] leading-[1.2] text-ink line-clamp-2">
                      {s.title}
                    </div>
                  </div>
                </Link>
              ))}
            </CoverGrid>
          )}
        </Section>

        <Section title="Writers you follow" count={following.length}>
          {following.length === 0 ? (
            <Empty text="Follow writers from their profile to keep up with their new chapters." />
          ) : (
            <div className="flex flex-wrap gap-3">
              {following.map((a) => (
                <Link
                  key={a.id}
                  href={`/u/${a.username}`}
                  className="flex items-center gap-2.5 border border-border-soft rounded-full pl-1.5 pr-4 py-1.5 bg-card hover:bg-card-hi transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-signal-soft text-signal flex items-center justify-center font-bold text-[12px]">
                    {(a.displayName ?? '?').slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-medium text-ink">{a.displayName}</span>
                </Link>
              ))}
            </div>
          )}
        </Section>
      </main>
    </>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="font-display font-bold text-[20px] md:text-[22px] tracking-[-0.01em] text-cream">
          {title}
        </h2>
        {typeof count === 'number' && count > 0 && (
          <span className="text-[12px] text-ink-faint font-medium">{count}</span>
        )}
      </div>
      {children}
    </section>
  );
}

function CoverGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-5 fade-stagger">
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-border-soft rounded-xl px-6 py-10 text-center">
      <p className="text-ink-muted text-[14px] max-w-md mx-auto">{text}</p>
    </div>
  );
}
