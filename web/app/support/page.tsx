import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Help & Support — NovelStack',
  description: 'Answers to common questions and how to get in touch with NovelStack.',
  alternates: { canonical: 'https://novelstack.app/support' },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Is NovelStack free?',
    a: 'Yes. You can read on NovelStack for free, supported by ads. NovelStack+ removes ads and unlocks every chapter.',
  },
  {
    q: 'What is NovelStack+?',
    a: 'A $6.99 per month membership: ad-free reading, every chapter unlocked, and offline downloads. You can manage or cancel it any time in your Apple Account settings.',
  },
  {
    q: 'How do I publish a story?',
    a: 'Open the Write tab, create a story, then add and publish chapters in the editor.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Open your profile settings in the app and choose Delete account. This permanently removes your account and associated data.',
  },
  {
    q: 'How do I report a story or comment?',
    a: 'Use the report option on the story, chapter or comment, and our moderation team will review it.',
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-ink-muted">
          ‹ NovelStack
        </Link>
        <h1 className="font-serif text-3xl text-ink mt-4">Help &amp; Support</h1>
        <p className="text-[15px] text-ink-muted mt-2 mb-8">
          Answers to common questions, and how to reach us.
        </p>

        <h2 className="font-serif text-xl text-ink mt-4 mb-3">Frequently asked questions</h2>
        <div className="space-y-5">
          {FAQ.map((item) => (
            <div key={item.q}>
              <p className="text-[15px] font-medium text-ink">{item.q}</p>
              <p className="text-[15px] text-ink-muted leading-relaxed mt-1">{item.a}</p>
            </div>
          ))}
        </div>

        <h2 className="font-serif text-xl text-ink mt-10 mb-2">Contact us</h2>
        <p className="text-[15px] text-ink-muted leading-relaxed">
          Still need help? Email{' '}
          <a className="text-signal" href="mailto:support@novelstack.app">
            support@novelstack.app
          </a>{' '}
          and we will get back to you as soon as we can.
        </p>

        <p className="text-sm text-ink-faint mt-12 pt-6 border-t border-border-soft">
          <Link href="/privacy" className="text-signal">
            Privacy Policy
          </Link>
          {'  ·  '}
          <Link href="/terms" className="text-signal">
            Terms of Use
          </Link>
        </p>
      </div>
    </main>
  );
}
