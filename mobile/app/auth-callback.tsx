import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { colors, spacing, radius } from '@/theme/tokens';

// Deep-link landing for the magic link. The email link points at
// novelstack://auth-callback?code=… — expo-router routes that here.
// We swap the PKCE code for a session, then drop the user into the app.
export default function AuthCallback() {
  const params = useLocalSearchParams<{ code?: string; error_description?: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (params.error_description) {
        setError(String(params.error_description));
        return;
      }
      if (!params.code) {
        setError('No sign-in code in the link. Try requesting a new one.');
        return;
      }
      const { error: exErr } = await supabase.auth.exchangeCodeForSession(
        String(params.code)
      );
      if (exErr) {
        setError(exErr.message);
        return;
      }
      router.replace('/(tabs)');
    })();
  }, [params.code]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        {error ? (
          <>
            <Text style={styles.h1}>Couldn't sign you in</Text>
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
