import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { setStoryStatus } from '@/lib/mutations';

// POST /api/me/stories/[id]/status  { status }  — publish / pause / etc.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  let body: { status?: Parameters<typeof setStoryStatus>[2] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body.status) {
    return NextResponse.json({ error: 'Missing status.' }, { status: 400 });
  }

  try {
    const story = await setStoryStatus(user.id, id, body.status);
    if (!story) {
      return NextResponse.json({ error: 'Story not found or not yours.' }, { status: 403 });
    }
    return NextResponse.json(story);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update status.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
