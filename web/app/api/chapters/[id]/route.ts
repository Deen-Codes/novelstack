import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getChapterForReader } from '@/lib/queries';

// GET /api/chapters/[id]  — a chapter for the reader, body gated by access.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  const chapter = await getChapterForReader(id, user?.id);
  if (!chapter) return NextResponse.json({ error: 'Chapter not found.' }, { status: 404 });
  return NextResponse.json(chapter);
}
