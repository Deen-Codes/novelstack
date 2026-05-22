'use server';

import { revalidatePath } from 'next/cache';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { adUnlocks, comments, likes } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import { recordRead, addComment, toggleLike as toggleLikeMutation } from '@/lib/mutations';

// Records that a reader watched a rewarded ad to unlock a chapter.
// Revenue fields default to 0 — the ad-network server callback reconciles
// the real amount later (see monetization.md / Flagged for Deen).
export async function recordAdUnlock(chapterId: string) {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'sign_in_required' };

  try {
    await db.insert(adUnlocks).values({ readerId: user.id, chapterId });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'unknown_error' };
  }

  revalidatePath(`/read/${chapterId}`);
  return { ok: true };
}

// Marks a chapter as read so the Library can show "continue reading".
// The genre-affinity signal that powered the home feed is now derived from
// the `reads` table itself (see lib/queries.ts getFeed), so no separate
// reading-events write is needed.
export async function markProgress(chapterId: string) {
  const user = await getSessionUser();
  if (!user) return;

  await recordRead(user.id, chapterId, 100, true);
}

// --- Comments + likes (used by the client Comments component) --------------
export type CommentView = {
  id: string;
  content: string;
  createdAt: string;
  author: { displayName: string; username: string } | null;
};

export type CommentsState = {
  comments: CommentView[];
  likeCount: number;
  liked: boolean;
  userId: string | null;
};

export async function getCommentsState(chapterId: string): Promise<CommentsState> {
  const user = await getSessionUser();

  const rows = await db.query.comments.findMany({
    where: eq(comments.chapterId, chapterId),
    with: { user: true },
    orderBy: [desc(comments.createdAt)],
  });

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(likes)
    .where(eq(likes.chapterId, chapterId));

  let liked = false;
  if (user) {
    const [row] = await db
      .select({ c: likes.chapterId })
      .from(likes)
      .where(sql`${likes.chapterId} = ${chapterId} and ${likes.userId} = ${user.id}`)
      .limit(1);
    liked = !!row;
  }

  return {
    comments: rows.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      author: c.user ? { displayName: c.user.displayName, username: c.user.username } : null,
    })),
    likeCount: Number(count) || 0,
    liked,
    userId: user?.id ?? null,
  };
}

export async function postComment(chapterId: string, content: string) {
  const user = await getSessionUser();
  if (!user) return;
  await addComment(user.id, chapterId, content);
  revalidatePath(`/read/${chapterId}`);
}

export async function toggleChapterLike(chapterId: string) {
  const user = await getSessionUser();
  if (!user) return;
  await toggleLikeMutation(user.id, chapterId);
  revalidatePath(`/read/${chapterId}`);
}
