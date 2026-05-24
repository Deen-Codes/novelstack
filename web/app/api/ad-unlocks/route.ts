import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { unlockChapter } from '@/lib/mutations';

// POST /api/ad-unlocks  { chapterId }  — record a rewarded-ad chapter unlock.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let payload: { chapterId?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const result = await unlockChapter(user.id, payload.chapterId ?? '');
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not unlock the chapter.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
