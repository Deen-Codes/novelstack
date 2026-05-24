import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { createTip } from '@/lib/mutations';

// POST /api/tips  { recipientId, storyId?, amount, message? }  — tip a writer.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let payload: { recipientId?: string; storyId?: string | null; amount?: number; message?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const tip = await createTip(user.id, {
      recipientId: payload.recipientId ?? '',
      storyId: payload.storyId ?? null,
      amount: payload.amount ?? 0,
      message: payload.message ?? null,
    });
    return NextResponse.json(tip);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not send the tip.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
