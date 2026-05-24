import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { createPostComment } from '@/lib/mutations';

// POST /api/posts/[id]/comments  { body }  — reply to an update.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const comment = await createPostComment(user.id, id, payload.body ?? '');
    return NextResponse.json(comment);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not post your comment.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
