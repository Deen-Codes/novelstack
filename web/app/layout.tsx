import type { Metadata, Viewport } from 'next';
import {
  Inter,
  Bricolage_Grotesque,
  Newsreader,
  // Default-cover variant fonts — one weight each, latin only, kept lean.
  Inter_Tight,
  Fraunces,
  Manrope,
  Sora,
  Outfit,
  Space_Grotesk,
  DM_Sans,
  Plus_Jakarta_Sans,
  IBM_Plex_Mono,
} from 'next/font/google';
import './globals.css';
import { MobileTabBar } from '@/components/MobileTabBar';

// UI / chrome / cards / buttons.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui-inter',
  display: 'swap',
});

// Display — logo, hero, section titles, chapter title.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display-bricolage',
  display: 'swap',
});

// Reader prose only — Newsreader is a screen-tuned reading serif.
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display-newsreader',
  display: 'swap',
});

// ============================================================
// Default-cover variant fonts. Each loads ONE weight + latin only
// to keep the page weight manageable. See DefaultCover.tsx + globals.css.
// ============================================================
const interTight = Inter_Tight({ subsets: ['latin'], weight: ['900'], variable: '--font-cv-inter-tight', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], weight: ['700'], variable: '--font-cv-fraunces', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], weight: ['800'], variable: '--font-cv-manrope', display: 'swap' });
const sora = Sora({ subsets: ['latin'], weight: ['700'], variable: '--font-cv-sora', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], weight: ['800'], variable: '--font-cv-outfit', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['700'], variable: '--font-cv-space-grotesk', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['700'], variable: '--font-cv-dm-sans', display: 'swap' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['800'], variable: '--font-cv-plus-jakarta', display: 'swap' });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['700'], variable: '--font-cv-ibm-plex-mono', display: 'swap' });

const coverFontVars = [
  interTight.variable,
  fraunces.variable,
  manrope.variable,
  sora.variable,
  outfit.variable,
  spaceGrotesk.variable,
  dmSans.variable,
  plusJakarta.variable,
  ibmPlexMono.variable,
].join(' ');

export const metadata: Metadata = {
  title: 'NovelStack — Stories worth following.',
  description:
    'Serialised fiction worth following. Free to read with ads, or $6.99/mo for all-access. Writers keep 70%.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#14110F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable} ${newsreader.variable} ${coverFontVars}`}
    >
      {/* Dark/ember everywhere. Paper-mode is scoped to /read via `.paper-mode`. */}
      <body className="font-sans bg-paper text-ink pb-16 md:pb-0 antialiased">
        {children}
        <MobileTabBar />
      </body>
    </html>
  );
}
