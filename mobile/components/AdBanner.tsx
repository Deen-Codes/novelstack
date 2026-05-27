import { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_UNIT } from '@/lib/ads';
import { colors } from '@/theme/tokens';

// Banner ad with graceful fallback. AdMob commonly returns "no fill" for
// brand-new apps that haven't built up traffic — without this wrapper the
// SDK renders an obvious "this ad did not load" placeholder. We listen for
// the failure event and hide the entire banner area, so the reader sees the
// chapter close to the nav buttons instead of an awkward empty stripe.
export function AdBanner({ style }: { style?: ViewStyle }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <View style={[styles.wrap, style]}>
      <BannerAd
        unitId={BANNER_UNIT}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
    minHeight: 50,
  },
});
