// NovelStack — read data layer (Drizzle over Render Postgres).
// These typed functions replace every Supabase read. Website server components
// call them directly; the mobile API route handlers wrap them over HTTP.
import 'server-only';
import { and, asc, desc, eq, ilike, ne, or, sql } from 'drizzle-orm';
import { db } from '@/db';
import { stories, chapters, chapterContent, bookmarks, follows, reads, subscriptions, adUnlocks } from '@/db/schema';

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
export async function getSavedStories(userId: string) {
  const rows = await db.query.bookmarks.findMany({
    where: eq(bookmarks.readerId, userId),
    with: { story: { with: { author: true } } },
    orderBy: [desc(bookmarks.createdAt)],
  });
  return rows.map((r) => r.story);
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

export async function getAuthorByUsername(username: string) {
  return db.query.users.findFirst({
    where: (u, { eq: e }) => e(u.username, username),
    with: { stories: { where: ne(stories.status, 'draft'), orderBy: [desc(stories.totalReads)] } },
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
