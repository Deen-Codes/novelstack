import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';
import { Cover } from '@/components/Cover';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { SidebarNav } from '@/components/SidebarNav';
import { getSessionUser } from '@/lib/auth';
import {
  getFeed,
  getSavedStories,
  getMyStories,
  getFollowing,
  isAdult,
  type FeedStory,
} from '@/lib/queries';
import { GENRES, genreLabel } from '@/lib/genres';

export const metadata = { title: 'NovelStack — Stories worth following' };

type View = 'feed' | 'saved' | 'writing' | 'following';

// The homepage is an app shell: a left control panel decides what the main
// area shows. The selected section lives in the URL (?view= / ?genre= / ?q=)
// so every view is server-rendered and shareable.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; genre?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const genre = sp.genre;
  const query = sp.q?.trim() || undefined;

  const user = await getSessionUser();
  const signedIn = !!user;
  const adult = isAdult(user?.dateOfBirth);

  let view: View = 'feed';
  if (signedIn && (sp.view === 'saved' || sp.view === 'writing' || sp.view === 'following')) {
    view = sp.view;
  }

  let feed: FeedStory[] = [];
  let saved: Awaited<ReturnType<typeof getSavedStories>> = [];
  let myStories: Awaited<ReturnType<typeof getMyStories>> = [];
  let following: Awaited<ReturnType<typeof getFollowing>> = [];

  if (view === 'feed') {
    feed = await getFeed({ genre, query, viewerId: user?.id, viewerIsAdult: adult });
  } else if (view === 'saved') {
    saved = await getSavedStories(user!.id);
  } else if (view === 'writing') {
    myStories = await getMyStories(user!.id);
  } else if (view === 'following') {
    following = await getFollowing(user!.id);
  }

  const heading =
    view === 'saved'
      ? 'Saved books'
      : view === 'writing'
      ? 'Your stories'
      : view === 'following'
      ? 'Writers you follow'
      : query
      ? `Results for “${query}”`
      : genre
      ? genreLabel(genre)
      : 'For you';

  return (
    <>
      <AppHeader />
      <div className="flex max-w-6xl mx-auto">
        <CollapsibleSidebar>
          <SidebarNav view={view} genre={genre} query={query} signedIn={signedIn} />
        </CollapsibleSidebar>

        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <h1 className="font-serif text-2xl font-medium mb-5">{heading}</h1>

            {/* Mobile-only genre filter — the control panel is desktop-only */}
            {view === 'feed' && (
              <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
                <Link
                  href="/"
                  className={`shrink-0 text-[13px] px-3 py-1.5 rounded-full border ${
                    !genre ? 'bg-ink text-paper border-ink' : 'border-border-soft text-ink-muted'
                  }`}
                >
                  For you
                </Link>
                {GENRES.map((g) => (
                  <Link
                    key={g.value}
                    href={`/?genre=${g.value}`}
                    className={`shrink-0 text-[13px] px-3 py-1.5 rounded-full border ${
                      genre === g.value
                        ? 'bg-ink text-paper border-ink'
                        : 'border-border-soft text-ink-muted'
                    }`}
                  >
                    {g.label}
                  </Link>
                ))}
              </div>
            )}

            {view === 'feed' && <FeedView feed={feed} />}
            {view === 'saved' && <SavedView saved={saved} />}
            {view === 'writing' && <WritingView stories={myStories} />}
            {view === 'following' && <FollowingView authors={following} />}
          </div>
        </main>
      </div>
    </>
  );
}

function FeedView({ feed }: { feed: FeedStory[] }) {
  if (feed.length === 0) {
    return (
      <p className="text-ink-muted text-[15px]">
        Nothing here yet.{' '}
        <Link href="/write/new" className="text-signal">
          Write the first story.
        </Link>
      </p>
    );
  }
  return (
    <div className="space-y-5">
      {feed.map((s) => (
        <Link key={s.id} href={`/story/${s.slug}`} className="flex gap-4 group">
          <Cover
            coverUrl={s.coverUrl}
            coverColor={s.coverColor}
            title={s.title}
            mature={s.isMature}
            className="w-20 shrink-0 aspect-[3/4] rounded-lg overflow-hidden transition-transform group-hover:-translate-y-1"
          />
          <div className="min-w-0">
            <p className="text-[11px] text-signal font-medium">{s._reason}</p>
            <h2 className="font-serif text-lg font-medium leading-tight group-hover:text-signal">
              {s.title}
            </h2>
            <p className="text-[13px] text-ink-muted">
              {s.author?.displayName ?? 'A writer'} ·{' '}
              {(s.totalReads ?? 0).toLocaleString()} reads
            </p>
            {s.description && (
              <p className="text-[13px] text-ink-faint mt-1 line-clamp-2">{s.description}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function SavedView({ saved }: { saved: Awaited<ReturnType<typeof getSavedStories>> }) {
  if (saved.length === 0) {
    return (
      <p className="text-ink-muted text-[15px]">
        No saved books yet. Tap “Save story” on any story to keep it on this shelf.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
      {saved.map((s) => (
        <Link key={s.id} href={`/story/${s.slug}`} className="group">
          <Cover
            coverUrl={s.coverUrl}
            coverColor={s.coverColor}
            title={s.title}
            mature={s.isMature}
            className="aspect-[3/4] rounded-[10px] overflow-hidden transition-transform group-hover:-translate-y-1"
          />
          <div className="text-[13px] font-medium mt-2 leading-tight">{s.title}</div>
        </Link>
      ))}
    </div>
  );
}

function WritingView({
  stories,
}: {
  stories: Awaited<ReturnType<typeof getMyStories>>;
}) {
  if (stories.length === 0) {
    return (
      <p className="text-ink-muted text-[15px]">
        You haven’t started a story yet.{' '}
        <Link href="/write/new" className="text-signal">
          Begin your first one.
        </Link>
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {stories.map((s) => (
        <Link
          key={s.id}
          href={`/write/${s.id}`}
          className="flex items-center gap-3 border border-border-soft rounded-xl p-3 bg-white group"
        >
          <Cover
            coverUrl={s.coverUrl}
            coverColor={s.coverColor}
            title={s.title}
            mature={s.isMature}
            className="w-11 h-14 rounded shrink-0 overflow-hidden"
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-[15px] group-hover:text-signal">{s.title}</div>
            <div className="text-[12px] text-ink-faint">
              {(s.totalReads ?? 0).toLocaleString()} reads
            </div>
          </div>
          <span className="text-[11px] capitalize px-2 py-1 rounded-full bg-paper-soft text-ink-muted">
            {s.status}
          </span>
        </Link>
      ))}
    </div>
  );
}

function FollowingView({
  authors,
}: {
  authors: Awaited<ReturnType<typeof getFollowing>>;
}) {
  if (authors.length === 0) {
    return (
      <p className="text-ink-muted text-[15px]">
        You’re not following anyone yet. Follow writers from their profile to keep up with new
        chapters.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {authors.map((a) => (
        <Link
          key={a.id}
          href={`/u/${a.username}`}
          className="flex items-center gap-3 border border-border-soft rounded-xl p-3 bg-white group"
        >
          <div className="w-10 h-10 rounded-full bg-signal/10 text-signal flex items-center justify-center font-medium">
            {(a.displayName ?? '?').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-[15px] group-hover:text-signal">
              {a.displayName}
            </div>
            {a.bio && (
              <div className="text-[12px] text-ink-faint line-clamp-1">{a.bio}</div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
