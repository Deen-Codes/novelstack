// NovelStack — write data layer (Drizzle over Render Postgres).
// Every function takes the acting user's id and enforces ownership itself —
// this is where the old Supabase row-level-security rules now live.
import 'server-only';
import { and, eq, isNotNull, ne, sql } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { db } from '@/db';
import {
  stories,
  chapters,
  chapterContent,
  bookmarks,
  follows,
  likes,
  reads,
  comments,
  users,
  posts,
  postComments,
  postLikes,
  tips,
  adUnlocks,
  reports,
  notifications,
} from '@/db/schema';

// Records a notification for `userId`. Self-actions are skipped, and a
// failure here never breaks the action that triggered it.
async function notify(opts: {
  userId: string;
  kind: string;
  actorId?: string | null;
  postId?: string | null;
  storyId?: string | null;
}) {
  if (opts.actorId && opts.actorId === opts.userId) return;
  try {
    await db.insert(notifications).values({
      userId: opts.userId,
      kind: opts.kind,
      actorId: opts.actorId ?? null,
      postId: opts.postId ?? null,
      storyId: opts.storyId ?? null,
    });
  } catch {
    // Best-effort — notifications must not fail the parent write.
  }
}

type Genre = typeof stories.$inferSelect.genre;
type Status = typeof stories.$inferSelect.status;

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'story';
  return `${base}-${randomBytes(3).toString('hex')}`;
}

function summarise(body: string) {
  // Strip the fiction-markdown syntax so word counts are accurate and the
  // excerpt (shown to locked readers) never surfaces a stray ** or image tag.
  const plain = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // illustrations
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // headings
    .replace(/^\s{0,3}>\s?/gm, '') // blockquotes
    .replace(/^\s*(?:\*\s*){3,}\s*$/gm, ' ') // scene breaks (* * *)
    .replace(/^\s*[-_]{3,}\s*$/gm, ' ') // scene breaks (--- / ___)
    .replace(/\*\*|__/g, '') // bold markers
    .replace(/(?<!\w)[*_](?=\S)|(?<=\S)[*_](?!\w)/g, '') // italic markers
    .trim();
  const words = plain.split(/\s+/).filter(Boolean);
  return {
    wordCount: words.length,
    pageCount: Math.max(1, Math.ceil(words.length / 250)),
    excerpt: words.slice(0, 60).join(' '),
  };
}

// --- Social toggles — return the new state (true = on) ---------------------
export async function toggleBookmark(userId: string, storyId: string): Promise<boolean> {
  const [row] = await db
    .select({ s: bookmarks.storyId })
    .from(bookmarks)
    .where(and(eq(bookmarks.readerId, userId), eq(bookmarks.storyId, storyId)))
    .limit(1);
  if (row) {
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.readerId, userId), eq(bookmarks.storyId, storyId)));
    return false;
  }
  await db.insert(bookmarks).values({ readerId: userId, storyId });
  return true;
}

// Idempotent bookmark set — used by "remove from saved" and by auto-save when
// a reader opens a story. Unlike toggleBookmark this never flips an unintended
// direction: add stays added, remove stays removed.
export async function setBookmark(
  userId: string,
  storyId: string,
  on: boolean,
): Promise<boolean> {
  if (on) {
    await db.insert(bookmarks).values({ readerId: userId, storyId }).onConflictDoNothing();
    return true;
  }
  await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.readerId, userId), eq(bookmarks.storyId, storyId)));
  return false;
}

export async function toggleFollow(userId: string, authorId: string): Promise<boolean> {
  if (userId === authorId) return false;
  const [row] = await db
    .select({ a: follows.authorId })
    .from(follows)
    .where(and(eq(follows.followerId, userId), eq(follows.authorId, authorId)))
    .limit(1);
  if (row) {
    await db
      .delete(follows)
      .where(and(eq(follows.followerId, userId), eq(follows.authorId, authorId)));
    return false;
  }
  await db.insert(follows).values({ followerId: userId, authorId });
  await notify({ userId: authorId, kind: 'follow', actorId: userId });
  return true;
}

export async function toggleLike(userId: string, chapterId: string): Promise<boolean> {
  const [row] = await db
    .select({ c: likes.chapterId })
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.chapterId, chapterId)))
    .limit(1);
  if (row) {
    await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.chapterId, chapterId)));
    return false;
  }
  await db.insert(likes).values({ userId, chapterId });
  return true;
}

