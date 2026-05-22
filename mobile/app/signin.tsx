import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { colors, spacing, radius } from '@/theme/tokens';

// Magic-link sign in — no passwords. The link opens back into the app
// via novelstack://auth-callback (handled by app/auth-callback.tsx).
// Sign up and sign in are one flow: a first-time email gets the same link.
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendLink() {
    setError(null);
    if (!email.trim()) {
      setError('Enter your email.');
      return;
    }
    setLoading(true);
    const { error: otpErr } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: 'novelstack://auth-callback' },
    });
    setLoading(false);
    if (otpErr) {
      setError(otpErr.message);
      return;
    }
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
              We sent a sign-in link to {email}. Open it on this phone and tap it —
              it&apos;ll bring you straight back into the app, signed in.
            </Text>
            <Pressable onPress={() => { setSent(false); setError(null); }}>
              <Text style={styles.link}>Use a different email or resend</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.h1}>Sign in to NovelStack</Text>
            <Text style={styles.sub}>No password. We email you a one-time link.</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={colors.inkFaint}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Pressable
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={sendLink}
              disabled={loading}
            >
              <Text style={styles.btnText}>{loading ? 'Sending…' : 'Email me a link'}</Text>
            </Pressable>
            <Text style={styles.hint}>
              New here? You&apos;ll get a username automatically — change it any time in
              Profile. Mature stories stay hidden until you add your date of birth.
            </Text>
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
  error: { fontSize: 13, color: colors.signal, marginTop: spacing.sm },
  btn: {
    marginTop: spacing.md,
    backgroundColor: colors.signal,
    paddingVertical: 13,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  btnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
  link: {
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: spacing.lg,
    textDecorationLine: 'underline',
  },
  hint: { fontSize: 12, color: colors.inkFaint, marginTop: spacing.lg, lineHeight: 17 },
});
