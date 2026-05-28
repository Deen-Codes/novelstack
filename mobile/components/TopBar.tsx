import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { colors, radius, fonts } from '@/theme/tokens';
import { getCurrentUser, subscribeAuthChange } from '@/lib/auth';
import { getUnreadCount } from '@/lib/notifications';
import { ProfileSheet } from './ProfileSheet';
import { Avatar } from './Avatar';
import type { User } from '@/lib/types';

// Shared top bar for the tab screens: the `n.{page}` mark on the left (e.g.
// n.home, n.search) and a notification bell · avatar on the right.
export function TopBar({ page }: { page?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getCurrentUser().then((u) => {
        if (!cancelled) setUser(u ?? null);
      });
      getUnreadCount().then((n) => {
        if (!cancelled) setUnread(n);
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
          <Pressable
            style={styles.icon}
            hitSlop={8}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={19} color={colors.ink} />
            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
              </View>
            )}
          </Pressable>
          <Pressable hitSlop={8} onPress={() => setSheetOpen(true)}>
            {user ? (
              <Avatar url={user.avatarUrl} seed={user.id} size={38} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 38, height: 38 },
  avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.signal,
    borderWidth: 2,
    borderColor: colors.paper,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
});
