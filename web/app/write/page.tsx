import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { getMyStories } from '@/lib/queries';
import { AppHeader } from '@/components/AppHeader';

export const metadata = { title: 'Your stories — NovelStack' };

export default async function WriterDashboard() {
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  const stories = await getMyStories(user.id);

  return (
    <>
      <AppHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl font-medium">Your stories</h1>
          <Link
            href="/write/new"
            className="bg-signal text-cream px-4 py-2 rounded-full text-sm font-medium"
          >
            New story
          </Link>
        </div>

        {stories.length === 0 ? (
          <p className="text-ink-muted text-[15px]">
            No stories yet. Start your first one — the first three chapters are free for
            readers, so they can get hooked.
          </p>
        ) : (
          <div className="divide-y divide-border-soft border-y border-border-soft">
            {stories.map((s) => (
              <Link
                key={s.id}
                href={`/write/${s.id}`}
                className="flex justify-between items-center py-4 group"
              >
                <div>
                  <span className="text-[16px] font-medium group-hover:text-signal">
                    {s.title}
                  </span>
                  <span className="text-[13px] text-ink-faint ml-2 capitalize">{s.genre}</span>
                </div>
                <span className="text-[12px] text-ink-faint capitalize">{s.status}</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
