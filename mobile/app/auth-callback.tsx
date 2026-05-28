import { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { apiGet, apiSend, setSessionToken } from '@/lib/api';
import { markAuthChanged } from '@/lib/auth';
import { registerForPush } from '@/lib/push';
import type { User } from '@/lib/types';
import { colors, spacing, radius } from '@/theme/tokens';

// Deep-link landing for the magic link. The email link bounces the device
// into novelstack://auth-callback?token=… — expo-router parses the token
// straight into this screen's params, so we read it from useLocalSearchParams
// rather than re-parsing the raw URL ourselves. We POST the token to
// /api/auth/verify, store the returned session JWT, and retry once on a
// transient network failure.

function isNetworkError(msg: string) {
  return /network request failed|failed to fetch|network error/i.test(msg);
}

// useLocalSearchParams values can be string | string[] — normalise to string.
function first(v: string | string[] | undefined): string | null {
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

export default function AuthCallback() {
  const params = useLocalSearchParams<{
    token?: string | string[];
    session?: string | string[];
    error?: string | string[];
    error_description?: string | string[];
  }>();
  const token = first(params.token);
  const session = first(params.session);
  const errParam = first(params.error_description) ?? first(params.error);

  const [error, setError] = useState<string | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    // The link carried an explicit error instead of a token.
    if (errParam) {
      handled.current = true;
      setError(String(errParam));
      return;
    }

    // A pre-minted session JWT — the reviewer / test-account login link.
    // No one-time token to exchange: store the session straight away.
    if (session) {
      handled.current = true;
      (async () => {
        try {
          await setSessionToken(session);
          markAuthChanged();
          // Ask for push permission now that they're signed in.
          void registerForPush();
          router.replace('/(tabs)');
        } catch {
          setError('Could not start that session. Open the link again.');
        }
      })();
      return;
    }

    // Params can be empty for a frame while the deep link hydrates — wait
    // for the token rather than failing early.
    if (!token) return;
    handled.current = true;

    (async () => {
      try {
        // Swap the one-time token for a session JWT. A network failure means
        // the request never reached the server, so the token is still
        // unused — safe to retry once.
        const verify = () =>
          apiSend<{ token: string; user: User }>('/api/auth/verify', 'POST', { token });
        let result: { token: string; user: User };
        try {
          result = await verify();
        } catch (e) {
          const msg = e instanceof Error ? e.message : '';
          if (isNetworkError(msg)) {
            await new Promise((r) => setTimeout(r, 1500));
            result = await verify();
          } else {
            throw e;
          }
        }

        await setSessionToken(result.token);

        // Diagnostic: prove the JWT round-trips before navigating. If
        // /api/auth/session can't see the new session, something is wrong
        // (AUTH_SECRET mismatch, header drop, etc.) — surface that here
        // rather than landing on a silently-signed-out home screen.
        try {
          const check = await apiGet<{ user: User | null }>('/api/auth/session');
          if (!check.user) {
            throw new Error('Signed in, but the server immediately rejected the session.');
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : '';
          throw new Error(
            msg.includes('Signed in')
              ? msg
              : `Signed in, but couldn't verify the session: ${msg}`,
          );
        }

        markAuthChanged();
        // Ask for push permission now that they're signed in.
        void registerForPush();
        router.replace('/(tabs)');
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Something went wrong signing you in.';
        setError(
          isNetworkError(msg)
            ? "Couldn't reach NovelStack. Check your connection and tap the link again."
            : msg,
        );
      }
    })();
  }, [token, session, errParam]);

  // Safety net: if no token ever arrives, don't spin forever.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!handled.current) {
        handled.current = true;
        setError('No sign-in token in the link. Request a fresh one.');
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        {error ? (
          <>
            <Text style={styles.h1}>Couldn&apos;t sign you in</Text>
            <Text style={styles.sub}>{error}</Text>
            <Pressable style={styles.btn} onPress={() => router.replace('/signin')}>
              <Text style={styles.btnText}>Back to sign in</Text>
            </Pressable>
          </>
        ) : (
          <>
            <ActivityIndicator color={colors.signal} />
            <Text style={styles.sub}>Signing you in…</Text>
            <Pressable onPress={() => router.replace('/signin')}>
              <Text style={styles.link}>Taking too long? Back to sign in</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  body: { flex: 1, padding: spacing.xl, justifyContent: 'center', alignItems: 'center' },
  h1: { fontSize: 22, fontWeight: '500', color: colors.ink },
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.md, textAlign: 'center', lineHeight: 21 },
  link: {
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: spacing.lg,
    textDecorationLine: 'underline',
  },
  btn: {
    marginTop: spacing.lg,
    backgroundColor: colors.cream,
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: radius.pill,
  },
  btnText: { color: colors.creamInk, fontSize: 14, fontWeight: '700' },
});
