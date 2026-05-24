import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// A full-screen ambient ember glow that drifts slowly. Anchored to the very
// top of the screen (so there's no hard edge) and fades out down the page.
// Rendered as the first child of a screen, behind the top bar and content.
export function AmbientGlow() {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 5200, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 5200, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.glow,
        {
          opacity: drift.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] }),
          transform: [
            { scale: drift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.16] }) },
            { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, 24] }) },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(200,65,78,0.42)', 'rgba(200,65,78,0.1)', 'transparent']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glow: { position: 'absolute', top: 0, left: 0, right: 0, height: 560 },
});
