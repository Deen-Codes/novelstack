import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getChapterComments } from '@/lib/queries';
import { addComment } from '@/lib/mutations';

// GET /api/comments?chapterId=  — a chapter's comments, newest-first.
export async function GET(req: NextRequest) {
  const chapterId = req.nextUrl.searchParams.get('chapterId');
  if (!chapterId) {
    return NextResponse.json({ error: 'Missing chapterId.' }, { status: 400 });
  }
  const list = await getChapterComments(chapterId);
  return NextResponse.json(list);
}

// POST /api/comments  { chapterId, content, parentId? }  — post a comment.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let body: { chapterId?: string; content?: string; parentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body.chapterId || !body.content) {
    return NextResponse.json({ error: 'Missing chapterId or content.' }, { status: 400 });
  }

  try {
    const comment = await addComment(user.id, body.chapterId, body.content, body.parentId);
    return NextResponse.json(comment);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not post comment.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
