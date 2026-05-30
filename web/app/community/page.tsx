import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { getCommunityFeed } from '@/lib/queries';
import { AppHeader } from '@/components/AppHeader';
import { Cover } from '@/components/Cover';

export const metadata = { title: 'Community — NovelStack' };

// Community — a single chronological feed of updates from the writers you
// follow + your own posts. Mirrors the iOS Community tab's posts view.
// Composer + likes/comments interactions come on a later pass — v1 is
// read-only on web so writers and readers at least see the conversation
// that already exists in the iOS app.
export default async function Community() {
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  const feed = await getCommunityFeed(user.id);

  return (
    <>
      <AppHeader />
      <main className="max-w-2xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <h1 className="font-display font-extrabold text-[34px] md:text-[44px] tracking-[-0.02em] text-cream mb-2">
          Community
        </h1>
        <p className="text-ink-muted text-[14px] mb-8 md:mb-10">
          Updates from the writers you follow.
        </p>

        {feed.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border-soft rounded-2xl">
            <p className="text-ink-muted text-[15px] max-w-md mx-auto">
              No updates yet. Follow a few writers from their profile and their posts will
              show up here.
            </p>
            <Link href="/" className="btn-cream mt-6 inline-flex">
              Discover writers →
            </Link>
          </div>
        ) : (
          <div className="space-y-4 fade-stagger">
            {feed.map((p) => (
              <Post key={p.id} post={p} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function Post({ post }: { post: Awaited<ReturnType<typeof getCommunityFeed>>[number] }) {
  const initial = (post.author?.displayName ?? '?').slice(0, 1).toUpperCase();
  return (
    <article className="border border-border-soft rounded-2xl bg-card p-5 md:p-6">
      <header className="flex items-center gap-3 mb-3">
        <Link
          href={`/u/${post.author?.username ?? ''}`}
          className="w-10 h-10 rounded-full bg-signal-soft text-signal flex items-center justify-center font-bold text-[14px] shrink-0 overflow-hidden"
        >
          {post.author?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.author.avatarUrl} alt={post.author.displayName ?? ''} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/u/${post.author?.username ?? ''}`}
            className="font-display font-bold text-[15px] text-ink hover:text-signal transition-colors block leading-tight"
          >
            {post.author?.displayName ?? 'A writer'}
          </Link>
          <div className="text-[12px] text-ink-faint">
            @{post.author?.username ?? 'writer'} · {relTime(post.createdAt)}
          </div>
        </div>
      </header>

      <p className="font-serif text-[16px] leading-[1.55] text-ink whitespace-pre-wrap">
        {post.body}
      </p>

      {post.story && (
        <Link
          href={`/story/${post.story.slug}`}
          className="mt-4 flex items-center gap-3 p-3 rounded-xl border border-border-soft bg-paper-soft hover:bg-card-hi transition-colors"
        >
          <Cover
            storyId={post.story.id}
            coverUrl={post.story.coverUrl}
            coverColor={post.story.coverColor}
            title={post.story.title}
            genre={post.story.genre}
            authorName={post.author?.displayName}
            className="w-12 h-16 rounded shrink-0 overflow-hidden"
          />
          <div className="min-w-0">
            <div className="font-display font-bold text-[14px] text-ink line-clamp-1">
              {post.story.title}
            </div>
            <div className="text-[12px] text-ink-faint capitalize">
              {post.story.genre} · {post.story.status === 'complete' ? 'complete' : 'ongoing'}
            </div>
          </div>
        </Link>
      )}

      <footer className="mt-4 flex items-center gap-5 text-[13px] text-ink-muted">
        <span>{post.likeCount ?? 0} {post.likeCount === 1 ? 'like' : 'likes'}</span>
        <span>{post.commentCount ?? 0} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
      </footer>
    </article>
  );
}

function relTime(at: Date | string): string {
  const t = typeof at === 'string' ? new Date(at).getTime() : at.getTime();
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(t).toLocaleDateString();
}
