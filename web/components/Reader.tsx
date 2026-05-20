'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { recordAdUnlock, markProgress } from '@/app/read/actions';
import { BannerAd } from '@/components/BannerAd';
import { TipButton } from '@/components/TipButton';

type Props = {
  chapterId: string;
  number: number;
  title: string;
  storyTitle: string;
  storySlug: string;
  authorId: string;
  body: string | null; // null = locked for this reader
  excerpt: string;
  prevId: string | null;
  nextId: string | null;
  showAd: boolean;
  signedIn: boolean;
};

const THEMES = {
  light: { bg: '#F5EFE0', fg: '#2A2418', soft: '#6B5A40' },
  sepia: { bg: '#ECE0C8', fg: '#3A2F1E', soft: '#6E5C3E' },
  night: { bg: '#1F1A12', fg: '#E8DCC0', soft: '#A7997B' },
};

export function Reader(props: Props) {
  const router = useRouter();
  const [theme, setTheme] = useState<keyof typeof THEMES>('light');
  const [size, setSize] = useState(19);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('ns-theme') as keyof typeof THEMES | null;
    const s = localStorage.getItem('ns-size');
    if (t && THEMES[t]) setTheme(t);
    if (s) setSize(Number(s));
  }, []);
  useEffect(() => { localStorage.setItem('ns-theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('ns-size', String(size)); }, [size]);
  useEffect(() => {
    if (props.body) markProgress(props.chapterId);
  }, [props.chapterId, props.body]);

  async function watchAd() {
    setUnlocking(true);
    await new Promise((r) => setTimeout(r, 2000)); // simulated rewarded ad
    await recordAdUnlock(props.chapterId);
    router.refresh();
    setUnlocking(false);
  }

  const c = THEMES[theme];
  const locked = !props.body;
  const btn: React.CSSProperties = {
    border: '1px solid currentColor', background: 'transparent', color: 'inherit',
    opacity: 0.65, fontSize: 12, padding: '2px 8px', borderRadius: 6, cursor: 'pointer',
  };

  return (
    <div style={{ background: c.bg, color: c.fg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 24px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <Link href={`/story/${props.storySlug}`} style={{ color: 'inherit', opacity: 0.7, fontSize: 13 }}>
            ‹ {props.storyTitle}
          </Link>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={btn} onClick={() => setSize(Math.max(15, size - 1))}>A-</button>
            <button style={btn} onClick={() => setSize(Math.min(26, size + 1))}>A+</button>
            <button style={btn} onClick={() => setTheme('light')}>Light</button>
            <button style={btn} onClick={() => setTheme('sepia')}>Sepia</button>
            <button style={btn} onClick={() => setTheme('night')}>Night</button>
          </div>
        </div>

        <p style={{ fontSize: 13, color: c.soft, marginTop: 28 }}>Chapter {props.number}</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 500, margin: '4px 0 24px' }}>
          {props.title}
        </h1>

        <div style={{ fontFamily: 'var(--font-serif)', fontSize: size, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
          {locked ? props.excerpt : props.body}
        </div>

        {locked && (
          <div style={{ marginTop: 40, borderTop: `1px solid ${c.soft}`, paddingTop: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: c.soft, marginBottom: 16 }}>That's the preview — keep reading:</p>
            <button
              onClick={watchAd}
              disabled={unlocking}
              style={{ background: '#E54B2A', color: '#F5EFE0', border: 'none', fontSize: 14, fontWeight: 500, padding: '12px 24px', borderRadius: 999, cursor: 'pointer', opacity: unlocking ? 0.6 : 1 }}
            >
              {unlocking ? 'Loading ad…' : 'Watch a short ad to continue'}
            </button>
            <p style={{ fontSize: 12, color: c.soft, marginTop: 16 }}>
              No ads, ever — go all-access with NovelStack+ for $6.99/month.
            </p>
          </div>
        )}

        {!locked && props.showAd && <BannerAd />}

        {!locked && (
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${c.soft}`, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: c.soft, marginBottom: 10 }}>Enjoyed this chapter?</p>
            <TipButton recipientId={props.authorId} signedIn={props.signedIn} />
          </div>
        )}

        {!locked && (
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            {props.prevId ? (
              <Link href={`/read/${props.prevId}`} style={{ color: '#E54B2A' }}>‹ Previous</Link>
            ) : <span />}
            {props.nextId ? (
              <Link href={`/read/${props.nextId}`} style={{ color: '#E54B2A' }}>Next chapter ›</Link>
            ) : (
              <span style={{ color: c.soft }}>You're all caught up</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
