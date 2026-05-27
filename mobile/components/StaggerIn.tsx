import { useEffect, useRef } from 'react';
import { Animated, type ViewStyle, type StyleProp } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

// A small wave-in helper. Each child fades + lifts in turn — index 0 first,
// index N last. Replays every time the parent screen comes into focus so
// navigating away and back retriggers the effect rather than only playing
// on first mount.
//
//   {items.map((item, i) => (
//     <StaggerIn key={item.id} index={i}>
//       <YourCard {...item} />
//     </StaggerIn>
//   ))}
export function StaggerIn({
  index,
  children,
  style,
  baseDelayMs = 60,
  durationMs = 380,
  liftPx = 12,
  // Clamp the delay so a long list still finishes within ~1.2s.
  maxIndex = 14,
}: {
  index: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  baseDelayMs?: number;
  durationMs?: number;
  liftPx?: number;
  maxIndex?: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(liftPx)).current;

  useFocusEffect(
    useCallback(() => {
      opacity.setValue(0);
      translate.setValue(liftPx);
      const delay = Math.min(index, maxIndex) * baseDelayMs;
      const anim = Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: durationMs,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: 0,
          duration: durationMs,
          delay,
          useNativeDriver: true,
        }),
      ]);
      anim.start();
      return () => {
        anim.stop();
      };
    }, [index, baseDelayMs, durationMs, liftPx, maxIndex, opacity, translate]),
  );

  return (
    <Animated.View
      style={[
        style,
        { opacity, transform: [{ translateY: translate }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}
