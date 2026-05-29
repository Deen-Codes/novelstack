import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';
import { Cover } from '@/components/Cover';
import { getSessionUser } from '@/lib/auth';
import {
  getFeed,
  getContinueReading,
  isAdult,
  type FeedStory,
} from '@/lib/queries';

export const metadata = { title: 'NovelStack — Stories worth following' };

// Home — dark/ember, mirrors the iOS app:
//   ember-halo hero · spotlight card · rails (Continue / Trending / Follows / Mood)
// Server-rendered, real data, no sidebar. Library / Write / Search live on
// their own routes — the bottom tab bar surfaces them on mobile, the top nav
// surfaces them on desktop.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const genre = sp.genre;
  const query = sp.q?.trim() || undefined;

  const user = await getSessionUser();
  const signedIn = !!user;
  const adult = isAdult(user?.dateOfBirth);

  // Pull a big feed once — slice it into the rails below.
  const feed = await getFeed({ genre, query, viewerId: user?.id, viewerIsAdult: adult });

  const spotlight = feed[0];
  const trending = [...feed]
    .sort((a, b) => (b.totalReads ?? 0) - (a.totalReads ?? 0))
    .slice(0, 5);
  const follows = signedIn ? feed.filter((s) => s._reason?.startsWith('From a writer')).slice(0, 5) : [];
  // Until mood is a real axis, "cosy" maps to soft genres.
  const COSY: ReadonlyArray<string> = ['romance', 'contemporary', 'drama', 'lgbtq'];
  const cosy = feed.filter((s) => COSY.includes(s.genre)).slice(0, 5);

  const continueReading = signedIn ? await getContinueReading(user!.id) : null;

  return (
    <>
      <AppHeader />

      {/* Hero — ember halo (slow pulse handled by globals.css) */}
      <section className="ember-halo overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-8">
          <div className="ns-hero">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-signal mb-3">
              {signedIn ? `Welcome back, ${user!.displayName?.split(' ')[0] ?? 'reader'}` : 'For you · today'}
            </div>
            <h1 className="font-display font-extrabold text-[42px] md:text-[64px] leading-[1.0] tracking-[-0.025em] max-w-[880px] text-cream">
              Stories worth <span className="text-signal">following.</span>
            </h1>
            <p className="mt-5 max-w-[560px] text-[15px] md:text-base text-ink-muted leading-relaxed">
              A reading room for serialised fiction. Free with ads, $6.99/month for all-access,
              writers keep 70%.
            </p>
          </div>
        </div>
      </section>

      {/* Spotlight */}
      {spotlight && <Spotlight story={spotlight} signedIn={signedIn} continueReading={continueReading} />}

      {/* Rails */}
      <main className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
        {signedIn && continueReading && (
          <ContinueRail current={continueReading} more={feed.filter((s) => s.id !== continueReading.storyId).slice(0, 4)} />
        )}

        <Rail title="Trending — by read-through" href="/browse?sort=trending" stories={trending} />

        {follows.length > 0 && (
          <Rail title="From writers you follow" href="/?view=following" stories={follows} />
        )}

        {cosy.length > 0 && (
          <Rail title="For tonight — a cosy one" href="/browse?genre=romance" stories={cosy} />
        )}

        {feed.length === 0 && (
          <p className="text-ink-muted text-[15px] mt-12">
            Nothing here yet.{' '}
            <Link href="/write/new" className="text-signal hover:underline">
              Write the first story.
            </Link>
          </p>
        )}
      </main>
    </>
  );
}

