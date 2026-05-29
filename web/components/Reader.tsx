'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { recordAdUnlock, markProgress } from '@/app/read/actions';
import { BannerAd } from '@/components/BannerAd';
import { TipButton } from '@/components/TipButton';
import { ChapterProse } from '@/components/ChapterProse';

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
  chapterCount: number;
  currentIndex: number; // 0-based, -1 if unknown
  showAd: boolean;
  signedIn: boolean;
};

type Theme = 'paper' | 'dark';

const SIZE_KEY = 'ns-reader-size';
const THEME_KEY = 'ns-reader-theme';
const RIBBON_KEY = (cid: string) => `ns-reader-ribbon:${cid}`;

// Time after which the resume ribbon should reappear on next visit.
const RIBBON_AFTER_MS = 6 * 60 * 60 * 1000; // 6 hours

// Web counterpart to the mobile reader. Paper-mode by default, dark toggle,
// 68ch column, right-edge chapter spine, "You left here on …" resume ribbon,
// settings drawer, TTS via the browser's SpeechSynthesisAPI.
export function Reader(props: Props) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('paper');
  const [size, setSize] = useState(19);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Resume ribbon — surfaces a short snippet of where the reader left off the
  // last time they opened this chapter, but only after a real gap (6h+).
  const [ribbon, setRibbon] = useState<{ when: string; quote: string } | null>(null);

  // TTS state
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const body = props.body;
  const locked = !body;

  // Restore saved size + theme on mount.
  useEffect(() => {
    const t = localStorage.getItem(THEME_KEY) as Theme | null;
    const s = localStorage.getItem(SIZE_KEY);
    if (t === 'paper' || t === 'dark') setTheme(t);
    if (s) setSize(Number(s));
  }, []);
  useEffect(() => { localStorage.setItem(THEME_KEY, theme); }, [theme]);
  useEffect(() => { localStorage.setItem(SIZE_KEY, String(size)); }, [size]);

  // Record reading progress + decide whether to show the resume ribbon.
  useEffect(() => {
    if (!body) return;
    markProgress(props.chapterId);
    try {
      const raw = localStorage.getItem(RIBBON_KEY(props.chapterId));
      if (raw) {
        const prev = JSON.parse(raw) as { ts: number; quote: string };
        if (Date.now() - prev.ts > RIBBON_AFTER_MS && prev.quote) {
          setRibbon({ when: relTime(prev.ts), quote: prev.quote });
        }
      }
      // Stash the first ~3 lines as the next-visit quote.
      const firstSnippet = body.replace(/\s+/g, ' ').slice(0, 240).trim();
      localStorage.setItem(
        RIBBON_KEY(props.chapterId),
        JSON.stringify({ ts: Date.now(), quote: firstSnippet }),
      );
    } catch { /* localStorage blocked — ignore */ }
  }, [props.chapterId, body]);

  // Stop any in-flight speech when the chapter changes / unmounts.
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [props.chapterId]);

  async function watchAd() {
    setUnlocking(true);
    await new Promise((r) => setTimeout(r, 1500));
    await recordAdUnlock(props.chapterId);
    router.refresh();
    setUnlocking(false);
  }

  const toggleSpeak = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !body) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    // Strip markdown-ish markers; the reader doesn't speak headings as nicely
    // as we'd like, but at v1 we just want the prose flowing.
    const plain = body
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/[*_]([^*_]+)[*_]/g, '$1')
      .replace(/^>\s?/gm, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ' ');
    const u = new SpeechSynthesisUtterance(plain);
    u.rate = 0.98;
    u.pitch = 1.0;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  }, [body, speaking]);

  // Fake-but-glanceable chapter spine: render N notches with the current one
  // highlighted. Real cliffhanger triangles come when we track them.
  const spineNotches = useMemo(() => {
    const max = Math.max(1, Math.min(props.chapterCount || 1, 14));
    const cur = props.currentIndex < 0 ? 0 : Math.min(props.currentIndex, max - 1);
    return Array.from({ length: max }, (_, i) => i === cur);
  }, [props.chapterCount, props.currentIndex]);

  const isPaper = theme === 'paper';

  return (
    <div className={isPaper ? 'paper-mode' : ''}>
      <div
        className="min-h-screen relative"
        style={{
          background: 'var(--color-paper)',
          color: 'var(--color-ink)',
        }}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-40 border-b" style={{ borderColor: 'var(--color-border-soft)', background: 'color-mix(in srgb, var(--color-paper) 85%, transparent)', backdropFilter: 'blur(20px)' }}>
          <div className="max-w-[920px] mx-auto px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Link
              href={`/story/${props.storySlug}`}
              className="text-[13px] font-medium hover:underline"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              ‹ {props.storyTitle}
            </Link>
            <div className="flex items-center gap-2">
              {body && (
                <button
                  onClick={toggleSpeak}
                  aria-label={speaking ? 'Stop read-aloud' : 'Read aloud'}
                  className="text-[12px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
                  style={{
                    background: speaking ? 'var(--color-signal)' : 'var(--color-paper-soft)',
                    color: speaking ? '#fff' : 'var(--color-ink-muted)',
                    border: '1px solid var(--color-border-soft)',
                  }}
                >
                  {speaking ? '■ Stop' : '▶ Read aloud'}
                </button>
              )}
              <button
                onClick={() => setSettingsOpen((s) => !s)}
                aria-label="Reader settings"
                className="text-[12px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
                style={{
                  background: 'var(--color-paper-soft)',
                  color: 'var(--color-ink-muted)',
                  border: '1px solid var(--color-border-soft)',
                }}
              >
                Aa
              </button>
              <div
                className="flex gap-1 p-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                style={{
                  background: 'var(--color-paper-soft)',
                  color: 'var(--color-ink-muted)',
                }}
              >
                <button
                  onClick={() => setTheme('paper')}
                  className={`px-3 py-1.5 rounded-full transition-colors`}
                  style={{
                    background: isPaper ? 'var(--color-cream-ink)' : 'transparent',
                    color: isPaper ? 'var(--color-cream)' : 'var(--color-ink-muted)',
                  }}
                >
                  Paper
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 rounded-full transition-colors`}
                  style={{
                    background: !isPaper ? 'var(--color-cream-ink)' : 'transparent',
                    color: !isPaper ? 'var(--color-cream)' : 'var(--color-ink-muted)',
                  }}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
          {settingsOpen && (
            <div
              className="max-w-[920px] mx-auto px-5 md:px-8 pb-3 flex flex-wrap items-center gap-3 text-[12px]"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              <span className="font-semibold uppercase tracking-wider">Size</span>
              <button
                onClick={() => setSize(Math.max(15, size - 1))}
                className="w-8 h-8 rounded-md font-bold"
                style={{ background: 'var(--color-paper-soft)', border: '1px solid var(--color-border-soft)' }}
              >
                A−
              </button>
              <span className="font-mono text-[13px] min-w-[28px] text-center">{size}</span>
              <button
                onClick={() => setSize(Math.min(26, size + 1))}
                className="w-8 h-8 rounded-md font-bold"
                style={{ background: 'var(--color-paper-soft)', border: '1px solid var(--color-border-soft)' }}
              >
                A+
              </button>
            </div>
          )}
        </div>

        {/* Right-edge chapter spine */}
        {body && (
          <div className="chapter-spine" aria-hidden>
            {spineNotches.map((cur, i) => (
              <div key={i} className={`notch${cur ? ' current' : ''}`} />
            ))}
          </div>
        )}

        {/* Body column */}
        <div className="max-w-[68ch] mx-auto px-6 md:px-8 py-10 md:py-16">
          {ribbon && body && (
            <div className="resume-ribbon">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: 'var(--color-ink)' }}>
                You left here {ribbon.when}
              </div>
              <div className="italic" style={{ color: 'var(--color-ink-muted)' }}>
                …{ribbon.quote}…
              </div>
            </div>
          )}

          <div
            className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2"
            style={{ color: 'var(--color-signal)' }}
          >
            Chapter {props.number} · {props.storyTitle}
          </div>
          <h1
            className="font-display font-extrabold leading-[1.05] tracking-[-0.025em] mb-8"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--color-ink)' }}
          >
            {props.title}
          </h1>

          <ChapterProse
            body={locked ? props.excerpt : body ?? ''}
            fontSize={size}
            soft={'var(--color-ink-muted)' as unknown as string}
          />

          {locked && (
            <div
              className="mt-12 pt-8 text-center"
              style={{ borderTop: '1px solid var(--color-border-soft)' }}
            >
              <p className="text-[13px] mb-5" style={{ color: 'var(--color-ink-muted)' }}>
                That's the preview — keep reading:
              </p>
              <button
                onClick={watchAd}
                disabled={unlocking}
                className="btn-cream"
                style={{ opacity: unlocking ? 0.6 : 1 }}
              >
                {unlocking ? 'Loading ad…' : 'Watch a short ad to continue →'}
              </button>
              <p className="text-[12px] mt-5" style={{ color: 'var(--color-ink-faint)' }}>
                No ads, ever — go all-access with{' '}
                <Link href="/plus" className="underline" style={{ color: 'var(--color-signal)' }}>
                  NovelStack+
                </Link>{' '}
                for $6.99/mo.
              </p>
            </div>
          )}

          {!locked && props.showAd && (
            <div className="mt-10">
              <BannerAd />
            </div>
          )}

          {!locked && (
            <div
              className="mt-12 pt-8 text-center"
              style={{ borderTop: '1px solid var(--color-border-soft)' }}
            >
              <p className="text-[13px] mb-3" style={{ color: 'var(--color-ink-muted)' }}>
                Enjoyed this chapter?
              </p>
              <TipButton recipientId={props.authorId} signedIn={props.signedIn} />
            </div>
          )}

          {!locked && (
            <div className="mt-10 flex items-center justify-between text-[14px]">
              {props.prevId ? (
                <Link
                  href={`/read/${props.prevId}`}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--color-signal)' }}
                >
                  ‹ Previous
                </Link>
              ) : <span />}
              {props.nextId ? (
                <Link
                  href={`/read/${props.nextId}`}
                  className="btn-cream"
                >
                  Next chapter →
                </Link>
              ) : (
                <span style={{ color: 'var(--color-ink-muted)' }}>
                  ✓ You're all caught up
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function relTime(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'earlier today';
  if (days === 1) return 'yesterday';
  if (days < 7) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(ts).getDay()];
  }
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(ts).toLocaleDateString();
}
