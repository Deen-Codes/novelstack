import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getPostDetail } from '@/lib/queries';

// GET /api/posts/[id]  — a single update with its author, attached book,
// comment thread and like state.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  const post = await getPostDetail(id, user.id);
  if (!post) return NextResponse.json({ error: 'Update not found.' }, { status: 404 });
  return NextResponse.json(post);
}
