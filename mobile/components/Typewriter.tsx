import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View, StyleSheet, type TextStyle, type StyleProp } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { colors } from '@/theme/tokens';

// A drawn-out type-out of a string, ending with a blinking caret that stays
// put. Re-runs every time the screen comes into focus (so navigating away
// and back retriggers the animation, rather than burning the effect on
// first mount only).
export function Typewriter({
  text,
  style,
  caretColor = colors.signal,
  speedMs = 50,
  startDelayMs = 200,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  caretColor?: string;
  speedMs?: number;
  startDelayMs?: number;
}) {
  const [shown, setShown] = useState('');
  const caretOpacity = useRef(new Animated.Value(0)).current;
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkLoop = useRef<Animated.CompositeAnimation | null>(null);

  // Reset + replay on focus. Doing it via useFocusEffect rather than useEffect
  // means visiting another tab and coming back re-runs the type-out.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setShown('');

      const startTimer = setTimeout(() => {
        let i = 0;
        const step = () => {
          if (cancelled) return;
          i += 1;
          setShown(text.slice(0, i));
          if (i < text.length) {
            tickRef.current = setTimeout(step, speedMs);
          } else {
            // Done typing — start the cursor blink.
            blinkLoop.current = Animated.loop(
              Animated.sequence([
                Animated.timing(caretOpacity, {
                  toValue: 1,
                  duration: 120,
                  useNativeDriver: true,
                }),
                Animated.timing(caretOpacity, {
                  toValue: 1,
                  duration: 420,
                  useNativeDriver: true,
                }),
                Animated.timing(caretOpacity, {
                  toValue: 0,
                  duration: 120,
                  useNativeDriver: true,
                }),
                Animated.timing(caretOpacity, {
                  toValue: 0,
                  duration: 420,
                  useNativeDriver: true,
                }),
              ]),
            );
            blinkLoop.current.start();
          }
        };
        step();
      }, startDelayMs);

      return () => {
        cancelled = true;
        if (tickRef.current) clearTimeout(tickRef.current);
        clearTimeout(startTimer);
        blinkLoop.current?.stop();
        caretOpacity.setValue(0);
      };
    }, [text, speedMs, startDelayMs, caretOpacity]),
  );

  return (
    <View style={styles.row}>
      <Text style={style}>{shown}</Text>
      <Animated.View
        style={[
          styles.caret,
          { backgroundColor: caretColor, opacity: caretOpacity },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  caret: {
    width: 2,
    height: 18,
    marginLeft: 3,
    borderRadius: 1,
  },
});
