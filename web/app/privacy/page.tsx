import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — NovelStack',
  description: 'How NovelStack collects, uses and protects your information.',
  alternates: { canonical: 'https://novelstack.app/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-ink-muted">
          ‹ NovelStack
        </Link>
        <h1 className="font-serif text-3xl text-ink mt-4">Privacy Policy</h1>
        <p className="text-sm text-ink-faint mt-1 mb-8">Last updated 25 May 2026</p>

        <div className="text-[15px] text-ink-muted leading-relaxed space-y-3">
          <p>
            NovelStack (&quot;NovelStack&quot;, &quot;we&quot;, &quot;us&quot;) operates the
            NovelStack app and website. This policy explains what information we collect and
            how we use it.
          </p>

          <h2 className="font-serif text-xl text-ink mt-8">Information you provide</h2>
          <p>
            When you create an account we collect your email address, and the username,
            display name, date of birth, profile photo and biography you choose to add. When
            you publish or interact, we store the stories, chapters, comments, posts and tips
            you create.
          </p>

          <h2 className="font-serif text-xl text-ink mt-8">Information collected automatically</h2>
          <p>
            We collect reading activity (the chapters you open and your progress through
            them), the stories and writers you follow, device and app information, a device
            identifier, approximate region, and diagnostic data such as crash reports.
          </p>

          <h2 className="font-serif text-xl text-ink mt-8">How we use information</h2>
          <p>
            We use it to provide and improve NovelStack, to recommend stories, to send the
            notifications you have enabled, to process NovelStack+ subscriptions, to display
            advertising, and to keep the platform safe.
          </p>

          <h2 className="font-serif text-xl text-ink mt-8">Advertising and tracking</h2>
          <p>
            Free reading on NovelStack is supported by advertising provided by Google AdMob.
            AdMob may use a device identifier to show and measure ads. On iOS we ask for your
            permission through Apple App Tracking Transparency before any such tracking; you
            may decline, and you can change this later in your device Settings. NovelStack+
            members do not see ads.
          </p>

          <h2 className="font-serif text-xl text-ink mt-8">Service providers</h2>
          <p>
            We share data only with the providers that run NovelStack: Render (hosting and
            database), Cloudflare R2 (image storage), Resend (email delivery), Apple and
            RevenueCat (subscription billing), Google AdMob (advertising) and Expo (push
            notifications). We do not sell your personal information.
          </p>

          <h2 className="font-serif text-xl text-ink mt-8">Data retention and deletion</h2>
          <p>
            We keep your information while your account is active. You may delete your
            account at any time from within the app, or by emailing us. Deletion removes your
            account and associated personal data, except where we must retain certain records
            to meet legal obligations.
          </p>

          <h2 className="font-serif text-xl text-ink mt-8">Children</h2>
          <p>
            NovelStack is not intended for children under 13. Stories marked mature are gated
            behind an age confirmation.
          </p>

          <h2 className="font-serif text-xl text-ink mt-8">Your choices</h2>
          <p>
            You may access and correct your information in the app, control notification
            settings, and delete your account. For any other request, contact us.
          </p>

          <h2 className="font-serif text-xl text-ink mt-8">Changes</h2>
          <p>
            We may update this policy from time to time; the date above reflects the latest
            version.
          </p>

          <h2 className="font-serif text-xl text-ink mt-8">Contact</h2>
          <p>
            Questions about privacy:{' '}
            <a className="text-signal" href="mailto:privacy@novelstack.app">
              privacy@novelstack.app
            </a>
          </p>
        </div>

        <p className="text-sm text-ink-faint mt-12 pt-6 border-t border-border-soft">
          <Link href="/terms" className="text-signal">
            Terms of Use
          </Link>
          {'  ·  '}
          <Link href="/support" className="text-signal">
            Help &amp; Support
          </Link>
        </p>
      </div>
    </main>
  );
}
