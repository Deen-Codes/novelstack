import type { Metadata } from 'next';
import Link from 'next/link';
import { and, asc, eq, isNotNull } from 'drizzle-orm';
import { db } from '@/db';
import { chapters, subscriptions } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import { getChapterForReader } from '@/lib/queries';
import { Reader } from '@/components/Reader';
import { Comments } from '@/components/Comments';
import { ReportButton } from '@/components/ReportButton';

const BASE = 'https://novelstack.app';

// SEO: the chapter row is public, so this metadata is always crawlable —
// even for locked chapters. The excerpt becomes the search-result preview.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}): Promise<Metadata> {
  const { chapterId } = await params;
  const chapter = await getChapterForReader(chapterId);
  if (!chapter) return { title: 'Chapter — NovelStack' };
  const desc =
    (chapter.excerpt || '').slice(0, 155) || `Read chapter ${chapter.number} on NovelStack.`;
  return {
    title: `${chapter.story?.title ?? 'Story'} — Ch. ${chapter.number}: ${chapter.title}`,
    description: desc,
    alternates: { canonical: `${BASE}/read/${chapter.id}` },
    openGraph: { title: chapter.title, description: desc, type: 'article' },
  };
}

export default async function ReadChapter({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const user = await getSessionUser();
  const chapter = await getChapterForReader(chapterId, user?.id);

  if (!chapter) {
    return (
      <main className="max-w-xl mx-auto px-6 py-32 text-center">
        <p className="text-ink-muted">Chapter not found.</p>
        <Link href="/" className="text-signal text-sm mt-4 inline-block">Back home</Link>
      </main>
    );
  }

  // getChapterForReader returns the body only when the viewer may read it.
  const body = chapter.locked ? null : chapter.body;

  // Free chapters carry a banner ad — unless the viewer is on NovelStack+.
  let isSubscriber = false;
  if (user) {
    const [sub] = await db
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(and(eq(subscriptions.readerId, user.id), eq(subscriptions.status, 'active')))
      .limit(1);
    isSubscriber = !!sub;
  }
  const showAd = chapter.isFree && !isSubscriber;

  // Prev / next within the story (published chapters only).
  let prevId: string | null = null;
  let nextId: string | null = null;
  const sibs = await db
    .select({ id: chapters.id, number: chapters.number })
    .from(chapters)
    .where(and(eq(chapters.storyId, chapter.storyId), isNotNull(chapters.publishedAt)))
    .orderBy(asc(chapters.number));
  const idx = sibs.findIndex((c) => c.id === chapter.id);
  if (idx > 0) prevId = sibs[idx - 1].id;
  if (idx >= 0 && idx < sibs.length - 1) nextId = sibs[idx + 1].id;
  const chapterCount = sibs.length;
  const currentIndex = idx;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${chapter.story?.title ?? ''}: ${chapter.title}`,
    author: {
      '@type': 'Person',
      name: chapter.story?.author?.displayName ?? 'NovelStack writer',
    },
    isAccessibleForFree: chapter.isFree,
    url: `${BASE}/read/${chapter.id}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Reader
        chapterId={chapter.id}
        number={chapter.number}
        title={chapter.title}
        storyTitle={chapter.story?.title ?? 'Story'}
        storySlug={chapter.story?.slug ?? ''}
        authorId={chapter.story?.author?.id ?? ''}
        body={body}
        excerpt={chapter.excerpt}
        prevId={prevId}
        nextId={nextId}
        chapterCount={chapterCount}
        currentIndex={currentIndex}
        showAd={showAd}
        signedIn={!!user}
      />
      {/* Comments live below the reader — dark surface so the paper-mode
          ends cleanly at the bottom of the reading column. */}
      <section className="bg-paper text-ink border-t border-border-soft">
        <div className="max-w-[68ch] mx-auto px-6 py-12">
          <div className="flex justify-end mb-6">
            <ReportButton targetType="chapter" targetId={chapter.id} signedIn={!!user} />
          </div>
          <Comments chapterId={chapter.id} />
        </div>
      </section>
    </>
  );
}
