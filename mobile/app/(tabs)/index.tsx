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
import { GENRES, genreLabel } from '@/lib/genres';
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
  const [genre, setGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (g: string | null) => {
    const feedPath = g ? `/api/feed?genre=${encodeURIComponent(g)}` : '/api/feed';
    const [feedRes, extrasRes] = await Promise.allSettled([
      apiGet<FeedStory[]>(feedPath),
      apiGet<HomeExtras>('/api/me/home'),
    ]);
    setFeed(feedRes.status === 'fulfilled' ? feedRes.value : []);
    // /api/me/home 401s when signed out — that's expected, just no extras.
    setExtras(extrasRes.status === 'fulfilled' ? extrasRes.value : null);
    setLoading(false);
  }, []);

  // Reloads on focus and whenever the genre filter changes.
  useFocusEffect(
    useCallback(() => {
      load(genre);
    }, [load, genre]),
  );

  async function onRefresh() {
    setRefreshing(true);
    await load(genre);
    setRefreshing(false);
  }

  function pickGenre(g: string | null) {
    if (g === genre) return;
    setLoading(true);
    setGenre(g);
  }

  const cont = extras?.continueReading ?? null;
  const trending = [...feed]
    .sort((a, b) => (b.totalReads ?? 0) - (a.totalReads ?? 0))
    .slice(0, 8);
  const spotlight = feed[0] ?? null;
  const following = feed.filter((s) => s._reason === 'From a writer you follow').slice(0, 6);
  const forYou = feed.slice(1);

  const headline = genre
    ? genreLabel(genre)
    : cont
    ? 'Pick up where you left off'
    : 'Stories worth following';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.signal} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            novelstack<Text style={styles.dot}>.</Text>
          </Text>
          {!!extras && extras.streak > 0 && (
            <View style={styles.streak}>
              <Ionicons name="flame" size={13} color="#993C1D" />
              <Text style={styles.streakText}>
                {extras.streak} day{extras.streak === 1 ? '' : 's'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.greeting}>
          {greeting()}
          {extras?.name ? `, ${extras.name}` : ''}
        </Text>
        <Text style={styles.h1}>{headline}</Text>

        {/* Continue reading */}
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
              <Text style={styles.contLabel}>Continue reading</Text>
              <Text style={styles.contTitle} numberOfLines={1}>
                {cont.storyTitle}
              </Text>
              <Text style={styles.contMeta}>
                Chapter {cont.chapterNumber}
                {cont.totalChapters ? ` of ${cont.totalChapters}` : ''}
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
          </Pressable>
        )}

        {/* Genre chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chips}
        >
          <Chip label="For you" active={!genre} onPress={() => pickGenre(null)} />
          {GENRES.map((g) => (
            <Chip
              key={g.value}
              label={g.label}
              active={genre === g.value}
              onPress={() => pickGenre(g.value)}
            />
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.xl }} />
        ) : feed.length === 0 ? (
          <Text style={styles.empty}>
            No stories here yet. Once writers publish, your feed fills in.
          </Text>
        ) : (
          <>
            {/* Trending rail */}
            {trending.length > 0 && (
              <>
                <Text style={styles.section}>Trending now</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.rail}
                >
                  {trending.map((s) => (
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
            )}

            {/* Spotlight */}
            {spotlight && (
              <>
                <Text style={styles.section}>Spotlight</Text>
                <Pressable
                  style={styles.spotCard}
                  onPress={() => router.push(`/story/${spotlight.slug}`)}
                >
                  <Cover
                    coverUrl={spotlight.coverUrl}
                    coverColor={spotlight.coverColor}
                    title={spotlight.title}
                    mature={spotlight.isMature}
                    style={styles.spotCover}
                  />
                  <View style={styles.spotBody}>
                    <Text style={styles.spotReason}>{spotlight._reason}</Text>
                    <Text style={styles.spotTitle} numberOfLines={2}>
                      {spotlight.title}
                    </Text>
                    <View style={styles.spotFoot}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.spotAuthor} numberOfLines={1}>
                          by {spotlight.author?.displayName ?? 'a NovelStack writer'}
                        </Text>
                        <Text style={styles.spotReads}>
                          {(spotlight.totalReads ?? 0).toLocaleString()} reads
                        </Text>
                      </View>
                      <View style={styles.readBtn}>
                        <Text style={styles.readBtnText}>Read</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </>
            )}

            {/* From writers you follow */}
            {following.length > 0 && (
              <>
                <Text style={styles.section}>From writers you follow</Text>
                {following.map((s) => (
                  <Pressable
                    key={`f-${s.id}`}
                    style={styles.followRow}
                    onPress={() => router.push(`/story/${s.slug}`)}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {(s.author?.displayName ?? '?').slice(0, 1).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.followTitle} numberOfLines={1}>
                        {s.title}
                      </Text>
                      <Text style={styles.followAuthor} numberOfLines={1}>
                        {s.author?.displayName ?? 'A writer'} · {s.genre}
                      </Text>
                    </View>
                    <View style={styles.newDot} />
                  </Pressable>
                ))}
              </>
            )}

            {/* For you list */}
            {forYou.length > 0 && (
              <>
                <Text style={styles.section}>{genre ? 'More like this' : 'More for you'}</Text>
                {forYou.map((s) => (
                  <Pressable
                    key={s.id}
                    style={styles.row}
                    onPress={() => router.push(`/story/${s.slug}`)}
                  >
                    <Cover
                      coverUrl={s.coverUrl}
                      coverColor={s.coverColor}
                      title={s.title}
                      mature={s.isMature}
                      style={styles.rowCover}
                    />
                    <View style={styles.rowText}>
                      <Text style={styles.reason}>{s._reason}</Text>
                      <Text style={styles.rowTitle} numberOfLines={2}>
                        {s.title}
                      </Text>
                      <Text style={styles.rowAuthor} numberOfLines={1}>
                        {s.author?.displayName ?? 'Unknown'} · {s.genre}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 20, fontWeight: '500', color: colors.ink, letterSpacing: -0.5 },
  dot: { color: colors.signal },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FAECE7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  streakText: { fontSize: 12, color: '#993C1D', fontWeight: '500' },

  greeting: { fontSize: 13, color: colors.inkFaint, marginTop: spacing.md },
  h1: {
    fontSize: 26,
    fontWeight: '500',
    color: colors.ink,
    marginTop: 2,
    letterSpacing: -0.5,
  },

  contCard: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: 12,
    marginTop: spacing.lg,
  },
  contCover: { width: 48, height: 66, borderRadius: radius.sm, overflow: 'hidden' },
  contText: { flex: 1, minWidth: 0 },
  contLabel: { fontSize: 11, color: colors.signal, fontWeight: '500' },
  contTitle: { fontSize: 15, fontWeight: '500', color: colors.ink, marginTop: 2 },
  contMeta: { fontSize: 12, color: colors.inkFaint, marginTop: 2, marginBottom: 8 },
  progressTrack: { height: 5, backgroundColor: '#EDE4D0', borderRadius: radius.pill },
  progressFill: { height: 5, backgroundColor: colors.signal, borderRadius: radius.pill },

  chipScroll: { marginTop: spacing.lg, marginHorizontal: -spacing.lg },
  chips: { gap: 8, paddingHorizontal: spacing.lg },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  chipActive: { backgroundColor: colors.signal, borderColor: colors.signal },
  chipText: { fontSize: 12, color: colors.inkMuted },
  chipTextActive: { color: colors.paper, fontWeight: '500' },

  empty: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.xl, lineHeight: 21 },

  section: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.ink,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  rail: { gap: 12, paddingRight: spacing.lg },
  railItem: { width: 104 },
  railCover: { width: 104, height: 140, borderRadius: 10, overflow: 'hidden' },
  railTitle: { fontSize: 12, fontWeight: '500', color: colors.ink, marginTop: 6 },
  railAuthor: { fontSize: 11, color: colors.inkFaint, marginTop: 1 },

  spotCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  spotCover: { width: '100%', height: 170 },
  spotBody: { padding: spacing.md },
  spotReason: { fontSize: 11, color: colors.signal, fontWeight: '500' },
  spotTitle: {
    fontSize: 19,
    fontWeight: '500',
    color: colors.ink,
    marginTop: 3,
    letterSpacing: -0.3,
  },
  spotFoot: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  spotAuthor: { fontSize: 13, color: colors.inkMuted },
  spotReads: { fontSize: 12, color: colors.inkFaint, marginTop: 2 },
  readBtn: {
    backgroundColor: colors.signal,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: radius.pill,
  },
  readBtnText: { color: colors.paper, fontSize: 13, fontWeight: '500' },

  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 9,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: '#FAECE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '500', color: '#993C1D' },
  followTitle: { fontSize: 14, fontWeight: '500', color: colors.ink },
  followAuthor: { fontSize: 12, color: colors.inkFaint, marginTop: 1, textTransform: 'capitalize' },
  newDot: { width: 8, height: 8, borderRadius: radius.pill, backgroundColor: colors.signal },

  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
  },
  rowCover: { width: 76, height: 104 },
  rowText: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  reason: { fontSize: 11, color: colors.signal, fontWeight: '500' },
  rowTitle: { fontSize: 16, fontWeight: '500', color: colors.ink, marginTop: 2 },
  rowAuthor: { fontSize: 13, color: colors.inkMuted, marginTop: 4, textTransform: 'capitalize' },
});
