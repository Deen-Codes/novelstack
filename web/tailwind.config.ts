import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5EFE0',
        'paper-soft': '#FAF6EA',
        ink: '#2A2418',
        'ink-muted': '#6B5A40',
        'ink-faint': '#8A7659',
        signal: '#E54B2A',
        'border-soft': '#E8DCC0',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
