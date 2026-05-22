import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { toggleLike } from '@/lib/mutations';

// POST /api/likes  { chapterId }  — toggle a chapter like.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let body: { chapterId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body.chapterId) {
    return NextResponse.json({ error: 'Missing chapterId.' }, { status: 400 });
  }

  const liked = await toggleLike(user.id, body.chapterId);
  return NextResponse.json({ liked });
}
