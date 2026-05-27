import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Animated,
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { getCurrentUser, signOut, subscribeAuthChange } from '@/lib/auth';
import { apiGet } from '@/lib/api';
import { Cover } from './Cover';
import { SignInPitch } from './SignInPitch';
import type { User, Shelf, Story } from '@/lib/types';

// The profile bottom sheet — opened from the TopBar avatar. Shows the
// signed-in user's public profile preview (avatar, name, bio, following
// count, stories grid) so they see themselves the way other readers do,
// with an inline Edit pill jumping to the full settings screen. Earnings,
// blocked users, sign-out and account deletion live at the bottom.
//
// The backdrop fades in while only the sheet panel slides up — RN's Modal
// "slide" would slide the whole black overlay as one block, which looks bad.
export function ProfileSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [following, setFollowing] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Animation: 0 = closed, 1 = open. `mounted` keeps the Modal alive through
  // the closing animation.
  const [mounted, setMounted] = useState(false);
  const [sheetH, setSheetH] = useState(700);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const u = await getCurrentUser();
      if (cancelled) return;
      setUser(u ?? null);
      if (u) {
        try {
          const shelf = await apiGet<Shelf>('/api/me/shelf');
          if (!cancelled) {
            setFollowing(shelf.following.length);
            setStories(shelf.writing);
          }
        } catch {
          // Stats are best-effort.
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [visible]);

  // Close the sheet the moment the session changes — chiefly so it dismisses
  // itself once a sign-in (from the inline email form) completes.
  useEffect(() => {
    return subscribeAuthChange(() => {
      if (visible) onClose();
    });
  }, [visible, onClose]);

  function go(path: string) {
    onClose();
    router.push(path as never);
  }

  async function handleSignOut() {
    await signOut();
    onClose();
    router.replace('/(tabs)');
  }

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetH, 0],
  });

  // Limit the grid preview to 6 (two rows). "View all" jumps to Write where
  // the full list lives, so we don't blow out the sheet's height.
  const previewStories = stories.slice(0, 6);
  const hasMoreStories = stories.length > previewStories.length;

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.wrap}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: anim }]}>
          <Pressable style={styles.backdrop} onPress={onClose} />
        </Animated.View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          onLayout={(e) => setSheetH(e.nativeEvent.layout.height)}
        >
          <View style={styles.grab} />
          {loading ? (
            <ActivityIndicator color={colors.signal} style={{ marginVertical: 60 }} />
          ) : !user ? (
            <SignInPitch
              headline="Sign in to NovelStack"
              sub="Follow writers, save stories, and pick up where you left off — no password needed."
            />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scroll}
            >
              {/* Header — avatar + name + handle + inline Edit pill */}
              <View style={styles.head}>
                <View style={styles.avatar}>
                  {user.avatarUrl ? (
                    <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
                  ) : (
                    <Text style={styles.avatarText}>
                      {(user.displayName || '?').slice(0, 1).toUpperCase()}
                    </Text>
                  )}
                </View>
                <View style={styles.headMain}>
                  <Text style={styles.name} numberOfLines={1}>
                    {user.displayName}
                  </Text>
                  <Text style={styles.handle} numberOfLines={1}>
                    @{user.username}
                  </Text>
                </View>
                <Pressable
                  style={styles.editPill}
                  onPress={() => go('/profile')}
                  hitSlop={6}
                >
                  <Ionicons name="pencil" size={13} color={colors.ink} />
                  <Text style={styles.editPillText}>Edit</Text>
                </Pressable>
              </View>

              {/* Bio — only if set */}
              {!!user.bio && <Text style={styles.bio}>{user.bio}</Text>}

              {/* Single-line stat row — following + stories. No follower count,
                  deliberately: NovelStack doesn't surface a chase metric. */}
              <Pressable style={styles.statRow} onPress={() => go('/following')}>
                <Text style={styles.statText}>
                  <Text style={styles.statN}>{following}</Text>
                  <Text style={styles.statL}> following</Text>
                </Text>
                <Text style={styles.statDot}>·</Text>
                <Text style={styles.statText}>
                  <Text style={styles.statN}>{stories.length}</Text>
                  <Text style={styles.statL}>
                    {stories.length === 1 ? ' story' : ' stories'}
                  </Text>
                </Text>
              </Pressable>

              {/* NovelStack+ upsell */}
              <Pressable style={styles.plus} onPress={() => go('/plus')}>
                <View style={styles.plusIcon}>
                  <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.plusTitle}>NovelStack+</Text>
                  <Text style={styles.plusSub}>Ad-free · every chapter unlocked</Text>
                </View>
                <View style={styles.plusGo}>
                  <Text style={styles.plusGoText}>Upgrade</Text>
                </View>
              </Pressable>

              {/* Stories grid — Instagram-style 3 columns. Empty state pitches
                  the writer to publish their first. */}
              {previewStories.length > 0 ? (
                <>
                  <Text style={styles.sectionLabel}>Stories</Text>
                  <View style={styles.grid}>
                    {previewStories.map((s) => (
                      <Pressable
                        key={s.id}
                        style={styles.gridItem}
                        onPress={() => go(`/story/${s.slug}`)}
                      >
                        <Cover
                          coverUrl={s.coverUrl}
                          coverColor={s.coverColor}
                          title={s.title}
                          mature={s.isMature}
                          style={styles.gridCover}
                        />
                      </Pressable>
                    ))}
                  </View>
                  {hasMoreStories && (
                    <Pressable style={styles.viewAll} onPress={() => go('/write')}>
                      <Text style={styles.viewAllText}>
                        View all {stories.length} stories
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={14}
                        color={colors.signal}
                      />
                    </Pressable>
                  )}
                </>
              ) : (
                <Pressable style={styles.startWriting} onPress={() => go('/write')}>
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={colors.signal}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.startWritingTitle}>Start writing</Text>
                    <Text style={styles.startWritingSub}>
                      Publish your first story — readers can save, tip and follow.
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
                </Pressable>
              )}

              {/* Account essentials — earnings, blocked users — live at the
                  bottom of the sheet, below the public-facing preview. */}
              <View style={styles.menu}>
                <Pressable style={styles.mrow} onPress={() => go('/earnings')}>
                  <View style={styles.mico}>
                    <Ionicons
                      name="cash-outline"
                      size={17}
                      color={colors.inkMuted}
                    />
                  </View>
                  <Text style={styles.mlabel}>Earnings &amp; payouts</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.inkFaint}
                  />
                </Pressable>
                <View style={styles.divider} />
                <Pressable style={styles.mrow} onPress={() => go('/blocked')}>
                  <View style={styles.mico}>
                    <Ionicons name="ban-outline" size={17} color={colors.inkMuted} />
                  </View>
                  <Text style={styles.mlabel}>Blocked users</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.inkFaint}
                  />
                </Pressable>
              </View>

              <Pressable style={styles.signOut} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign out</Text>
              </Pressable>
            </ScrollView>
          )}
        </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { flex: 1, backgroundColor: 'rgba(6,5,5,0.66)' },
  sheet: {
    backgroundColor: colors.paperSoft,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 16,
    paddingTop: 10,
    // Cap the sheet at ~85% of typical screen height so the ScrollView is
    // the bit that scrolls, not the sheet itself.
    maxHeight: '88%',
  },
  scroll: { paddingBottom: 36 },
  grab: {
    width: 38,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: '#4A4037',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },

  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 6,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 62, height: 62 },
  avatarText: { fontSize: 25, fontWeight: '600', color: '#FFFFFF' },
  headMain: { flex: 1, minWidth: 0 },
  name: { fontFamily: fonts.display, fontSize: 20, color: colors.ink },
  handle: { fontSize: 13, color: colors.inkFaint, marginTop: 2 },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  editPillText: { fontSize: 12.5, fontWeight: '600', color: colors.ink },

  bio: {
    fontSize: 14,
    color: colors.inkMuted,
    lineHeight: 20,
    marginTop: spacing.md,
    paddingHorizontal: 6,
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: 6,
  },
  statText: { fontSize: 13.5 },
  statN: { color: colors.ink, fontWeight: '700' },
  statL: { color: colors.inkMuted },
  statDot: { color: colors.inkFaint, fontSize: 13.5 },

  sectionLabel: {
    fontSize: 11,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 6,
  },
  // Three columns inside the sheet. Sheet has 22px horizontal padding total
  // (16 + 6) on each side; the remaining ~290–340pt is split into 3 cells
  // with 6pt gaps. Using % keeps it responsive across phone widths.
  gridItem: { width: '32.5%' },
  gridCover: { width: '100%', aspectRatio: 3 / 4, borderRadius: 8 },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    marginTop: 4,
  },
  viewAllText: { fontSize: 13, color: colors.signal, fontWeight: '600' },

  startWriting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    padding: 14,
    marginTop: spacing.sm,
  },
  startWritingTitle: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  startWritingSub: { fontSize: 12, color: colors.inkMuted, marginTop: 2 },

  plus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    borderRadius: 16,
    padding: 14,
    marginBottom: spacing.md,
  },
  plusIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: colors.signal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusTitle: { fontSize: 14, fontWeight: '600', color: colors.ink },
  plusSub: { fontSize: 11.5, color: '#C9A89F', marginTop: 1 },
  plusGo: {
    backgroundColor: colors.signal,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  plusGoText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },

  menu: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: spacing.lg,
  },
  mrow: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 13 },
  divider: { height: 1, backgroundColor: '#2A231F' },
  mico: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.cardHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mlabel: { flex: 1, fontSize: 14.5, color: colors.ink },

  signOut: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  signOutText: { fontSize: 13.5, color: colors.inkMuted, fontWeight: '500' },
});
