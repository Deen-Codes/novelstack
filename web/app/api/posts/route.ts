import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { createPost } from '@/lib/mutations';

// POST /api/posts  { body, storyId? }  — publish a community update.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let payload: { body?: string; storyId?: string | null };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const post = await createPost(user.id, payload.body ?? '', payload.storyId ?? null);
    return NextResponse.json(post);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not post your update.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
