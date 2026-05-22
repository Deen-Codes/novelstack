import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { AppHeader } from '@/components/AppHeader';
import { updateProfile } from './actions';

export const metadata = { title: 'Settings — NovelStack' };

export default async function Settings() {
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  const profile = user;

  return (
    <>
      <AppHeader />
      <main className="max-w-xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl font-medium mb-6">Settings</h1>

        <form action={updateProfile} className="space-y-4">
          <div>
            <label className="text-[13px] text-ink-muted block mb-1">Display name</label>
            <input
              name="displayName"
              defaultValue={profile?.displayName ?? ''}
              className="w-full border border-border-soft rounded-lg px-3.5 py-2.5 text-[15px] bg-white"
            />
          </div>
          <div>
            <label className="text-[13px] text-ink-muted block mb-1">Username</label>
            <input
              name="username"
              defaultValue={profile?.username ?? ''}
              className="w-full border border-border-soft rounded-lg px-3.5 py-2.5 text-[15px] bg-white"
            />
          </div>
          <div>
            <label className="text-[13px] text-ink-muted block mb-1">Bio</label>
            <textarea
              name="bio"
              defaultValue={profile?.bio ?? ''}
              rows={3}
              className="w-full border border-border-soft rounded-lg px-3.5 py-2.5 text-[15px] bg-white"
            />
          </div>
          <div>
            <label className="text-[13px] text-ink-muted block mb-1">Date of birth</label>
            <input
              name="dateOfBirth"
              type="date"
              defaultValue={profile?.dateOfBirth ?? ''}
              className="w-full border border-border-soft rounded-lg px-3.5 py-2.5 text-[15px] bg-white"
            />
            <p className="text-[12px] text-ink-faint mt-1">
              Used to confirm your age — mature (18+) stories stay hidden until this is set.
            </p>
          </div>
          <button
            type="submit"
            className="bg-signal text-paper px-5 py-2.5 rounded-full font-medium text-sm"
          >
            Save
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-border-soft flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium">Signed in as</p>
            <p className="text-[13px] text-ink-faint">{user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-[13px] border border-border-soft rounded-full px-4 py-2">
              Sign out
            </button>
          </form>
        </div>

        {profile?.username && (
          <Link
            href={`/u/${profile.username}`}
            className="text-[13px] text-signal mt-6 inline-block"
          >
            View your public profile ›
          </Link>
        )}
      </main>
    </>
  );
}
