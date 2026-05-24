import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getNotifications } from '@/lib/queries';

// GET /api/notifications  — the signed-in reader's notification feed.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const items = await getNotifications(user.id);
  return NextResponse.json(items);
}
