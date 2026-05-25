import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { updateChapter, deleteChapter } from '@/lib/mutations';

// PATCH /api/me/chapters/[id]  { title?, body?, isFree? }  — edit a chapter.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  let body: Parameters<typeof updateChapter>[2];
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const chapter = await updateChapter(user.id, id, body);
    return NextResponse.json(chapter);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update chapter.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/me/chapters/[id]  — remove a chapter you own.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  try {
    const ok = await deleteChapter(user.id, id);
    if (!ok) return NextResponse.json({ error: 'Chapter not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not delete the chapter.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
