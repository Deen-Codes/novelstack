import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { colors, spacing, radius } from '@/theme/tokens';

// Magic-link sign in — no passwords. The link opens back into the app
// via novelstack://auth-callback (handled by app/auth-callback.tsx).
// Date of birth is captured here and stored on the profile so mature
// (18+) content can be age-gated (Q1 decision).
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(''); // YYYY-MM-DD
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validDob(s: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(s);
    return !isNaN(d.getTime()) && d < new Date();
  }

  async function sendLink() {
    setError(null);
    if (!email.trim()) {
      setError('Enter your email.');
      return;
    }
    if (!validDob(dob)) {
      setError('Enter your date of birth as YYYY-MM-DD.');
      return;
    }
    setLoading(true);
    const { error: otpErr } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: 'novelstack://auth-callback',
        data: { date_of_birth: dob },
      },
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
              placeholderTextColor={colors.inkFaint}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Text style={styles.label}>Date of birth</Text>
            <TextInput
              value={dob}
              onChangeText={setDob}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.inkFaint}
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
              style={styles.input}
            />
            <Text style={styles.hint}>
              Used to confirm your age — mature stories are 18+ only.
            </Text>
            {!!error && <Text style={styles.error}>{error}</Text>}
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
  label: { fontSize: 13, color: colors.inkMuted, marginTop: spacing.md, marginBottom: 4 },
  input: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: colors.white,
    color: colors.ink,
  },
  hint: { fontSize: 12, color: colors.inkFaint, marginTop: 6, lineHeight: 17 },
  error: { fontSize: 13, color: colors.signal, marginTop: spacing.sm },
  btn: {
    marginTop: spacing.md,
    backgroundColor: colors.signal,
    paddingVertical: 13,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  btnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
});
