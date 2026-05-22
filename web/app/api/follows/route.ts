import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { toggleFollow } from '@/lib/mutations';

// POST /api/follows  { authorId }  — toggle following an author.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let body: { authorId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body.authorId) {
    return NextResponse.json({ error: 'Missing authorId.' }, { status: 400 });
  }

  const following = await toggleFollow(user.id, body.authorId);
  return NextResponse.json({ following });
}
