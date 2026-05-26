'use server';

import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth';
import { confirmAdUnlocks } from '@/lib/mutations';

// Admin-only — reconciles a window of pending ad unlocks against the real
// AdMob payout, stamping each row with the per-unlock cents value and
// flipping it to status='confirmed'.
export async function importAdRevenue(formData: FormData): Promise<{
  ok: boolean;
  confirmed?: number;
  error?: string;
}> {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') return { ok: false, error: 'Forbidden.' };

  const centsRaw = String(formData.get('centsPerUnlock') || '');
  const fromStr = String(formData.get('from') || '');
  const toStr = String(formData.get('to') || '');
  const cents = Number(centsRaw);
  if (!Number.isFinite(cents) || cents < 0) {
    return { ok: false, error: 'Cents per unlock must be a non-negative number.' };
  }
  const from = new Date(fromStr);
  const to = new Date(toStr);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return { ok: false, error: 'From and To must be valid dates.' };
  }
  if (from >= to) {
    return { ok: false, error: 'From must be earlier than To.' };
  }

  try {
    const confirmed = await confirmAdUnlocks({ centsPerUnlock: cents, from, to });
    revalidatePath('/admin/payouts');
    return { ok: true, confirmed };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Import failed.' };
  }
}
