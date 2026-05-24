// NovelStack — read data layer (Drizzle over Render Postgres).
// These typed functions replace every Supabase read. Website server components
// call them directly; the mobile API route handlers wrap them over HTTP.
import 'server-only';
import { and, asc, desc, eq, ilike, inArray, isNotNull, ne, or, sql } from 'drizzle-orm';
import { db } from '@/db';
import { stories, chapters, chapterContent, bookmarks, follows, reads, subscriptions, adUnlocks, comments, posts } from '@/db/schema';

// 18 is adult. Mature stories stay hidden until a date of birth proves it.
export function isAdult(dateOfBirth: string | null | undefined): boolean {
  if (!dateOfBirth) return false;
  const dob = new Date(dateOfBirth);
  const eighteen = new Date();
  eighteen.setFullYear(eighteen.getFullYear() - 18);
  return dob <= eighteen;
}

// ============================================================
// FEED — transparent rule-based ranking (ported from the old feed.ts).
// score = follow-graph + genre-affinity + recency + popularity.
// ============================================================
const WEIGHTS = { follow: 4.0, affinity: 2.5, recency: 2.0, popular: 1.5 };

export type FeedStory = Awaited<ReturnType<typeof feedCandidates>>[number] & {
  _score: number;
  _reason: string;
};

function feedCandidates(where: ReturnType<typeof and>) {
  return db.query.stories.findMany({
    where,
    with: { author: true },
    orderBy: [desc(stories.publishedAt)],
    limit: 80,
  });
}

