import { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { colors, radius, fonts } from '@/theme/tokens';
import { getCurrentUser, subscribeAuthChange } from '@/lib/auth';
import { ProfileSheet } from './ProfileSheet';
import type { User } from '@/lib/types';

// Shared top bar for the tab screens: the `n.{page}` mark on the left (e.g.
// n.home, n.search) and write · avatar on the right. The avatar opens the
// profile sheet.
export function TopBar({ page }: { page?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getCurrentUser().then((u) => {
        if (!cancelled) setUser(u ?? null);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  // Refresh the moment the session changes — chiefly so signing out clears
  // the avatar instead of leaving the old user's initial behind.
  useEffect(() => {
    return subscribeAuthChange(() => {
      getCurrentUser().then((u) => setUser(u ?? null));
    });
  }, []);

  return (
    <>
      <View style={styles.bar}>
        <Text style={styles.mark}>
          n<Text style={styles.dot}>.</Text>
          {page ? <Text style={styles.markPage}>{page}</Text> : null}
        </Text>
        <View style={styles.right}>
          <Pressable style={styles.icon} hitSlop={8} onPress={() => router.push('/write')}>
            <Ionicons name="create-outline" size={19} color={colors.signal} />
          </Pressable>
          <Pressable hitSlop={8} onPress={() => setSheetOpen(true)}>
            {user ? (
              <View style={styles.avatar}>
                {user.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.avatarText}>
                    {(user.displayName || '?').slice(0, 1).toUpperCase()}
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.icon}>
                <Ionicons name="person-outline" size={18} color={colors.inkMuted} />
              </View>
            )}
          </Pressable>
        </View>
      </View>
      <ProfileSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
  },
  mark: { fontSize: 24, fontFamily: fonts.displayXl, color: colors.ink, letterSpacing: -1 },
  dot: { color: colors.signal },
  markPage: { color: colors.inkMuted },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 38, height: 38 },
  avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
