import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { createReport } from '@/lib/mutations';

// POST /api/reports  { storyId?, chapterId?, reason, detail? }  — file a report.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let payload: {
    storyId?: string | null;
    chapterId?: string | null;
    reason?: string;
    detail?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const report = await createReport(user.id, {
      storyId: payload.storyId ?? null,
      chapterId: payload.chapterId ?? null,
      reason: payload.reason ?? '',
      detail: payload.detail ?? null,
    });
    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not file the report.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
