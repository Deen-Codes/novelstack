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

// --- Auth-change notifications --------------------------------------------
// The top bar shows the signed-in avatar on every screen. A plain focus
// effect can miss a sign-out (no re-navigation fires), leaving the previous
// user's initial stuck in the avatar. Screens subscribe here instead so they
// refresh the instant the session changes.
type AuthListener = () => void;
const authListeners = new Set<AuthListener>();

export function subscribeAuthChange(listener: AuthListener): () => void {
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
  };
}

function notifyAuthChange(): void {
  for (const fn of [...authListeners]) fn();
}

// Call after a sign-in completes (auth-callback) so subscribed UI — the top
// bar avatar, the sign-in sheet — refreshes and dismisses right away.
export function markAuthChanged(): void {
  cache = null;
  notifyAuthChange();
}

// Sign out — drop the stored JWT and the cached user, then tell the UI.
export async function signOut(): Promise<void> {
  cache = null;
  await clearSession();
  notifyAuthChange();
}
