import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { toggleBookmark } from '@/lib/mutations';

// POST /api/bookmarks  { storyId }  — toggle a story bookmark.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let body: { storyId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body.storyId) {
    return NextResponse.json({ error: 'Missing storyId.' }, { status: 400 });
  }

  const bookmarked = await toggleBookmark(user.id, body.storyId);
  return NextResponse.json({ bookmarked });
}
