import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAuthorByUsername } from '@/lib/queries';
import { hasBlocked } from '@/lib/blocks';

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
  // Expose whether the viewer has blocked this author — drives the mobile
  // profile screen's "Block" vs "Unblock" toggle.
  const blockedByMe = viewer ? await hasBlocked(viewer.id, author.id) : false;
  return NextResponse.json({ ...author, blockedByMe });
}
