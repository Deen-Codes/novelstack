import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { colors, spacing, radius } from '@/theme/tokens';

// Magic-link sign in — no passwords. The link opens back into the app
// via the `novelstack://` scheme (configured in app.json).
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendLink() {
    if (!email) return;
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'novelstack://auth-callback' },
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.logo}>
          novelstack<Text style={styles.dot}>.</Text>
        </Text>

        {sent ? (
          <>
            <Text style={styles.h1}>Check your email</Text>
            <Text style={styles.sub}>
              We sent a sign-in link to {email}. Tap it and you're in.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.h1}>Sign in to NovelStack</Text>
            <Text style={styles.sub}>No password. We email you a one-time link.</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Pressable
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={sendLink}
              disabled={loading}
            >
              <Text style={styles.btnText}>{loading ? 'Sending…' : 'Email me a link'}</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  body: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  logo: { fontSize: 22, fontWeight: '500', color: colors.ink, marginBottom: spacing.xl },
  dot: { color: colors.signal },
  h1: { fontSize: 24, fontWeight: '500', color: colors.ink },
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, lineHeight: 21 },
  input: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: colors.white,
    color: colors.ink,
  },
  btn: {
    marginTop: spacing.md,
    backgroundColor: colors.signal,
    paddingVertical: 13,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  btnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
});
