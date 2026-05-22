import { NextRequest, NextResponse } from 'next/server';
import {
  consumeMagicToken,
  findOrCreateUser,
  signSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from '@/lib/auth';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://novelstack.app';

// GET /api/auth/verify?token=…  — web flow.
// Verifies the magic-link token, sets the session cookie, lands the reader home.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.redirect(`${BASE}/signin?error=missing`);

  const email = await consumeMagicToken(token);
  if (!email) return NextResponse.redirect(`${BASE}/signin?error=expired`);

  const user = await findOrCreateUser(email);
  const jwt = await signSession(user.id);

  const res = NextResponse.redirect(BASE);
  res.cookies.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

// POST /api/auth/verify  { token }  — mobile flow.
// Verifies the token and returns the session JWT for the app to store.
export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body.token) {
    return NextResponse.json({ error: 'Missing token.' }, { status: 400 });
  }

  const email = await consumeMagicToken(body.token);
  if (!email) {
    return NextResponse.json({ error: 'This link is invalid or expired.' }, { status: 401 });
  }

  const user = await findOrCreateUser(email);
  const jwt = await signSession(user.id);
  return NextResponse.json({ token: jwt, user });
}
