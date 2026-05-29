import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';

// Top nav — translucent, blurred (mirrors the mobile TopBar). Sticky at top.
// Logo uses Bricolage Grotesque to match the mobile splash mark.
export async function AppHeader() {
  const user = await getSessionUser();

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border-soft"
      style={{
        background: 'rgba(20, 17, 15, 0.72)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-3.5 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-[22px] md:text-[24px] font-extrabold tracking-tight text-cream"
        >
          novelstack<span className="text-signal">.</span>
        </Link>
        <div className="flex items-center gap-5 text-sm text-ink-muted">
          <Link href="/browse" className="hidden md:inline hover:text-ink transition-colors">
            Browse
          </Link>
          {user ? (
            <>
              <Link href="/write" className="hidden md:inline hover:text-ink transition-colors">
                Write
              </Link>
              <Link href="/library" className="hidden md:inline hover:text-ink transition-colors">
                Library
              </Link>
              <Link
                href="/settings"
                className="bg-cream text-cream-ink px-4 py-2 rounded-full font-semibold text-[13px]"
              >
                Account
              </Link>
            </>
          ) : (
            <Link
              href="/signin"
              className="bg-cream text-cream-ink px-4 py-2 rounded-full font-semibold text-[13px]"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
