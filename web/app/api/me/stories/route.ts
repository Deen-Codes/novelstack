import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { createStory } from '@/lib/mutations';

// POST /api/me/stories  { title, description?, genre?, isMature?, coverColor? }
// Creates a new draft story owned by the signed-in user.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let body: Parameters<typeof createStory>[1] & { title?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body.title) {
    return NextResponse.json({ error: 'Missing title.' }, { status: 400 });
  }

  try {
    const story = await createStory(user.id, body);
    return NextResponse.json(story);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create story.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
