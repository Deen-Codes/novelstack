import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { apiSend } from '@/lib/api';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { MailAppLinks } from '@/components/MailAppLinks';

// Always leaves the reader a way out of the sign-in screen.
function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)');
}

// Magic-link sign in — no passwords. The link opens back into the app via
// novelstack://auth-callback (handled by app/auth-callback.tsx). Sign up and
// sign in are one flow: a first-time email gets the same link.
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendLink() {
    setError(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await apiSend('/api/auth/request', 'POST', {
        email: email.trim(),
        platform: 'mobile',
      });
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send the link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Pressable onPress={goBack} hitSlop={12} style={styles.backRow}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
        <Text style={styles.logo}>
          novelstack<Text style={styles.dot}>.</Text>
        </Text>

        {sent ? (
          <>
            <Text style={styles.h1}>Check your email</Text>
            <Text style={styles.sub}>
              We sent a sign-in link to {email.trim()}. Open it on this phone and tap the
              link — it&apos;ll bring you straight back into the app, signed in.
            </Text>

            <MailAppLinks email={email.trim()} />

            {!!error && <Text style={styles.error}>{error}</Text>}

            <Pressable
              onPress={() => {
                setSent(false);
                setError(null);
              }}
            >
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
  backRow: { position: 'absolute', top: spacing.lg, left: spacing.xl },
  back: { fontSize: 15, color: colors.inkMuted },
  logo: {
    fontFamily: fonts.displayXl,
    fontSize: 24,
    color: colors.ink,
    marginBottom: spacing.xl,
    letterSpacing: -0.6,
  },
  dot: { color: colors.signal },
  h1: { fontFamily: fonts.display, fontSize: 24, color: colors.ink },
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, lineHeight: 21 },
  input: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    backgroundColor: colors.card,
    color: colors.ink,
  },
  error: { fontSize: 13, color: colors.signal, marginTop: spacing.md },
  btn: {
    marginTop: spacing.md,
    backgroundColor: colors.cream,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: colors.creamInk, fontSize: 15, fontWeight: '700' },
  link: {
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: spacing.lg,
    textDecorationLine: 'underline',
  },
  hint: { fontSize: 12, color: colors.inkFaint, marginTop: spacing.lg, lineHeight: 17 },
});
