// Mobile auth helpers. The session JWT lives in AsyncStorage (lib/api.ts);
// these wrap the API's session endpoint so screens can ask "who am I?".
import { apiGet, getSessionToken, clearSession, mutationSeqNo } from '@/lib/api';
import type { User } from '@/lib/types';

// Cached result of the last session lookup. The top bar asks "who am I?" on
// every screen, so without this each tab switch fires a network request.
// Keyed by token + mutation count: reused freely while nothing changes, and
// refreshed after a sign in/out or any write (e.g. a profile edit).
let cache: { token: string; seq: number; user: User | null; at: number } | null = null;
const USER_TTL = 300000; // 5 min safety cap

// Returns the signed-in user, or null when there is no/invalid session.
export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionToken();
  if (!token) {
    cache = null;
    return null;
  }
  const seq = mutationSeqNo();
  if (
    cache &&
    cache.token === token &&
    cache.seq === seq &&
    Date.now() - cache.at < USER_TTL
  ) {
    return cache.user;
  }
  try {
    const { user } = await apiGet<{ user: User | null }>('/api/auth/session');
    cache = { token, seq, user, at: Date.now() };
    return user;
  } catch {
    // An expired or rejected token — treat as signed out.
    return null;
  }
}

// Lightweight check used by screens that only need a yes/no.
export async function isSignedIn(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}

// Sign out — drop the stored JWT and the cached user.
export async function signOut(): Promise<void> {
  cache = null;
  await clearSession();
}
