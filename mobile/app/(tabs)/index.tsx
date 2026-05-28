import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGetCached, apiSend } from '@/lib/api';
import { Cover } from '@/components/Cover';
import { TopBar } from '@/components/TopBar';
import { useTabScroll } from '@/lib/useTabScroll';
import type { FeedStory, HomeExtras, Shelf } from '@/lib/types';

// hex → rgba, used to derive the ambient glow from a book's cover colour.
function hexA(hex: string, a: number): string {
  const h = (hex || '#3a2150').replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) || 58;
  const g = parseInt(h.slice(2, 4), 16) || 33;
  const b = parseInt(h.slice(4, 6), 16) || 80;
  return `rgba(${r},${g},${b},${a})`;
}

export default function Home() {
  const [feed, setFeed] = useState<FeedStory[]>([]);
  const [extras, setExtras] = useState<HomeExtras | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [spotIndex, setSpotIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const fade = useRef(new Animated.Value(0)).current; // entrance
  const heroFade = useRef(new Animated.Value(1)).current; // spotlight cross-fade
  const drift = useRef(new Animated.Value(0)).current; // ambient drift loop
  // Shared tab-scroll plumbing: scrollY for the TopBar shrink, scroll-to-top
  // on focus, and the matching topPad so content lands below the bar.
  const { scrollRef, scrollY, topPad, onScroll } = useTabScroll();

  const load = useCallback(async () => {
    const [f, e, sh] = await Promise.allSettled([
      apiGetCached<FeedStory[]>('/api/feed'),
      apiGetCached<HomeExtras>('/api/me/home'),
      apiGetCached<Shelf>('/api/me/shelf'),
    ]);
    setFeed(f.status === 'fulfilled' ? f.value : []);
    setExtras(e.status === 'fulfilled' ? e.value : null);
    // Reflect the reader's real saved shelf so the spotlight Save button is
    // always accurate — including after they unsave a book elsewhere.
    if (sh.status === 'fulfilled') {
      setSavedIds(new Set(sh.value.saved.map((s) => s.id)));
    }
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

  // Entrance fade-in once the feed has loaded.
  useEffect(() => {
    if (!loading) {
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }).start();
    }
  }, [loading, fade]);

  // Slow ambient drift — keeps the glow alive.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 7000, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 7000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift]);

  const spotCount = Math.min(5, feed.length);

  // Rotate the spotlight every 10s with a gentle cross-fade dip.
  useEffect(() => {
    if (spotCount < 2) return;
    const timer = setInterval(() => {
      Animated.timing(heroFade, { toValue: 0.35, duration: 300, useNativeDriver: true }).start(() => {
        setSpotIndex((i) => (i + 1) % spotCount);
        Animated.timing(heroFade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [spotCount, heroFade]);

  const cont = extras?.continueReading ?? null;
  const spotCandidates = feed.slice(0, Math.max(1, spotCount));
  const spot = spotCandidates.length
    ? spotCandidates[spotIndex % spotCandidates.length]
    : null;
  const ambientColor = spot?.coverColor ?? '#3a2150';
  const trending = [...feed]
    .sort((a, b) => (b.totalReads ?? 0) - (a.totalReads ?? 0))
    .slice(0, 10);
  const following = feed.filter((s) => s._reason === 'From a writer you follow').slice(0, 10);
  const moreForYou = feed.slice(1, 13);

  async function toggleSave() {
    if (!spot) return;
    const story = spot;
    try {
      // The bookmarks endpoint toggles and returns the resulting state, so
      // the button stays in sync whether saving or unsaving.
      const { bookmarked } = await apiSend<{ bookmarked: boolean }>(
        '/api/bookmarks',
        'POST',
        { storyId: story.id },
      );
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (bookmarked) next.add(story.id);
        else next.delete(story.id);
        return next;
      });
    } catch {
      router.push('/signin');
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      {/* Ambient glow — colour from the current spotlight, drifting + dipping */}
      {spot && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ambient,
            {
              opacity: heroFade,
              transform: [
                { scale: drift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.14] }) },
                { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, 16] }) },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[hexA(ambientColor, 0.62), hexA(ambientColor, 0.14), 'transparent']}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.scroll, { paddingTop: topPad }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.signal}
            progressViewOffset={topPad}
          />
        }
      >
        <Animated.View
          style={{
            opacity: fade,
            transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.xl }} />
          ) : feed.length === 0 ? (
            <Text style={styles.empty}>
              Nothing here yet. Once writers publish, your feed fills in.
            </Text>
          ) : (
            <>
              {spot && (
                <Animated.View style={{ opacity: heroFade }}>
                  <Pressable style={styles.hero} onPress={() => router.push(`/story/${spot.slug}`)}>
                    <LinearGradient
                      colors={[hexA(ambientColor, 0.95), '#16100F']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    {spot.coverUrl ? (
                      <Image source={{ uri: spot.coverUrl }} style={styles.heroImg} resizeMode="cover" />
                    ) : null}
                    <LinearGradient
                      colors={['transparent', 'rgba(16,13,12,0.97)']}
                      locations={[0.32, 1]}
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.heroBody}>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{spot._reason}</Text>
                      </View>
                      <Text style={styles.heroTitle} numberOfLines={3}>
                        {spot.title}
                      </Text>
                      <Text style={styles.heroMeta} numberOfLines={1}>
                        {spot.author?.displayName ?? 'A NovelStack writer'} ·{' '}
                        {(spot.totalReads ?? 0).toLocaleString()} reads
                      </Text>
                    </View>
                  </Pressable>

                  <View style={styles.btns}>
                    <Pressable
                      style={[styles.btn, styles.btnRead]}
                      onPress={() => router.push(`/story/${spot.slug}`)}
                    >
                      <Ionicons name="play" size={17} color={colors.creamInk} />
                      <Text style={styles.btnReadText}>Read</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, styles.btnSave]} onPress={toggleSave}>
                      <Ionicons
                        name={savedIds.has(spot.id) ? 'checkmark' : 'add'}
                        size={18}
                        color="#FFFFFF"
                      />
                      <Text style={styles.btnSaveText}>
                        {savedIds.has(spot.id) ? 'Saved' : 'Save'}
                      </Text>
                    </Pressable>
                  </View>

                  {spotCount > 1 && (
                    <View style={styles.dots}>
                      {spotCandidates.map((s, i) => (
                        <View
                          key={s.id}
                          style={[styles.dot, i === spotIndex % spotCount && styles.dotOn]}
                        />
                      ))}
                    </View>
                  )}
                </Animated.View>
              )}

              {cont && !cont.storyCompleted && (
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
                    <Ionicons name="play" size={15} color={colors.creamInk} />
                  </View>
                </Pressable>
              )}

              <Rail title="Trending now" stories={trending} />
              {following.length > 0 && (
                <Rail title="From writers you follow" stories={following} />
              )}
              {moreForYou.length > 0 && <Rail title="More for you" stories={moreForYou} />}
            </>
          )}
          <View style={{ height: spacing.xl }} />
        </Animated.View>
      </Animated.ScrollView>

      <TopBar page="home" scrollY={scrollY} />
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

  ambient: { position: 'absolute', top: 0, left: 0, right: 0, height: 500 },

  empty: { fontSize: 14, color: colors.inkMuted, paddingHorizontal: 20, marginTop: spacing.xl },

  hero: {
    marginHorizontal: 16,
    height: 392,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  heroBody: { padding: 20 },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  heroTitle: {
    fontFamily: fonts.displayXl,
    fontSize: 34,
    color: '#FFFFFF',
    marginTop: 12,
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  heroMeta: { fontSize: 13, color: colors.inkMuted, marginTop: 7, fontWeight: '500' },

  btns: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 14 },
  btn: {
    height: 52,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnRead: { flex: 1.6, backgroundColor: colors.cream },
  btnReadText: { fontSize: 15, fontWeight: '700', color: colors.creamInk },
  btnSave: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  btnSaveText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.borderSoft },
  dotOn: { backgroundColor: colors.signal, width: 18 },

  contCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginHorizontal: 16,
    marginTop: spacing.xl,
    backgroundColor: colors.paperSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 16,
    padding: 12,
  },
  contCover: { width: 50, height: 70, borderRadius: 7 },
  contText: { flex: 1, minWidth: 0 },
  contLabel: { fontSize: 10, letterSpacing: 1, color: colors.signal, fontWeight: '700' },
  contTitle: { fontFamily: fonts.display, fontSize: 16, color: colors.ink, marginTop: 3 },
  contMeta: { fontSize: 11, color: colors.inkFaint, marginTop: 2, marginBottom: 9 },
  progressTrack: { height: 4, backgroundColor: colors.borderSoft, borderRadius: radius.pill },
  progressFill: { height: 4, backgroundColor: colors.signal, borderRadius: radius.pill },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.ink,
    paddingHorizontal: 20,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  rail: { gap: 13, paddingHorizontal: 16, paddingBottom: 4 },
  railItem: { width: 118 },
  railCover: { width: 118, height: 166, borderRadius: 12 },
  railTitle: { fontSize: 12, fontWeight: '600', color: colors.ink, marginTop: 8 },
  railAuthor: { fontSize: 11, color: colors.inkFaint, marginTop: 1 },
});
