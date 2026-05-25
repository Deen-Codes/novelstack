// Renders a story cover: the uploaded image when one exists, otherwise the
// solid colour block with the title typeset on it. `mature` overlays an
// "18+" badge. Uses expo-image for memory+disk caching and a soft fade-in,
// which keeps cover-heavy rails and grids smooth while scrolling.
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/theme/tokens';

export function Cover({
  coverUrl,
  coverColor,
  title,
  style,
  mature,
}: {
  coverUrl?: string | null;
  coverColor?: string | null;
  title?: string;
  // Callers pass plain sizing styles (width/height/aspectRatio/borderRadius).
  style?: StyleProp<ViewStyle>;
  mature?: boolean;
}) {
  return (
    <View style={[style, styles.wrap]}>
      {typeof coverUrl === 'string' && coverUrl.length > 0 ? (
        <Image
          source={coverUrl}
          style={styles.fill}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={160}
          alt={title}
        />
      ) : (
        <View style={[styles.fill, styles.fallback, { backgroundColor: coverColor ?? '#D85A30' }]}>
          {!!title && (
            <Text style={styles.title} numberOfLines={3}>
              {title}
            </Text>
          )}
        </View>
      )}
      {mature && (
        <View style={styles.matureBadge}>
          <Text style={styles.matureText}>18+</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
  fill: { width: '100%', height: '100%' },
  fallback: { padding: 8, justifyContent: 'flex-end' },
  title: { color: colors.white, fontSize: 11, fontWeight: '500' },
  matureBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  matureText: { color: '#FFFFFF', fontSize: 9, fontWeight: '500' },
});
