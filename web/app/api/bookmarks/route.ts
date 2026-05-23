import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { toggleBookmark, setBookmark } from '@/lib/mutations';

// POST /api/bookmarks  { storyId, action? }
//   action "add"    — idempotent save (used by auto-save on read)
//   action "remove" — idempotent un-save (used by "remove from saved")
//   action omitted  — toggle (used by the Save button)
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let body: { storyId?: string; action?: 'add' | 'remove' | 'toggle' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body.storyId) {
    return NextResponse.json({ error: 'Missing storyId.' }, { status: 400 });
  }

  let bookmarked: boolean;
  if (body.action === 'add') {
    bookmarked = await setBookmark(user.id, body.storyId, true);
  } else if (body.action === 'remove') {
    bookmarked = await setBookmark(user.id, body.storyId, false);
  } else {
    bookmarked = await toggleBookmark(user.id, body.storyId);
  }
  return NextResponse.json({ bookmarked });
}
