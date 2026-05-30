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

  // Input is the GROSS AdMob revenue per unlock — the form labels it that way.
  // Backend applies the 70/30 split before stamping rows.
  const centsRaw = String(formData.get('grossCentsPerUnlock') || formData.get('centsPerUnlock') || '');
  const fromStr = String(formData.get('from') || '');
  const toStr = String(formData.get('to') || '');
  const gross = Number(centsRaw);
  if (!Number.isFinite(gross) || gross < 0) {
    return { ok: false, error: 'Gross cents per unlock must be a non-negative number.' };
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
    const confirmed = await confirmAdUnlocks({ grossCentsPerUnlock: gross, from, to });
    revalidatePath('/admin/payouts');
    return { ok: true, confirmed };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Import failed.' };
  }
}
