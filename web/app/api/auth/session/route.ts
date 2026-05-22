import { NextResponse } from 'next/server';
import { getSessionUser, SESSION_COOKIE } from '@/lib/auth';

// GET /api/auth/session  — the current signed-in user, or null.
export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ user });
}

// DELETE /api/auth/session  — sign out (clears the web session cookie).
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
