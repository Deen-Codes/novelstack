import { NextRequest, NextResponse } from 'next/server';
import { createMagicToken } from '@/lib/auth';
import { sendMagicLinkEmail } from '@/lib/email';

// POST /api/auth/request  { email, platform? }
// Emails a magic-link sign-in. `platform: "mobile"` makes the link a
// novelstack:// deep link; otherwise it's a normal web link.
export async function POST(req: NextRequest) {
  let body: { email?: string; platform?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const token = await createMagicToken(email);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://novelstack.app';
  const link =
    body.platform === 'mobile'
      ? `novelstack://auth-callback?token=${token}`
      : `${base}/api/auth/verify?token=${token}`;

  await sendMagicLinkEmail(email, link);
  return NextResponse.json({ ok: true });
}
