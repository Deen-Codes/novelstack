// Web banner ads are parked for v1. Mobile (iOS) ships AdMob banners on
// free chapters; web stays clean until a real ad-network unit is wired in.
// `web/components/Reader.tsx` still references this component — keep the
// export so the import doesn't break.
export function BannerAd() {
  return null;
}
