// Default cover for iOS — typographic, picks one of 10 variants deterministically
// by hashing the story id. The title IS the design, so callers must NOT render
// the title text again underneath the cover (otherwise it duplicates).
//
// 1:1 port of web/components/DefaultCover.tsx — same variants, same colours,
// same deterministic pick. Fonts loaded by _layout.tsx via @expo-google-fonts.
import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';

const VARIANT_COUNT = 10;

// Same FNV-ish hash as the web version so a given story renders the same
// variant on iOS as it does on novelstack.app.
function pickVariant(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % VARIANT_COUNT;
}

function splitHalves(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return [title, ''];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function firstWords(title: string, n = 3): string[] {
  return title.trim().split(/\s+/).slice(0, n);
}

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

// Type sizes auto-scale by the cover's actual rendered width. Each variant
// gets its own scaling factor for the title vs the chrome elements.
function scale(width: number, base: number, max: number = base * 3): number {
  // 300px-wide cover is the design reference. Scale up/down proportionally
  // but cap so a giant hero cover doesn't blow the type out.
  const factor = Math.min(width / 300, max / base);
  return Math.max(8, Math.round(base * factor));
}

// Cream + ember tokens used across most variants.
const CREAM = '#F4ECDF';
const CREAM_LO = 'rgba(244, 236, 223, 0.65)';
const CREAM_XLO = 'rgba(244, 236, 223, 0.18)';

export function DefaultCover({
  storyId,
  title,
  genre: _genre,
  authorName,
  width,
  style,
}: {
  storyId: string;
  title: string;
  genre?: string | null;
  authorName?: string | null;
  // Width hint (in px) so type sizes can scale. Parent should pass the
  // cover's intended rendered width; falls back to 200 if not known.
  width?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const v = pickVariant(storyId);
  const t = title || 'Untitled';
  const w = width ?? 200;

  switch (v) {
    case 0: return <V1 width={w} title={t} style={style} />;
    case 1: return <V2 width={w} title={t} style={style} />;
    case 2: return <V3 width={w} title={t} style={style} />;
    case 3: return <V4 width={w} title={t} style={style} />;
    case 4: return <V5 width={w} title={t} style={style} />;
    case 5: return <V6 width={w} title={t} style={style} />;
    case 6: return <V7 width={w} title={t} authorName={authorName} style={style} />;
    case 7: return <V8 width={w} title={t} authorName={authorName} style={style} />;
    case 8: return <V9 width={w} title={t} style={style} />;
    default: return <V10 width={w} title={t} style={style} />;
  }
}

// ============================================================
// 01 — Brick · Bricolage 800 · Ember
// ============================================================
function V1({ width, title, style }: { width: number; title: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.fill, { backgroundColor: '#C8414E' }, style]}>
      <View style={[styles.dot, { width: scale(width, 10), height: scale(width, 10) }]} />
      <Text
        numberOfLines={4}
        style={[
          styles.titleBottom,
          {
            fontFamily: 'BricolageGrotesque_800ExtraBold',
            fontSize: scale(width, 38, 72),
            lineHeight: scale(width, 38, 72) * 0.95,
            letterSpacing: -1,
            color: CREAM,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

// ============================================================
// 02 — Wrapped · Inter Tight 900 · Plum
// ============================================================
function V2({ width, title, style }: { width: number; title: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.fill, { backgroundColor: '#5C2A55' }, style]}>
      <Text
        style={[
          styles.eyebrowTopRight,
          {
            fontFamily: 'InterTight_900Black',
            fontSize: scale(width, 9, 13),
            letterSpacing: 1.6,
            color: CREAM_LO,
          },
        ]}
      >
        ROMANCE
      </Text>
      <Text
        numberOfLines={4}
        style={[
          styles.titleBottom,
          {
            fontFamily: 'InterTight_900Black',
            fontSize: scale(width, 32, 58),
            lineHeight: scale(width, 32, 58) * 0.97,
            letterSpacing: -1.2,
            color: '#F8EFDE',
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

// ============================================================
// 03 — Editorial · Fraunces 700 · Burgundy
// ============================================================
function V3({ width, title, style }: { width: number; title: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.fill, styles.center, { backgroundColor: '#7A2434', padding: width * 0.10 }, style]}>
      <View style={{ width: width * 0.18, height: 1.5, backgroundColor: 'rgba(244,236,223,0.55)', marginBottom: width * 0.05 }} />
      <Text
        numberOfLines={4}
        style={[
          styles.titleCentered,
          {
            fontFamily: 'Fraunces_700Bold',
            fontSize: scale(width, 28, 50),
            lineHeight: scale(width, 28, 50),
            letterSpacing: -0.6,
            color: CREAM,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={{
          marginTop: width * 0.05,
          fontFamily: 'Fraunces_700Bold',
          fontSize: scale(width, 9, 13),
          letterSpacing: 2,
          color: 'rgba(244,236,223,0.55)',
        }}
      >
        A NOVEL
      </Text>
    </View>
  );
}

// ============================================================
// 04 — Stack · Manrope 800 · Forest
// ============================================================
function V4({ width, title, style }: { width: number; title: string; style?: StyleProp<ViewStyle> }) {
  const [a, b] = splitHalves(title);
  const size = scale(width, 28, 50);
  return (
    <View style={[styles.fill, { backgroundColor: '#2E4E3F', padding: width * 0.08, justifyContent: 'flex-end' }, style]}>
      <Text style={[styles.cornerTopLeft, { fontFamily: 'Manrope_800ExtraBold', fontSize: scale(width, 9, 13), letterSpacing: 1.5, color: 'rgba(244,236,223,0.5)' }]}>
        VOL I
      </Text>
      <Text numberOfLines={2} style={{ fontFamily: 'Manrope_800ExtraBold', fontSize: size, lineHeight: size * 1.05, letterSpacing: -0.8, color: CREAM }}>
        {a}
      </Text>
      {b ? (
        <Text numberOfLines={2} style={{ fontFamily: 'Manrope_800ExtraBold', fontSize: size, lineHeight: size * 1.05, letterSpacing: -0.8, color: 'rgba(244,236,223,0.6)' }}>
          {b}
        </Text>
      ) : null}
    </View>
  );
}

// ============================================================
// 05 — Index · Sora 700 · Sand
// ============================================================
function V5({ width, title, style }: { width: number; title: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.fill, { backgroundColor: '#A87142' }, style]}>
      <View style={[styles.headRow, { paddingHorizontal: width * 0.08, paddingTop: width * 0.09 }]}>
        <Text style={{ fontFamily: 'Sora_700Bold', fontSize: scale(width, 9, 13), letterSpacing: 2, color: 'rgba(255,240,220,0.7)' }} numberOfLines={1}>
          {title.toUpperCase().slice(0, 18)}
        </Text>
        <Text style={{ fontFamily: 'Sora_700Bold', fontSize: scale(width, 9, 13), letterSpacing: 2, color: 'rgba(255,240,220,0.7)' }}>
          NS
        </Text>
      </View>
      <Text
        style={{
          position: 'absolute',
          left: width * 0.06,
          top: '38%',
          fontFamily: 'Sora_700Bold',
          fontSize: scale(width, 80, 140),
          lineHeight: scale(width, 80, 140) * 0.9,
          letterSpacing: -3,
          color: CREAM_XLO,
        }}
      >
        01
      </Text>
      <Text
        numberOfLines={3}
        style={[
          styles.titleBottom,
          {
            fontFamily: 'Sora_700Bold',
            fontSize: scale(width, 26, 44),
            lineHeight: scale(width, 26, 44) * 1.05,
            letterSpacing: -0.7,
            color: '#FFF1DA',
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

// ============================================================
// 06 — Field · Outfit 800 · Midnight
// ============================================================
function V6({ width, title, style }: { width: number; title: string; style?: StyleProp<ViewStyle> }) {
  const size = scale(width, 34, 60);
  return (
    <View style={[styles.fill, { backgroundColor: '#1E2A4A', padding: width * 0.08, justifyContent: 'center' }, style]}>
      <Text numberOfLines={3} style={{ fontFamily: 'Outfit_800ExtraBold', fontSize: size, lineHeight: size, letterSpacing: -1.5, color: '#E9DDF7' }}>
        {title.toLowerCase()}
      </Text>
      <Text style={{ marginTop: width * 0.05, fontFamily: 'Outfit_800ExtraBold', fontSize: scale(width, 9, 13), letterSpacing: 1.6, color: 'rgba(233,221,247,0.5)' }}>
        A STORY
      </Text>
    </View>
  );
}

// ============================================================
// 07 — Spine · Space Grotesk 700 · Sage (rotated title)
// ============================================================
function V7({ width, title, authorName, style }: { width: number; title: string; authorName?: string | null; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.fill, { backgroundColor: '#5A6F4F' }, style]}>
      {/* Vertical title — rotated 90deg, anchored to the left edge. */}
      <View
        style={{
          position: 'absolute',
          left: width * 0.11,
          top: 0,
          bottom: 0,
          width: width * 0.18,
          justifyContent: 'center',
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'SpaceGrotesk_700Bold',
            fontSize: scale(width, 22, 34),
            lineHeight: scale(width, 22, 34) * 1.1,
            color: CREAM,
            transform: [{ rotate: '-90deg' }],
            width: 200,
          }}
        >
          {title}
        </Text>
      </View>
      {/* Author initials bottom-right */}
      <View style={{ position: 'absolute', right: width * 0.08, bottom: width * 0.08, alignItems: 'flex-end' }}>
        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: scale(width, 9, 13), letterSpacing: 1.6, color: 'rgba(244,236,223,0.55)' }}>
          A STORY BY
        </Text>
        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: scale(width, 22, 36), letterSpacing: -0.5, color: CREAM, marginTop: 4 }}>
          {initials(authorName, title)}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// 08 — Band · DM Sans 700 · Cream-on-charcoal (two-tone)
// ============================================================
function V8({ width, title, authorName, style }: { width: number; title: string; authorName?: string | null; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.fill, { backgroundColor: '#1A1714' }, style]}>
      <Text style={{ position: 'absolute', top: width * 0.09, left: width * 0.08, fontFamily: 'DMSans_700Bold', fontSize: scale(width, 9, 13), letterSpacing: 1.6, color: 'rgba(244,236,223,0.55)' }}>
        NOVELSTACK
      </Text>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '30%',
          bottom: '30%',
          backgroundColor: '#F4ECDF',
          paddingHorizontal: width * 0.08,
          justifyContent: 'center',
        }}
      >
        <Text numberOfLines={3} style={{ fontFamily: 'DMSans_700Bold', fontSize: scale(width, 24, 40), lineHeight: scale(width, 24, 40), letterSpacing: -0.7, color: '#1A1714' }}>
          {title}
        </Text>
      </View>
      <Text
        style={{
          position: 'absolute',
          bottom: width * 0.09,
          right: width * 0.08,
          fontFamily: 'DMSans_700Bold',
          fontSize: scale(width, 9, 13),
          letterSpacing: 1.6,
          color: 'rgba(244,236,223,0.55)',
        }}
        numberOfLines={1}
      >
        {(authorName ?? 'A NOVELSTACK WRITER').toUpperCase()}
      </Text>
    </View>
  );
}

// ============================================================
// 09 — Mosaic · Plus Jakarta Sans 800 · Dusty rose (2-col grid)
// ============================================================
function V9({ width, title, style }: { width: number; title: string; style?: StyleProp<ViewStyle> }) {
  const words = firstWords(title, 3);
  while (words.length < 4) words.push(words.length === 3 ? '·' : '');
  const size = scale(width, 26, 44);
  return (
    <View style={[styles.fill, { backgroundColor: '#A2516B' }, style]}>
      <View
        style={{
          position: 'absolute',
          top: width * 0.09,
          right: width * 0.08,
          width: scale(width, 18, 26),
          height: scale(width, 18, 26),
          borderRadius: 999,
          borderWidth: 1.5,
          borderColor: 'rgba(255,241,218,0.55)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: width * 0.08,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ width: '48%', fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: size, lineHeight: size * 0.95, letterSpacing: -0.7, color: '#FFF1DA' }} numberOfLines={1}>
          {words[0]}
        </Text>
        <Text style={{ width: '48%', textAlign: 'right', fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: size, lineHeight: size * 0.95, letterSpacing: -0.7, color: 'rgba(255,241,218,0.65)' }} numberOfLines={1}>
          {words[1]}
        </Text>
        <Text style={{ width: '48%', fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: size, lineHeight: size * 0.95, letterSpacing: -0.7, color: '#FFF1DA' }} numberOfLines={1}>
          {words[2]}
        </Text>
        <Text style={{ width: '48%', textAlign: 'right', fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: size, lineHeight: size * 0.95, letterSpacing: -0.7, color: 'rgba(255,241,218,0.65)' }} numberOfLines={1}>
          {words[3]}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// 10 — Mono · IBM Plex Mono 700 · Slate · corner brackets
// ============================================================
function V10({ width, title, style }: { width: number; title: string; style?: StyleProp<ViewStyle> }) {
  const bracketSize = scale(width, 11, 16);
  const bracket = (corner: 'tl' | 'tr' | 'bl' | 'br'): ViewStyle => ({
    position: 'absolute',
    width: bracketSize,
    height: bracketSize,
    borderColor: 'rgba(244,236,223,0.55)',
    ...(corner === 'tl' && { top: width * 0.06, left: width * 0.07, borderTopWidth: 2, borderLeftWidth: 2 }),
    ...(corner === 'tr' && { top: width * 0.06, right: width * 0.07, borderTopWidth: 2, borderRightWidth: 2 }),
    ...(corner === 'bl' && { bottom: width * 0.06, left: width * 0.07, borderBottomWidth: 2, borderLeftWidth: 2 }),
    ...(corner === 'br' && { bottom: width * 0.06, right: width * 0.07, borderBottomWidth: 2, borderRightWidth: 2 }),
  });
  const size = scale(width, 16, 28);
  return (
    <View style={[styles.fill, { backgroundColor: '#3F4956' }, style]}>
      <View style={bracket('tl')} />
      <View style={bracket('tr')} />
      <View style={bracket('bl')} />
      <View style={bracket('br')} />
      <View style={[styles.fill, { padding: width * 0.12, justifyContent: 'center', alignItems: 'center' }]}>
        <Text
          numberOfLines={4}
          style={{
            fontFamily: 'IBMPlexMono_700Bold',
            fontSize: size,
            lineHeight: size * 1.15,
            letterSpacing: 0.5,
            textAlign: 'center',
            color: CREAM,
          }}
        >
          {title.toUpperCase()}
        </Text>
      </View>
      <Text
        style={{
          position: 'absolute',
          bottom: width * 0.08,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'IBMPlexMono_700Bold',
          fontSize: scale(width, 8, 11),
          letterSpacing: 1.6,
          color: 'rgba(244,236,223,0.55)',
        }}
      >
        NSK · 010
      </Text>
    </View>
  );
}

// ============================================================
// Shared styles
// ============================================================
const styles = StyleSheet.create({
  fill: { width: '100%', height: '100%', overflow: 'hidden' },
  center: { justifyContent: 'center', alignItems: 'center' },
  dot: { position: 'absolute', top: '9%', left: '8%', borderRadius: 999, backgroundColor: '#F4ECDF' },
  titleBottom: { position: 'absolute', bottom: '9%', left: '8%', right: '8%' } as TextStyle,
  titleCentered: { textAlign: 'center' } as TextStyle,
  eyebrowTopRight: { position: 'absolute', top: '9%', right: '8%' } as TextStyle,
  cornerTopLeft: { position: 'absolute', top: '9%', left: '8%' } as TextStyle,
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
