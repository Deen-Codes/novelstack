import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { saveDeviceToken } from '@/lib/mutations';

// POST /api/me/push-token  { token, platform }
// Registers an Expo push token for the signed-in user's device.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let body: { token?: string; platform?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body.token) {
    return NextResponse.json({ error: 'Missing token.' }, { status: 400 });
  }

  try {
    await saveDeviceToken(user.id, body.token, body.platform === 'android' ? 'android' : 'ios');
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not save token.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
