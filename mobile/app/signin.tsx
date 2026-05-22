import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { colors, spacing, radius } from '@/theme/tokens';

// Sign in / sign up — one flow, no passwords. Supabase emails a 6-digit code;
// the reader types it in here. This is deliberately code-based rather than a
// tappable deep link: no browser hand-off, no URL scheme, nothing that can
// break between the email app and NovelStack. The magic link still works as a
// fallback (app/auth-callback.tsx) for anyone who taps it instead.
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode() {
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

  async function verifyCode() {
    setError(null);
    const token = code.replace(/\s/g, '');
    if (token.length < 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    setLoading(true);
    const { error: vErr } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token,
      type: 'email',
    });
    setLoading(false);
    if (vErr) {
      setError(
        /expired|invalid/i.test(vErr.message)
          ? 'That code is wrong or expired. Request a fresh one.'
          : vErr.message,
      );
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.logo}>
          novelstack<Text style={styles.dot}>.</Text>
        </Text>

        {sent ? (
          <>
            <Text style={styles.h1}>Enter your code</Text>
            <Text style={styles.sub}>
              We emailed a 6-digit code to {email}. Type it in below — it works whether
              you&apos;re new here or coming back.
            </Text>
            <TextInput
              value={code}
              onChangeText={(t) => setCode(t.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="123456"
              placeholderTextColor={colors.inkFaint}
              keyboardType="number-pad"
              maxLength={6}
              style={[styles.input, styles.codeInput]}
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Pressable
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={verifyCode}
              disabled={loading}
            >
              <Text style={styles.btnText}>{loading ? 'Checking…' : 'Verify & sign in'}</Text>
            </Pressable>
            <Pressable onPress={() => { setSent(false); setCode(''); setError(null); }}>
              <Text style={styles.link}>Use a different email or resend</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.h1}>Sign in to NovelStack</Text>
            <Text style={styles.sub}>No password. We email you a 6-digit code.</Text>
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
              onPress={sendCode}
              disabled={loading}
            >
              <Text style={styles.btnText}>{loading ? 'Sending…' : 'Email me a code'}</Text>
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
  codeInput: {
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
    fontWeight: '500',
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
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  hint: { fontSize: 12, color: colors.inkFaint, marginTop: spacing.lg, lineHeight: 17 },
});
