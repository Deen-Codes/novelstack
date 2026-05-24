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
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGetCached, apiSend, getSessionToken } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { Cover } from '@/components/Cover';
import { TopBar } from '@/components/TopBar';
import { SignInPitch } from '@/components/SignInPitch';
import { AmbientGlow } from '@/components/AmbientGlow';
import { RecentActivity } from '@/components/RecentActivity';
import type { Shelf, FeedStory, User } from '@/lib/types';

// Community tab: one writers rail that's always full — the people you follow,
// topped up with popular writers to discover — plus new chapters from writers
// you follow and a live activity strip.
export default function Community() {
  const [following, setFollowing] = useState<User[]>([]);
  const [feed, setFeed] = useState<FeedStory[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = await getSessionToken();
    let follows: User[] = [];
    let id: string | null = null;
    if (token) {
      try {
        const shelf = await apiGetCached<Shelf>('/api/me/shelf');
        follows = shelf.following ?? [];
      } catch {
        follows = [];
      }
      const me = await getCurrentUser();
      id = me?.id ?? null;
    }
    let stories: FeedStory[] = [];
    try {
      stories = await apiGetCached<FeedStory[]>('/api/feed');
    } catch {
      stories = [];
    }
    setSignedIn(!!token);
    setMeId(id);
    setFollowing(follows);
    setFeed(stories);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function follow(w: User) {
    if (pendingId) return;
    setPendingId(w.id);
    try {
      await apiSend('/api/follows', 'POST', { authorId: w.id });
      setFollowing((list) => [...list, w]);
    } catch {
      // Leave unchanged on failure.
    }
    setPendingId(null);
  }

  async function unfollow(w: User) {
    if (pendingId) return;
    setPendingId(w.id);
    try {
      await apiSend('/api/follows', 'POST', { authorId: w.id });
      setFollowing((list) => list.filter((x) => x.id !== w.id));
    } catch {
      // Leave unchanged on failure.
    }
    setPendingId(null);
  }

  const followedIds = new Set(following.map((w) => w.id));

  // Distinct authors from the feed the reader doesn't already follow.
  const suggested: User[] = [];
  const seen = new Set<string>();
  for (const s of feed) {
    const a = s.author;
    if (a && !seen.has(a.id) && !followedIds.has(a.id) && a.id !== meId) {
      seen.add(a.id);
      suggested.push(a);
    }
    if (suggested.length >= 16) break;
  }

  // One rail: who you follow first, then popular writers to discover. It looks
  // the same whether you follow nobody or fifty people — never an empty state.
  const writers: { user: User; isFollowing: boolean }[] = [
    ...following.map((w) => ({ user: w, isFollowing: true })),
    ...suggested.map((w) => ({ user: w, isFollowing: false })),
  ].slice(0, 16);

  const fromWriters = feed
    .filter((s) => s._reason === 'From a writer you follow')
    .slice(0, 12);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {!signedIn && !loading && <AmbientGlow />}
      <TopBar page="community" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            {signedIn ? (
              <>
                {/* Writers — always full: people you follow, topped up with
                    popular writers to discover. */}
                {writers.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Writers</Text>
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.avatarRail}
                    >
                      {writers.map(({ user: w, isFollowing }) => (
                        <View key={w.id} style={styles.avatarItem}>
                          <View
                            style={[
                              styles.avatar,
                              isFollowing ? styles.avatarFollowed : styles.avatarDiscover,
                            ]}
                          >
                            {w.avatarUrl ? (
                              <Image source={{ uri: w.avatarUrl }} style={styles.avatarImg} />
                            ) : (
                              <Text style={styles.avatarInitial}>
                                {(w.displayName ?? '?').slice(0, 1).toUpperCase()}
                              </Text>
                            )}
                          </View>
                          <Pressable
                            style={[
                              styles.badge,
                              isFollowing ? styles.badgeFollowing : styles.badgeFollow,
                              pendingId === w.id && { opacity: 0.5 },
                            ]}
                            onPress={() => (isFollowing ? unfollow(w) : follow(w))}
                            disabled={pendingId === w.id}
                            hitSlop={8}
                          >
                            <Ionicons
                              name={isFollowing ? 'checkmark' : 'add'}
                              size={13}
                              color="#FFFFFF"
                            />
                          </Pressable>
                          <Text style={styles.avatarName} numberOfLines={1}>
                            {w.displayName}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                    <Text style={styles.railHint}>
                      {following.length === 0
                        ? 'Tap + to follow a writer and fill your feed.'
                        : 'Tap + to follow more writers.'}
                    </Text>
                  </>
                )}

                {/* New from your writers */}
                {fromWriters.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>New from your writers</Text>
                    </View>
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
                  </>
                )}
              </>
            ) : (
              <SignInPitch
                headline="Join the community"
                sub="Follow your favourite writers and get a feed of every new chapter they post."
              />
            )}

            {/* Recent activity — a live, self-refreshing strip */}
            <RecentActivity stories={feed} />
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

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontFamily: fonts.display, fontSize: 19, color: colors.ink },

  avatarRail: { gap: 16, paddingHorizontal: 20, paddingBottom: 4 },
  avatarItem: { width: 66, alignItems: 'center' },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarFollowed: { borderColor: colors.signal },
  avatarDiscover: { borderColor: colors.border },
  avatarImg: { width: 66, height: 66 },
  avatarInitial: { color: colors.ink, fontSize: 24, fontWeight: '600' },
  avatarName: { fontSize: 11, color: colors.inkMuted, marginTop: 6, textAlign: 'center' },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeFollow: { backgroundColor: colors.signal },
  badgeFollowing: { backgroundColor: '#5A4D40' },
  railHint: {
    fontSize: 12,
    color: colors.inkFaint,
    paddingHorizontal: 20,
    marginTop: 12,
  },

  list: { paddingHorizontal: 20, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowCover: { width: 46, height: 62, borderRadius: 6 },
  rowText: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  rowMeta: { fontSize: 12, color: colors.inkFaint, marginTop: 2 },
});
