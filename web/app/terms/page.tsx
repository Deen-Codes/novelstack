import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use — NovelStack',
  description: 'The terms that govern your use of NovelStack.',
  alternates: { canonical: 'https://novelstack.app/terms' },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-ink-muted">
          ‹ NovelStack
        </Link>
        <h1 className="font-display text-3xl text-ink mt-4">Terms of Use</h1>
        <p className="text-sm text-ink-faint mt-1 mb-8">Last updated 25 May 2026</p>

        <div className="text-[15px] text-ink-muted leading-relaxed space-y-3">
          <p>
            These terms govern your use of NovelStack. By using the NovelStack app or
            website, you agree to them.
          </p>

          <h2 className="font-display text-xl text-ink mt-8">Eligibility</h2>
          <p>You must be at least 13 years old to use NovelStack.</p>

          <h2 className="font-display text-xl text-ink mt-8">Your account</h2>
          <p>
            You are responsible for the accuracy of your account information, for keeping
            your account secure, and for the activity that occurs under it.
          </p>

          <h2 className="font-display text-xl text-ink mt-8">Your content</h2>
          <p>
            You keep ownership of the stories, chapters, comments and other content you
            create. By posting it, you grant NovelStack a worldwide, non-exclusive licence to
            host, store, display and distribute that content for the purpose of operating and
            promoting the service. You are responsible for your content and must hold all
            rights necessary to post it.
          </p>

          <h2 className="font-display text-xl text-ink mt-8">Acceptable use</h2>
          <p>
            You agree not to post content that is unlawful, infringing, hateful, harassing or
            that sexualises minors; not to spam, scrape or disrupt the service; and to mark
            mature content accordingly. We may remove content or suspend accounts that breach
            these terms.
          </p>

          <h2 className="font-display text-xl text-ink mt-8">NovelStack+</h2>
          <p>
            NovelStack+ is an optional membership priced at $6.99 per month. Payment is
            charged to your Apple ID. The subscription renews automatically unless it is
            cancelled at least 24 hours before the end of the current period. You can manage
            or cancel it in your Apple Account settings. Refunds are handled by Apple in line
            with their policies.
          </p>

          <h2 className="font-display text-xl text-ink mt-8">Tips and earnings</h2>
          <p>
            Readers may send optional tips to writers. Writers earn a share of NovelStack
            revenue according to the payout model described in the app. Earnings and payouts
            are subject to verification and applicable law.
          </p>

          <h2 className="font-display text-xl text-ink mt-8">Advertising</h2>
          <p>Reading NovelStack without a membership is supported by advertising.</p>

          <h2 className="font-display text-xl text-ink mt-8">Disclaimers and liability</h2>
          <p>
            NovelStack is provided on an as-available basis. To the extent permitted by law,
            we are not liable for indirect or consequential losses arising from your use of
            the service.
          </p>

          <h2 className="font-display text-xl text-ink mt-8">Changes</h2>
          <p>
            We may update these terms; continued use of NovelStack after an update means you
            accept the revised terms.
          </p>

          <h2 className="font-display text-xl text-ink mt-8">Contact</h2>
          <p>
            Questions about these terms:{' '}
            <a className="text-signal" href="mailto:support@novelstack.app">
              support@novelstack.app
            </a>
          </p>
        </div>

        <p className="text-sm text-ink-faint mt-12 pt-6 border-t border-border-soft">
          <Link href="/privacy" className="text-signal">
            Privacy Policy
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
