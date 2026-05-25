// NovelStack — server-side push delivery via the Expo Push service.
// Pairs with the in-app notifications feed: every notify() also fans out a
// lock-screen push to the recipient's devices. All best-effort.
import 'server-only';
import { db } from '@/db';
import { deviceTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

type PushPayload = {
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

// Sends a push to every device the user is signed in on. Dead tokens that
// Expo reports as unregistered are pruned so the table stays clean.
export async function sendPush(userId: string, payload: PushPayload): Promise<void> {
  try {
    const rows = await db
      .select({ token: deviceTokens.token })
      .from(deviceTokens)
      .where(eq(deviceTokens.userId, userId));
    if (rows.length === 0) return;

    const messages = rows.map((r) => ({
      to: r.token,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      sound: 'default' as const,
    }));

    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(messages),
    });

    const json = (await res.json().catch(() => null)) as
      | { data?: Array<{ status?: string; details?: { error?: string } }> }
      | null;
    const tickets = json?.data ?? [];
    for (let i = 0; i < tickets.length; i += 1) {
      const t = tickets[i];
      if (t?.status === 'error' && t?.details?.error === 'DeviceNotRegistered') {
        const dead = messages[i]?.to;
        if (dead) await db.delete(deviceTokens).where(eq(deviceTokens.token, dead));
      }
    }
  } catch {
    // Best-effort — push must never fail the action that triggered it.
  }
}
