import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Animated,
  ScrollView,
  View,
  Text,
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
import { getCurrentUser, subscribeAuthChange } from '@/lib/auth';
import { apiGet } from '@/lib/api';
import { Cover } from './Cover';
import { Avatar } from './Avatar';
import { SignInPitch } from './SignInPitch';
import type { User, Shelf, Story } from '@/lib/types';

// Compact stat number — "1.2k" / "12.4k" / "120k".
function compact(n: number): string {
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString('en-US');
}

// The profile bottom sheet — opened from the TopBar avatar. Single-glance
// preview: profile card, your stories rail, then two rows (Earnings,
// Settings). Settings is where the heavier flows live (edit profile,
// NovelStack+, blocked users, sign out, delete account) — keeps the sheet
// itself fit-on-screen with nothing to scroll.
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

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetH, 0],
  });

  const totalReads = stories.reduce((sum, s) => sum + (s.totalReads ?? 0), 0);

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.wrap}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: anim }]}>
          <Pressable style={styles.backdrop} onPress={onClose} />
        </Animated.View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 12) + 14 },
            { transform: [{ translateY }] },
          ]}
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
            <>
              {/* Profile card — avatar + name + handle + stats + bio. No
                  inline pencils anymore; editing happens in Settings. */}
              <View style={styles.card}>
                <View style={styles.cardRow}>
                  <Avatar url={user.avatarUrl} seed={user.id} size={68} />
                  <View style={styles.cardMain}>
                    <Text style={styles.name} numberOfLines={1}>
                      {user.displayName}
                    </Text>
                    <Text style={styles.handle} numberOfLines={1}>
                      @{user.username}
                    </Text>
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

                {!!user.bio?.trim() && (
                  <Text style={styles.bio} numberOfLines={2}>
                    {user.bio}
                  </Text>
                )}
              </View>

              {/* Horizontal stories rail — scrolls left/right within the
                  sheet without making the whole sheet scrollable. */}
              {stories.length > 0 ? (
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
              ) : (
                <Pressable style={styles.startWriting} onPress={() => go('/write')}>
                  <Ionicons name="create-outline" size={18} color={colors.signal} />
                  <Text style={styles.startWritingText}>Start your first story</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
                </Pressable>
              )}

              {/* Two-row menu at the bottom — heavy account flows live one
                  push away inside Settings. */}
              <View style={styles.menu}>
                <Pressable style={styles.mrow} onPress={() => go('/earnings')}>
                  <View style={styles.mico}>
                    <Ionicons name="cash-outline" size={17} color={colors.inkMuted} />
                  </View>
                  <Text style={styles.mlabel}>Earnings &amp; payouts</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
                </Pressable>
                <View style={styles.divider} />
                <Pressable style={styles.mrow} onPress={() => go('/settings')}>
                  <View style={styles.mico}>
                    <Ionicons name="settings-outline" size={17} color={colors.inkMuted} />
                  </View>
                  <Text style={styles.mlabel}>Settings</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
                </Pressable>
              </View>
            </>
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
    // No vertical scroll — sheet auto-sizes to its content. Sits flush
    // against the screen bottom thanks to the safe-area inset on
    // paddingBottom set inline above.
  },
  grab: {
    width: 38,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: '#4A4037',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },

  // Profile card.
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 18,
    padding: 14,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 68, height: 68 },
  avatarText: { fontSize: 27, fontWeight: '600', color: '#FFFFFF' },
  cardMain: { flex: 1, minWidth: 0 },
  name: { fontFamily: fonts.displayXl, fontSize: 20, color: colors.ink },
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

  bio: { fontSize: 13.5, color: colors.inkMuted, lineHeight: 19, marginTop: 12 },

  rail: { gap: 10, paddingHorizontal: 2, paddingTop: spacing.md, paddingBottom: 4 },
  railItem: { width: 84 },
  railCover: { width: 84, height: 112, borderRadius: 9 },
  railTitle: { fontSize: 11.5, fontWeight: '600', color: colors.ink, marginTop: 6 },

  startWriting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    padding: 12,
    marginTop: spacing.md,
  },
  startWritingText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.ink },

  menu: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: spacing.md,
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
});
