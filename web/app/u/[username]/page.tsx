import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { getAuthorByUsername, getFollowing } from '@/lib/queries';
import { AppHeader } from '@/components/AppHeader';
import { StoryCard } from '@/components/StoryCard';
import { toggleFollow } from '../actions';
import { ReportButton } from '@/components/ReportButton';
import { TipButton } from '@/components/TipButton';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return { title: `@${username} — NovelStack` };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getAuthorByUsername(username);
  if (!profile) notFound();

  const stories = profile.stories;

  const user = await getSessionUser();
  let following = false;
  if (user && user.id !== profile.id) {
    const followed = await getFollowing(user.id);
    following = followed.some((a) => a.id === profile.id);
  }

  return (
    <>
      <AppHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-signal/10 text-signal flex items-center justify-center font-medium text-xl">
            {profile.displayName.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-2xl font-medium">
              {profile.displayName}
              {profile.isVerified && <span className="text-signal text-base"> ✓</span>}
            </h1>
            <p className="text-[13px] text-ink-faint">@{profile.username}</p>
          </div>
          {user && user.id !== profile.id && (
            <form action={toggleFollow}>
              <input type="hidden" name="authorId" value={profile.id} />
              <input type="hidden" name="username" value={profile.username} />
              <input type="hidden" name="following" value={following.toString()} />
              <button
                className={`text-[13px] px-4 py-2 rounded-full font-medium ${
                  following
                    ? 'border border-border-soft text-ink-muted'
                    : 'bg-signal text-paper'
                }`}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            </form>
          )}
        </div>

        {profile.bio && <p className="text-[14px] text-ink-muted mt-4">{profile.bio}</p>}

        {user && user.id !== profile.id && (
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <TipButton recipientId={profile.id} signedIn={true} />
            <ReportButton targetType="user" targetId={profile.id} signedIn={true} />
          </div>
        )}

        {stories.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-medium mb-4">Stories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stories.map((s) => (
                <StoryCard key={s.id} story={{ ...s, author: profile }} />
              ))}
            </div>
          </section>
        ) : (
          <p className="text-ink-muted text-[14px] mt-10">No published stories yet.</p>
        )}
      </main>
    </>
  );
}
