// Renders a chapter body from NovelStack's fiction-subset Markdown — the web
// counterpart of the mobile <MarkdownText>. Both must render the same syntax
// identically so a writer's formatting looks the same everywhere it's read.
//
// Supported:  ## heading · > quote · * * * / --- scene break ·
//             ![caption](url) illustration · **bold** · *italic* / _italic_
import { Fragment, type CSSProperties, type ReactNode } from 'react';

type Props = {
  body: string;
  fontSize: number;
  // Muted colour for captions / scene breaks / quote rule.
  soft: string;
};

const isWordChar = (c: string | undefined) => c !== undefined && /[A-Za-z0-9]/.test(c);

// Splits a line into <strong>/<em> spans. Honours **bold**, *italic*, _italic_.
function inline(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let buf = '';
  let bold = false;
  let italic = false;
  let key = 0;
  const flush = () => {
    if (!buf) return;
    let node: ReactNode = buf;
    if (italic) node = <em key={key++}>{node}</em>;
    if (bold) node = <strong key={key++}>{node}</strong>;
    out.push(<Fragment key={key++}>{node}</Fragment>);
    buf = '';
  };
  for (let i = 0; i < line.length; i += 1) {
    if (line.slice(i, i + 2) === '**') {
      flush();
      bold = !bold;
      i += 1;
      continue;
    }
    const ch = line[i];
    if (ch === '*' || ch === '_') {
      // Opening marker needs a non-space to its right; closing one needs a
      // non-space to its left. `_` won't fire mid-word (snake_case / URLs).
      const prev = line[i - 1];
      const next = line[i + 1];
      const openOk = next !== undefined && next !== ' ' && !(ch === '_' && isWordChar(prev));
      const closeOk = prev !== undefined && prev !== ' ' && !(ch === '_' && isWordChar(next));
      if ((!italic && openOk) || (italic && closeOk)) {
        flush();
        italic = !italic;
        continue;
      }
    }
    buf += ch;
  }
  flush();
  return out;
}

const SCENE_BREAK = /^(?:\*\s*){3,}$|^-{3,}$|^_{3,}$/;
const IMAGE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

export function ChapterProse({ body, fontSize, soft }: Props) {
  const blocks = (body ?? '').replace(/\r\n/g, '\n').split(/\n{2,}/);
  // Newsreader serif inside the reader — set in layout.tsx as a Next/font var.
  const proseFont = 'var(--font-display-newsreader), Charter, Georgia, serif';

  return (
    <div style={{ fontFamily: proseFont, fontSize, lineHeight: 1.75 }}>
      {blocks.map((raw, bi) => {
        const block = raw.trim();
        if (!block) return null;

        if (SCENE_BREAK.test(block)) {
          return (
            <p
              key={bi}
              style={{
                textAlign: 'center',
                letterSpacing: 6,
                color: soft,
                margin: '28px 0',
              }}
            >
              * * *
            </p>
          );
        }

        const img = block.match(IMAGE);
        if (img) {
          const figure: CSSProperties = { margin: '24px 0' };
          return (
            <figure key={bi} style={figure}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img[2]}
                alt={img[1] || 'Chapter illustration'}
                style={{ width: '100%', borderRadius: 12, display: 'block' }}
              />
              {!!img[1] && (
                <figcaption
                  style={{
                    fontSize: 13,
                    fontStyle: 'italic',
                    textAlign: 'center',
                    color: soft,
                    marginTop: 8,
                  }}
                >
                  {img[1]}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.startsWith('## ')) {
          return (
            <h2
              key={bi}
              style={{
                fontSize: fontSize + 5,
                fontWeight: 600,
                margin: '28px 0 12px',
              }}
            >
              {inline(block.slice(3).trim())}
            </h2>
          );
        }

        if (block.split('\n').every((l) => l.startsWith('>'))) {
          const text = block
            .split('\n')
            .map((l) => l.replace(/^>\s?/, ''))
            .join('\n');
          return (
            <blockquote
              key={bi}
              style={{
                borderLeft: `3px solid ${soft}`,
                paddingLeft: 16,
                margin: '20px 0',
                fontStyle: 'italic',
                color: soft,
                whiteSpace: 'pre-wrap',
              }}
            >
              {inline(text)}
            </blockquote>
          );
        }

        return (
          <p key={bi} style={{ margin: '0 0 20px' }}>
            {inline(block.split('\n').join(' '))}
          </p>
        );
      })}
    </div>
  );
}
