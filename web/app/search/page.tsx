import Link from 'next/link';
import { ilike, or } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import { searchStories, isAdult } from '@/lib/queries';
import { AppHeader } from '@/components/AppHeader';
import { StoryCard } from '@/components/StoryCard';
import type { Story, User } from '@/lib/types';

export const metadata = { title: 'Search — NovelStack' };

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: qParam } = await searchParams;
  const raw = (qParam ?? '').trim();
  const q = raw;

  let stories: Story[] = [];
  let writers: User[] = [];

  if (q) {
    const user = await getSessionUser();
    const adult = isAdult(user?.dateOfBirth);

    // Stories — title, description, genre.
    stories = await searchStories(q, adult);

    // Writers — by display name or username.
    const t = `%${q}%`;
    writers = await db
      .select()
      .from(users)
      .where(or(ilike(users.displayName, t), ilike(users.username, t)))
      .limit(8);
  }

  return (
    <>
      <AppHeader />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-medium mb-5">Search</h1>

        <form action="/search" method="get" className="mb-10">
          <input
            name="q"
            defaultValue={raw}
            placeholder="Search stories, writers, genres, tags…"
            className="w-full max-w-md border border-border-soft rounded-full px-4 py-2.5 text-[15px] bg-card"
          />
        </form>

        {q && writers.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl font-medium mb-4">Writers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {writers.map((w) => (
                <Link
                  key={w.id}
                  href={`/u/${w.username}`}
                  className="flex items-center gap-3 border border-border-soft rounded-lg p-3 bg-card"
                >
                  <div className="w-9 h-9 rounded-full bg-signal/10 text-signal flex items-center justify-center font-medium text-sm">
                    {w.displayName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium truncate">
                      {w.displayName}
                      {w.isVerified && <span className="text-signal"> ✓</span>}
                    </div>
                    <div className="text-[12px] text-ink-faint truncate">@{w.username}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {q && (
          <section>
            <h2 className="font-display text-xl font-medium mb-4">Stories</h2>
            {stories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stories.map((s) => (
                  <StoryCard key={s.id} story={s} />
                ))}
              </div>
            ) : (
              <p className="text-ink-muted text-[14px]">No stories matched &ldquo;{raw}&rdquo;.</p>
            )}
          </section>
        )}

        {!q && (
          <p className="text-ink-muted text-[14px]">
            Search by story title, writer name, genre, or tag.
          </p>
        )}
      </main>
    </>
  );
}
