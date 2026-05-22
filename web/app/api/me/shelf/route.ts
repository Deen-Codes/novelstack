import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getSavedStories, getMyStories, getFollowing } from '@/lib/queries';

// GET /api/me/shelf  — the signed-in reader's saved stories, own stories, follows.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const [saved, writing, following] = await Promise.all([
    getSavedStories(user.id),
    getMyStories(user.id),
    getFollowing(user.id),
  ]);
  return NextResponse.json({ saved, writing, following });
}
