import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getPostDetail } from '@/lib/queries';
import { updatePost, deletePost } from '@/lib/mutations';

// GET /api/posts/[id]  — a single update with its author, attached book,
// comment thread and like state.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  const post = await getPostDetail(id, user.id);
  if (!post) return NextResponse.json({ error: 'Update not found.' }, { status: 404 });
  return NextResponse.json(post);
}

// PATCH /api/posts/[id]  { body }  — edit your own update.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  let payload: { body?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  try {
    const post = await updatePost(user.id, id, payload.body ?? '');
    return NextResponse.json(post);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update the post.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/posts/[id]  — delete your own update.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await deletePost(user.id, id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not delete the post.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
