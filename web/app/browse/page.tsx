import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';
import { getFeed } from '@/lib/feed';

export const metadata = { title: 'Home — NovelStack' };

const GENRES = [
  'romance', 'fantasy', 'scifi', 'thriller', 'mystery',
  'drama', 'horror', 'poetry', 'fanfiction',
];

function chip(active: boolean) {
  return `text-[13px] px-3.5 py-1.5 rounded-full border capitalize ${
    active ? 'bg-ink text-paper border-ink' : 'border-border-soft text-ink-muted'
  }`;
}

// The home feed — one fast, scrollable, ranked feed (Q3). Replaces the old
// browse grid and the fake-threads Community tab.
export default async function Home({
  searchParams,
}: {
  searchParams: { genre?: string };
}) {
  const genre = searchParams.genre;
  const feed = await getFeed(genre);

  return (
    <>
      <AppHeader />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-7">
          <Link href="/browse" className={chip(!genre)}>
            For you
          </Link>
          {GENRES.map((g) => (
            <Link key={g} href={`/browse?genre=${g}`} className={chip(genre === g)}>
              {g}
            </Link>
          ))}
        </div>

        {feed.length === 0 ? (
          <p className="text-ink-muted text-[15px]">
            No stories yet.{' '}
            <Link href="/write" className="text-signal">
              Write the first one.
            </Link>
          </p>
        ) : (
          <div className="space-y-5">
            {feed.map((s) => (
              <Link key={s.id} href={`/story/${s.slug}`} className="flex gap-4 group">
                <div
                  className="w-20 shrink-0 aspect-[3/4] rounded-lg transition-transform group-hover:-translate-y-1"
                  style={{ background: s.cover_color }}
                />
                <div className="min-w-0">
                  <p className="text-[11px] text-signal font-medium">{s._reason}</p>
                  <h2 className="font-serif text-lg font-medium leading-tight group-hover:text-signal">
                    {s.title}
                  </h2>
                  <p className="text-[13px] text-ink-muted">
                    {s.author?.display_name ?? 'A writer'} · {(s.total_reads ?? 0).toLocaleString()} reads
                  </p>
                  {s.description && (
                    <p className="text-[13px] text-ink-faint mt-1 line-clamp-2">
                      {s.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
