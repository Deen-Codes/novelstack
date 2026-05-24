import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { apiSend } from '@/lib/api';
import { colors, spacing, radius, fonts } from '@/theme/tokens';

// Always leaves the reader a way out of the sign-in screen.
function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)');
}

// Magic-link sign in — no passwords. The link opens back into the app
// via novelstack://auth-callback (handled by app/auth-callback.tsx).
// Sign up and sign in are one flow: a first-time email gets the same link.

type MailApp = { key: string; name: string; scheme: string; domains: string[] };

// Mail apps we can hand the reader off to. `domains` lets us guess which one
// matches their address so the right app is offered first. The schemes are
// declared in app.json → ios.infoPlist.LSApplicationQueriesSchemes so that
// canOpenURL can detect which apps are actually installed.
const MAIL_APPS: MailApp[] = [
  { key: 'apple', name: 'Mail', scheme: 'message://', domains: ['icloud.com', 'me.com', 'mac.com'] },
  { key: 'gmail', name: 'Gmail', scheme: 'googlegmail://', domains: ['gmail.com', 'googlemail.com'] },
  {
    key: 'outlook',
    name: 'Outlook',
    scheme: 'ms-outlook://',
    domains: [
      'outlook.com', 'outlook.co.uk', 'hotmail.com', 'hotmail.co.uk', 'hotmail.fr',
      'live.com', 'live.co.uk', 'msn.com',
    ],
  },
  {
    key: 'yahoo',
    name: 'Yahoo Mail',
    scheme: 'ymail://',
    domains: ['yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'ymail.com', 'rocketmail.com', 'aol.com'],
  },
  { key: 'proton', name: 'Proton Mail', scheme: 'protonmail://', domains: ['proton.me', 'protonmail.com', 'pm.me'] },
  { key: 'fastmail', name: 'Fastmail', scheme: 'fastmail://', domains: ['fastmail.com', 'fastmail.fm'] },
  { key: 'spark', name: 'Spark', scheme: 'readdle-spark://', domains: [] },
  { key: 'airmail', name: 'Airmail', scheme: 'airmail://', domains: [] },
];

function suggestedAppKey(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return null;
  return MAIL_APPS.find((a) => a.domains.includes(domain))?.key ?? null;
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mailApps, setMailApps] = useState<MailApp[]>([]);

  async function sendLink() {
    setError(null);
    if (!email.trim()) {
      setError('Enter your email.');
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

  // Once the link is sent, work out which mail apps are installed so we can
  // offer one-tap shortcuts, with the reader's likely provider first.
  useEffect(() => {
    if (!sent) return;
    let cancelled = false;
    (async () => {
      const found: MailApp[] = [];
      for (const app of MAIL_APPS) {
        try {
          if (await Linking.canOpenURL(app.scheme)) found.push(app);
        } catch {
          // scheme not detectable — skip
        }
      }
      // Apple Mail is a system app; offer it even if the probe came back false.
      if (!found.some((a) => a.key === 'apple')) found.unshift(MAIL_APPS[0]);

      const suggested = suggestedAppKey(email);
      if (suggested) {
        const i = found.findIndex((a) => a.key === suggested);
        if (i > 0) found.unshift(found.splice(i, 1)[0]);
      }
      if (!cancelled) setMailApps(found);
    })();
    return () => {
      cancelled = true;
    };
  }, [sent, email]);

  async function openMailApp(app: MailApp) {
    try {
      await Linking.openURL(app.scheme);
    } catch {
      setError(`Couldn't open ${app.name}. Open it from your home screen instead.`);
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
              We sent a sign-in link to {email}. Open it on this phone and tap the link —
              it&apos;ll bring you straight back into the app, signed in.
            </Text>

            <View style={styles.mailList}>
              {mailApps.map((app, i) => (
                <Pressable
                  key={app.key}
                  style={i === 0 ? styles.btn : styles.btnOutline}
                  onPress={() => openMailApp(app)}
                >
                  <Text style={i === 0 ? styles.btnText : styles.btnOutlineText}>
                    Open {app.name}
                  </Text>
                </Pressable>
              ))}
            </View>

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
  logo: { fontFamily: fonts.displayXl, fontSize: 24, color: colors.ink, marginBottom: spacing.xl, letterSpacing: -0.6 },
  dot: { color: colors.signal },
  h1: { fontFamily: fonts.display, fontSize: 24, color: colors.ink },
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
  error: { fontSize: 13, color: colors.signal, marginTop: spacing.md },
  mailList: { marginTop: spacing.lg },
  btn: {
    marginTop: spacing.sm,
    backgroundColor: colors.signal,
    paddingVertical: 13,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  btnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
  btnOutline: {
    marginTop: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingVertical: 13,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  btnOutlineText: { color: colors.ink, fontSize: 14, fontWeight: '500' },
  link: {
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: spacing.lg,
    textDecorationLine: 'underline',
  },
  hint: { fontSize: 12, color: colors.inkFaint, marginTop: spacing.lg, lineHeight: 17 },
});
