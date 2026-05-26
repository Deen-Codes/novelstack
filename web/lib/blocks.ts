// NovelStack — user blocking helpers.
// A block is mutual: if A blocks B (or B blocks A), neither sees the other's
// content (stories, comments, community posts) or appears in lookups for the
// other. Anonymous viewers (no session) are never filtered.
import 'server-only';
import { and, eq, or } from 'drizzle-orm';
import { db } from '@/db';
import { blocks } from '@/db/schema';

// Returns the set of user ids the viewer must not see — the union of:
//   * everyone the viewer has blocked
//   * everyone who has blocked the viewer
// Always returns an empty array when there is no viewer.
export async function getBlockedUserIds(viewerId?: string | null): Promise<string[]> {
  if (!viewerId) return [];
  const rows = await db
    .select({ blockerId: blocks.blockerId, blockedId: blocks.blockedId })
    .from(blocks)
    .where(or(eq(blocks.blockerId, viewerId), eq(blocks.blockedId, viewerId)));
  const ids = new Set<string>();
  for (const r of rows) {
    if (r.blockerId !== viewerId) ids.add(r.blockerId);
    if (r.blockedId !== viewerId) ids.add(r.blockedId);
  }
  return Array.from(ids);
}

// True if the two users have a block in either direction.
export async function isBlockedBetween(viewerId: string, otherId: string): Promise<boolean> {
  if (viewerId === otherId) return false;
  const [row] = await db
    .select({ b: blocks.blockerId })
    .from(blocks)
    .where(
      or(
        and(eq(blocks.blockerId, viewerId), eq(blocks.blockedId, otherId)),
        and(eq(blocks.blockerId, otherId), eq(blocks.blockedId, viewerId)),
      ),
    )
    .limit(1);
  return !!row;
}

// True if the viewer (the acting user) has blocked the other user — used by
// the profile-screen button to show "Unblock" vs "Block".
export async function hasBlocked(viewerId: string, otherId: string): Promise<boolean> {
  if (viewerId === otherId) return false;
  const [row] = await db
    .select({ b: blocks.blockerId })
    .from(blocks)
    .where(and(eq(blocks.blockerId, viewerId), eq(blocks.blockedId, otherId)))
    .limit(1);
  return !!row;
}

// Idempotent block create. Returns true if the user is now blocked.
export async function blockUser(viewerId: string, otherId: string): Promise<boolean> {
  if (viewerId === otherId) return false;
  await db
    .insert(blocks)
    .values({ blockerId: viewerId, blockedId: otherId })
    .onConflictDoNothing();
  return true;
}

// Idempotent block remove. Returns false (now unblocked).
export async function unblockUser(viewerId: string, otherId: string): Promise<boolean> {
  await db
    .delete(blocks)
    .where(and(eq(blocks.blockerId, viewerId), eq(blocks.blockedId, otherId)));
  return false;
}

// Returns the set of users the viewer has blocked (used by the "Blocked users"
// screen) — only the viewer-initiated blocks, not the reverse direction.
export async function listBlockedUsers(viewerId: string) {
  const rows = await db.query.blocks.findMany({
    where: eq(blocks.blockerId, viewerId),
    orderBy: (b, { desc }) => [desc(b.createdAt)],
  });
  if (rows.length === 0) return [];
  // Hand-join to users so we don't pull in their stories.
  const ids = rows.map((r) => r.blockedId);
  const users = await db.query.users.findMany({
    where: (u, { inArray }) => inArray(u.id, ids),
    columns: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  });
  // Preserve created-at ordering from the blocks query.
  const idx = new Map(ids.map((id, i) => [id, i]));
  return users
    .slice()
    .sort((a, b) => (idx.get(a.id) ?? 0) - (idx.get(b.id) ?? 0));
}
