// Default cover — picks one of 10 typographic variants deterministically by
// hashing the story id. The title IS the design here, so parents must NOT
// render the title text again underneath the cover (that's the doubling bug
// the upload-cover fallback used to have).
//
// Variant styling lives in globals.css as .cv-1 through .cv-10. Each font
// is loaded once in layout.tsx and referenced via its CSS custom property.
import { genreLabel } from '@/lib/genres';

const VARIANT_COUNT = 10;

// Tiny deterministic hash — same input always yields the same variant.
function pickVariant(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % VARIANT_COUNT;
}

// Split a title into two roughly equal halves for the Stack / Mosaic variants.
function splitTitleHalves(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return [title, ''];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

// First two words for the Mosaic 2x2 grid.
function firstWords(title: string, n = 3): string[] {
  return title.trim().split(/\s+/).slice(0, n);
}

// Two-letter initial badge for the Spine variant (author initials, or first
// two letters of the title if no author).
function initials(s: string | null | undefined, fallback: string): string {
  const src = (s ?? '').trim();
  if (src) {
    const parts = src.split(/\s+/);
    const a = parts[0]?.[0] ?? '';
    const b = parts[1]?.[0] ?? parts[0]?.[1] ?? '';
    return (a + b).toUpperCase().slice(0, 2);
  }
  return fallback.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();
}

export function DefaultCover({
  storyId,
  title,
  genre,
  authorName,
  className,
}: {
  storyId: string;
  title: string;
  genre?: string | null;
  authorName?: string | null;
  className?: string;
}) {
  const v = pickVariant(storyId);
  const t = title || 'Untitled';

  // Each branch lays out the same data (title + optional genre + author) in
  // a different visual register — see /aesthetic_examples/cover_variants.html
  // for the design reference.
  let inner: React.ReactNode = null;
  switch (v) {
    case 0:
      inner = (
        <>
          <span className="cv-corner" />
          <div className="cv-title">{t}</div>
        </>
      );
      break;
    case 1: {
      const g = genre ? genreLabel(genre) : 'A story';
      inner = (
        <>
          <div className="cv-genre">{g}</div>
          <div className="cv-title">{t}</div>
        </>
      );
      break;
    }
    case 2:
      inner = (
        <>
          <div className="cv-rule" />
          <div className="cv-title">{t}</div>
          <div className="cv-below">A novel</div>
        </>
      );
      break;
    case 3: {
      const [a, b] = splitTitleHalves(t);
      inner = (
        <>
          <span className="cv-corner-tx">Vol I</span>
          <div className="cv-title">
            <span className="cv-row">{a}</span>
            {b && <span className="cv-row">{b}</span>}
          </div>
        </>
      );
      break;
    }
    case 4:
      inner = (
        <>
          <div className="cv-head">
            <span>{t.slice(0, 20)}</span>
            <span>NS</span>
          </div>
          <div className="cv-vol">01</div>
          <div className="cv-title">{t}</div>
        </>
      );
      break;
    case 5: {
      const g = genre ? genreLabel(genre) : 'A story';
      inner = (
        <>
          <div className="cv-title">{t.toLowerCase()}</div>
          <div className="cv-below">{g}</div>
        </>
      );
      break;
    }
    case 6:
      inner = (
        <>
          <div className="cv-title">{t}</div>
          <div className="cv-meta-band">
            <span className="cv-label">A story by</span>
            <span className="cv-num">{initials(authorName, t)}</span>
          </div>
        </>
      );
      break;
    case 7:
      inner = (
        <>
          <div className="cv-top">NovelStack</div>
          <div className="cv-band">
            <div className="cv-title">{t}</div>
          </div>
          <div className="cv-bot">{authorName ?? 'A NovelStack writer'}</div>
        </>
      );
      break;
    case 8: {
      const words = firstWords(t, 3);
      // Pad to 4 cells so the grid stays balanced.
      while (words.length < 4) words.push(words.length === 3 ? '·' : '');
      inner = (
        <>
          <span className="cv-top" />
          <div className="cv-grid">
            {words.slice(0, 4).map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
        </>
      );
      break;
    }
    case 9:
      inner = (
        <>
          <span className="cv-bracket-tl" />
          <span className="cv-bracket-tr" />
          <span className="cv-bracket-bl" />
          <span className="cv-bracket-br" />
          <div className="cv-title">{t}</div>
          <div className="cv-below">NSK · {String(v + 1).padStart(3, '0')}</div>
        </>
      );
      break;
  }

  return (
    <div className={`cv-base cv-${v + 1} ${className ?? ''}`}>
      {inner}
    </div>
  );
}
