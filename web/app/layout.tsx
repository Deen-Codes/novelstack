import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'NovelStack — Stories worth following.',
  description:
    'Serialized fiction from millions of writers. Free to read with ads, or $6.99/mo for all-access. Writers keep 70%.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body className="font-sans bg-paper text-ink">{children}</body>
    </html>
  );
}
