import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Reader } from '@/components/Reader';
import { Comments } from '@/components/Comments';
import { ReportButton } from '@/components/ReportButton';
import type { Chapter } from '@/lib/types';

const BASE = 'https://novelstack.app';

type ChapterWithStory = Chapter & {
  story: { id: string; title: string; slug: string; author: { id: string; display_name: string } | null } | null;
};

async function getChapter(id: string): Promise<ChapterWithStory | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('chapters')
    .select('*, story:stories(id, title, slug, author:users(id, display_name))')
    .eq('id', id)
    .single();
  return (data as ChapterWithStory) ?? null;
}

// SEO: the chapter row is public, so this metadata is always crawlable —
// even for locked chapters. The excerpt becomes the search-result preview.
export async function generateMetadata({
  params,
}: {
  params: { chapterId: string };
}): Promise<Metadata> {
  const chapter = await getChapter(params.chapterId);
  if (!chapter) return { title: 'Chapter — NovelStack' };
  const desc = (chapter.excerpt || '').slice(0, 155) || `Read chapter ${chapter.number} on NovelStack.`;
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
  params: { chapterId: string };
}) {
  const supabase = createClient();
  const chapter = await getChapter(params.chapterId);

  if (!chapter) {
    return (
      <main className="max-w-xl mx-auto px-6 py-32 text-center">
        <p className="text-ink-muted">Chapter not found. Connect Supabase and seed the database.</p>
        <Link href="/" className="text-signal text-sm mt-4 inline-block">Back home</Link>
      </main>
    );
  }

  // Full body — RLS-gated table. null when the viewer is not entitled.
  const { data: contentRow } = await supabase
    .from('chapter_content')
    .select('body')
    .eq('chapter_id', chapter.id)
    .single();
  const body = contentRow?.body ?? null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Free chapters carry a banner ad — unless the viewer is on NovelStack+.
  let isSubscriber = false;
  if (user) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('reader_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    isSubscriber = !!sub;
  }
  const showAd = chapter.is_free && !isSubscriber;

  // Prev / next within the story (published chapters only).
  let prevId: string | null = null;
  let nextId: string | null = null;
  if (chapter.story) {
    const { data: sibs } = await supabase
      .from('chapters')
      .select('id, number')
      .eq('story_id', chapter.story.id)
      .not('published_at', 'is', null)
      .order('number');
    const list = (sibs ?? []) as { id: string; number: number }[];
    const idx = list.findIndex((c) => c.id === chapter.id);
    if (idx > 0) prevId = list[idx - 1].id;
    if (idx >= 0 && idx < list.length - 1) nextId = list[idx + 1].id;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${chapter.story?.title ?? ''}: ${chapter.title}`,
    author: { '@type': 'Person', name: chapter.story?.author?.display_name ?? 'NovelStack writer' },
    isAccessibleForFree: chapter.is_free,
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
        showAd={showAd}
        signedIn={!!user}
      />
      <section className="bg-paper border-t border-border-soft">
        <div className="max-w-[640px] mx-auto px-6 py-12">
          <div className="flex justify-end mb-6">
            <ReportButton targetType="chapter" targetId={chapter.id} signedIn={!!user} />
          </div>
          <Comments chapterId={chapter.id} />
        </div>
      </section>
    </>
  );
}
