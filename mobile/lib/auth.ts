// Mobile auth helpers. The session JWT lives in AsyncStorage (lib/api.ts);
// these wrap the API's session endpoint so screens can ask "who am I?".
import { apiGet, getSessionToken, clearSession } from '@/lib/api';
import type { User } from '@/lib/types';

// Returns the signed-in user, or null when there is no/invalid session.
export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    const { user } = await apiGet<{ user: User | null }>('/api/auth/session');
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

// Sign out — drop the stored JWT.
export async function signOut(): Promise<void> {
  await clearSession();
}
