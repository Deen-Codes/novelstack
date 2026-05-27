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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { getCurrentUser, signOut, subscribeAuthChange } from '@/lib/auth';
import { apiGet } from '@/lib/api';
import { Cover } from './Cover';
import { SignInPitch } from './SignInPitch';
import type { User, Shelf, Story } from '@/lib/types';

// Compactor matching the public profile so the two read the same.
function compact(n: number): string {
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString('en-US');
}

// The profile bottom sheet — opened from the TopBar avatar. A live preview
// of your own public profile (Instagram-style top card with inline edit
// pencils, horizontal stories rail, bottom menu of account essentials).
// Sits flush against the bottom of the screen so it doesn't look orphaned.
export function ProfileSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
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
          // Best-effort.
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [visible]);

  // Close the sheet the moment the session changes — dismisses itself once
  // a sign-in (from the inline email form) completes.
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

  // Pencils all jump to the full /profile edit screen — inline editing inside
  // a bottom sheet over the keyboard is fragile; the dedicated screen is the
  // honest place to make changes.
  const editProfile = () => go('/profile');

  const totalReads = stories.reduce((sum, s) => sum + (s.totalReads ?? 0), 0);

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
              contentContainerStyle={[
                styles.scroll,
                { paddingBottom: Math.max(insets.bottom, 12) + 24 },
              ]}
            >
              {/* Instagram-style top card — avatar left, name + handle to its
                  right with inline pencil icons. Tapping any pencil jumps to
                  the full edit screen. */}
              <View style={styles.card}>
                <View style={styles.cardRow}>
                  <Pressable onPress={editProfile} hitSlop={4}>
                    <View style={styles.avatar}>
                      {user.avatarUrl ? (
                        <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
                      ) : (
                        <Text style={styles.avatarText}>
                          {(user.displayName || '?').slice(0, 1).toUpperCase()}
                        </Text>
                      )}
                      <View style={styles.avatarPencil}>
                        <Ionicons name="pencil" size={11} color="#FFFFFF" />
                      </View>
                    </View>
                  </Pressable>
                  <View style={styles.cardMain}>
                    <Pressable
                      style={styles.editableRow}
                      onPress={editProfile}
                      hitSlop={4}
                    >
                      <Text style={styles.name} numberOfLines={1}>
                        {user.displayName}
                      </Text>
                      <Ionicons name="pencil" size={13} color={colors.inkMuted} />
                    </Pressable>
                    <Pressable
                      style={styles.editableRow}
                      onPress={editProfile}
                      hitSlop={4}
                    >
                      <Text style={styles.handle} numberOfLines={1}>
                        @{user.username}
                      </Text>
                      <Ionicons name="pencil" size={11} color={colors.inkFaint} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.stats}>
                  <View style={styles.stat}>
                    <Text style={styles.statN}>{stories.length}</Text>
                    <Text style={styles.statL}>
                      {stories.length === 1 ? 'story' : 'stories'}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statN}>{compact(totalReads)}</Text>
                    <Text style={styles.statL}>reads</Text>
                  </View>
                  <Pressable
                    style={styles.stat}
                    onPress={() => go('/following')}
                    hitSlop={4}
                  >
                    <Text style={styles.statN}>{compact(following)}</Text>
                    <Text style={styles.statL}>following</Text>
                  </Pressable>
                </View>

                <Pressable
                  style={styles.editableBio}
                  onPress={editProfile}
                  hitSlop={4}
                >
                  <Text style={styles.bio} numberOfLines={3}>
                    {user.bio?.trim() || 'Add a bio so readers know who you are.'}
                  </Text>
                  <Ionicons name="pencil" size={12} color={colors.inkFaint} />
                </Pressable>
              </View>

              {/* Horizontal stories rail — left/right scroll instead of a
                  grid, leaving the bottom menu room to breathe. */}
              {stories.length > 0 && (
                <>
                  <Text style={styles.section}>Stories</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.rail}
                  >
                    {stories.map((s) => (
                      <Pressable
                        key={s.id}
                        style={styles.railItem}
                        onPress={() => go(`/story/${s.slug}`)}
                      >
                        <Cover
                          coverUrl={s.coverUrl}
                          coverColor={s.coverColor}
                          title={s.title}
                          mature={s.isMature}
                          style={styles.railCover}
                        />
                        <Text style={styles.railTitle} numberOfLines={2}>
                          {s.title}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </>
              )}
              {stories.length === 0 && (
                <Pressable style={styles.startWriting} onPress={() => go('/write')}>
                  <Ionicons name="create-outline" size={20} color={colors.signal} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.startWritingTitle}>Start writing</Text>
                    <Text style={styles.startWritingSub}>
                      Publish your first story — readers can save, tip and follow.
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
                </Pressable>
              )}

              {/* Bottom menu — NovelStack+ first (coral, primary), then the
                  practical account rows. */}
              <Pressable style={styles.plusRow} onPress={() => go('/plus')}>
                <View style={styles.plusIcon}>
                  <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.plusTitle}>NovelStack+</Text>
                  <Text style={styles.plusSub}>Ad-free · every chapter unlocked</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.signal} />
              </Pressable>

              <View style={styles.menu}>
                <Pressable style={styles.mrow} onPress={() => go('/earnings')}>
                  <View style={styles.mico}>
                    <Ionicons name="cash-outline" size={17} color={colors.inkMuted} />
                  </View>
                  <Text style={styles.mlabel}>Earnings &amp; payouts</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
                </Pressable>
                <View style={styles.divider} />
                <Pressable style={styles.mrow} onPress={() => go('/blocked')}>
                  <View style={styles.mico}>
                    <Ionicons name="ban-outline" size={17} color={colors.inkMuted} />
                  </View>
                  <Text style={styles.mlabel}>Blocked users</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
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
    // No bottom padding on the sheet itself — sits flush against the screen
    // edge. The ScrollView handles safe-area bottom inset for its content.
    paddingBottom: 0,
    maxHeight: '92%',
  },
  scroll: { paddingTop: 4 },
  grab: {
    width: 38,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: '#4A4037',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },

  // Top card — Instagram-style.
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 18,
    padding: 14,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 72, height: 72 },
  avatarText: { fontSize: 28, fontWeight: '600', color: '#FFFFFF' },
  avatarPencil: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.signal,
    borderWidth: 2,
    borderColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMain: { flex: 1, minWidth: 0 },
  editableRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontFamily: fonts.displayXl, fontSize: 21, color: colors.ink },
  handle: { fontSize: 13, color: colors.inkFaint, marginTop: 2 },

  stats: {
    flexDirection: 'row',
    marginTop: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  stat: { flex: 1, alignItems: 'center' },
  statN: { fontSize: 16, fontWeight: '700', color: colors.ink },
  statL: { fontSize: 11, color: colors.inkMuted, marginTop: 2 },

  editableBio: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
  },
  bio: { flex: 1, fontSize: 13.5, color: colors.inkMuted, lineHeight: 19 },

  section: {
    fontSize: 11,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  rail: { gap: 10, paddingHorizontal: 4, paddingBottom: 4 },
  railItem: { width: 92 },
  railCover: { width: 92, height: 122, borderRadius: 10 },
  railTitle: { fontSize: 11.5, fontWeight: '600', color: colors.ink, marginTop: 6 },

  startWriting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    padding: 14,
    marginTop: spacing.md,
  },
  startWritingTitle: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  startWritingSub: { fontSize: 12, color: colors.inkMuted, marginTop: 2 },

  // NovelStack+ row — coral surface to stand out from the plain account menu.
  plusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    borderRadius: 14,
    padding: 13,
    marginTop: spacing.lg,
  },
  plusIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: colors.signal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusTitle: { fontSize: 14.5, fontWeight: '700', color: colors.ink },
  plusSub: { fontSize: 12, color: '#C9A89F', marginTop: 1 },

  menu: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
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
    paddingVertical: 12,
    alignItems: 'center',
  },
  signOutText: { fontSize: 13.5, color: colors.inkMuted, fontWeight: '500' },
});
