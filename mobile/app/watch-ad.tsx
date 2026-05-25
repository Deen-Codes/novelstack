import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiSend } from '@/lib/api';
import { showRewardedAd } from '@/lib/ads';

// Rewarded-ad screen. The reader sends a chapterId; we load and show a real
// AdMob rewarded ad, and once the reward is earned we record the unlock and
// reopen the chapter. If the ad can't load, the reader can retry or upgrade.
export default function WatchAd() {
  const params = useLocalSearchParams<{ chapterId?: string | string[] }>();
  const chapterId = Array.isArray(params.chapterId)
    ? params.chapterId[0]
    : params.chapterId;

  const [phase, setPhase] = useState<'loading' | 'failed'>('loading');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run() {
    setPhase('loading');
    const earned = await showRewardedAd();
    if (earned) {
      // Record the rewarded-ad unlock, then reopen the chapter.
      if (chapterId) {
        try {
          await apiSend('/api/ad-unlocks', 'POST', { chapterId });
        } catch {
          // Open the chapter even if recording failed.
        }
        router.replace(`/read/${chapterId}`);
      } else {
        router.back();
      }
    } else {
      setPhase('failed');
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.head}>
        <Text style={styles.label}>Advertisement</Text>
        <Pressable style={styles.close} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={18} color={colors.ink} />
        </Pressable>
      </View>

      <View style={styles.body}>
        {phase === 'loading' ? (
          <>
            <ActivityIndicator color={colors.signal} />
            <Text style={styles.title}>Loading your ad…</Text>
            <Text style={styles.sub}>
              Watch a short ad and your chapter opens straight after.
            </Text>
          </>
        ) : (
          <>
            <View style={styles.iconWrap}>
              <Ionicons name="cloud-offline-outline" size={30} color={colors.inkMuted} />
            </View>
            <Text style={styles.title}>That ad didn&apos;t load</Text>
            <Text style={styles.sub}>
              No ad was available just now. Try again, or skip ads for good with
              NovelStack+.
            </Text>
            <Pressable style={styles.cta} onPress={run}>
              <Text style={styles.ctaText}>Try again</Text>
            </Pressable>
            <Pressable onPress={() => router.replace('/plus')} hitSlop={8}>
              <Text style={styles.plusLink}>Read ad-free with NovelStack+</Text>
            </Pressable>
          </>
        )}
      </View>
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

  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: { fontFamily: fonts.display, fontSize: 19, color: colors.ink, marginTop: 6 },
  sub: {
    fontSize: 13.5,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  cta: {
    height: 50,
    minWidth: 200,
    borderRadius: 14,
    backgroundColor: '#F4ECDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  ctaText: { color: '#15100E', fontSize: 15, fontWeight: '700' },
  plusLink: {
    fontSize: 13,
    color: colors.signal,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