// --- Reading progress — one row per reader+chapter, upserted ---------------
export async function recordRead(
  userId: string,
  chapterId: string,
  progressPct: number,
  completed: boolean,
): Promise<void> {
  const completedAt = completed ? new Date() : null;
  await db
    .insert(reads)
    .values({ readerId: userId, chapterId, progressPct, completedAt })
    .onConflictDoUpdate({
      target: [reads.readerId, reads.chapterId],
      set: { progressPct, completedAt },
    });
}

// Marks every published chapter of a story as read for this reader — backs
// the reader's "Finish book" / "All caught up" action, so the book moves to
// the Completed & up-to-date shelf.
export async function markStoryCaughtUp(userId: string, storyId: string) {
  const chs = await db
    .select({ id: chapters.id })
    .from(chapters)
    .where(and(eq(chapters.storyId, storyId), isNotNull(chapters.publishedAt)));
  for (const c of chs) {
    await recordRead(userId, c.id, 100, true);
  }
  return { ok: true, chapters: chs.length };
}

// --- Comments --------------------------------------------------------------
export async function addComment(
  userId: string,
  chapterId: string,
  content: string,
  parentId?: string,
) {
  const text = content.trim();
  if (!text) throw new Error('Comment is empty.');
  const [row] = await db
    .insert(comments)
    .values({ userId, chapterId, content: text, parentId: parentId ?? null })
    .returning();
  return row;
}

// --- Stories (write flow) --------------------------------------------------
// Community — create an author update, optionally attaching one of the
// author's own books. Updates are short and never touch reading progress.
export async function createPost(
  authorId: string,
  body: string,
  storyId: string | null,
) {
  const text = body.trim();
  if (!text) throw new Error('Write something to share.');
  if (text.length > 500) throw new Error('Updates are limited to 500 characters.');
  if (storyId) {
    const [own] = await db
      .select({ id: stories.id })
      .from(stories)
      .where(and(eq(stories.id, storyId), eq(stories.authorId, authorId)))
      .limit(1);
    if (!own) throw new Error('You can only attach one of your own books.');
  }
  const [row] = await db
    .insert(posts)
    .values({ authorId, body: text, storyId: storyId ?? null })
    .returning();
  return row;
}

// Tips — a reader-to-writer tip. This row is the ledger; settlement runs
// through Stripe later. Charging isn't wired yet, so this captures intent.
export async function createTip(
  senderId: string,
  data: { recipientId: string; storyId?: string | null; amount: number; message?: string | null },
) {
  if (!data.recipientId || data.recipientId === senderId) {
    throw new Error('You cannot tip yourself.');
  }
  const amount = Math.round(Number(data.amount));
  if (!Number.isFinite(amount) || amount < 300) {
    throw new Error('Tips start at $3.');
  }
  const [row] = await db
    .insert(tips)
    .values({
      senderId,
      recipientId: data.recipientId,
      storyId: data.storyId ?? null,
      amountCents: amount,
      message: data.message?.trim() || null,
    })
    .returning();
  await notify({
    userId: data.recipientId,
    kind: 'tip',
    actorId: senderId,
    storyId: data.storyId ?? null,
  });
  return row;
}

// Records a rewarded-ad unlock so the chapter opens for this reader — the
// reader entitlement check in getChapterForReader looks for this row.
export async function unlockChapter(userId: string, chapterId: string) {
  if (!chapterId) throw new Error('Missing chapter.');
  await db.insert(adUnlocks).values({ readerId: userId, chapterId });
  return { ok: true };
}

// Files a content report against a story or chapter.
export async function createReport(
  reporterId: string,
  data: {
    storyId?: string | null;
    chapterId?: string | null;
    reason: string;
    detail?: string | null;
  },
) {
  const reason = (data.reason || '').trim();
  if (!reason) throw new Error('Choose a reason for the report.');
  if (!data.storyId && !data.chapterId) throw new Error('Nothing to report.');
  const [row] = await db
    .insert(reports)
    .values({
      reporterId,
      storyId: data.storyId ?? null,
      chapterId: data.chapterId ?? null,
      reason,
      detail: data.detail?.trim() || null,
    })
    .returning();
  return row;
}

