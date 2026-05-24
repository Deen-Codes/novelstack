import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { togglePostLike } from '@/lib/mutations';

// POST /api/posts/[id]/like  — like / unlike an update. Returns { liked, likeCount }.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await togglePostLike(user.id, id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update the like.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
