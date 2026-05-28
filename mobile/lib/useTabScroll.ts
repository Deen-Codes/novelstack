import { useCallback, useRef } from 'react';
import { Animated, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTopBarOffset } from '@/components/TopBar';

// Every tab page (Home, Library, Search, Community, Write) shares the same
// scroll/topbar plumbing:
//   - an Animated.Value that drives the TopBar's title shrink + backdrop
//     opacity ramp
//   - a ScrollView ref used to jump back to the top whenever the user
//     re-focuses the tab from the bottom nav
//   - the top padding required so the first scroll item lands cleanly below
//     the overlay TopBar
//   - the Animated.event handler that wires scrollY to the page's scroll
//
// This hook bundles all of it so each tab page is one line instead of ten.
//
// Usage:
//   const { scrollRef, scrollY, topPad, onScroll } = useTabScroll();
//   <Animated.ScrollView
//     ref={scrollRef}
//     contentContainerStyle={[styles.scroll, { paddingTop: topPad }]}
//     scrollEventThrottle={16}
//     onScroll={onScroll}
//   />
//   <TopBar page="home" scrollY={scrollY} />
export function useTabScroll() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const topPad = useTopBarOffset();

  // Tapping a tab icon should land the user at the top — never strand them
  // mid-page in a state they didn't ask for. Resetting scrollY too keeps
  // the TopBar title at its big resting size.
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo?.({ y: 0, animated: false });
      scrollY.setValue(0);
    }, [scrollY]),
  );

  // Native driver would be faster, but the title-shrink interpolates
  // fontSize which the native driver doesn't support — JS driver is fine
  // for one Animated.Value updated by scroll.
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  return { scrollRef, scrollY, topPad, onScroll };
}
