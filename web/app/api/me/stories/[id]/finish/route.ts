import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { markStoryCaughtUp } from '@/lib/mutations';

// POST /api/me/stories/[id]/finish  — mark every published chapter read, so
// the book counts as completed / caught up on the reader's shelf.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await markStoryCaughtUp(user.id, id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update the book.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
