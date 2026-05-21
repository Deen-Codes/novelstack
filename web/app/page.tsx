import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';
import { getFeed } from '@/lib/feed';
import { GENRES } from '@/lib/genres';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'NovelStack — Stories worth following' };

function chip(active: boolean) {
  return `text-[13px] px-3.5 py-1.5 rounded-full border capitalize ${
    active ? 'bg-ink text-paper border-ink' : 'border-border-soft text-ink-muted'
  }`;
}

// The homepage IS the catalog — a fast, ranked, scrollable feed of books.
// No marketing splash: a visitor lands straight in the stories.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre } = await searchParams;
  const feed = await getFeed(genre);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <AppHeader />
      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Genre filter */}
        <div className="flex flex-wrap gap-2 mb-7">
          <Link href="/" className={chip(!genre)}>
            For you
          </Link>
          {GENRES.map((g) => (
            <Link key={g.value} href={`/?genre=${g.value}`} className={chip(genre === g.value)}>
              {g.label}
            </Link>
          ))}
        </div>

        {/* Signed-out nudge: read freely, sign up to write + sync progress */}
        {!user && (
          <div className="mb-7 rounded-2xl border border-border-soft bg-paper-soft px-5 py-4 flex items-center justify-between gap-4">
            <p className="text-[13px] text-ink-muted leading-snug">
              Reading is free. Sign in to write your own stories and sync your
              progress across devices.
            </p>
            <Link
              href="/signin"
              className="shrink-0 bg-ink text-paper px-4 py-2 rounded-full text-[13px] font-medium"
            >
              Sign in
            </Link>
          </div>
        )}

        {feed.length === 0 ? (
          <p className="text-ink-muted text-[15px]">
            No stories in this genre yet.{' '}
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
                    {s.author?.display_name ?? 'A writer'} ·{' '}
                    {(s.total_reads ?? 0).toLocaleString()} reads
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
