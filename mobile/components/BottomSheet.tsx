import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Modal, Animated, View, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '@/theme/tokens';

// Reusable bottom sheet — the backdrop fades in while the panel slides up
// (RN's Modal "slide" would slide the whole black overlay as one block).
export function BottomSheet({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [sheetH, setSheetH] = useState(520);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(anim, { toValue: 1, duration: 240, useNativeDriver: true }).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(
        ({ finished }) => {
          if (finished) setMounted(false);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [sheetH, 0] });

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.wrap}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: anim }]}>
          <Pressable style={styles.backdrop} onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          onLayout={(e) => setSheetH(e.nativeEvent.layout.height)}
        >
          <View style={styles.grab} />
          {children}
        </Animated.View>
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
    borderBottomWidth: 0,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: 40,
  },
  grab: {
    width: 38,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: '#4A4037',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
});
