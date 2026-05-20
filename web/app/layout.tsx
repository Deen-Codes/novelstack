import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { MobileTabBar } from '@/components/MobileTabBar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'NovelStack — Stories worth following.',
  description:
    'Serialized fiction from millions of writers. Free to read with ads, or $6.99/mo for all-access. Writers keep 70%.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Allow zoom for accessibility, but render at device width by default.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      {/* pb-16 on mobile clears the fixed bottom tab bar; removed at md+. */}
      <body className="font-sans bg-paper text-ink pb-16 md:pb-0">
        {children}
        <MobileTabBar />
      </body>
    </html>
  );
}
