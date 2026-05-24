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
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
import { apiGet } from '@/lib/api';
import { Cover } from '@/components/Cover';
import { TopBar } from '@/components/TopBar';
import type { FeedStory, HomeExtras } from '@/lib/types';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const [feed, setFeed] = useState<FeedStory[]>([]);
  const [extras, setExtras] = useState<HomeExtras | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [feedRes, extrasRes] = await Promise.allSettled([
      apiGet<FeedStory[]>('/api/feed'),
      apiGet<HomeExtras>('/api/me/home'),
    ]);
    setFeed(feedRes.status === 'fulfilled' ? feedRes.value : []);
    setExtras(extrasRes.status === 'fulfilled' ? extrasRes.value : null);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const cont = extras?.continueReading ?? null;
  const trending = [...feed]
    .sort((a, b) => (b.totalReads ?? 0) - (a.totalReads ?? 0))
    .slice(0, 10);
  const spotlight = feed[0] ?? null;
  const following = feed.filter((s) => s._reason === 'From a writer you follow').slice(0, 10);
  const moreForYou = feed.slice(1, 13);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.signal} />
        }
      >
        <Text style={styles.greeting}>
          {greeting()}
          {extras?.name ? `, ${extras.name}` : ''}
          {extras && extras.streak > 0 ? `  ·  ${extras.streak}-day streak` : ''}
        </Text>

        {cont && (
          <Pressable
            style={styles.contCard}
            onPress={() => router.push(`/read/${cont.chapterId}`)}
          >
            <Cover
              coverUrl={cont.coverUrl}
              coverColor={cont.coverColor}
              title={cont.storyTitle}
              style={styles.contCover}
            />
            <View style={styles.contText}>
              <Text style={styles.contLabel}>CONTINUE READING</Text>
              <Text style={styles.contTitle} numberOfLines={1}>
                {cont.storyTitle}
              </Text>
              <Text style={styles.contMeta}>
                Chapter {cont.chapterNumber}
                {cont.totalChapters ? ` of ${cont.totalChapters}` : ''} · {cont.progressPct}%
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(100, Math.max(4, cont.progressPct))}%` },
                  ]}
                />
              </View>
            </View>
            <View style={styles.playBtn}>
              <Ionicons name="play" size={15} color="#FFFFFF" />
            </View>
          </Pressable>
        )}

        {loading ? (
          <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.xl }} />
        ) : feed.length === 0 ? (
          <Text style={styles.empty}>
            Nothing here yet. Once writers publish, your feed fills in.
          </Text>
        ) : (
          <>
            {spotlight && (
              <>
                <Text style={styles.section}>Spotlight</Text>
                <Pressable
                  style={styles.spot}
                  onPress={() => router.push(`/story/${spotlight.slug}`)}
                >
                  <Cover
                    coverUrl={spotlight.coverUrl}
                    coverColor={spotlight.coverColor}
                    title={spotlight.title}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.spotScrim} />
                  <View style={styles.spotBody}>
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>{spotlight._reason}</Text>
                    </View>
                    <Text style={styles.spotTitle} numberOfLines={3}>
                      {spotlight.title}
                    </Text>
                    <Text style={styles.spotBy} numberOfLines={1}>
                      by {spotlight.author?.displayName ?? 'a NovelStack writer'} ·{' '}
                      {(spotlight.totalReads ?? 0).toLocaleString()} reads
                    </Text>
                    <View style={styles.spotRow}>
                      <View style={styles.readBtn}>
                        <Text style={styles.readBtnText}>Read now</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </>
            )}

            <Rail title="Trending now" stories={trending} />
            {following.length > 0 && (
              <Rail title="From writers you follow" stories={following} />
            )}
            {moreForYou.length > 0 && <Rail title="More for you" stories={moreForYou} />}
          </>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Rail({ title, stories }: { title: string; stories: FeedStory[] }) {
  if (stories.length === 0) return null;
  return (
    <>
      <Text style={styles.section}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      >
        {stories.map((s) => (
          <Pressable
            key={s.id}
            style={styles.railItem}
            onPress={() => router.push(`/story/${s.slug}`)}
          >
            <Cover
              coverUrl={s.coverUrl}
              coverColor={s.coverColor}
              title={s.title}
              mature={s.isMature}
              style={styles.railCover}
            />
            <Text style={styles.railTitle} numberOfLines={1}>
              {s.title}
            </Text>
            <Text style={styles.railAuthor} numberOfLines={1}>
              {s.author?.displayName ?? 'A writer'}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingBottom: spacing.xl },

  greeting: { fontSize: 13, color: colors.inkFaint, paddingHorizontal: 20, paddingTop: 4 },

  contCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginHorizontal: 20,
    marginTop: spacing.md,
    backgroundColor: colors.paperSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 16,
    padding: 12,
  },
  contCover: { width: 50, height: 70, borderRadius: 7 },
  contText: { flex: 1, minWidth: 0 },
  contLabel: { fontSize: 10, letterSpacing: 1, color: colors.signal, fontWeight: '600' },
  contTitle: { fontSize: 16, fontWeight: '500', color: colors.ink, marginTop: 3 },
  contMeta: { fontSize: 11, color: colors.inkFaint, marginTop: 2, marginBottom: 9 },
  progressTrack: { height: 4, backgroundColor: colors.borderSoft, borderRadius: radius.pill },
  progressFill: { height: 4, backgroundColor: colors.signal, borderRadius: radius.pill },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.signal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: { fontSize: 14, color: colors.inkMuted, paddingHorizontal: 20, marginTop: spacing.xl },

  section: {
    fontSize: 19,
    fontWeight: '500',
    color: colors.ink,
    paddingHorizontal: 20,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  spot: {
    marginHorizontal: 20,
    height: 372,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    justifyContent: 'flex-end',
  },
  spotScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    backgroundColor: 'rgba(10,8,9,0.78)',
  },
  spotBody: { padding: 20 },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(200,65,78,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(200,65,78,0.5)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 10,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: '#F2C9CD',
  },
  spotTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 12,
    letterSpacing: -0.3,
  },
  spotBy: { fontSize: 13, color: colors.inkMuted, marginTop: 5 },
  spotRow: { flexDirection: 'row', marginTop: 16 },
  readBtn: {
    flex: 1,
    backgroundColor: colors.signal,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  readBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  rail: { gap: 13, paddingHorizontal: 20, paddingBottom: 4 },
  railItem: { width: 118 },
  railCover: { width: 118, height: 166, borderRadius: 10 },
  railTitle: { fontSize: 12, fontWeight: '500', color: colors.ink, marginTop: 8 },
  railAuthor: { fontSize: 11, color: colors.inkFaint, marginTop: 1 },
});
