import { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { apiSend, setSessionToken } from '@/lib/api';
import type { User } from '@/lib/types';
import { colors, spacing, radius } from '@/theme/tokens';

// Deep-link landing for the magic link. The email link points back at
// novelstack://auth-callback?token=… — we POST that token to /api/auth/verify,
// store the returned session JWT, retry once on a transient network failure,
// and only run the exchange once.

function isNetworkError(msg: string) {
  return /network request failed|failed to fetch|network error/i.test(msg);
}

export default function AuthCallback() {
  const url = Linking.useURL();
  const [error, setError] = useState<string | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current || !url) return;
    handled.current = true;

    (async () => {
      try {
        const parsed = Linking.parse(url);
        const qp = parsed.queryParams ?? {};

        const errDesc = qp.error_description ?? qp.error;
        if (errDesc) {
          setError(String(errDesc));
          return;
        }

        // The magic link arrives as novelstack://auth-callback?token=…
        const token = qp.token ? String(qp.token) : null;
        if (!token) {
          setError('No sign-in token in the link. Request a fresh one.');
          return;
        }

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
  }, [url]);

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
    backgroundColor: colors.signal,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: radius.pill,
  },
  btnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
});
