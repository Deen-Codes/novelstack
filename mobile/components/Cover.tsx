// Renders a story cover.
//   - If `coverUrl` exists: render that uploaded image.
//   - Otherwise: render one of 10 typographic default variants picked
//     deterministically by hashing `storyId`. The title IS the design,
//     so parents that use the default variant should NOT render the title
//     text again underneath the cover.
// `mature` overlays an "18+" badge on top either way.
import { useState } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type LayoutChangeEvent } from 'react-native';
import { Image } from 'expo-image';
import { DefaultCover } from './DefaultCover';

export function Cover({
  storyId,
  coverUrl,
  coverColor: _coverColor,
  title,
  genre,
  authorName,
  style,
  mature,
}: {
  storyId?: string;
  coverUrl?: string | null;
  coverColor?: string | null;
  title?: string;
  genre?: string | null;
  authorName?: string | null;
  // Callers pass plain sizing styles (width/height/aspectRatio/borderRadius).
  style?: StyleProp<ViewStyle>;
  mature?: boolean;
}) {
  // Measure the rendered width so DefaultCover can scale type accordingly.
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - width) > 0.5) setWidth(w);
  };

  const hasUpload = typeof coverUrl === 'string' && coverUrl.length > 0;

  return (
    <View style={[style, styles.wrap]} onLayout={onLayout}>
      {hasUpload ? (
        <Image
          source={{ uri: coverUrl ?? undefined }}
          style={styles.fill}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={180}
          accessibilityLabel={title}
        />
      ) : (
        // Render the default once we know the width; until then the
        // background colour is enough placeholder for ~1 frame.
        width > 0 && (
          <DefaultCover
            storyId={storyId ?? title ?? 'unknown'}
            title={title ?? 'Untitled'}
            genre={genre}
            authorName={authorName}
            width={width}
          />
        )
      )}
      {mature && (
        <View style={styles.matureBadge}>
          <Text style={styles.matureText}>18+</Text>
        </View>
      )}
    </View>
  );
}

// Helper used by parent UIs to decide whether to render the title text
// underneath a cover. When using a default variant the title is already
// baked into the cover, so the label would duplicate.
export function hasUploadedCover(coverUrl?: string | null): boolean {
  return typeof coverUrl === 'string' && coverUrl.length > 0;
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: '#14110F' },
  fill: { width: '100%', height: '100%' },
  matureBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  matureText: { color: '#F4ECDF', fontSize: 9, fontWeight: '700' },
});
