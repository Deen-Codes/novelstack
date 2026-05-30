import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { TopBarSearch } from '@/components/TopBarSearch';

// Top nav — translucent, blurred (mirrors the mobile TopBar). Sticky at top.
// Logo · inline search field · (write / library) · profile circle or sign in.
// Profile lives here on web, so the bottom tab bar doesn't carry it on mobile.
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
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-[22px] md:text-[24px] font-extrabold tracking-tight text-cream shrink-0"
        >
          novelstack<span className="text-signal">.</span>
        </Link>

        {/* Search — takes the centre, collapses to an icon below md. */}
        <TopBarSearch />

        <div className="flex items-center gap-4 md:gap-5 text-sm text-ink-muted shrink-0">
          {user ? (
            <>
              <Link href="/write" className="hidden md:inline hover:text-ink transition-colors">
                Write
              </Link>
              <Link href="/library" className="hidden md:inline hover:text-ink transition-colors">
                Library
              </Link>
              <ProfileCircle
                href="/settings"
                displayName={user.displayName ?? 'You'}
                avatarUrl={user.avatarUrl}
              />
            </>
          ) : (
            // Signed-out: keep an explicit CTA — an empty avatar circle reads
            // as "broken account" to a first-time visitor.
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

function ProfileCircle({
  href,
  displayName,
  avatarUrl,
}: {
  href: string;
  displayName: string;
  avatarUrl?: string | null;
}) {
  const initial = (displayName ?? '?').trim().slice(0, 1).toUpperCase() || '?';
  return (
    <Link
      href={href}
      aria-label="Your account"
      className="block w-9 h-9 rounded-full overflow-hidden border border-border-soft hover:border-edge transition-colors"
      style={{
        background: 'var(--color-signal-soft)',
        color: 'var(--color-signal)',
      }}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="w-full h-full flex items-center justify-center font-display font-bold text-[15px]">
          {initial}
        </span>
      )}
    </Link>
  );
}
