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
import { Fragment, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { fonts } from '@/theme/tokens';

type Props = {
  body: string;
  // Primary prose colour — caller passes the active reading-mode ink.
  color: string;
  // Muted colour for captions / scene-break rule.
  faint: string;
  // Optional override for the base prose size (reader uses 18).
  fontSize?: number;
};

// --- inline emphasis -------------------------------------------------------
// Splits a line into styled segments. Honours **bold**, *italic* and _italic_.
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

function InlineText({
  line,
  style,
  color,
}: {
  line: string;
  style: object;
  color: string;
}) {
  const segs = parseInline(line);
  return (
    <Text style={[style, { color }]}>
      {segs.map((s, idx) => (
        <Text
          key={idx}
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

export function MarkdownText({ body, color, faint, fontSize = 18 }: Props) {
  const proseStyle = { fontFamily: 'serif', fontSize, lineHeight: fontSize * 1.72 };
  // Split into blocks on blank lines; keep single newlines inside a block.
  const blocks = (body ?? '').replace(/\r\n/g, '\n').split(/\n{2,}/);

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
          return (
            <InlineText
              key={bi}
              line={block.slice(3).trim()}
              color={color}
              style={styles.heading}
            />
          );
        }

        // Block quote — one or more `> ` lines.
        if (block.split('\n').every((l) => l.startsWith('>'))) {
          const text = block
            .split('\n')
            .map((l) => l.replace(/^>\s?/, ''))
            .join('\n');
          return (
            <View key={bi} style={[styles.quote, { borderLeftColor: faint }]}>
              <InlineText
                line={text}
                color={faint}
                style={{ ...proseStyle, fontStyle: 'italic' }}
              />
            </View>
          );
        }

        // Default: a paragraph. Soft single newlines become spaces so wrapped
        // editor lines don't fracture; deliberate breaks need a blank line.
        const para = block.split('\n').join(' ');
        return (
          <Fragment key={bi}>
            <InlineText line={para} color={color} style={{ ...proseStyle, ...styles.para }} />
          </Fragment>
        );
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
