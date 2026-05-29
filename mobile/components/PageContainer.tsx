import { useMemo } from 'react';
import { useWindowDimensions, type ViewStyle } from 'react-native';

// Reading-width breakpoint — once the device is wider than this, content
// gets centred with side padding so paragraphs, story cards, and feed rows
// don't stretch across the whole iPad. Tuned around 640pt so iPhone (always
// narrower) is never affected, while iPad in any orientation gets the
// centred reading column.
const READING_MAX_WIDTH = 640;

// Returns a contentContainerStyle fragment to spread into any ScrollView /
// FlatList contentContainerStyle on a tab screen. On phones it's a no-op
// (returns an empty object). On iPad it caps the content width and centres
// it horizontally so the layout stays readable instead of sprawling.
//
// Usage:
//   const ipadPad = useReadingWidth();
//   <ScrollView contentContainerStyle={[styles.scroll, ipadPad]}>...
//
// Doesn't touch the bar / FAB layers — those still want the full screen
// width — only the scroll content.
export function useReadingWidth(): ViewStyle {
  const { width } = useWindowDimensions();
  return useMemo(() => {
    if (width <= READING_MAX_WIDTH) return {};
    const sidePad = Math.max(24, (width - READING_MAX_WIDTH) / 2);
    return {
      paddingHorizontal: sidePad,
      maxWidth: width,    // anchor — keeps RN from collapsing to content width
      alignSelf: 'center',
    };
  }, [width]);
}

// Hint whether we're currently rendered on an iPad-sized canvas. Useful for
// branching to multi-column grids on Home / Library only when the room is
// actually there — never affects phone layout.
export function useIsWide(): boolean {
  const { width } = useWindowDimensions();
  return width > READING_MAX_WIDTH;
}

// Width string ('31%' / '18%' / etc) for a cover cell in a wrap-grid given
// the desired column counts at each breakpoint. The "% string" form keeps
// flexWrap + gap math behaving the way every existing grid in the app
// already does — no layout shift to FlatList needed.
export function useGridItemWidth(opts: {
  phone: number;     // columns on phone (e.g. 3)
  tablet: number;    // columns on iPad portrait (e.g. 5)
  tabletWide?: number; // columns on iPad landscape / large iPad (e.g. 6)
}): string {
  const { width } = useWindowDimensions();
  const cols =
    width > 1100 ? (opts.tabletWide ?? opts.tablet)
    : width > READING_MAX_WIDTH ? opts.tablet
    : opts.phone;
  // Each item leaves a 12pt gap on its trailing edge — same as the existing
  // `gap: 12` styling on the wraps. Translate that into a width pct.
  const pct = Math.floor(96 / cols);
  return `${pct}%`;
}
