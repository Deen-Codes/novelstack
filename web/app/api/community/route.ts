import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getCommunityFeed } from '@/lib/queries';

// GET /api/community  — the signed-in reader's community feed: update posts
// from the writers they follow, plus their own, newest first.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const feed = await getCommunityFeed(user.id);
  return NextResponse.json(feed);
}
