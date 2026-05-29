import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { stories, chapters as chaptersTable } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import { AppHeader } from '@/components/AppHeader';
import { CoverUploader } from '@/components/CoverUploader';
import { DeleteStoryButton } from '@/components/DeleteStoryButton';
import { DeleteChapterButton } from '@/components/DeleteChapterButton';
import { GENRES, genreLabel } from '@/lib/genres';
import {
  createChapter,
  toggleChapterFree,
  updateStoryDetails,
  setStoryStatusAction,
} from '../actions';

// Story manage screen — mirrors the iOS app's tabbed Story-manage:
//   Cover · Status · Access (mature) · Details · Chapters
// On desktop we don't bother with tabs — there's room to show everything in
// one column. Each section is its own server-action form so any save is one
// round trip.
export default async function ManageStory({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  const story = await db.query.stories.findFirst({
    where: eq(stories.id, storyId),
  });
  if (!story || story.authorId !== user.id) notFound();

  const chapters = await db.query.chapters.findMany({
    where: eq(chaptersTable.storyId, story.id),
    orderBy: [asc(chaptersTable.number)],
  });

  return (
    <>
      <AppHeader />
      <main className="max-w-3xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <Link href="/write" className="text-[13px] text-signal font-semibold inline-block mb-4">
          ‹ Your stories
        </Link>

        {/* Title row + status pill */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="font-display font-extrabold text-[34px] md:text-[44px] tracking-[-0.02em] text-cream leading-[1.05]">
            {story.title}
          </h1>
          <StatusPill status={story.status} />
        </div>
        <p className="text-ink-muted text-[14px] mb-10">
          {genreLabel(story.genre)} ·{' '}
          {chapters.length} chapter{chapters.length === 1 ? '' : 's'} ·{' '}
          {(story.totalReads ?? 0).toLocaleString()} reads
          {story.isMature && <span className="text-signal font-medium ml-2">· 18+</span>}
        </p>

        {/* COVER */}
        <Section title="Cover" subtitle="JPEG, PNG or WebP · up to 5 MB · 3:4 looks best.">
          <CoverUploader
            storyId={story.id}
            title={story.title}
            initialCoverUrl={story.coverUrl}
            coverColor={story.coverColor}
          />
        </Section>

        {/* STATUS */}
        <Section
          title="Status"
          subtitle={
            story.status === 'draft'
              ? 'Draft — not visible to readers yet. Switch to Ongoing to publish.'
              : story.status === 'ongoing'
              ? 'Live and ongoing. Readers see new chapters in their feed.'
              : 'Marked complete. Readers see the "complete" badge on the cover.'
          }
        >
          <div className="flex flex-wrap gap-2">
            <StatusButton storyId={story.id} value="draft" current={story.status} label="Draft" />
            <StatusButton storyId={story.id} value="ongoing" current={story.status} label="Ongoing" />
            <StatusButton storyId={story.id} value="complete" current={story.status} label="Complete" />
          </div>
        </Section>

        {/* DETAILS (title + description + genre + mature) */}
        <Section title="Details" subtitle="Title, description and genre — readers see these on the story page.">
          <form action={updateStoryDetails} className="space-y-4">
            <input type="hidden" name="storyId" value={story.id} />

            <Field label="Title">
              <input
                name="title"
                defaultValue={story.title}
                required
                className="w-full bg-paper-soft border border-border-soft rounded-lg px-3.5 py-2.5 text-[15px]"
              />
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                defaultValue={story.description ?? ''}
                rows={4}
                placeholder="A few lines about what this story is. The hook a reader sees before they tap in."
                className="w-full bg-paper-soft border border-border-soft rounded-lg px-3.5 py-2.5 text-[15px]"
              />
            </Field>

            <Field label="Genre">
              <select
                name="genre"
                defaultValue={story.genre}
                className="w-full bg-paper-soft border border-border-soft rounded-lg px-3.5 py-2.5 text-[15px]"
              >
                {GENRES.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </Field>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isMature"
                defaultChecked={story.isMature}
                className="w-4 h-4 accent-signal"
              />
              <div>
                <div className="text-[14px] font-medium">Mature (18+)</div>
                <div className="text-[12px] text-ink-faint">
                  Readers without a verified date of birth won't see this story.
                </div>
              </div>
            </label>

            <button type="submit" className="btn-cream">Save details →</button>
          </form>
        </Section>

        {/* CHAPTERS */}
        <Section
          title="Chapters"
          subtitle="The first three you publish are free for readers by default. Tap a chapter to edit it."
          right={
            <form action={createChapter.bind(null, story.id)}>
              <button className="btn-cream">+ Add chapter</button>
            </form>
          }
        >
          {chapters.length === 0 ? (
            <p className="text-ink-muted text-[14px]">
              No chapters yet. Click "Add chapter" to write your first.
            </p>
          ) : (
            <div className="border border-border-soft rounded-xl overflow-hidden">
              {chapters.map((ch, i) => (
                <div
                  key={ch.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i !== chapters.length - 1 ? 'border-b border-border-soft' : ''
                  } bg-card hover:bg-card-hi transition-colors`}
                >
                  <Link
                    href={`/write/${story.id}/chapter/${ch.id}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="text-[15px] font-medium text-ink truncate">
                      {ch.number}. {ch.title || 'Untitled chapter'}
                    </div>
                    <div className="text-[12px] text-ink-faint mt-0.5">
                      {ch.wordCount?.toLocaleString() ?? 0} words
                      {!ch.publishedAt && <span className="ml-2 text-warn">Draft</span>}
                    </div>
                  </Link>

                  {/* Free / Locked toggle */}
                  <form action={toggleChapterFree}>
                    <input type="hidden" name="chapterId" value={ch.id} />
                    <input type="hidden" name="storyId" value={story.id} />
                    <input type="hidden" name="makeFree" value={(!ch.isFree).toString()} />
                    <button
                      className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-full border border-border-soft text-ink-muted hover:text-ink hover:bg-paper-soft transition-colors"
                      title={ch.isFree ? 'Locked chapters need an ad-unlock or NovelStack+' : 'Free chapters are open to everyone'}
                    >
                      {ch.isFree ? 'Free' : 'Locked'}
                    </button>
                  </form>

                  {/* Delete — confirm prompt lives in the client component */}
                  <DeleteChapterButton chapterId={ch.id} storyId={story.id} chapterNumber={ch.number} />
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* DANGER ZONE */}
        <div className="mt-12 pt-6 border-t border-border-soft">
          <DeleteStoryButton storyId={story.id} />
        </div>
      </main>
    </>
  );
}

function Section({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h2 className="font-display font-bold text-[20px] tracking-[-0.01em] text-cream">
            {title}
          </h2>
          {subtitle && <p className="text-[13px] text-ink-muted mt-1 max-w-[520px]">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

type StoryStatus = 'draft' | 'ongoing' | 'complete' | 'paused';

function StatusPill({ status }: { status: StoryStatus }) {
  const cfg =
    status === 'complete'
      ? { bg: 'var(--color-cream)', fg: 'var(--color-cream-ink)', label: 'Complete' }
      : status === 'ongoing'
      ? { bg: 'var(--color-signal)', fg: 'var(--color-cream)', label: 'Live · ongoing' }
      : status === 'paused'
      ? { bg: 'var(--color-paper-soft)', fg: 'var(--color-warn)', label: 'Paused' }
      : { bg: 'var(--color-paper-soft)', fg: 'var(--color-ink-muted)', label: 'Draft' };
  return (
    <span
      className="shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.fg, border: '1px solid var(--color-border-soft)' }}
    >
      {cfg.label}
    </span>
  );
}

function StatusButton({
  storyId,
  value,
  current,
  label,
}: {
  storyId: string;
  value: 'draft' | 'ongoing' | 'complete';
  current: StoryStatus;
  label: string;
}) {
  const active = value === current;
  return (
    <form action={setStoryStatusAction}>
      <input type="hidden" name="storyId" value={storyId} />
      <input type="hidden" name="status" value={value} />
      <button
        type="submit"
        className="px-4 py-2 rounded-full text-[13px] font-semibold border transition-colors"
        style={{
          background: active ? 'var(--color-cream)' : 'transparent',
          color: active ? 'var(--color-cream-ink)' : 'var(--color-ink-muted)',
          borderColor: active ? 'var(--color-cream)' : 'var(--color-border-soft)',
        }}
      >
        {label}
      </button>
    </form>
  );
}

