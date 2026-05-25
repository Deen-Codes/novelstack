// NovelStack — Google AdMob integration.
// Rewarded ads gate locked chapters; a banner runs on free chapters. During
// development we always use Google's test ad units; the real AdMob units take
// over in a production build.
import { Platform } from 'react-native';
import mobileAds, {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

// Real AdMob ad unit IDs (live once the app is approved by AdMob).
const REWARDED_LIVE = Platform.select({
  ios: 'ca-app-pub-4785473067647076/5628175310',
  android: 'ca-app-pub-4785473067647076/3055880079',
});
const BANNER_LIVE = Platform.select({
  ios: 'ca-app-pub-4785473067647076/9580240065',
  android: 'ca-app-pub-4785473067647076/3725278154',
});

export const REWARDED_UNIT = __DEV__ ? TestIds.REWARDED : REWARDED_LIVE ?? TestIds.REWARDED;
export const BANNER_UNIT = __DEV__ ? TestIds.BANNER : BANNER_LIVE ?? TestIds.BANNER;

let initialized = false;

// Initialises the ads SDK. On iOS this first shows the App Tracking
// Transparency prompt — Apple requires it before any tracking-based ads.
export async function initAds(): Promise<void> {
  if (initialized) return;
  try {
    await requestTrackingPermissionsAsync();
    await mobileAds().initialize();
    initialized = true;
  } catch {
    // Best-effort — the app must run fine even if ads fail to start.
  }
}

// Loads and shows a single rewarded ad. Resolves true once the reward is
// earned, false if the ad couldn't load or was dismissed without a reward.
export function showRewardedAd(): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    let earned = false;
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    try {
      const ad = RewardedAd.createForAdRequest(REWARDED_UNIT);
      ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        ad.show().catch(() => finish(false));
      });
      ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        earned = true;
      });
      ad.addAdEventListener(AdEventType.CLOSED, () => finish(earned));
      ad.addAdEventListener(AdEventType.ERROR, () => finish(false));
      ad.load();
      // Safety net — never leave the unlock screen hanging on a stalled load.
      setTimeout(() => finish(earned), 30000);
    } catch {
      finish(false);
    }
  });
}
