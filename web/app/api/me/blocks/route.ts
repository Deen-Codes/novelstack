import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { listBlockedUsers } from '@/lib/blocks';

// GET /api/me/blocks  — the signed-in user's blocked-user list.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const list = await listBlockedUsers(user.id);
  return NextResponse.json(list);
}
