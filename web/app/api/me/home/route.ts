import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getContinueReading, getReadingStreak } from '@/lib/queries';

// GET /api/me/home  — extras for the mobile home screen: the reader's
// "continue reading" pickup and their current reading streak. The story
// feed itself still comes from /api/feed.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const [continueReading, streak] = await Promise.all([
    getContinueReading(user.id),
    getReadingStreak(user.id),
  ]);

  const name = user.displayName && user.displayName !== 'New reader' ? user.displayName : null;
  return NextResponse.json({ continueReading, streak, name });
}
