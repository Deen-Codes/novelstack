import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppHeader } from '@/components/AppHeader';
import { StoryCard } from '@/components/StoryCard';
import { toggleFollow } from '../actions';
import { toggleBlock } from '@/app/moderation/actions';
import { ReportButton } from '@/components/ReportButton';
import { TipButton } from '@/components/TipButton';
import type { Story, User } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return { title: `@${username} — NovelStack` };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const supabase = await createClient();
  const { username } = await params;
  const { data: profileData } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
  const profile = profileData as User | null;
  if (!profile) notFound();

  const { data: storiesData } = await supabase
    .from('stories')
    .select('*, author:users!stories_author_id_fkey(id, username, display_name, is_verified)')
    .eq('author_id', profile.id)
    .neq('status', 'draft')
    .order('total_reads', { ascending: false });
  const stories = (storiesData ?? []) as Story[];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let following = false;
  let blocked = false;
  if (user && user.id !== profile.id) {
    const { data: f } = await supabase
      .from('follows')
      .select('author_id')
      .eq('follower_id', user.id)
      .eq('author_id', profile.id)
      .maybeSingle();
    following = !!f;
    const { data: b } = await supabase
      .from('blocks')
      .select('blocked_id')
      .eq('blocker_id', user.id)
      .eq('blocked_id', profile.id)
      .maybeSingle();
    blocked = !!b;
  }

  return (
    <>
      <AppHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-signal/10 text-signal flex items-center justify-center font-medium text-xl">
            {profile.display_name.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-2xl font-medium">
              {profile.display_name}
              {profile.is_verified && <span className="text-signal text-base"> ✓</span>}
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
            <form action={toggleBlock}>
              <input type="hidden" name="blockedId" value={profile.id} />
              <input type="hidden" name="username" value={profile.username} />
              <input type="hidden" name="blocked" value={blocked.toString()} />
              <button className="text-[12px] text-ink-faint underline">
                {blocked ? 'Unblock' : 'Block'}
              </button>
            </form>
          </div>
        )}

        {stories.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-medium mb-4">Stories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stories.map((s) => (
                <StoryCard key={s.id} story={s} />
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
