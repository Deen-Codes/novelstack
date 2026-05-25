import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { updatePostComment, deletePostComment } from '@/lib/mutations';

// PATCH /api/post-comments/[id]  { body }  — edit your own comment.
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
    const comment = await updatePostComment(user.id, id, payload.body ?? '');
    return NextResponse.json(comment);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update the comment.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/post-comments/[id]  — delete your own comment.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await deletePostComment(user.id, id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not delete the comment.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