export async function getFeed(opts: {
  genre?: string;
  query?: string;
  viewerId?: string;
  viewerIsAdult?: boolean;
}): Promise<FeedStory[]> {
  const conds = [ne(stories.status, 'draft')];
  if (!opts.viewerIsAdult) conds.push(eq(stories.isMature, false));
  if (opts.genre) conds.push(eq(stories.genre, opts.genre as typeof stories.$inferSelect.genre));
  if (opts.query?.trim()) {
    const t = `%${opts.query.trim()}%`;
    conds.push(or(ilike(stories.title, t), ilike(stories.description, t))!);
  }

  const candidates = await feedCandidates(and(...conds));

  // Viewer signals: who they follow + which genres they've been reading.
  let followed = new Set<string>();
  const affinity: Record<string, number> = {};
  if (opts.viewerId) {
    const fRows = await db
      .select({ authorId: follows.authorId })
      .from(follows)
      .where(eq(follows.followerId, opts.viewerId));
    followed = new Set(fRows.map((r) => r.authorId));

    const gRows = await db
      .select({ genre: stories.genre })
      .from(reads)
      .innerJoin(chapters, eq(chapters.id, reads.chapterId))
      .innerJoin(stories, eq(stories.id, chapters.storyId))
      .where(eq(reads.readerId, opts.viewerId))
      .orderBy(desc(reads.createdAt))
      .limit(100);
    const total = gRows.length || 1;
    for (const r of gRows) affinity[r.genre] = (affinity[r.genre] ?? 0) + 1 / total;
  }

  const now = Date.now();
  const scored: FeedStory[] = candidates.map((s) => {
    const published = s.publishedAt ? new Date(s.publishedAt).getTime() : now;
    const days = Math.max(0, (now - published) / 86_400_000);
    const recency = 1 / (1 + days / 7);
    const popular = Math.min(1, Math.log10((s.totalReads ?? 0) + 1) / 6);
    const isFollowed = followed.has(s.authorId);
    const aff = affinity[s.genre] ?? 0;
    const score =
      WEIGHTS.follow * (isFollowed ? 1 : 0) +
      WEIGHTS.affinity * aff +
      WEIGHTS.recency * recency +
      WEIGHTS.popular * popular;
    const reason = isFollowed
      ? 'From a writer you follow'
      : aff > 0
      ? `Because you've been reading ${s.genre}`
      : days < 7
      ? 'New this week'
      : 'Popular on NovelStack';
    return { ...s, _score: score, _reason: reason };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored;
}

// ============================================================
// STORY + CHAPTERS
// ============================================================
export async function getStoryBySlug(slug: string) {
  return db.query.stories.findFirst({
    where: eq(stories.slug, slug),
    with: {
      author: true,
      chapters: { orderBy: [asc(chapters.number)] },
    },
  });
}

export async function getAuthorStories(authorId: string, includeDrafts = false) {
  return db.query.stories.findMany({
    where: includeDrafts
      ? eq(stories.authorId, authorId)
      : and(eq(stories.authorId, authorId), ne(stories.status, 'draft')),
    orderBy: [desc(stories.totalReads)],
  });
}

// A chapter plus its story/author, and its body only if the viewer may read it:
// the chapter is free, the viewer is the author, an active subscriber, or has
// unlocked it with an ad.
export async function getChapterForReader(chapterId: string, viewerId?: string) {
  const chapter = await db.query.chapters.findFirst({
    where: eq(chapters.id, chapterId),
    with: { story: { with: { author: true } } },
  });
  if (!chapter) return null;

  let canRead = chapter.isFree;
  if (!canRead && viewerId) {
    if (chapter.story.authorId === viewerId) {
      canRead = true;
    } else {
      const [sub] = await db
        .select({ id: subscriptions.id })
        .from(subscriptions)
        .where(and(eq(subscriptions.readerId, viewerId), eq(subscriptions.status, 'active')))
        .limit(1);
      if (sub) canRead = true;
      if (!canRead) {
        const [unlock] = await db
          .select({ id: adUnlocks.id })
          .from(adUnlocks)
          .where(and(eq(adUnlocks.chapterId, chapterId), eq(adUnlocks.readerId, viewerId)))
          .limit(1);
        if (unlock) canRead = true;
      }
    }
  }

  let body: string | null = null;
  if (canRead) {
    const content = await db.query.chapterContent.findFirst({
      where: eq(chapterContent.chapterId, chapterId),
    });
    body = content?.body ?? '';
  }
  return { ...chapter, body, locked: !canRead };
}

// ============================================================
// PERSONAL SHELF
// ============================================================
// Saved stories, each tagged with the reader's progress: how many published
// chapters they've completed out of the total. Lets the app split the shelf
// into "in progress" and "completed", and show a progress bar.
export async function getSavedStories(userId: string) {
  const rows = await db.query.bookmarks.findMany({
    where: eq(bookmarks.readerId, userId),
    with: { story: { with: { author: true } } },
    orderBy: [desc(bookmarks.createdAt)],
  });
  const list = rows.map((r) => r.story);
  if (list.length === 0) return list;

  const ids = list.map((s) => s.id);
  const totals = await db
    .select({ storyId: chapters.storyId, n: sql<number>`count(*)::int` })
    .from(chapters)
    .where(and(inArray(chapters.storyId, ids), isNotNull(chapters.publishedAt)))
    .groupBy(chapters.storyId);
  const dones = await db
    .select({ storyId: chapters.storyId, n: sql<number>`count(distinct ${chapters.id})::int` })
    .from(reads)
    .innerJoin(chapters, eq(chapters.id, reads.chapterId))
    .where(
      and(
        eq(reads.readerId, userId),
        inArray(chapters.storyId, ids),
        isNotNull(reads.completedAt),
        isNotNull(chapters.publishedAt),
      ),
    )
    .groupBy(chapters.storyId);

  const totalMap = new Map(totals.map((t) => [t.storyId, t.n]));
  const doneMap = new Map(dones.map((d) => [d.storyId, d.n]));
  return list.map((s) => ({
    ...s,
    progress: { completed: doneMap.get(s.id) ?? 0, total: totalMap.get(s.id) ?? 0 },
  }));
}

export async function getMyStories(userId: string) {
  return db.query.stories.findMany({
    where: eq(stories.authorId, userId),
    orderBy: [desc(stories.updatedAt)],
  });
}

export async function getFollowing(userId: string) {
  const rows = await db.query.follows.findMany({
    where: eq(follows.followerId, userId),
    with: { author: true },
  });
  return rows.map((r) => r.author);
}

// ============================================================
// COMMUNITY — the author-updates feed
// ============================================================
// Update posts from the writers the reader follows, plus their own, newest
// first, each with the author and any attached book.
export async function getCommunityFeed(userId: string) {
  const myFollows = await db
    .select({ authorId: follows.authorId })
    .from(follows)
    .where(eq(follows.followerId, userId));
  const authorIds = [userId, ...myFollows.map((f) => f.authorId)];
  return db.query.posts.findMany({
    where: inArray(posts.authorId, authorIds),
    with: { author: true, story: true },
    orderBy: [desc(posts.createdAt)],
    limit: 50,
  });
}

// ============================================================
// HOME — "continue reading" + reading streak (mobile home screen)
// ============================================================
// The reader's most recently opened chapter, with the story it belongs to
// and how far they got. Powers the home screen's "Continue reading" card.
export async function getContinueReading(userId: string) {
  const [row] = await db
    .select({
      progressPct: reads.progressPct,
      completedAt: reads.completedAt,
      chapterId: chapters.id,
      chapterNumber: chapters.number,
      chapterTitle: chapters.title,
      storyId: stories.id,
      storySlug: stories.slug,
      storyTitle: stories.title,
      coverUrl: stories.coverUrl,
      coverColor: stories.coverColor,
    })
    .from(reads)
    .innerJoin(chapters, eq(chapters.id, reads.chapterId))
    .innerJoin(stories, eq(stories.id, chapters.storyId))
    .where(eq(reads.readerId, userId))
    .orderBy(desc(reads.createdAt))
    .limit(1);
  if (!row) return null;

  const [counted] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(chapters)
    .where(and(eq(chapters.storyId, row.storyId), isNotNull(chapters.publishedAt)));
  const [doneRow] = await db
    .select({ done: sql<number>`count(distinct ${chapters.id})::int` })
    .from(reads)
    .innerJoin(chapters, eq(chapters.id, reads.chapterId))
    .where(
      and(
        eq(reads.readerId, userId),
        eq(chapters.storyId, row.storyId),
        isNotNull(reads.completedAt),
        isNotNull(chapters.publishedAt),
      ),
    );
  const total = counted?.total ?? 0;
  // Whole-book completion — every published chapter finished. When a writer
  // posts a new chapter the total rises, so the book re-opens as in-progress.
  const storyCompleted = total > 0 && (doneRow?.done ?? 0) >= total;
  return { ...row, totalChapters: total, storyCompleted };
}

// Count of consecutive days (ending today or yesterday) on which the reader
// opened at least one chapter — the home screen's streak chip.
export async function getReadingStreak(userId: string): Promise<number> {
  const rows = await db
    .select({ day: sql<string>`to_char(${reads.createdAt} at time zone 'UTC', 'YYYY-MM-DD')` })
    .from(reads)
    .where(eq(reads.readerId, userId))
    .groupBy(sql`to_char(${reads.createdAt} at time zone 'UTC', 'YYYY-MM-DD')`);

  const days = new Set(rows.map((r) => r.day));
  if (days.size === 0) return 0;

  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const cursor = new Date();
  // The streak is still "alive" if they read today or yesterday.
  if (!days.has(iso(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!days.has(iso(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(iso(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export async function getAuthorByUsername(username: string) {
  return db.query.users.findFirst({
    where: (u, { eq: e }) => e(u.username, username),
    with: { stories: { where: ne(stories.status, 'draft'), orderBy: [desc(stories.totalReads)] } },
  });
}

// ============================================================
// COMMENTS
// ============================================================
// A chapter's comments, newest-first, each with its author.
export async function getChapterComments(chapterId: string) {
  return db.query.comments.findMany({
    where: eq(comments.chapterId, chapterId),
    with: {
      user: {
        columns: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
    orderBy: [desc(comments.createdAt)],
  });
}

// ============================================================
// SEARCH
// ============================================================
export async function searchStories(query: string, viewerIsAdult = false) {
  const q = query.trim();
  if (!q) return [];
  const t = `%${q}%`;
  const conds = [
    ne(stories.status, 'draft'),
    or(ilike(stories.title, t), ilike(stories.description, t), sql`${stories.genre}::text ilike ${t}`)!,
  ];
  if (!viewerIsAdult) conds.push(eq(stories.isMature, false));
  return db.query.stories.findMany({
    where: and(...conds),
    with: { author: true },
    orderBy: [desc(stories.totalReads)],
    limit: 24,
  });
}
