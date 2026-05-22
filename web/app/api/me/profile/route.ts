import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { updateProfile } from '@/lib/mutations';

// PATCH /api/me/profile  { displayName?, username?, bio?, dateOfBirth? }
export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  let body: Parameters<typeof updateProfile>[1];
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const profile = await updateProfile(user.id, body);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update profile.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
