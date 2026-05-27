import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { getSessionUser } from '@/lib/auth';
import { AppHeader } from '@/components/AppHeader';
import { db } from '@/db';
import { reports, users, stories, chapters } from '@/db/schema';
import { setReportStatus, removeStory } from '../actions';

export const metadata = { title: 'Moderation queue — NovelStack' };

const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  reviewing: 'Reviewing',
  actioned: 'Actioned',
  dismissed: 'Dismissed',
};

const STATUS_TINT: Record<string, string> = {
  open: 'bg-signal/15 text-signal',
  reviewing: 'bg-ink/15 text-ink',
  actioned: 'bg-emerald-600/15 text-emerald-700',
  dismissed: 'bg-ink-muted/15 text-ink-muted',
};

function timeAgo(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

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

  // Most recent first; include the reporter's username and the target story
  // title where present, so moderators have context without extra lookups.
  const rows = await db
    .select({
      id: reports.id,
      reason: reports.reason,
      detail: reports.detail,
      status: reports.status,
      createdAt: reports.createdAt,
      storyId: reports.storyId,
      chapterId: reports.chapterId,
      reporterUsername: users.username,
      storyTitle: stories.title,
      storySlug: stories.slug,
    })
    .from(reports)
    .leftJoin(users, eq(users.id, reports.reporterId))
    .leftJoin(stories, eq(stories.id, reports.storyId))
    .leftJoin(chapters, eq(chapters.id, reports.chapterId))
    .orderBy(desc(reports.createdAt))
    .limit(200);

  return (
    <>
      <AppHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl font-medium mb-1">Moderation queue</h1>
        <p className="text-[13px] text-ink-muted mb-7">
          {rows.length === 0 ? 'No reports yet.' : `${rows.length} report${rows.length === 1 ? '' : 's'}.`}
        </p>

        {rows.length === 0 ? (
          <p className="text-ink-muted text-[14px]">Quiet day.</p>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => {
              const target = r.storyTitle
                ? r.chapterId
                  ? `Chapter in “${r.storyTitle}”`
                  : `Story “${r.storyTitle}”`
                : 'Removed content';
              const reasonLabel = r.reason.replace(/_/g, ' ');
              return (
                <div
                  key={r.id}
                  className="border border-border-soft bg-white rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-ink capitalize">
                        {reasonLabel}
                      </p>
                      <p className="text-[12.5px] text-ink-muted mt-0.5">
                        {target}
                        {r.reporterUsername ? ` · reported by @${r.reporterUsername}` : ''}
                        {' · '}
                        {timeAgo(new Date(r.createdAt))}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                        STATUS_TINT[r.status] ?? STATUS_TINT.open
                      }`}
                    >
                      {STATUS_LABEL[r.status] ?? r.status}
                    </span>
                  </div>

                  {r.detail && (
                    <p className="text-[13.5px] text-ink leading-relaxed border-l-2 border-border-soft pl-3 italic">
                      “{r.detail}”
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(['reviewing', 'actioned', 'dismissed'] as const).map((next) =>
                      next === r.status ? null : (
                        <form key={next} action={setReportStatus}>
                          <input type="hidden" name="reportId" value={r.id} />
                          <input type="hidden" name="status" value={next} />
                          <button
                            type="submit"
                            className="text-[12.5px] border border-border-soft rounded-full px-3 py-1.5 hover:bg-ink/5"
                          >
                            Mark {STATUS_LABEL[next].toLowerCase()}
                          </button>
                        </form>
                      ),
                    )}
                    {r.storyId && r.storyTitle && (
                      <>
                        <a
                          href={`/story/${r.storySlug}`}
                          className="text-[12.5px] border border-border-soft rounded-full px-3 py-1.5 hover:bg-ink/5"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View story ↗
                        </a>
                        <form action={removeStory}>
                          <input type="hidden" name="storyId" value={r.storyId} />
                          <input type="hidden" name="reportId" value={r.id} />
                          <button
                            type="submit"
                            className="text-[12.5px] border border-red-600 text-red-600 rounded-full px-3 py-1.5 hover:bg-red-600/10"
                          >
                            Remove story
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
