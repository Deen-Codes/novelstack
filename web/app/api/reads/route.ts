import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { recordRead } from '@/lib/mutations';

// POST /api/reads  { chapterId, progressPct, completed }  — record reading progress.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let body: { chapterId?: string; progressPct?: number; completed?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body.chapterId) {
    return NextResponse.json({ error: 'Missing chapterId.' }, { status: 400 });
  }

  await recordRead(user.id, body.chapterId, body.progressPct ?? 0, body.completed ?? false);
  return NextResponse.json({ ok: true });
}
