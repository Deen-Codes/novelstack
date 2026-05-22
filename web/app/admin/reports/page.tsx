import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { AppHeader } from '@/components/AppHeader';

export const metadata = { title: 'Moderation queue — NovelStack' };

// NOTE: the `reports` table was not part of the Render/Drizzle migration, so
// this queue currently renders empty. Admin gating uses the new `users.role`
// enum. Re-wire the data fetch once a `reports` table lands in db/schema.ts.

type Report = {
  id: string;
  reason: string;
  targetType: string;
  targetId: string;
  detail: string | null;
  status: string;
};

export default async function AdminReports() {
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  if (user.role !== 'admin') {
    return (
      <>
        <AppHeader />
        <main className="max-w-2xl mx-auto px-6 py-32 text-center">
          <p className="text-ink-muted">This page is for moderators only.</p>
        </main>
      </>
    );
  }

  const reports: Report[] = [];

  return (
    <>
      <AppHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl font-medium mb-6">Moderation queue</h1>

        {reports.length === 0 ? (
          <p className="text-ink-muted text-[14px]">No reports. Quiet day.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="border border-border-soft bg-white rounded-lg p-4">
                <span className="text-[14px] font-medium capitalize">
                  {r.reason.replace('_', ' ')} · {r.targetType}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
