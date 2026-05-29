import type { Metadata, Viewport } from 'next';
import { Inter, Bricolage_Grotesque, Newsreader } from 'next/font/google';
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
      className={`${inter.variable} ${bricolage.variable} ${newsreader.variable}`}
    >
      {/* Dark/ember everywhere. Paper-mode is scoped to /read via `.paper-mode`. */}
      <body className="font-sans bg-paper text-ink pb-16 md:pb-0 antialiased">
        {children}
        <MobileTabBar />
      </body>
    </html>
  );
}
