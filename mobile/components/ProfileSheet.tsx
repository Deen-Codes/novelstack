import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Animated,
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
import { colors, spacing, radius } from '@/theme/tokens';
import { getCurrentUser, signOut, subscribeAuthChange } from '@/lib/auth';
import { apiGet } from '@/lib/api';
import { SignInPitch } from './SignInPitch';
import type { User, Shelf } from '@/lib/types';

// The profile bottom sheet — opened from the TopBar avatar. The backdrop
// fades in while only the sheet panel slides up (RN's Modal "slide" would
// slide the whole black overlay as one block, which looks bad).
export function ProfileSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ following: 0, stories: 0, reads: 0 });
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
            setStats({
              following: shelf.following.length,
              stories: shelf.writing.length,
              reads: shelf.writing.reduce((sum, s) => sum + (s.totalReads ?? 0), 0),
            });
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

  function compactReads(n: number): string {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  }

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetH, 0],
  });

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
            <>
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
                <View>
                  <Text style={styles.name}>{user.displayName}</Text>
                  <Text style={styles.handle}>@{user.username}</Text>
                </View>
              </View>

              <View style={styles.stats}>
                <Pressable style={styles.stat} onPress={() => go('/following')}>
                  <Text style={styles.statN}>{stats.following}</Text>
                  <Text style={styles.statL}>Following</Text>
                </Pressable>
                <Pressable style={styles.stat} onPress={() => go('/write')}>
                  <Text style={styles.statN}>{stats.stories}</Text>
                  <Text style={styles.statL}>Stories</Text>
                </Pressable>
                <Pressable style={styles.stat} onPress={() => go('/library')}>
                  <Text style={styles.statN}>{compactReads(stats.reads)}</Text>
                  <Text style={styles.statL}>Reads</Text>
                </Pressable>
              </View>

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

              <View style={styles.menu}>
                <Pressable style={styles.mrow} onPress={() => go('/profile')}>
                  <View style={styles.mico}>
                    <Ionicons name="person-outline" size={17} color={colors.inkMuted} />
                  </View>
                  <Text style={styles.mlabel}>Edit profile</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
                </Pressable>
              </View>

              <Pressable style={styles.signOut} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign out</Text>
              </Pressable>
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
    paddingBottom: 36,
    paddingTop: 10,
  },
  grab: {
    width: 38,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: '#4A4037',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  signedOut: {
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 6,
    marginBottom: spacing.md,
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
  name: { fontSize: 21, fontWeight: '500', color: colors.ink },
  handle: { fontSize: 13, color: colors.inkFaint, marginTop: 2 },

  stats: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 13,
    paddingVertical: 11,
    alignItems: 'center',
  },
  statN: { fontSize: 18, fontWeight: '500', color: colors.ink },
  statL: {
    fontSize: 10,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },

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
    marginBottom: spacing.md,
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
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  signOutText: { fontSize: 13.5, color: colors.inkMuted, fontWeight: '500' },

  primaryBtn: {
    backgroundColor: colors.signal,
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: radius.pill,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
