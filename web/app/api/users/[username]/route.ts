import { NextResponse } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import { getSessionUser } from '@/lib/auth';
import { getAuthorByUsername } from '@/lib/queries';
import { hasBlocked } from '@/lib/blocks';
import { db } from '@/db';
import { follows } from '@/db/schema';

// GET /api/users/[username]  — an author profile with their published stories.
// Returns 404 when the viewer (or the author) has blocked the other.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const viewer = await getSessionUser();
  const author = await getAuthorByUsername(username, viewer?.id);
  if (!author) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  // Expose whether the viewer has blocked this author + whether they follow
  // them — drives the mobile profile screen's Block/Unblock and Follow toggles.
  // Always-cheap: how many writers does this author follow? Surfaced in
  // place of a follower count, deliberately — NovelStack doesn't expose a
  // follower number to avoid the popularity-chase loop.
  const followingCountRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(follows)
    .where(eq(follows.followerId, author.id));
  const followingCount = followingCountRow[0]?.count ?? 0;

  const [blockedByMe, followRow] = viewer
    ? await Promise.all([
        hasBlocked(viewer.id, author.id),
        // `follows` has a composite primary key (followerId, authorId) and
        // no `id` column, so select `followerId` just as a presence probe.
        db
          .select({ followerId: follows.followerId })
          .from(follows)
          .where(
            and(eq(follows.followerId, viewer.id), eq(follows.authorId, author.id)),
          )
          .limit(1),
      ])
    : [false, []];
  const followedByMe = followRow.length > 0;
  return NextResponse.json({
    ...author,
    blockedByMe,
    followedByMe,
    followingCount,
  });
}
