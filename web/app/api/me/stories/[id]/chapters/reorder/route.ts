import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { reorderChapters } from '@/lib/mutations';

// POST /api/me/stories/[id]/chapters/reorder  { ids: string[] }
// Re-numbers chapters in the order given. Author-owned only.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { id } = await params;
  let body: { ids?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!Array.isArray(body.ids) || !body.ids.every((x) => typeof x === 'string')) {
    return NextResponse.json({ error: 'Missing ordered ids.' }, { status: 400 });
  }

  try {
    await reorderChapters(user.id, id, body.ids as string[]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not reorder chapters.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
