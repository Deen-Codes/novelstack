import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { getMyStories } from '@/lib/queries';
import { AppHeader } from '@/components/AppHeader';
import { Cover, hasUploadedCover } from '@/components/Cover';

export const metadata = { title: 'Your stories — NovelStack' };

// Writer dashboard — mirrors the mobile Write tab: a cover-forward grid of
// the author's own stories, with a "New story" CTA in the top-right.
export default async function WriterDashboard() {
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  const stories = await getMyStories(user.id);

  return (
    <>
      <AppHeader />
      <main className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="flex justify-between items-end mb-8 md:mb-10">
          <div>
            <h1 className="font-display font-extrabold text-[34px] md:text-[44px] tracking-[-0.02em] text-cream">
              Your stories
            </h1>
            <p className="text-ink-muted text-[14px] mt-1">
              {stories.length} story{stories.length === 1 ? '' : 'ies'} · the first three
              chapters of each are free by default.
            </p>
          </div>
          <Link href="/write/new" className="btn-cream">
            + New story
          </Link>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border-soft rounded-2xl">
            <p className="text-ink-muted text-[15px] max-w-md mx-auto">
              No stories yet. Start your first — the first three chapters are free for
              readers automatically, so they can get hooked. Hit{' '}
              <span className="text-ink font-semibold">+ New story</span> up top to begin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {stories.map((s) => (
              <Link key={s.id} href={`/write/${s.id}`} className="block cover-lift group">
                <div className="relative">
                  <Cover
                    storyId={s.id}
                    coverUrl={s.coverUrl}
                    coverColor={s.coverColor}
                    title={s.title}
                    genre={s.genre}
                    mature={s.isMature}
                    className="aspect-[3/4] rounded-[10px] overflow-hidden shadow-[0_10px_28px_-14px_rgba(0,0,0,0.55)]"
                  />
                  <span
                    className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-1 rounded-full"
                    style={{
                      background:
                        s.status === 'complete'
                          ? 'rgba(244, 236, 223, 0.92)'
                          : s.status === 'ongoing'
                          ? 'rgba(200, 65, 78, 0.92)'
                          : 'rgba(20, 17, 15, 0.78)',
                      color: s.status === 'complete' ? '#15100E' : '#F2EADC',
                    }}
                  >
                    {s.status === 'complete' ? 'Complete' : s.status === 'ongoing' ? 'Live' : 'Draft'}
                  </span>
                </div>
                <div className="mt-3">
                  {hasUploadedCover(s.coverUrl) && (
                    <div className="font-display font-bold text-[14px] md:text-[15px] leading-[1.2] text-ink line-clamp-2">
                      {s.title}
                    </div>
                  )}
                  <div className="text-[11px] text-ink-faint mt-1 capitalize">
                    {s.genre} · {(s.totalReads ?? 0).toLocaleString()} reads
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
