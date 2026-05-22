import { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { colors, spacing, radius } from '@/theme/tokens';

// Deep-link landing for the magic link. The email link points back at
// novelstack://auth-callback — depending on Supabase's flow that arrives as
// ?code=… (PKCE) or as #access_token=… in the fragment. We handle both,
// retry once on a transient network failure, and only run the exchange once.

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
        const fragment = url.includes('#') ? url.split('#')[1] : '';
        const hp = new URLSearchParams(fragment);

        const errDesc = qp.error_description ?? hp.get('error_description');
        if (errDesc) {
          setError(String(errDesc));
          return;
        }

        // Implicit flow — tokens arrive in the URL fragment.
        const accessToken = hp.get('access_token');
        const refreshToken = hp.get('refresh_token');
        if (accessToken && refreshToken) {
          const { error: setErr } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (setErr) {
            setError(setErr.message);
            return;
          }
          router.replace('/(tabs)');
          return;
        }

        // PKCE flow — a one-time code we swap for a session.
        const code = qp.code ? String(qp.code) : null;
        if (!code) {
          setError('No sign-in code in the link. Request a fresh one.');
          return;
        }

        let { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
        // A network failure means the request never reached Supabase, so the
        // one-time code is still unused — safe to try again once.
        if (exErr && isNetworkError(exErr.message)) {
          await new Promise((r) => setTimeout(r, 1500));
          ({ error: exErr } = await supabase.auth.exchangeCodeForSession(code));
        }
        if (exErr) {
          setError(
            isNetworkError(exErr.message)
              ? "Couldn't reach NovelStack. Check your connection and tap the link again."
              : exErr.message,
          );
          return;
        }
        router.replace('/(tabs)');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong signing you in.');
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
  btn: {
    marginTop: spacing.lg,
    backgroundColor: colors.signal,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: radius.pill,
  },
  btnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
});
