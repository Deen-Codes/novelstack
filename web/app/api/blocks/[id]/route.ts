import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { blockUser, unblockUser, hasBlocked } from '@/lib/blocks';

// Block toggle endpoint. `id` is the *user id* of the person being blocked.
// Lives under /api/blocks/[id] rather than /api/users/[id]/block because the
// users tree already routes on [username], and Next.js disallows two
// different dynamic segment names at the same path level.
//
//   POST   /api/blocks/[id]  — block
//   DELETE /api/blocks/[id]  — unblock
//   GET    /api/blocks/[id]  — { blocked: boolean }

async function resolve(
  params: Promise<{ id: string }>,
): Promise<{ viewerId: string; targetId: string } | NextResponse> {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Missing user id.' }, { status: 400 });
  if (id === user.id) {
    return NextResponse.json({ error: 'You cannot block yourself.' }, { status: 400 });
  }
  return { viewerId: user.id, targetId: id };
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolved = await resolve(params);
  if (resolved instanceof NextResponse) return resolved;
  await blockUser(resolved.viewerId, resolved.targetId);
  return NextResponse.json({ blocked: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolved = await resolve(params);
  if (resolved instanceof NextResponse) return resolved;
  await unblockUser(resolved.viewerId, resolved.targetId);
  return NextResponse.json({ blocked: false });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolved = await resolve(params);
  if (resolved instanceof NextResponse) return resolved;
  const blocked = await hasBlocked(resolved.viewerId, resolved.targetId);
  return NextResponse.json({ blocked });
}
