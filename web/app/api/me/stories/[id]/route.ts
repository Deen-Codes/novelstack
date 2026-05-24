import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { updateStory, deleteStory } from '@/lib/mutations';

// PATCH /api/me/stories/[id]  — partial story update; ownership enforced.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  let body: Parameters<typeof updateStory>[2];
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const story = await updateStory(user.id, id, body);
    if (!story) {
      return NextResponse.json({ error: 'Story not found or not yours.' }, { status: 403 });
    }
    return NextResponse.json(story);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update story.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/me/stories/[id]  — permanently delete a story you own.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  const ok = await deleteStory(user.id, id);
  if (!ok) {
    return NextResponse.json({ error: 'Story not found or not yours.' }, { status: 403 });
  }
  return NextResponse.json({ deleted: true });
}
