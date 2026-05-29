import type { Config } from 'tailwindcss';

// Tokens mirror /Users/.../mobile/theme/tokens.ts via CSS custom properties
// in globals.css. Keep this list in sync with the :root block there.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        'paper-soft': 'var(--color-paper-soft)',
        card: 'var(--color-card)',
        'card-hi': 'var(--color-card-hi)',
        'card-web': 'var(--color-card-web)',
        ink: 'var(--color-ink)',
        'ink-muted': 'var(--color-ink-muted)',
        'ink-faint': 'var(--color-ink-faint)',
        signal: 'var(--color-signal)',
        'signal-deep': 'var(--color-signal-deep)',
        'signal-soft': 'var(--color-signal-soft)',
        cream: 'var(--color-cream)',
        'cream-ink': 'var(--color-cream-ink)',
        'border-soft': 'var(--color-border-soft)',
        // 'border' is reserved by Tailwind's border-* utilities — alias it
        edge: 'var(--color-border)',
        divider: 'var(--color-divider)',
        warn: 'var(--color-warn)',
      },
      fontFamily: {
        sans: ['var(--font-ui-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display-bricolage)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display-newsreader)', 'Charter', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
