// Renders a chapter's body from the fiction-subset Markdown that the writing
// editor produces. Whatever a writer sees in the editor's preview, a reader
// sees here — the exact same component does both.
//
// Supported syntax (intentionally small — the platform owns typography):
//   ## Heading            section heading inside a chapter
//   > Quoted line         block quote (epigraphs, letters, texts)
//   * * *  /  ---         scene break (rendered as a centred divider)
//   ![caption](url)       inline illustration with an optional caption
//   **bold**  *italic*    inline emphasis (also _italic_)
//   blank line            paragraph break
//
// When `activeWord` is set (read-aloud is playing) the component renders one
// <Text> per word so the word currently being spoken can be highlighted.
import { useState, type ReactNode } from 'react';
import { View, Text, Image, StyleSheet, type TextStyle } from 'react-native';
import { fonts } from '@/theme/tokens';

type Props = {
  body: string;
  // Primary prose colour — caller passes the active reading-mode ink.
  color: string;
  // Muted colour for captions / scene-break rule.
  faint: string;
  // Optional override for the base prose size (reader uses 18).
  fontSize?: number;
  // Document-order index of the word being read aloud, or undefined when
  // read-aloud is off (the fast, single-Text-per-line render path).
  activeWord?: number;
};

// Tint behind the word currently being narrated.
const HIGHLIGHT_BG = 'rgba(200, 65, 78, 0.32)';

// --- inline emphasis -------------------------------------------------------
type Seg = { text: string; bold: boolean; italic: boolean };

const isWordChar = (c: string | undefined) => c !== undefined && /[A-Za-z0-9]/.test(c);

function parseInline(line: string): Seg[] {
  const segs: Seg[] = [];
  let i = 0;
  let buf = '';
  let bold = false;
  let italic = false;
  const flush = () => {
    if (buf) segs.push({ text: buf, bold, italic });
    buf = '';
  };
  while (i < line.length) {
    const ch = line[i];
    if (line.slice(i, i + 2) === '**') {
      flush();
      bold = !bold;
      i += 2;
      continue;
    }
    if (ch === '*' || ch === '_') {
      // An opening marker needs a non-space to its right; a closing one needs
      // a non-space to its left. `_` additionally won't fire mid-word, so
      // snake_case text and URLs survive untouched.
      const prev = line[i - 1];
      const next = line[i + 1];
      const openOk = next !== undefined && next !== ' ' && !(ch === '_' && isWordChar(prev));
      const closeOk = prev !== undefined && prev !== ' ' && !(ch === '_' && isWordChar(next));
      if ((!italic && openOk) || (italic && closeOk)) {
        flush();
        italic = !italic;
        i += 1;
        continue;
      }
    }
    buf += ch;
    i += 1;
  }
  flush();
  return segs.length ? segs : [{ text: '', bold: false, italic: false }];
}

// --- block parsing ---------------------------------------------------------
// An inline illustration. Starts at a sensible placeholder ratio and adopts
// the image's true aspect ratio once it loads — so art is never cropped.
function ChapterImage({
  uri,
  caption,
  faint,
}: {
  uri: string;
  caption: string;
  faint: string;
}) {
  const [ratio, setRatio] = useState(3 / 2);
  return (
    <View style={styles.figure}>
      <Image
        source={{ uri }}
        style={[styles.image, { aspectRatio: ratio }]}
        resizeMode="cover"
        onLoad={(e) => {
          const src = e.nativeEvent.source;
          if (src && src.width > 0 && src.height > 0) {
            setRatio(src.width / src.height);
          }
        }}
      />
      {!!caption && <Text style={[styles.caption, { color: faint }]}>{caption}</Text>}
    </View>
  );
}

const SCENE_BREAK = /^(?:\*\s*){3,}$|^-{3,}$|^_{3,}$/;
const IMAGE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

export function MarkdownText({ body, color, faint, fontSize = 18, activeWord }: Props) {
  const proseStyle: TextStyle = {
    fontFamily: 'serif',
    fontSize,
    lineHeight: fontSize * 1.72,
  };
  const blocks = (body ?? '').replace(/\r\n/g, '\n').split(/\n{2,}/);
  const highlight = typeof activeWord === 'number';
  // Running word index across the whole chapter — only meaningful while a
  // chapter is being read aloud. Reset on every render so it stays in sync.
  const counter = { n: 0 };

  // Renders one line of inline text. Off the read-aloud path this is a single
  // <Text>; on it, each word becomes its own <Text> so it can be lit up.
  function renderInline(line: string, base: TextStyle, col: string, key: string): ReactNode {
    const segs = parseInline(line);
    if (!highlight) {
      return (
        <Text key={key} style={[base, { color: col }]}>
          {segs.map((s, i) => (
            <Text
              key={i}
              style={{
                fontWeight: s.bold ? '700' : '400',
                fontStyle: s.italic ? 'italic' : 'normal',
              }}
            >
              {s.text}
            </Text>
          ))}
        </Text>
      );
    }
    const parts: ReactNode[] = [];
    segs.forEach((s, si) => {
      s.text.split(/(\s+)/).forEach((tok, ti) => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) {
          parts.push(tok);
          return;
        }
        const idx = counter.n;
        counter.n += 1;
        parts.push(
          <Text
            key={`${si}-${ti}`}
            style={{
              fontWeight: s.bold ? '700' : '400',
              fontStyle: s.italic ? 'italic' : 'normal',
              ...(idx === activeWord ? { backgroundColor: HIGHLIGHT_BG } : null),
            }}
          >
            {tok}
          </Text>,
        );
      });
    });
    return (
      <Text key={key} style={[base, { color: col }]}>
        {parts}
      </Text>
    );
  }

  return (
    <View>
      {blocks.map((raw, bi) => {
        const block = raw.trim();
        if (!block) return null;

        // Scene break — a centred ornament between scenes.
        if (SCENE_BREAK.test(block)) {
          return (
            <View key={bi} style={styles.sceneBreak}>
              <Text style={[styles.sceneMark, { color: faint }]}>* * *</Text>
            </View>
          );
        }

        // Inline illustration.
        const img = block.match(IMAGE);
        if (img) {
          return <ChapterImage key={bi} uri={img[2]} caption={img[1]} faint={faint} />;
        }

        // Heading.
        if (block.startsWith('## ')) {
          return renderInline(block.slice(3).trim(), styles.heading, color, `h${bi}`);
        }

        // Block quote — one or more `> ` lines.
        if (block.split('\n').every((l) => l.startsWith('>'))) {
          const text = block
            .split('\n')
            .map((l) => l.replace(/^>\s?/, ''))
            .join('\n');
          return (
            <View key={bi} style={[styles.quote, { borderLeftColor: faint }]}>
              {renderInline(text, { ...proseStyle, fontStyle: 'italic' }, faint, `q${bi}`)}
            </View>
          );
        }

        // Default: a paragraph. Soft single newlines become spaces so wrapped
        // editor lines do not fracture; deliberate breaks need a blank line.
        const para = block.split('\n').join(' ');
        return renderInline(para, { ...proseStyle, ...styles.para }, color, `p${bi}`);
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  para: { marginBottom: 18 },
  heading: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 27,
    marginTop: 6,
    marginBottom: 14,
  },
  quote: {
    borderLeftWidth: 3,
    paddingLeft: 14,
    marginBottom: 18,
  },
  sceneBreak: { alignItems: 'center', marginVertical: 14 },
  sceneMark: { fontSize: 16, letterSpacing: 6 },
  figure: { marginBottom: 18 },
  image: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: 'rgba(127,127,127,0.15)',
  },
  caption: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});
