import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiSend } from '@/lib/api';

// An inline, animated sign-in pitch — used as the signed-out state of the
// Library and Community tabs. The reader can request a magic link right here
// without leaving the screen.
export function SignInPitch({ headline, sub }: { headline: string; sub: string }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fade = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 480, useNativeDriver: true }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 4200, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 4200, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [fade, glow]);

  async function send() {
    const e = email.trim();
    if (!e || !e.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiSend('/api/auth/request', 'POST', { email: e, platform: 'mobile' });
      setSent(true);
    } catch {
      setError("Couldn't send the link — check your connection and try again.");
    }
    setLoading(false);
  }

  return (
    <View style={styles.wrap}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          {
            opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
            transform: [
              { scale: glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] }) },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(200,65,78,0.5)', 'rgba(200,65,78,0.12)', 'transparent']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View
        style={{
          opacity: fade,
          transform: [
            { translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
          ],
        }}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            n<Text style={{ color: colors.signal }}>.</Text>
          </Text>
        </View>

        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.sub}>{sub}</Text>

        {sent ? (
          <View style={styles.sentCard}>
            <View style={styles.sentIcon}>
              <Ionicons name="mail-outline" size={22} color={colors.signal} />
            </View>
            <Text style={styles.sentTitle}>Check your email</Text>
            <Text style={styles.sentBody}>
              We sent a sign-in link to {email.trim()}. Open it on this phone and you&apos;re in.
            </Text>
            <Pressable
              onPress={() => {
                setSent(false);
                setEmail('');
              }}
            >
              <Text style={styles.resend}>Use a different email</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.field}>
              <Ionicons name="mail-outline" size={18} color={colors.inkFaint} />
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
            </View>
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Pressable
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={send}
              disabled={loading}
            >
              <Text style={styles.btnText}>{loading ? 'Sending…' : 'Email me a link'}</Text>
            </Pressable>
            <Text style={styles.hint}>
              No password. New here? You&apos;ll get an account automatically.
            </Text>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 24, paddingTop: spacing.xl },
  glow: { position: 'absolute', top: -40, left: -40, right: -40, height: 320 },

  badge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.displayXl, fontSize: 26, color: colors.ink },

  headline: {
    fontFamily: fonts.displayXl,
    fontSize: 30,
    color: colors.ink,
    marginTop: spacing.lg,
    letterSpacing: -0.7,
    lineHeight: 33,
  },
  sub: { fontSize: 14.5, color: colors.inkMuted, marginTop: 10, lineHeight: 21 },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
  },
  input: { flex: 1, fontSize: 15, color: colors.ink, padding: 0 },
  error: { fontSize: 13, color: colors.signal, marginTop: 10 },
  btn: {
    backgroundColor: colors.signal,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  hint: { fontSize: 12.5, color: colors.inkFaint, marginTop: 16, lineHeight: 18 },

  sentCard: { marginTop: spacing.xl },
  sentIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    marginTop: spacing.md,
  },
  sentBody: { fontSize: 14, color: colors.inkMuted, marginTop: 6, lineHeight: 21 },
  resend: {
    fontSize: 13,
    color: colors.signal,
    fontWeight: '600',
    marginTop: spacing.md,
  },
});
