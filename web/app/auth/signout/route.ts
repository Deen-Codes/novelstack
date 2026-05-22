import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';

// Signs the user out by clearing the session cookie.
export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/`, { status: 303 });
  response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
