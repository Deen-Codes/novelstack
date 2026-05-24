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
import { apiGet, apiSend, getSessionToken } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { Cover } from '@/components/Cover';
import { TopBar } from '@/components/TopBar';
import { SignInPitch } from '@/components/SignInPitch';
import type { Shelf, FeedStory, User } from '@/lib/types';

// Community tab: writers a reader follows, suggested writers to discover,
// the latest chapters from followed writers, and what's popular this week.
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
        const shelf = await apiGet<Shelf>('/api/me/shelf');
        follows = shelf.following ?? [];
      } catch {
        follows = [];
      }
      const me = await getCurrentUser();
      id = me?.id ?? null;
    }
    let stories: FeedStory[] = [];
    try {
      stories = await apiGet<FeedStory[]>('/api/feed');
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

  // Distinct authors from the feed the reader doesn't already follow — a
  // ready-made set of writers to discover, so Community is never empty.
  const suggested: User[] = [];
  const seen = new Set<string>();
  for (const s of feed) {
    const a = s.author;
    if (a && !seen.has(a.id) && !followedIds.has(a.id) && a.id !== meId) {
      seen.add(a.id);
      suggested.push(a);
    }
    if (suggested.length >= 12) break;
  }

  const fromWriters = feed
    .filter((s) => s._reason === 'From a writer you follow')
    .slice(0, 12);
  const popular = [...feed]
    .sort((a, b) => (b.totalReads ?? 0) - (a.totalReads ?? 0))
    .slice(0, 10);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar page="community" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            {signedIn ? (
              <>
            {/* Writers you follow */}
            {following.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Writers you follow</Text>
                  <Text style={styles.sectionCount}>{following.length}</Text>
                </View>
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
              </>
            )}

            {/* Suggested writers — discovery; keeps Community populated */}
            {suggested.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    {following.length === 0 ? 'Writers to follow' : 'Discover writers'}
                  </Text>
                </View>
                <View style={styles.list}>
                  {suggested.map((w) => (
                    <View key={w.id} style={styles.suggestRow}>
                      <View style={styles.suggestAvatar}>
                        {w.avatarUrl ? (
                          <Image source={{ uri: w.avatarUrl }} style={styles.suggestAvatarImg} />
                        ) : (
                          <Text style={styles.suggestInitial}>
                            {(w.displayName ?? '?').slice(0, 1).toUpperCase()}
                          </Text>
                        )}
                      </View>
                      <View style={styles.suggestText}>
                        <Text style={styles.suggestName} numberOfLines={1}>
                          {w.displayName}
                        </Text>
                        <Text style={styles.suggestMeta} numberOfLines={1}>
                          {w.bio ? w.bio : `@${w.username}`}
                        </Text>
                      </View>
                      <Pressable
                        style={[styles.followBtn, pendingId === w.id && { opacity: 0.5 }]}
                        onPress={() => follow(w)}
                        disabled={pendingId === w.id}
                      >
                        <Text style={styles.followBtnText}>Follow</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
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

            {/* Popular this week */}
            {popular.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Popular this week</Text>
                </View>
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
              </>
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
    fontFamily: fonts.displayXl,
    fontSize: 27,
    color: colors.ink,
    paddingHorizontal: 20,
    paddingTop: 4,
    letterSpacing: -0.6,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontFamily: fonts.display, fontSize: 19, color: colors.ink },
  sectionCount: { fontSize: 14, color: colors.inkFaint },

  signInCard: {
    marginHorizontal: 20,
    marginTop: spacing.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  signInTitle: { fontSize: 17, fontWeight: '500', color: colors.ink },
  signInBody: { fontSize: 13.5, color: colors.inkMuted, lineHeight: 20, marginTop: 6 },
  signInBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.signal,
    borderRadius: radius.pill,
    paddingHorizontal: 22,
    paddingVertical: 11,
    marginTop: spacing.md,
  },
  signInBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  avatarRail: { gap: 16, paddingHorizontal: 20, paddingBottom: 4 },
  avatarItem: { width: 64, alignItems: 'center' },
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
  avatarName: { fontSize: 11, color: colors.inkMuted, marginTop: 6, textAlign: 'center' },
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

  list: { paddingHorizontal: 20, gap: 12 },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: 11,
  },
  suggestAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  suggestAvatarImg: { width: 44, height: 44 },
  suggestInitial: { color: colors.ink, fontSize: 17, fontWeight: '600' },
  suggestText: { flex: 1, minWidth: 0 },
  suggestName: { fontSize: 15, fontWeight: '500', color: colors.ink },
  suggestMeta: { fontSize: 12, color: colors.inkFaint, marginTop: 2 },
  followBtn: {
    backgroundColor: colors.signal,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  followBtnText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
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