// Community — edit / delete your own update.
export async function updatePost(userId: string, postId: string, body: string) {
  const text = body.trim();
  if (!text) throw new Error('Write something to share.');
  if (text.length > 500) throw new Error('Updates are limited to 500 characters.');
  const [row] = await db
    .update(posts)
    .set({ body: text })
    .where(and(eq(posts.id, postId), eq(posts.authorId, userId)))
    .returning();
  if (!row) throw new Error('That update is not yours, or no longer exists.');
  return row;
}

export async function deletePost(userId: string, postId: string) {
  const [row] = await db
    .delete(posts)
    .where(and(eq(posts.id, postId), eq(posts.authorId, userId)))
    .returning({ id: posts.id });
  if (!row) throw new Error('That update is not yours, or no longer exists.');
  return { ok: true };
}

// Community — edit / delete your own comment.
export async function updatePostComment(userId: string, commentId: string, body: string) {
  const text = body.trim();
  if (!text) throw new Error('Write a comment.');
  if (text.length > 500) throw new Error('Comments are limited to 500 characters.');
  const [row] = await db
    .update(postComments)
    .set({ body: text })
    .where(and(eq(postComments.id, commentId), eq(postComments.userId, userId)))
    .returning();
  if (!row) throw new Error('That comment is not yours, or no longer exists.');
  return row;
}

export async function deletePostComment(userId: string, commentId: string) {
  const [row] = await db
    .delete(postComments)
    .where(and(eq(postComments.id, commentId), eq(postComments.userId, userId)))
    .returning({ id: postComments.id });
  if (!row) throw new Error('That comment is not yours, or no longer exists.');
  return { ok: true };
}

// Community — reply to an update.
export async function createPostComment(userId: string, postId: string, body: string) {
  const text = body.trim();
  if (!text) throw new Error('Write a comment.');
  if (text.length > 500) throw new Error('Comments are limited to 500 characters.');
  const [post] = await db
    .select({ id: posts.id, authorId: posts.authorId })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);
  if (!post) throw new Error('That update no longer exists.');
  const [row] = await db
    .insert(postComments)
    .values({ postId, userId, body: text })
    .returning();
  await notify({ userId: post.authorId, kind: 'post_comment', actorId: userId, postId });
  return row;
}

// Community — like / unlike an update. Returns the new state and total.
export async function togglePostLike(userId: string, postId: string) {
  const [existing] = await db
    .select()
    .from(postLikes)
    .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
    .limit(1);
  if (existing) {
    await db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
  } else {
    await db.insert(postLikes).values({ postId, userId });
    const [post] = await db
      .select({ authorId: posts.authorId })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);
    if (post) {
      await notify({ userId: post.authorId, kind: 'post_like', actorId: userId, postId });
    }
  }
  const [{ n }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(postLikes)
    .where(eq(postLikes.postId, postId));
  return { liked: !existing, likeCount: n };
}

export async function createStory(
  authorId: string,
  data: {
    title: string;
    description?: string;
    genre?: Genre;
    isMature?: boolean;
    coverColor?: string;
    coverUrl?: string;
  },
) {
  const [row] = await db
    .insert(stories)
    .values({
      authorId,
      title: data.title.trim() || 'Untitled story',
      slug: slugify(data.title || 'untitled-story'),
      description: data.description ?? null,
      genre: data.genre ?? 'other',
      isMature: data.isMature ?? false,
      coverColor: data.coverColor ?? '#D85A30',
      coverUrl: data.coverUrl ?? null,
      status: 'draft',
    })
    .returning();
  return row;
}

// Updates a story only if it belongs to the acting user. Returns null if not.
export async function updateStory(
  authorId: string,
  storyId: string,
  patch: Partial<{
    title: string;
    description: string;
    genre: Genre;
    isMature: boolean;
    coverColor: string;
    coverUrl: string;
  }>,
) {
  const [row] = await db
    .update(stories)
    .set({ ...patch, updatedAt: new Date() })
    .where(and(eq(stories.id, storyId), eq(stories.authorId, authorId)))
    .returning();
  return row ?? null;
}

export async function setStoryStatus(authorId: string, storyId: string, status: Status) {
  const goingLive = status === 'ongoing' || status === 'complete';
  const [row] = await db
    .update(stories)
    .set({
      status,
      updatedAt: new Date(),
      ...(goingLive ? { publishedAt: sql`coalesce(${stories.publishedAt}, now())` } : {}),
    })
    .where(and(eq(stories.id, storyId), eq(stories.authorId, authorId)))
    .returning();
  return row ?? null;
}

