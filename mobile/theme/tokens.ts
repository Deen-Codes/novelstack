// NovelStack brand tokens — dark cinematic theme, deep ember/ruby accent.
// Legacy key names (paper, white, etc.) are kept and remapped to dark values
// so screens that reference them reskin without code changes.
export const colors = {
  // Backgrounds & surfaces (warm near-black, not cold pure black).
  paper: '#14110F', // app background
  paperSoft: '#1C1714', // raised surface / bottom sheet
  white: '#241E1A', // card surface (legacy name — kept for compatibility)
  card: '#241E1A',
  cardHi: '#2C2520',

  // Text
  ink: '#F2EADC', // primary text (warm off-white)
  inkMuted: '#A29685',
  inkFaint: '#6F6459',

  // Accent — deep ember / ruby
  signal: '#C8414E',
  signalDeep: '#8E2C38',
  signalSoft: '#3A2025', // tinted fill behind accent elements

  // Lines
  borderSoft: '#332B25',
  border: '#3F352D',
};

// Light "paper" palette — used only by the reader's paper reading mode.
export const paperMode = {
  bg: '#F5EFE0',
  surface: '#EDE4CE',
  ink: '#2A2418',
  inkMuted: '#7C6F58',
  border: '#E3D8BE',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const fonts = {
  serif: 'serif',
  sans: 'System',
};
