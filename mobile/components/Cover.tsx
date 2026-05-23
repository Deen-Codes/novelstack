// Renders a story cover: the uploaded image when one exists, otherwise the
// solid colour block with the title typeset on it.
import {
  Image,
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type ImageStyle,
} from 'react-native';
import { colors } from '@/theme/tokens';

export function Cover({
  coverUrl,
  coverColor,
  title,
  style,
}: {
  coverUrl?: string | null;
  coverColor?: string | null;
  title?: string;
  // Callers pass plain sizing styles (width/height/aspectRatio/borderRadius)
  // that are valid for both a View fallback and an Image.
  style?: StyleProp<ViewStyle>;
}) {
  if (typeof coverUrl === 'string' && coverUrl.length > 0) {
    return (
      <Image
        source={{ uri: coverUrl }}
        style={style as StyleProp<ImageStyle>}
        resizeMode="cover"
        accessibilityLabel={title}
      />
    );
  }

  return (
    <View style={[styles.fallback, { backgroundColor: coverColor ?? '#D85A30' }, style]}>
      {!!title && (
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { padding: 8, justifyContent: 'flex-end' },
  title: { color: colors.white, fontSize: 11, fontWeight: '500' },
});
