import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { AmbientGlow } from '@/components/AmbientGlow';

type IconName = ComponentProps<typeof Ionicons>['name'];

// NovelStack+ — the membership upgrade screen.
const PERKS: { icon: IconName; title: string; sub: string }[] = [
  {
    icon: 'volume-mute-outline',
    title: 'Ad-free reading',
    sub: 'No ad breaks between chapters — ever.',
  },
  {
    icon: 'lock-open-outline',
    title: 'Every chapter unlocked',
    sub: 'Skip the ad gates on every story, instantly.',
  },
  {
    icon: 'cloud-offline-outline',
    title: 'Offline reading',
    sub: 'Download stories and read them anywhere.',
  },
  {
    icon: 'heart-outline',
    title: 'More for the writers',
    sub: 'A bigger share of your membership reaches the authors you read.',
  },
  {
    icon: 'ribbon-outline',
    title: 'A member badge',
    sub: 'Show your support across NovelStack.',
  },
];

export default function Plus() {
  const [tapped, setTapped] = useState(false);
  const enter = useRef(new Animated.Value(0)).current; // entrance
  const float = useRef(new Animated.Value(0)).current; // badge drift

  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 520, useNativeDriver: true }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2400, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2400, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [enter, float]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AmbientGlow />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>

        <Animated.View
          style={{
            alignItems: 'center',
            width: '100%',
            opacity: enter,
            transform: [
              { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) },
            ],
          }}
        >
        <Animated.View
          style={[
            styles.badge,
            {
              transform: [
                { scale: float.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) },
                { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
              ],
            },
          ]}
        >
          <Ionicons name="sparkles" size={26} color="#15100E" />
        </Animated.View>
        <Text style={styles.title}>
          NovelStack<Text style={{ color: colors.signal }}>+</Text>
        </Text>
        <Text style={styles.tagline}>Reading, uninterrupted.</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>$6.99</Text>
          <Text style={styles.per}>/ month</Text>
        </View>

        <View style={styles.perks}>
          {PERKS.map((p) => (
            <View key={p.title} style={styles.perk}>
              <View style={styles.perkIcon}>
                <Ionicons name={p.icon} size={19} color={colors.signal} />
              </View>
              <View style={styles.perkText}>
                <Text style={styles.perkTitle}>{p.title}</Text>
                <Text style={styles.perkSub}>{p.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
          onPress={() => setTapped(true)}
        >
          <Text style={styles.ctaText}>Go NovelStack+</Text>
        </Pressable>

        {tapped ? (
          <Text style={styles.note}>
            Memberships go live soon — we&apos;ll let you know the moment they do.
          </Text>
        ) : (
          <Text style={styles.fine}>Cancel anytime · billing handled by the App Store.</Text>
        )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingHorizontal: 24, paddingBottom: spacing.xl * 2, alignItems: 'center' },

  back: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: spacing.sm },

  badge: {
    width: 66,
    height: 66,
    borderRadius: 19,
    backgroundColor: '#F4ECDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  title: {
    fontFamily: fonts.displayXl,
    fontSize: 32,
    color: colors.ink,
    marginTop: spacing.md,
    letterSpacing: -0.6,
  },
  tagline: { fontSize: 15, color: colors.inkMuted, marginTop: 4 },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5, marginTop: spacing.lg },
  price: { fontFamily: fonts.displayXl, fontSize: 34, color: colors.ink },
  per: { fontSize: 14, color: colors.inkMuted },

  perks: { width: '100%', marginTop: spacing.xl, gap: 16 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  perkIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: { flex: 1, minWidth: 0 },
  perkTitle: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  perkSub: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2, lineHeight: 17 },

  cta: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    backgroundColor: '#F4ECDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  ctaText: { color: '#15100E', fontSize: 15, fontWeight: '700' },
  note: {
    fontSize: 12.5,
    color: colors.signal,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  fine: { fontSize: 12.5, color: colors.inkFaint, textAlign: 'center', marginTop: 12 },
});
