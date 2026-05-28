import { View, StyleSheet, type ImageSourcePropType, type ViewStyle, type StyleProp } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/theme/tokens';

// Pre-bundled defaults — the 8 literary AI avatars (Classic Reader, Night
// Reader, Poet, Scholar, Minimalist, Vintage, Fantasy, Sci-Fi…). Metro
// turns each require() into a static asset ID so they're available offline
// and never round-trip through the network. Drop a new PNG in
// /assets/avatars/avatar-N.png and add a line here to extend the pool.
const DEFAULTS: ImageSourcePropType[] = [
  require('@/assets/avatars/avatar-0.png'),
  require('@/assets/avatars/avatar-1.png'),
  require('@/assets/avatars/avatar-2.png'),
  require('@/assets/avatars/avatar-3.png'),
  require('@/assets/avatars/avatar-4.png'),
  require('@/assets/avatars/avatar-5.png'),
  require('@/assets/avatars/avatar-6.png'),
  require('@/assets/avatars/avatar-7.png'),
];

// Deterministic hash → pick — same user always gets the same default avatar
// so it doesn't reshuffle on every render. djb2-style, plenty good for an
// even spread across 10 buckets.
function pickIndex(seed: string): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % DEFAULTS.length;
}

export function defaultAvatarFor(seed: string | null | undefined): ImageSourcePropType {
  return DEFAULTS[pickIndex(seed ?? 'novelstack')];
}

// One avatar UI for everywhere — uploaded photo when present, otherwise a
// deterministic default. Pass `size` to scale; the container is a perfect
// circle regardless of the underlying image dimensions.
export function Avatar({
  url,
  seed,
  size = 40,
  style,
}: {
  url: string | null | undefined;
  // Anything stable per user — id, username, display name.
  seed: string | null | undefined;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const source: ImageSourcePropType = url
    ? { uri: url }
    : defaultAvatarFor(seed);

  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Image
        source={source}
        style={{ width: size, height: size }}
        // `cover` so default avatars (which are 512×512 squares) and tall
        // user uploads both fill the circle without letterboxing.
        contentFit="cover"
        // expo-image disk-caches by default — avatars stay snappy on every
        // tab switch, no re-fetch.
        cachePolicy="memory-disk"
        transition={120}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
