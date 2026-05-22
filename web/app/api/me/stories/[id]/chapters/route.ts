import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { createChapter } from '@/lib/mutations';

// POST /api/me/stories/[id]/chapters  { title, body, isFree? }
// Adds a chapter to a story the signed-in user owns.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  let body: { title?: string; body?: string; isFree?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (body.title === undefined || body.body === undefined) {
    return NextResponse.json({ error: 'Missing title or body.' }, { status: 400 });
  }

  try {
    const chapter = await createChapter(user.id, id, {
      title: body.title,
      body: body.body,
      isFree: body.isFree,
    });
    return NextResponse.json(chapter);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create chapter.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
