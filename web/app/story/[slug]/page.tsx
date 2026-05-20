import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { createClient } from '@/lib/supabase/server';
import { viewerIsAdult } from '@/lib/age';
import { BookmarkButton } from '@/components/BookmarkButton';
import { ReportButton } from '@/components/ReportButton';
import { TipButton } from '@/components/TipButton';
import type { Story, Chapter, User } from '@/lib/types';

const BASE = 'https://novelstack.app';

type StoryWithAuthor = Story & { author: User | null };

async function getStory(slug: string): Promise<StoryWithAuthor | null> {
  const { data } = await supabase
    .from('stories')
    .select('*, author:users(*)')
    .eq('slug', slug)
    .single();
  return (data as StoryWithAuthor) ?? null;
}

// SEO: server-rendered metadata so Google can index and deep-link to this book.
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const story = await getStory(params.slug);
  if (!story) return { title: 'Story not found — NovelStack' };

  const desc = story.description ?? `Read ${story.title} free on NovelStack.`;
  return {
    title: `${story.title} by ${story.author?.display_name ?? 'a NovelStack writer'}`,
    description: desc,
    alternates: { canonical: `${BASE}/story/${story.slug}` },
    openGraph: {
      title: story.title,
      description: desc,
      type: 'book',
      url: `${BASE}/story/${story.slug}`,
      images: story.cover_url ? [{ url: story.cover_url }] : [],
    },
    twitter: { card: 'summary_large_image', title: story.title, description: desc },
  };
}

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const story = await getStory(params.slug);

  if (!story) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-32 text-center">
        <p className="text-ink-muted">
          Story not found. Connect Supabase and seed the database to see real stories here.
        </p>
        <Link href="/" className="text-signal text-sm mt-4 inline-block">Back home</Link>
      </main>
    );
  }

  const { data: chapterData } = await supabase
    .from('chapters')
    .select('*')
    .eq('story_id', story.id)
    .order('number');
  const chapters = (chapterData ?? []) as Chapter[];

  // Current user + whether they've bookmarked this story.
  const ssr = createClient();
  const {
    data: { user },
  } = await ssr.auth.getUser();
  let bookmarked = false;
  if (user) {
    const { data: bm } = await ssr
      .from('bookmarks')
      .select('story_id')
      .eq('reader_id', user.id)
      .eq('story_id', story.id)
      .maybeSingle();
    bookmarked = !!bm;
  }

  // Q1 age-gate: mature stories are blocked for under-18s and logged-out visitors.
  const adult = await viewerIsAdult();
  if (story.is_mature && !adult) {
    return (
      <main className="max-w-xl mx-auto px-6 py-32 text-center">
        <p className="text-ink-muted">
          This story is marked mature (18+). Sign in with a date of birth confirming
          you are 18 or older to read it.
        </p>
        <Link href="/signin" className="text-signal text-sm mt-4 inline-block">
          Sign in
        </Link>
      </main>
    );
  }

  // JSON-LD structured data — helps Google show rich book results.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: story.title,
    author: { '@type': 'Person', name: story.author?.display_name ?? 'NovelStack writer' },
    description: story.description ?? undefined,
    url: `${BASE}/story/${story.slug}`,
    image: story.cover_url ?? undefined,
    genre: story.genre,
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/" className="text-[22px] font-medium tracking-tight">
        novelstack<span className="text-signal">.</span>
      </Link>

      <div className="flex gap-6 mt-10">
        <div
          className="w-36 shrink-0 aspect-[3/4] rounded-xl"
          style={{ background: story.cover_color }}
        />
        <div>
          <span className="text-[12px] text-signal font-medium capitalize">{story.genre}</span>
          <h1 className="font-serif text-3xl font-medium mt-1">{story.title}</h1>
          <p className="text-[14px] text-ink-muted mt-1">
            by{' '}
            {story.author?.username ? (
              <Link href={`/u/${story.author.username}`} className="text-signal">
                {story.author.display_name}
              </Link>
            ) : (
              'a NovelStack writer'
            )}
          </p>
          <p className="text-[14px] text-ink-muted mt-4 leading-relaxed">{story.description}</p>
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <BookmarkButton
              storyId={story.id}
              slug={story.slug}
              initial={bookmarked}
              signedIn={!!user}
            />
            <TipButton recipientId={story.author_id} storyId={story.id} signedIn={!!user} />
            <ReportButton targetType="story" targetId={story.id} signedIn={!!user} />
          </div>
        </div>
      </div>

      <h2 className="font-serif text-xl font-medium mt-10 mb-3">Chapters</h2>
      <div className="divide-y divide-border-soft border-y border-border-soft">
        {chapters.map((ch) => (
          <Link
            key={ch.id}
            href={`/read/${ch.id}`}
            className="flex justify-between items-center py-3 group"
          >
            <span className="text-[15px] group-hover:text-signal">
              {ch.number}. {ch.title}
            </span>
            <span className="text-[12px] text-ink-faint">
              {ch.is_free ? 'Free' : 'Ad or NovelStack+'}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
