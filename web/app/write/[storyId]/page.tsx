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

type Tab = 'cover' | 'status' | 'access' | 'details' | 'chapters';
const TABS: { value: Tab; label: string }[] = [
  { value: 'cover', label: 'Cover' },
  { value: 'status', label: 'Status' },
  { value: 'access', label: 'Access' },
  { value: 'details', label: 'Details' },
  { value: 'chapters', label: 'Chapters' },
];

// Story manage — tabbed view that mirrors the iOS hamburger menu sections.
// Smart default tab:
//   - If the story has an uploaded cover OR at least one chapter → Chapters
//     (the writer is past setup; they're here to keep writing).
//   - Otherwise → Cover (first-time setup feels like a guided start).
// URL-driven via ?tab=… so refresh/back-button work and the smart default
// only kicks in when no tab is explicitly chosen.
export default async function ManageStory({
  params,
  searchParams,
}: {
  params: Promise<{ storyId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { storyId } = await params;
  const { tab: tabParam } = await searchParams;

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

  const explicitTab = TABS.find((t) => t.value === tabParam)?.value;
  const pastSetup = !!story.coverUrl || chapters.length > 0;
  const tab: Tab = explicitTab ?? (pastSetup ? 'chapters' : 'cover');

  return (
    <>
      <AppHeader />
      <main className="max-w-4xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <Link href="/write" className="text-[13px] text-signal font-semibold inline-block mb-4">
          ‹ Your stories
        </Link>

        {/* Title row + status pill */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="font-display font-extrabold text-[30px] md:text-[40px] tracking-[-0.02em] text-cream leading-[1.05]">
            {story.title}
          </h1>
          <StatusPill status={story.status} />
        </div>
        <p className="text-ink-muted text-[14px] mb-8">
          {genreLabel(story.genre)} ·{' '}
          {chapters.length} chapter{chapters.length === 1 ? '' : 's'} ·{' '}
          {(story.totalReads ?? 0).toLocaleString()} reads
          {story.isMature && <span className="text-signal font-medium ml-2">· 18+</span>}
        </p>

        {/* Sub-nav — desktop tabs, horizontally scrollable on mobile */}
        <nav className="border-b border-border-soft mb-8 -mx-5 md:mx-0 px-5 md:px-0 overflow-x-auto">
          <ul className="flex items-center gap-1 min-w-max">
            {TABS.map((t) => {
              const active = t.value === tab;
              return (
                <li key={t.value}>
                  <Link
                    href={`/write/${story.id}?tab=${t.value}`}
                    className="inline-block px-4 py-3 text-[14px] font-semibold transition-colors"
                    style={{
                      color: active ? 'var(--color-cream)' : 'var(--color-ink-muted)',
                      borderBottom: active
                        ? '2px solid var(--color-signal)'
                        : '2px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >
                    {t.label}
                    {t.value === 'chapters' && chapters.length > 0 && (
                      <span className="ml-2 text-[11px] text-ink-faint font-medium">
                        {chapters.length}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {tab === 'cover' && (
          <Section title="Cover" subtitle="JPEG, PNG or WebP · up to 5 MB · 3:4 looks best. Until you upload one, readers see a typographic default cover.">
            <CoverUploader
              storyId={story.id}
              title={story.title}
              initialCoverUrl={story.coverUrl}
              coverColor={story.coverColor}
            />
          </Section>
        )}

        {tab === 'status' && (
          <Section
            title="Status"
            subtitle={
              story.status === 'draft'
                ? 'Draft — not visible to readers yet. Switch to Ongoing to publish.'
                : story.status === 'ongoing'
                ? 'Live and ongoing. Readers see new chapters in their feed.'
                : story.status === 'complete'
                ? 'Marked complete. Readers see the "complete" badge on the cover.'
                : 'Paused — hidden from discovery but readers can still finish what they started.'
            }
          >
            <div className="flex flex-wrap gap-2">
              <StatusButton storyId={story.id} value="draft" current={story.status} label="Draft" />
              <StatusButton storyId={story.id} value="ongoing" current={story.status} label="Ongoing" />
              <StatusButton storyId={story.id} value="complete" current={story.status} label="Complete" />
            </div>
          </Section>
        )}

        {tab === 'access' && (
          <Section
            title="Access"
            subtitle="Who can see this story, and how the first chapters work."
          >
            <form action={updateStoryDetails} className="space-y-6">
              <input type="hidden" name="storyId" value={story.id} />
              {/* Preserve current title/desc/genre — Access only touches isMature */}
              <input type="hidden" name="title" value={story.title} />
              <input type="hidden" name="description" value={story.description ?? ''} />
              <input type="hidden" name="genre" value={story.genre} />

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-border-soft bg-card hover:bg-card-hi transition-colors">
                <input
                  type="checkbox"
                  name="isMature"
                  defaultChecked={story.isMature}
                  className="mt-0.5 w-4 h-4 accent-signal"
                />
                <div>
                  <div className="text-[15px] font-semibold text-ink">Mature (18+)</div>
                  <div className="text-[13px] text-ink-muted mt-1 max-w-[520px]">
                    Readers without a verified date of birth won't see this story. Use for
                    explicit content — graphic violence, sexual content, heavy themes.
                  </div>
                </div>
              </label>

              <div className="p-4 rounded-xl border border-border-soft bg-card">
                <div className="text-[15px] font-semibold text-ink">First 3 chapters free</div>
                <div className="text-[13px] text-ink-muted mt-1 max-w-[520px]">
                  Always on. Lets readers get hooked before they hit the paywall. You can
                  flip individual chapters between Free / Locked in the Chapters tab.
                </div>
              </div>

              <button type="submit" className="btn-cream">Save access →</button>
            </form>
          </Section>
        )}

        {tab === 'details' && (
          <Section title="Details" subtitle="Title, description and genre — readers see these on the story page.">
            <form action={updateStoryDetails} className="space-y-4">
              <input type="hidden" name="storyId" value={story.id} />
              {/* Mature checkbox lives in Access — preserve current value */}
              {story.isMature && <input type="hidden" name="isMature" value="on" />}

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
                  rows={5}
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

              <button type="submit" className="btn-cream">Save details →</button>
            </form>
          </Section>
        )}

        {tab === 'chapters' && (
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
              <div className="text-center py-12 border border-dashed border-border-soft rounded-xl">
                <p className="text-ink-muted text-[14px] mb-4">
                  No chapters yet — click "Add chapter" above to write your first.
                </p>
              </div>
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

                    <DeleteChapterButton chapterId={ch.id} storyId={story.id} chapterNumber={ch.number} />
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* DANGER ZONE — only on Details, where structural changes already happen. */}
        {tab === 'details' && (
          <div className="mt-12 pt-6 border-t border-border-soft">
            <DeleteStoryButton storyId={story.id} />
          </div>
        )}
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
    <section>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-display font-bold text-[22px] tracking-[-0.01em] text-cream">
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
