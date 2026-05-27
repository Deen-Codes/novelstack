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
import { genreLabel } from '@/lib/genres';
import { Cover } from '@/components/Cover';
import { TopBar } from '@/components/TopBar';
import { SignInPitch } from '@/components/SignInPitch';
import { AmbientGlow } from '@/components/AmbientGlow';
import { Typewriter } from '@/components/Typewriter';
import { StaggerIn } from '@/components/StaggerIn';
import { ago } from '@/lib/time';
import type { Shelf, FeedStory, User, CommunityPost } from '@/lib/types';

const SITE = 'https://novelstack.app';

// Community: a writers rail, an update composer, then a feed of author
// updates — each likeable, commentable and shareable.
export default function Community() {
  const [me, setMe] = useState<User | null>(null);
  const [following, setFollowing] = useState<User[]>([]);
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [feed, setFeed] = useState<FeedStory[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  // Suggested-writer ids the user has followed within this session — keeps
  // the discovery ghost cards from sticking around after the user has
  // already acted on them, without a refetch.
  const [justFollowed, setJustFollowed] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const token = await getSessionToken();
    if (!token) {
      // Not signed in — show the SignInPitch and skip authed fetches.
      setSignedIn(false);
      setMe(null);
      setFollowing([]);
      setSavedStories([]);
      setPosts([]);
      setFeed([]);
      setLoading(false);
      return;
    }
    // Fetch everything the screen needs in one parallel batch rather than a
    // four-request waterfall. `getCurrentUser` doubles as a session-validity
    // check — if it returns null the stored token was expired/rejected and we
    // fall back to the SignInPitch instead of showing an empty signed-in UI.
    const [user, shelf, updates, stories] = await Promise.all([
      getCurrentUser().catch(() => null),
      apiGetCached<Shelf>('/api/me/shelf').catch(() => null),
      apiGetCached<CommunityPost[]>('/api/community').catch(() => []),
      apiGetCached<FeedStory[]>('/api/feed').catch(() => []),
    ]);
    if (!user) {
      // Token was present but no longer valid — treat as signed out.
      setSignedIn(false);
      setMe(null);
      setFollowing([]);
      setSavedStories([]);
      setPosts([]);
      setFeed([]);
      setLoading(false);
      return;
    }
    setSignedIn(true);
    setMe(user);
    setFollowing(shelf?.following ?? []);
    setSavedStories(shelf?.saved ?? []);
    setPosts(updates);
    setFeed(stories);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Inline follow from a ghost discovery card. Optimistic — the card is
  // hidden immediately, reverts if the request fails.
  async function followInline(authorId: string) {
    setJustFollowed((s) => {
      const next = new Set(s);
      next.add(authorId);
      return next;
    });
    try {
      await apiSend('/api/follows', 'POST', { authorId });
    } catch {
      setJustFollowed((s) => {
        const next = new Set(s);
        next.delete(authorId);
        return next;
      });
    }
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

  // Rank writers worth surfacing in the empty-feed "Writers to follow"
  // section. Score combines straight popularity (reads + followers) with
  // a 2× boost for writers whose stories sit in genres the reader has
  // already saved — so suggestions feel personally relevant when the user
  // has reading history, and degrade to "trending" when they don't.
  const myGenres = new Set(savedStories.map((s) => s.genre));
  type WriterPick = {
    user: User;
    topStory: FeedStory;
    score: number;
    affinity: boolean;
  };
  const writerMap = new Map<string, WriterPick>();
  for (const s of feed) {
    const a = s.author;
    if (!a || followedIds.has(a.id) || a.id === me?.id) continue;
    const reach = (s.totalReads ?? 0) + (s.totalFollowers ?? 0) * 10;
    const aff = myGenres.has(s.genre);
    const bumped = aff ? reach * 2 : reach;
    const prev = writerMap.get(a.id);
    if (!prev) {
      writerMap.set(a.id, { user: a, topStory: s, score: bumped, affinity: aff });
    } else {
      prev.score += bumped;
      prev.affinity = prev.affinity || aff;
      const prevReach =
        (prev.topStory.totalReads ?? 0) + (prev.topStory.totalFollowers ?? 0) * 10;
      if (reach > prevReach) prev.topStory = s;
    }
  }
  const suggestedWriters = Array.from(writerMap.values())
    .sort((a, b) => {
      if (a.affinity !== b.affinity) return a.affinity ? -1 : 1;
      return b.score - a.score;
    })
    .slice(0, 6);

  // While the reader follows fewer than 5 writers, mix "ghost" discovery
  // cards into the feed. They look like normal posts (avatar, name, body,
  // book card) but the body is the story's own description and an honest
  // "Suggested" badge sits in place of the usual "Update" pill — so the
  // feed never feels empty while the reader is still figuring out who they
  // care about. Once they've committed (5+ follows) discovery steps back.
  const FOLLOW_THRESHOLD = 5;
  const ghostItems =
    following.length < FOLLOW_THRESHOLD
      ? suggestedWriters
          .filter((s) => !justFollowed.has(s.user.id))
          .slice(0, 5)
          .map((s) => ({ kind: 'ghost' as const, key: `g-${s.user.id}`, pick: s }))
      : [];
  type FeedItem =
    | { kind: 'post'; key: string; post: CommunityPost }
    | { kind: 'ghost'; key: string; pick: typeof suggestedWriters[number] };
  const feedItems: FeedItem[] = [
    ...posts.map((p) => ({ kind: 'post' as const, key: `p-${p.id}`, post: p })),
    ...ghostItems,
  ];

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
                  {writers.map(({ user: w, isFollowing }, idx) => (
                    <StaggerIn key={w.id} index={idx} baseDelayMs={45}>
                    <Pressable
                      style={styles.writer}
                      onPress={() => router.push(`/u/${w.username}`)}
                      hitSlop={4}
                    >
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
                      <Text style={styles.wName} numberOfLines={1}>
                        {w.displayName}
                      </Text>
                    </Pressable>
                    </StaggerIn>
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
              <View style={{ flex: 1 }}>
                <Typewriter
                  text="Share an update with your readers…"
                  style={styles.composerPh}
                  caretColor={colors.signal}
                  speedMs={38}
                  startDelayMs={400}
                />
              </View>
              <Ionicons name="create-outline" size={18} color={colors.signal} />
            </Pressable>

            {feedItems.length === 0 ? (
              <View style={styles.emptyFeed}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="chatbubbles-outline" size={24} color={colors.signal} />
                </View>
                <Text style={styles.emptyTitle}>Nothing here yet</Text>
                <Text style={styles.emptyBody}>
                  Follow some writers and their updates land here.
                </Text>
              </View>
            ) : (
              <View style={styles.feed}>
                {feedItems.map((item, idx) =>
                  item.kind === 'post' ? (
                    <StaggerIn key={item.key} index={idx} baseDelayMs={75}>
                      <Pressable
                        style={styles.post}
                        onPress={() => router.push(`/post/${item.post.id}`)}
                      >
                        <View style={styles.postHead}>
                          <Pressable
                            style={styles.postAv}
                            onPress={() =>
                              item.post.author?.username &&
                              router.push(`/u/${item.post.author.username}`)
                            }
                            hitSlop={4}
                          >
                            {item.post.author?.avatarUrl ? (
                              <Image
                                source={{ uri: item.post.author.avatarUrl }}
                                style={styles.postAvImg}
                              />
                            ) : (
                              <Text style={styles.postAvText}>
                                {(item.post.author?.displayName ?? '?')
                                  .slice(0, 1)
                                  .toUpperCase()}
                              </Text>
                            )}
                          </Pressable>
                          <Pressable
                            style={styles.postWho}
                            onPress={() =>
                              item.post.author?.username &&
                              router.push(`/u/${item.post.author.username}`)
                            }
                          >
                            <Text style={styles.postName} numberOfLines={1}>
                              {item.post.author?.displayName ?? 'A writer'}
                            </Text>
                            <Text style={styles.postTime}>{ago(item.post.createdAt)}</Text>
                          </Pressable>
                          <View style={styles.kind}>
                            <Text style={styles.kindText}>Update</Text>
                          </View>
                        </View>

                        <Text style={styles.postBody}>{item.post.body}</Text>

                        {item.post.story && (
                          <Pressable
                            style={styles.bookCard}
                            onPress={() =>
                              item.post.story &&
                              router.push(`/story/${item.post.story.slug}`)
                            }
                          >
                            <Cover
                              coverUrl={item.post.story.coverUrl}
                              coverColor={item.post.story.coverColor}
                              title={item.post.story.title}
                              mature={item.post.story.isMature}
                              style={styles.bookCover}
                            />
                            <View style={styles.bookInfo}>
                              <Text style={styles.bookTitle} numberOfLines={2}>
                                {item.post.story.title}
                              </Text>
                              <Text style={styles.bookRead}>Read story ›</Text>
                            </View>
                          </Pressable>
                        )}

                        <View style={styles.actions}>
                          <Pressable
                            style={styles.action}
                            onPress={() => toggleLike(item.post)}
                            hitSlop={6}
                          >
                            <Ionicons
                              name={item.post.likedByMe ? 'heart' : 'heart-outline'}
                              size={18}
                              color={item.post.likedByMe ? colors.signal : colors.inkMuted}
                            />
                            <Text style={styles.actionText}>{item.post.likeCount}</Text>
                          </Pressable>
                          <Pressable
                            style={styles.action}
                            onPress={() => router.push(`/post/${item.post.id}`)}
                            hitSlop={6}
                          >
                            <Ionicons
                              name="chatbubble-outline"
                              size={17}
                              color={colors.inkMuted}
                            />
                            <Text style={styles.actionText}>{item.post.commentCount}</Text>
                          </Pressable>
                          <View style={{ flex: 1 }} />
                          <Pressable
                            style={styles.action}
                            onPress={() => sharePost(item.post)}
                            hitSlop={6}
                          >
                            <Ionicons
                              name="arrow-redo-outline"
                              size={17}
                              color={colors.signal}
                            />
                            <Text style={styles.shareText}>Share</Text>
                          </Pressable>
                        </View>
                      </Pressable>
                    </StaggerIn>
                  ) : (
                    // Ghost discovery card — styled like a post for visual
                    // continuity, with a "Suggested" badge instead of "Update"
                    // (honest) and a primary Follow CTA in the actions row.
                    <StaggerIn key={item.key} index={idx} baseDelayMs={75}>
                      <View style={styles.post}>
                        <View style={styles.postHead}>
                          <Pressable
                            style={styles.postAv}
                            onPress={() => router.push(`/u/${item.pick.user.username}`)}
                            hitSlop={4}
                          >
                            {item.pick.user.avatarUrl ? (
                              <Image
                                source={{ uri: item.pick.user.avatarUrl }}
                                style={styles.postAvImg}
                              />
                            ) : (
                              <Text style={styles.postAvText}>
                                {(item.pick.user.displayName ?? '?')
                                  .slice(0, 1)
                                  .toUpperCase()}
                              </Text>
                            )}
                          </Pressable>
                          <Pressable
                            style={styles.postWho}
                            onPress={() => router.push(`/u/${item.pick.user.username}`)}
                          >
                            <Text style={styles.postName} numberOfLines={1}>
                              {item.pick.user.displayName}
                            </Text>
                            <Text style={styles.postTime}>
                              {item.pick.affinity
                                ? `Popular in ${genreLabel(item.pick.topStory.genre)}`
                                : 'Trending now'}
                            </Text>
                          </Pressable>
                          <View style={styles.kindSuggested}>
                            <Text style={styles.kindSuggestedText}>Suggested</Text>
                          </View>
                        </View>

                        {!!item.pick.topStory.description && (
                          <Text style={styles.postBody} numberOfLines={3}>
                            {item.pick.topStory.description}
                          </Text>
                        )}

                        <Pressable
                          style={styles.bookCard}
                          onPress={() =>
                            router.push(`/story/${item.pick.topStory.slug}`)
                          }
                        >
                          <Cover
                            coverUrl={item.pick.topStory.coverUrl}
                            coverColor={item.pick.topStory.coverColor}
                            title={item.pick.topStory.title}
                            mature={item.pick.topStory.isMature}
                            style={styles.bookCover}
                          />
                          <View style={styles.bookInfo}>
                            <Text style={styles.bookTitle} numberOfLines={2}>
                              {item.pick.topStory.title}
                            </Text>
                            <Text style={styles.bookRead}>Read story ›</Text>
                          </View>
                        </Pressable>

                        <View style={styles.actions}>
                          <Pressable
                            style={styles.followInlineBtn}
                            onPress={() => followInline(item.pick.user.id)}
                            hitSlop={6}
                          >
                            <Ionicons name="add" size={15} color="#15100E" />
                            <Text style={styles.followInlineText}>
                              Follow {item.pick.user.displayName.split(' ')[0]}
                            </Text>
                          </Pressable>
                          <View style={{ flex: 1 }} />
                          <Pressable
                            style={styles.action}
                            onPress={() => router.push(`/u/${item.pick.user.username}`)}
                            hitSlop={6}
                          >
                            <Ionicons
                              name="person-outline"
                              size={15}
                              color={colors.inkMuted}
                            />
                            <Text style={styles.actionText}>View profile</Text>
                          </Pressable>
                        </View>
                      </View>
                    </StaggerIn>
                  ),
                )}
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

  // Suggested-writers list shown in the empty-feed state.
  suggestList: {
    paddingHorizontal: 16,
    marginTop: spacing.sm,
    gap: 8,
  },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    padding: 12,
  },
  suggestAv: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  suggestAvImg: { width: 44, height: 44 },
  suggestAvText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  suggestName: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  suggestReason: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2 },

  // "Suggested" badge — visually distinct from the "Update" pill, slightly
  // calmer (cream-tint, not coral) so it reads as a recommendation, not a
  // brand-new post from someone you follow.
  kindSuggested: {
    backgroundColor: 'rgba(244,236,223,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244,236,223,0.25)',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  kindSuggestedText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.ink,
  },

  // Primary Follow CTA inside a ghost discovery card — cream pill matching
  // the rest of the app's primary buttons.
  followInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F4ECDF',
    borderRadius: radius.pill,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  followInlineText: { fontSize: 13, fontWeight: '700', color: '#15100E' },
});
