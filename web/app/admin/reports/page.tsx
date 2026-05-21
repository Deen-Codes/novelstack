import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppHeader } from '@/components/AppHeader';
import { setReportStatus, removeStory } from '../actions';

export const metadata = { title: 'Moderation queue — NovelStack' };

const STATUSES = ['reviewing', 'actioned', 'dismissed'];

export default async function AdminReports() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: me } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!me?.is_admin) {
    return (
      <>
        <AppHeader />
        <main className="max-w-2xl mx-auto px-6 py-32 text-center">
          <p className="text-ink-muted">This page is for moderators only.</p>
        </main>
      </>
    );
  }

  const { data } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  const reports = (data ?? []) as any[];
  // CSAM reports first — most urgent.
  reports.sort((a, b) => (a.reason === 'csam' ? -1 : 0) - (b.reason === 'csam' ? -1 : 0));

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
              <div
                key={r.id}
                className={`border rounded-lg p-4 ${
                  r.reason === 'csam'
                    ? 'border-signal bg-signal/5'
                    : 'border-border-soft bg-white'
                }`}
              >
                <div className="flex justify-between items-baseline">
                  <span className="text-[14px] font-medium capitalize">
                    {r.reason.replace('_', ' ')} · {r.target_type}
                  </span>
                  <span className="text-[12px] text-ink-faint capitalize">{r.status}</span>
                </div>
                <p className="text-[12px] text-ink-faint mt-0.5">target id: {r.target_id}</p>
                {r.detail && (
                  <p className="text-[13px] text-ink-muted mt-2">{r.detail}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {STATUSES.map((s) => (
                    <form key={s} action={setReportStatus}>
                      <input type="hidden" name="reportId" value={r.id} />
                      <input type="hidden" name="status" value={s} />
                      <button className="text-[12px] border border-border-soft rounded-full px-3 py-1 capitalize">
                        {s}
                      </button>
                    </form>
                  ))}
                  {r.target_type === 'story' && (
                    <form action={removeStory}>
                      <input type="hidden" name="storyId" value={r.target_id} />
                      <button className="text-[12px] bg-signal text-paper rounded-full px-3 py-1 font-medium">
                        Remove story
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
