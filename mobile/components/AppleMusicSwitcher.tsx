// AppleMusicSwitcher — two-tab bottom switcher inspired by Apple Music's
// "Listen Now ⟷ Browse" segmented bar. Selected tab takes the wide right
// side as a filled cream pill (icon + label); unselected tab collapses to
// an icon-only chip on the left. Tap the unselected → animates the swap.
//
// Usage:
//   <AppleMusicSwitcher
//     tabs={[
//       { key: 'cover',    label: 'Cover',    icon: 'image-outline' },
//       { key: 'chapters', label: 'Chapters', icon: 'list-outline'  },
//     ]}
//     value={tab}
//     onChange={setTab}
//   />

import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '@/theme/tokens';

type Tab<K extends string> = {
  key: K;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

export function AppleMusicSwitcher<K extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: [Tab<K>, Tab<K>];
  value: K;
  onChange: (next: K) => void;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Animate a 0→1 value that represents "second tab is selected". The bar's
  // visual layout (which side is the wide pill) is derived from this.
  const t = useRef(new Animated.Value(value === tabs[1].key ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(t, {
      toValue: value === tabs[1].key ? 1 : 0,
      useNativeDriver: false, // we animate width / margin
      tension: 120,
      friction: 14,
    }).start();
  }, [value, tabs, t]);

  // Pill widths — selected ~70% of the bar, unselected ~26%. Gap between
  // them takes the rest.
  const barW = Math.min(width - 32, 380); // 16px side margin, capped
  const leftPillW = t.interpolate({ inputRange: [0, 1], outputRange: [barW * 0.70, barW * 0.26] });
  const rightPillW = t.interpolate({ inputRange: [0, 1], outputRange: [barW * 0.26, barW * 0.70] });

  // Bar sits above any home-indicator safe area, like a real player chrome.
  const bottom = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.outer, { bottom, width: barW }]} pointerEvents="box-none">
      <View style={styles.row}>
        <SwitchPill
          tab={tabs[0]}
          isSelected={value === tabs[0].key}
          width={leftPillW}
          onPress={() => onChange(tabs[0].key)}
        />
        <SwitchPill
          tab={tabs[1]}
          isSelected={value === tabs[1].key}
          width={rightPillW}
          onPress={() => onChange(tabs[1].key)}
        />
      </View>
    </View>
  );
}

function SwitchPill<K extends string>({
  tab,
  isSelected,
  width,
  onPress,
}: {
  tab: Tab<K>;
  isSelected: boolean;
  width: Animated.AnimatedInterpolation<number>;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ flex: 0 }}>
      <Animated.View
        style={[
          styles.pill,
          {
            width,
            backgroundColor: isSelected ? colors.cream : colors.paperSoft,
            borderColor: isSelected ? colors.cream : colors.borderSoft,
          },
        ]}
      >
        <Ionicons
          name={tab.icon}
          size={18}
          color={isSelected ? colors.creamInk : colors.inkMuted}
        />
        {isSelected && (
          <Text style={[styles.label, { color: colors.creamInk }]} numberOfLines={1}>
            {tab.label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignSelf: 'center',
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20,17,15,0.92)',
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    // Soft elevation so it floats over content
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 12,
  },
  pill: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
