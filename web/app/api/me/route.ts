import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { deleteAccount } from '@/lib/mutations';

// DELETE /api/me  — permanently deletes the signed-in user's account and all
// of their data. Required by App Store Guideline 5.1.1(v).
export async function DELETE() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  try {
    const ok = await deleteAccount(user.id);
    if (!ok) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not delete the account.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
