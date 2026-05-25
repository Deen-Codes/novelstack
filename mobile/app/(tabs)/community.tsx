import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Share,
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
import { ago } from '@/lib/time';
import type { Shelf, FeedStory, User, CommunityPost } from '@/lib/types';

const SITE = 'https://novelstack.app';

// Community: a writers rail, an update composer, then a feed of author
// updates — each likeable, commentable and shareable.
export default function Community() {
  const [me, setMe] = useState<User | null>(null);
  const [following, setFollowing] = useState<User[]>([]);
  const [feed, setFeed] = useState<FeedStory[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = await getSessionToken();
    // Fetch everything the screen needs in one parallel batch rather than a
    // four-request waterfall.
    const [shelf, user, updates, stories] = await Promise.all([
      token
        ? apiGetCached<Shelf>('/api/me/shelf').catch(() => null)
        : Promise.resolve(null),
      token ? getCurrentUser().catch(() => null) : Promise.resolve(null),
      token
        ? apiGetCached<CommunityPost[]>('/api/community').catch(() => [])
        : Promise.resolve([]),
      apiGetCached<FeedStory[]>('/api/feed').catch(() => []),
    ]);
    setSignedIn(!!token);
    setMe(user);
    setFollowing(shelf?.following ?? []);
    setPosts(updates);
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
      // Leave unchanged.
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
      // Leave unchanged.
    }
    setPendingId(null);
  }

  // Optimistic like toggle on a feed card.
  async function toggleLike(p: CommunityPost) {
    setPosts((list) =>
      list.map((x) =>
        x.id === p.id
          ? {
              ...x,
              likedByMe: !x.likedByMe,
              likeCount: x.likeCount + (x.likedByMe ? -1 : 1),
            }
          : x,
      ),
    );
    try {
      const res = await apiSend<{ liked: boolean; likeCount: number }>(
        `/api/posts/${p.id}/like`,
        'POST',
      );
      setPosts((list) =>
        list.map((x) =>
          x.id === p.id ? { ...x, likedByMe: res.liked, likeCount: res.likeCount } : x,
        ),
      );
    } catch {
      // Revert on failure.
      setPosts((list) =>
        list.map((x) =>
          x.id === p.id
            ? {
                ...x,
                likedByMe: p.likedByMe,
                likeCount: p.likeCount,
              }
            : x,
        ),
      );
    }
  }

  async function sharePost(p: CommunityPost) {
    const url = p.story ? `${SITE}/story/${p.story.slug}` : SITE;
    const who = p.author?.displayName ?? 'A writer';
    try {
      await Share.share({
        message: p.story
          ? `${who} on NovelStack: “${p.body}” — read ${p.story.title}: ${url}`
          : `${who} on NovelStack: “${p.body}” — ${url}`,
      });
    } catch {
      // Share cancelled.
    }
  }

  const followedIds = new Set(following.map((w) => w.id));
  const suggested: User[] = [];
  const seen = new Set<string>();
  for (const s of feed) {
    const a = s.author;
    if (a && !seen.has(a.id) && !followedIds.has(a.id) && a.id !== me?.id) {
      seen.add(a.id);
      suggested.push(a);
    }
    if (suggested.length >= 16) break;
  }
  const writers: { user: User; isFollowing: boolean }[] = [
    ...following.map((w) => ({ user: w, isFollowing: true })),
    ...suggested.map((w) => ({ user: w, isFollowing: false })),
  ].slice(0, 16);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AmbientGlow />
      <TopBar page="community" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.xl }} />
        ) : !signedIn ? (
          <SignInPitch
            headline="Join the community"
            sub="Follow your favourite writers, get their updates, and share your own."
          />
        ) : (
          <>
            {writers.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Writers</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.rail}
                >
                  {writers.map(({ user: w, isFollowing }) => (
                    <View key={w.id} style={styles.writer}>
                      <View
                        style={[
                          styles.wAvatar,
                          isFollowing ? styles.wFollowed : styles.wDiscover,
                        ]}
                      >
                        {w.avatarUrl ? (
                          <Image source={{ uri: w.avatarUrl }} style={styles.wAvatarImg} />
                        ) : (
                          <Text style={styles.wInitial}>
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
                          size={12}
                          color="#FFFFFF"
                        />
                      </Pressable>
                      <Text style={styles.wName} numberOfLines={1}>
                        {w.displayName}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </>
            )}

            <Pressable style={styles.composer} onPress={() => router.push('/compose')}>
              <View style={styles.composerAv}>
                {me?.avatarUrl ? (
                  <Image source={{ uri: me.avatarUrl }} style={styles.composerAvImg} />
                ) : (
                  <Text style={styles.composerAvText}>
                    {(me?.displayName ?? '?').slice(0, 1).toUpperCase()}
                  </Text>
                )}
              </View>
              <Text style={styles.composerPh}>Share an update with your readers…</Text>
              <Ionicons name="create-outline" size={18} color={colors.signal} />
            </Pressable>

            {posts.length === 0 ? (
              <View style={styles.emptyFeed}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="chatbubbles-outline" size={24} color={colors.signal} />
                </View>
                <Text style={styles.emptyTitle}>No updates yet</Text>
                <Text style={styles.emptyBody}>
                  Follow writers to see their updates here — or share the first one yourself.
                </Text>
              </View>
            ) : (
              <View style={styles.feed}>
                {posts.map((p) => (
                  <Pressable
                    key={p.id}
                    style={styles.post}
                    onPress={() => router.push(`/post/${p.id}`)}
                  >
                    <View style={styles.postHead}>
                      <View style={styles.postAv}>
                        {p.author?.avatarUrl ? (
                          <Image
                            source={{ uri: p.author.avatarUrl }}
                            style={styles.postAvImg}
                          />
                        ) : (
                          <Text style={styles.postAvText}>
                            {(p.author?.displayName ?? '?').slice(0, 1).toUpperCase()}
                          </Text>
                        )}
                      </View>
                      <View style={styles.postWho}>
                        <Text style={styles.postName} numberOfLines={1}>
                          {p.author?.displayName ?? 'A writer'}
                        </Text>
                        <Text style={styles.postTime}>{ago(p.createdAt)}</Text>
                      </View>
                      <View style={styles.kind}>
                        <Text style={styles.kindText}>Update</Text>
                      </View>
                    </View>

                    <Text style={styles.postBody}>{p.body}</Text>

                    {p.story && (
                      <Pressable
                        style={styles.bookCard}
                        onPress={() => p.story && router.push(`/story/${p.story.slug}`)}
                      >
                        <Cover
                          coverUrl={p.story.coverUrl}
                          coverColor={p.story.coverColor}
                          title={p.story.title}
                          mature={p.story.isMature}
                          style={styles.bookCover}
                        />
                        <View style={styles.bookInfo}>
                          <Text style={styles.bookTitle} numberOfLines={2}>
                            {p.story.title}
                          </Text>
                          <Text style={styles.bookRead}>Read story ›</Text>
                        </View>
                      </Pressable>
                    )}

                    <View style={styles.actions}>
                      <Pressable
                        style={styles.action}
                        onPress={() => toggleLike(p)}
                        hitSlop={6}
                      >
                        <Ionicons
                          name={p.likedByMe ? 'heart' : 'heart-outline'}
                          size={18}
                          color={p.likedByMe ? colors.signal : colors.inkMuted}
                        />
                        <Text style={styles.actionText}>{p.likeCount}</Text>
                      </Pressable>
                      <Pressable
                        style={styles.action}
                        onPress={() => router.push(`/post/${p.id}`)}
                        hitSlop={6}
                      >
                        <Ionicons name="chatbubble-outline" size={17} color={colors.inkMuted} />
                        <Text style={styles.actionText}>{p.commentCount}</Text>
                      </Pressable>
                      <View style={{ flex: 1 }} />
                      <Pressable
                        style={styles.action}
                        onPress={() => sharePost(p)}
                        hitSlop={6}
                      >
                        <Ionicons name="arrow-redo-outline" size={17} color={colors.signal} />
                        <Text style={styles.shareText}>Share</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                ))}
              </View>
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

  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.ink,
    paddingHorizontal: 20,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  rail: { gap: 16, paddingHorizontal: 20, paddingBottom: 4 },
  writer: { width: 66, alignItems: 'center' },
  wAvatar: {
    width: 66,
    height: 66,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wFollowed: { borderColor: colors.signal },
  wDiscover: { borderColor: colors.border },
  wAvatarImg: { width: 66, height: 66 },
  wInitial: { color: colors.ink, fontSize: 24, fontWeight: '600' },
  wName: { fontSize: 11, color: colors.inkMuted, marginTop: 6, textAlign: 'center' },
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

  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginHorizontal: 20,
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  composerAv: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  composerAvImg: { width: 34, height: 34 },
  composerAvText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  composerPh: { flex: 1, color: colors.inkFaint, fontSize: 14 },

  feed: { paddingHorizontal: 16, marginTop: spacing.lg, gap: 14 },
  post: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 18,
    padding: 14,
  },
  postHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  postAv: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  postAvImg: { width: 40, height: 40 },
  postAvText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  postWho: { flex: 1, minWidth: 0 },
  postName: { fontSize: 14, fontWeight: '600', color: colors.ink },
  postTime: { fontSize: 12, color: colors.inkFaint, marginTop: 1 },
  kind: {
    backgroundColor: colors.signalSoft,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  kindText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#E59AA0',
  },
  postBody: { fontSize: 14.5, color: colors.ink, lineHeight: 21, marginTop: 11 },

  bookCard: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    backgroundColor: colors.paperSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 13,
    padding: 11,
  },
  bookCover: { width: 50, height: 68, borderRadius: 7 },
  bookInfo: { flex: 1, minWidth: 0, justifyContent: 'center' },
  bookTitle: { fontFamily: fonts.display, fontSize: 14.5, color: colors.ink },
  bookRead: { fontSize: 12.5, color: colors.signal, fontWeight: '600', marginTop: 5 },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 12,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 13, color: colors.inkMuted, fontWeight: '500' },
  shareText: { fontSize: 13, color: colors.signal, fontWeight: '600' },

  emptyFeed: { alignItems: 'center', paddingHorizontal: 36, marginTop: spacing.xl },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    marginTop: spacing.md,
  },
  emptyBody: {
    fontSize: 13.5,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
  },
});
