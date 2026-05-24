import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
import { apiGet, apiSend } from '@/lib/api';
import { Cover } from '@/components/Cover';
import { TopBar } from '@/components/TopBar';
import type { Shelf, FeedStory, User } from '@/lib/types';

// Community tab: surfaces the writers a reader follows, the latest chapters
// from those writers, and what's popular across NovelStack this week.
export default function Community() {
  const [following, setFollowing] = useState<User[]>([]);
  const [feed, setFeed] = useState<FeedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Unfollow a writer — the × badge on their avatar. Removes optimistically.
  async function unfollow(w: User) {
    if (pendingId) return;
    setPendingId(w.id);
    try {
      await apiSend('/api/follows', 'POST', { authorId: w.id });
      setFollowing((list) => list.filter((x) => x.id !== w.id));
    } catch {
      // Leave the list unchanged on failure.
    }
    setPendingId(null);
  }

  const load = useCallback(async () => {
    // The shelf endpoint 401s when signed out — treat that as "follows nobody".
    let follows: User[] = [];
    try {
      const shelf = await apiGet<Shelf>('/api/me/shelf');
      follows = shelf.following ?? [];
    } catch {
      follows = [];
    }

    let stories: FeedStory[] = [];
    try {
      stories = await apiGet<FeedStory[]>('/api/feed');
    } catch {
      stories = [];
    }

    setFollowing(follows);
    setFeed(stories);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const fromWriters = feed
    .filter((s) => s._reason === 'From a writer you follow')
    .slice(0, 12);
  const popular = [...feed]
    .sort((a, b) => (b.totalReads ?? 0) - (a.totalReads ?? 0))
    .slice(0, 10);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Community</Text>

        {loading ? (
          <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            {/* Writers you follow */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Writers you follow</Text>
              <Text style={styles.sectionCount}>{following.length}</Text>
            </View>
            {following.length === 0 ? (
              <Text style={styles.empty}>
                You're not following any writers yet.
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.avatarRail}
              >
                {following.map((w) => (
                  <View key={w.id} style={styles.avatarItem}>
                    <View style={styles.avatar}>
                      {w.avatarUrl ? (
                        <Image source={{ uri: w.avatarUrl }} style={styles.avatarImg} />
                      ) : (
                        <Text style={styles.avatarInitial}>
                          {(w.displayName ?? '?').slice(0, 1).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <Pressable
                      style={[styles.unfollowBadge, pendingId === w.id && { opacity: 0.5 }]}
                      onPress={() => unfollow(w)}
                      disabled={pendingId === w.id}
                      hitSlop={8}
                    >
                      <Ionicons name="close" size={12} color="#FFFFFF" />
                    </Pressable>
                    <Text style={styles.avatarName} numberOfLines={1}>
                      {w.displayName}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* New from your writers */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New from your writers</Text>
            </View>
            {fromWriters.length === 0 ? (
              <Text style={styles.empty}>
                Nothing new yet — follow a few writers to see their latest here.
              </Text>
            ) : (
              <View style={styles.list}>
                {fromWriters.map((s) => (
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
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {s.title}
                      </Text>
                      <Text style={styles.rowMeta} numberOfLines={1}>
                        by {s.author?.displayName ?? 'A writer'} · {s.genre}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Popular this week */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular this week</Text>
            </View>
            {popular.length === 0 ? (
              <Text style={styles.empty}>Nothing trending yet.</Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.rail}
              >
                {popular.map((s) => (
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
            )}
          </>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingBottom: spacing.xl },

  pageTitle: {
    fontSize: 25,
    fontWeight: '500',
    color: colors.ink,
    paddingHorizontal: 20,
    paddingTop: 4,
    letterSpacing: -0.3,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 19, fontWeight: '500', color: colors.ink },
  sectionCount: { fontSize: 14, color: colors.inkFaint },

  empty: {
    fontSize: 13,
    color: colors.inkMuted,
    paddingHorizontal: 20,
  },

  avatarRail: { gap: 16, paddingHorizontal: 20, paddingBottom: 4 },
  avatarItem: { width: 64, alignItems: 'center' },
  unfollowBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(20,16,10,0.92)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    borderWidth: 2,
    borderColor: colors.signal,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 64, height: 64 },
  avatarInitial: { color: colors.ink, fontSize: 24, fontWeight: '600' },
  avatarName: {
    fontSize: 11,
    color: colors.inkMuted,
    marginTop: 6,
    textAlign: 'center',
  },

  list: { paddingHorizontal: 20, gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowCover: { width: 46, height: 62, borderRadius: 6 },
  rowText: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  rowMeta: { fontSize: 12, color: colors.inkFaint, marginTop: 2 },

  rail: { gap: 13, paddingHorizontal: 20, paddingBottom: 4 },
  railItem: { width: 118 },
  railCover: { width: 118, height: 166, borderRadius: 10 },
  railTitle: { fontSize: 12, fontWeight: '500', color: colors.ink, marginTop: 8 },
  railAuthor: { fontSize: 11, color: colors.inkFaint, marginTop: 1 },
});
