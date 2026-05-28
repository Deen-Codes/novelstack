import { useCallback, useEffect, useState } from 'react';
import { Animated, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { colors, radius, fonts } from '@/theme/tokens';
import { getCurrentUser, subscribeAuthChange } from '@/lib/auth';
import { getUnreadCount } from '@/lib/notifications';
import { ProfileSheet } from './ProfileSheet';
import { Avatar } from './Avatar';
import type { User } from '@/lib/types';

// The big resting size of the n.{page} mark. Sized so it comfortably fits
// inside the top bar — nothing clips, nothing overflows the bottom edge.
const TITLE_BIG = 34;
// What it settles to as the user scrolls down — the previous default size,
// keeping the bar tidy once you're deep in the page.
const TITLE_SMALL = 24;
// How far the user has to scroll for the shrink to finish — keeps the
// transition responsive without feeling jumpy.
const SHRINK_RANGE = 70;
// Height of the bar's content row (sits below the safe-area inset). Tall
// enough for the big title to breathe and never touch the gradient fade.
const BAR_CONTENT_HEIGHT = 60;

// Pages place their scrollable content under the absolute top bar — this
// hook returns the right paddingTop so the first item lands cleanly below.
export function useTopBarOffset() {
  const insets = useSafeAreaInsets();
  return insets.top + BAR_CONTENT_HEIGHT;
}

// Shared top bar for the tab screens: the `n.{page}` mark on the left (e.g.
// n.home, n.search) and a notification bell · avatar on the right. Now
// overlays the page so the scroll content slides up behind a translucent
// dark backdrop — Netflix-style. The title also shrinks from a large
// resting size to the small "scrolled" size as the user scrolls down.
export function TopBar({
  page,
  scrollY,
}: {
  page?: string;
  scrollY?: Animated.Value;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const insets = useSafeAreaInsets();

  // If the page doesn't pass a scrollY, the title just stays small — same as
  // the old behaviour. Pages that wire it in get the shrink animation.
  const sy = scrollY ?? new Animated.Value(SHRINK_RANGE);
  const titleSize = sy.interpolate({
    inputRange: [0, SHRINK_RANGE],
    outputRange: [TITLE_BIG, TITLE_SMALL],
    extrapolate: 'clamp',
  });
  // Backdrop opacity rises a hair as you scroll so the very top of the page
  // keeps a clean transparent look at rest, then settles into a darker
  // frosted-glass feel once content is sliding behind.
  const backdropOpacity = sy.interpolate({
    inputRange: [0, SHRINK_RANGE],
    outputRange: [0.55, 0.82],
    extrapolate: 'clamp',
  });

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

  useEffect(() => {
    return subscribeAuthChange(() => {
      getCurrentUser().then((u) => setUser(u ?? null));
    });
  }, []);

  return (
    <>
      <View
        pointerEvents="box-none"
        style={[
          styles.barWrap,
          { paddingTop: insets.top, height: insets.top + BAR_CONTENT_HEIGHT },
        ]}
      >
        {/* Translucent backdrop — the closest we get to a real blur without
            shipping expo-blur (which would force a native build). On the
            dark paper background this reads as a frosted dark layer. */}
        <Animated.View
          pointerEvents="none"
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
        {/* A soft fade just under the bar so content peeks through the
            transition instead of meeting a hard edge. */}
        <LinearGradient
          colors={['rgba(20,17,15,0.65)', 'transparent']}
          locations={[0, 1]}
          style={styles.fade}
          pointerEvents="none"
        />

        <View style={[styles.row, { height: BAR_CONTENT_HEIGHT }]}>
          <Animated.Text style={[styles.mark, { fontSize: titleSize }]}>
            n<Text style={styles.dot}>.</Text>
            {page ? <Text style={styles.markPage}>{page}</Text> : null}
          </Animated.Text>
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
      </View>
      <ProfileSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  // The bar floats above the scroll content so pages can slide behind it.
  barWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  // Full-cover translucent dark layer.
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.paper,
  },
  // Sits just below the bar — fades the lower edge so it doesn't draw a
  // sharp line across the page.
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -14,
    height: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  mark: {
    fontFamily: fonts.displayXl,
    color: colors.ink,
    letterSpacing: -1,
    // Anchor to the baseline so the big-to-small shrink reads as collapsing
    // toward the bottom-left, like Apple's large titles.
    includeFontPadding: false,
  },
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
