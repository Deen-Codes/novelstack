import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import type { User } from '@/lib/types';

// App-wide auth state. The session JWT is persisted in AsyncStorage
// (see lib/api.ts), so it survives app restarts; this hook resolves it
// to the current user via GET /api/auth/session.
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCurrentUser().then((u) => {
      if (cancelled) return;
      setUser(u);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}
