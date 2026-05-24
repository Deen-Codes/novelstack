import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';

const AD_SECONDS = 5;

// Rewarded-ad screen. The reader sends a chapterId; once the (simulated) ad
// finishes, the reader is re-opened so the chapter can continue.
export default function WatchAd() {
  const params = useLocalSearchParams<{ chapterId?: string | string[] }>();
  const chapterId = Array.isArray(params.chapterId)
    ? params.chapterId[0]
    : params.chapterId;

  const [left, setLeft] = useState(AD_SECONDS);
  const done = left <= 0;

  // Tick the countdown down to zero.
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  function finish() {
    if (chapterId) router.replace(`/read/${chapterId}`);
    else router.back();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.head}>
        <Text style={styles.label}>Advertisement</Text>
        <Pressable
          style={[styles.close, !done && styles.closeOff]}
          onPress={done ? finish : undefined}
          disabled={!done}
          hitSlop={8}
        >
          <Ionicons name="close" size={18} color={done ? colors.ink : colors.inkFaint} />
        </Pressable>
      </View>

      {/* Simulated ad creative */}
      <View style={styles.adWrap}>
        <LinearGradient
          colors={['#2C2C5A', '#121221']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ad}
        >
          <Ionicons name="play-circle" size={56} color="rgba(255,255,255,0.9)" />
          <Text style={styles.adTitle}>Your ad plays here</Text>
          <Text style={styles.adSub}>A short message from a NovelStack sponsor.</Text>
        </LinearGradient>
      </View>

      {/* Countdown / reward status */}
      <View style={styles.statusRow}>
        <View style={[styles.timer, done && styles.timerDone]}>
          {done ? (
            <Ionicons name="checkmark" size={17} color="#15100E" />
          ) : (
            <Text style={styles.timerNum}>{left}</Text>
          )}
        </View>
        <Text style={styles.statusText}>
          {done
            ? 'All done — thanks for watching.'
            : `Keep watching — your chapter is ${left}s away.`}
        </Text>
      </View>

      <Pressable
        style={[styles.cta, !done && styles.ctaOff]}
        onPress={finish}
        disabled={!done}
      >
        <Text style={[styles.ctaText, !done && styles.ctaTextOff]}>
          {done ? 'Continue reading' : 'Please wait…'}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/plus')} hitSlop={8}>
        <Text style={styles.plusLink}>Tired of ads? Read ad-free with NovelStack+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: 20 },

  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: colors.inkFaint,
  },
  close: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeOff: { opacity: 0.5 },

  adWrap: { flex: 1, justifyContent: 'center' },
  ad: {
    borderRadius: 22,
    paddingVertical: 72,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 6,
  },
  adTitle: { fontFamily: fonts.display, fontSize: 19, color: '#FFFFFF', marginTop: 10 },
  adSub: { fontSize: 13, color: 'rgba(255,255,255,0.72)', textAlign: 'center' },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginTop: spacing.lg,
  },
  timer: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerDone: { backgroundColor: '#F4ECDF', borderColor: '#F4ECDF' },
  timerNum: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  statusText: { flex: 1, fontSize: 13.5, color: colors.inkMuted },

  cta: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#F4ECDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  ctaOff: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  ctaText: { color: '#15100E', fontSize: 15, fontWeight: '700' },
  ctaTextOff: { color: colors.inkFaint },

  plusLink: {
    fontSize: 13,
    color: colors.signal,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