// Deletes a story — only if it belongs to the acting user. Its chapters,
// chapter content, bookmarks, reads, comments and likes are removed too via
// the schema's ON DELETE CASCADE foreign keys. Returns true if removed.
export async function deleteStory(authorId: string, storyId: string): Promise<boolean> {
  const rows = await db
    .delete(stories)
    .where(and(eq(stories.id, storyId), eq(stories.authorId, authorId)))
    .returning({ id: stories.id });
  return rows.length > 0;
}

// --- Chapters --------------------------------------------------------------
async function ownsStory(authorId: string, storyId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: stories.id })
    .from(stories)
    .where(and(eq(stories.id, storyId), eq(stories.authorId, authorId)))
    .limit(1);
  return !!row;
}

export async function createChapter(
  authorId: string,
  storyId: string,
  data: { title: string; body: string; isFree?: boolean },
) {
  if (!(await ownsStory(authorId, storyId))) throw new Error('Not your story.');
  const [{ max }] = await db
    .select({ max: sql<number>`coalesce(max(${chapters.number}), 0)` })
    .from(chapters)
    .where(eq(chapters.storyId, storyId));
  const { wordCount, pageCount, excerpt } = summarise(data.body);
  const [chapter] = await db
    .insert(chapters)
    .values({
      storyId,
      number: Number(max) + 1,
      title: data.title.trim() || `Chapter ${Number(max) + 1}`,
      excerpt,
      wordCount,
      pageCount,
      isFree: data.isFree ?? Number(max) < 3, // first 3 chapters free by default
      publishedAt: new Date(),
    })
    .returning();
  await db.insert(chapterContent).values({ chapterId: chapter.id, body: data.body });
  return chapter;
}

export async function updateChapter(
  authorId: string,
  chapterId: string,
  data: Partial<{ title: string; body: string; isFree: boolean }>,
) {
  const chapter = await db.query.chapters.findFirst({
    where: eq(chapters.id, chapterId),
    with: { story: true },
  });
  if (!chapter || chapter.story.authorId !== authorId) throw new Error('Not your chapter.');

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (data.title !== undefined) patch.title = data.title.trim();
  if (data.isFree !== undefined) patch.isFree = data.isFree;
  if (data.body !== undefined) {
    const { wordCount, pageCount, excerpt } = summarise(data.body);
    patch.wordCount = wordCount;
    patch.pageCount = pageCount;
    patch.excerpt = excerpt;
    await db
      .insert(chapterContent)
      .values({ chapterId, body: data.body })
      .onConflictDoUpdate({ target: chapterContent.chapterId, set: { body: data.body } });
  }
  const [row] = await db.update(chapters).set(patch).where(eq(chapters.id, chapterId)).returning();
  return row;
}

// Deletes a chapter the author owns, then closes the gap so the remaining
// chapter numbers stay contiguous (1, 2, 3 …). Body, reads, comments and
// ad-unlocks for the chapter cascade away with the row.
export async function deleteChapter(authorId: string, chapterId: string): Promise<boolean> {
  const chapter = await db.query.chapters.findFirst({
    where: eq(chapters.id, chapterId),
    with: { story: true },
  });
  if (!chapter || chapter.story.authorId !== authorId) throw new Error('Not your chapter.');

  await db.delete(chapters).where(eq(chapters.id, chapterId));
  // Renumber what's left so there's never a missing "Chapter N".
  await db.execute(sql`
    with ordered as (
      select id, row_number() over (order by number) as rn
      from chapters where story_id = ${chapter.storyId}
    )
    update chapters c set number = o.rn, updated_at = now()
    from ordered o where c.id = o.id and c.number <> o.rn
  `);
  return true;
}

// --- Profile ---------------------------------------------------------------
export async function updateProfile(
  userId: string,
  patch: Partial<{
    displayName: string;
    username: string;
    bio: string;
    dateOfBirth: string;
    avatarUrl: string;
  }>,
) {
  const next = { ...patch };
  // Username changes: validate format and enforce uniqueness with a clean
  // error rather than letting the raw DB constraint violation surface.
  if (next.username !== undefined) {
    const uname = next.username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(uname)) {
      throw new Error('Username must be 3–24 characters — letters, numbers and underscores only.');
    }
    const [taken] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.username, uname), ne(users.id, userId)))
      .limit(1);
    if (taken) throw new Error('That username is already taken.');
    next.username = uname;
  }
  const [row] = await db
    .update(users)
    .set({ ...next, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return row ?? null;
}
