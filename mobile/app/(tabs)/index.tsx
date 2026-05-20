import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
import { getFeed, type FeedStory } from '@/lib/feed';

export default function Home() {
  const [stories, setStories] = useState<FeedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const feed = await getFeed();
    setStories(feed);
    setLoading(false);
  }, []);

  // Refresh whenever Home regains focus — picks up new reading_events
  // so the ranking reflects what you've just been reading.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.signal} />
        }
      >
        <Text style={styles.logo}>
          novelstack<Text style={styles.dot}>.</Text>
        </Text>
        <Text style={styles.h1}>Stories worth following.</Text>
        <Text style={styles.sub}>A feed built from who you follow and what you read.</Text>

        {loading ? (
          <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.xl }} />
        ) : stories.length === 0 ? (
          <Text style={styles.empty}>
            No stories yet. Once writers publish, your feed fills in here.
          </Text>
        ) : (
          stories.map((story) => (
            <Pressable
              key={story.id}
              style={styles.row}
              onPress={() => story.firstChapter && router.push(`/read/${story.firstChapter}`)}
            >
              <View style={[styles.cover, { backgroundColor: story.cover_color }]}>
                <Text style={styles.coverTitle}>{story.title}</Text>
              </View>
              <View style={styles.rowText}>
                <Text style={styles.reason}>{story._reason}</Text>
                <Text style={styles.rowTitle}>{story.title}</Text>
                <Text style={styles.author}>
                  {story.author} · {story.genre}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  logo: { fontSize: 20, fontWeight: '500', color: colors.ink, letterSpacing: -0.5 },
  dot: { color: colors.signal },
  h1: { fontSize: 30, fontWeight: '500', color: colors.ink, marginTop: spacing.lg, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, lineHeight: 21, marginBottom: spacing.lg },
  empty: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.xl, lineHeight: 21 },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
  },
  cover: { width: 76, height: 104, padding: 8, justifyContent: 'flex-end' },
  coverTitle: { color: colors.white, fontSize: 11, fontWeight: '500' },
  rowText: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  reason: { fontSize: 11, color: colors.signal, fontWeight: '500' },
  rowTitle: { fontSize: 16, fontWeight: '500', color: colors.ink, marginTop: 2 },
  author: { fontSize: 13, color: colors.inkMuted, marginTop: 4, textTransform: 'capitalize' },
});
