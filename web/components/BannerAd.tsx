// Placeholder banner-ad slot for free chapters (Q4). A real ad-network unit
// (AppLovin MAX / AdMob) drops in here at launch. Subscribers never see it —
// the read page only renders this when the chapter is free and the viewer
// is not on NovelStack+.
export function BannerAd() {
  return (
    <div className="my-8 border border-border-soft rounded-lg bg-paper-soft py-6 px-4 text-center">
      <p className="text-[11px] text-ink-faint tracking-wide">ADVERTISEMENT</p>
      <p className="text-[13px] text-ink-muted mt-1">
        Ad slot — a real banner loads here at launch, and the writer earns a share of it.
      </p>
      <p className="text-[12px] text-ink-faint mt-1">Go ad-free with NovelStack+ for $6.99/month.</p>
    </div>
  );
}