function Spotlight({
  story,
  signedIn,
  continueReading,
}: {
  story: FeedStory;
  signedIn: boolean;
  continueReading: Awaited<ReturnType<typeof getContinueReading>>;
}) {
  // If the viewer has a chapter in flight, surface that as the primary CTA.
  const resumeHref =
    signedIn && continueReading
      ? `/read/${continueReading.chapterId}`
      : `/story/${story.slug}`;
  const ctaLabel = signedIn && continueReading ? 'Continue reading' : 'Start reading';
  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 -mt-2 mb-12 md:mb-16">
      <div
        className="relative overflow-hidden border border-border-soft rounded-2xl bg-card p-6 md:p-8 grid md:grid-cols-[260px_1fr] gap-6 md:gap-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 90% 30%, rgba(200, 65, 78, 0.12) 0%, transparent 55%)',
        }}
      >
        <Link href={`/story/${story.slug}`} className="cover-lift block">
          <Cover
            coverUrl={story.coverUrl}
            coverColor={story.coverColor}
            title={story.title}
            mature={story.isMature}
            className="aspect-[3/4] rounded-xl overflow-hidden shadow-[0_18px_50px_-16px_rgba(0,0,0,0.6)]"
          />
        </Link>
        <div className="min-w-0">
          <div className="inline-block bg-signal-soft text-signal text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1.5 rounded mb-4">
            Spotlight
            {(story.totalReads ?? 0) > 0 && (
              <span className="ml-2 text-signal/80">
                · {(story.totalReads ?? 0).toLocaleString()} reads
              </span>
            )}
          </div>
          <h2 className="font-display font-bold text-[28px] md:text-[38px] leading-[1.05] tracking-[-0.02em] text-cream mb-2">
            {story.title}
          </h2>
          <div className="text-ink-muted text-sm mb-4 font-medium">
            {story.author?.displayName ?? 'A writer'}
            {story.status && story.status !== 'draft' && (
              <> · {story.status === 'complete' ? 'complete' : 'ongoing'}</>
            )}
          </div>
          {story.description && (
            <p className="font-display text-[15px] md:text-[17px] leading-[1.55] text-ink mb-6 max-w-[520px]">
              {story.description}
            </p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <Link href={resumeHref} className="btn-cream">
              {ctaLabel} →
            </Link>
            <Link href={`/story/${story.slug}`} className="btn-ember">
              Story details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Rail({
  title,
  href,
  stories,
}: {
  title: string;
  href: string;
  stories: FeedStory[];
}) {
  if (stories.length === 0) return null;
  return (
    <section className="mb-14">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-display font-bold text-[20px] md:text-[22px] tracking-[-0.01em] text-ink">
          {title}
        </h3>
        <Link href={href} className="text-[13px] font-semibold text-signal hover:underline">
          See all →
        </Link>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-5 fade-stagger">
        {stories.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
      </div>
    </section>
  );
}

function ContinueRail({
  current,
  more,
}: {
  current: NonNullable<Awaited<ReturnType<typeof getContinueReading>>>;
  more: FeedStory[];
}) {
  return (
    <section className="mb-14">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-display font-bold text-[20px] md:text-[22px] tracking-[-0.01em] text-ink">
          Continue reading
        </h3>
        <Link href="/library" className="text-[13px] font-semibold text-signal hover:underline">
          All in library →
        </Link>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-5 fade-stagger">
        <Link
          href={`/read/${current.chapterId}`}
          className="block cover-lift group"
        >
          <Cover
            coverUrl={current.coverUrl}
            coverColor={current.coverColor}
            title={current.storyTitle}
            className="aspect-[3/4] rounded-[10px] overflow-hidden shadow-[0_10px_28px_-14px_rgba(0,0,0,0.55)] mb-3"
          />
          <div className="font-display font-bold text-[14px] md:text-[15px] leading-[1.2] text-ink line-clamp-2 mb-1">
            {current.storyTitle}
          </div>
          <div className="text-[12px] text-signal font-medium">
            Resume Ch. {current.chapterNumber} →
          </div>
        </Link>
        {more.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
      </div>
    </section>
  );
}

function StoryCard({ story }: { story: FeedStory }) {
  return (
    <Link href={`/story/${story.slug}`} className="block cover-lift group">
      <Cover
        coverUrl={story.coverUrl}
        coverColor={story.coverColor}
        title={story.title}
        mature={story.isMature}
        className="aspect-[3/4] rounded-[10px] overflow-hidden shadow-[0_10px_28px_-14px_rgba(0,0,0,0.55)] mb-3"
      />
      <div className="font-display font-bold text-[14px] md:text-[15px] leading-[1.2] text-ink line-clamp-2 mb-1">
        {story.title}
      </div>
      <div className="text-[12px] text-ink-muted font-medium line-clamp-1">
        {story.author?.displayName ?? 'A writer'}
      </div>
      {(story.totalReads ?? 0) > 0 && (
        <div className="text-[11px] text-ink-faint mt-0.5">
          {(story.totalReads ?? 0).toLocaleString()} reads
        </div>
      )}
    </Link>
  );
}
