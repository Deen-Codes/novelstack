'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// App-style bottom navigation, shown only on mobile (md:hidden). Mirrors the
// native app's tab bar: Search · Library · Home · Write · Profile, with Home
// dead-centre. Hidden on the marketing landing page, auth screens and the
// reader (which is an immersive, full-screen view).
const TABS = [
  { href: '/search', label: 'Search', icon: 'search' },
  { href: '/library', label: 'Library', icon: 'bookmark' },
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/write', label: 'Write', icon: 'edit' },
  { href: '/settings', label: 'Profile', icon: 'user' },
] as const;

const HIDE_ON = ['/signin'];
const HIDE_PREFIX = ['/auth', '/read'];

function Icon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? '#E54B2A' : '#8A7659';
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'bookmark':
      return (
        <svg {...common}>
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

export function MobileTabBar() {
  const pathname = usePathname() || '/';

  if (HIDE_ON.includes(pathname)) return null;
  if (HIDE_PREFIX.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-paper/95 backdrop-blur border-t border-ink/10">
      <div className="flex items-stretch justify-around">
        {TABS.map((tab) => {
          const active =
            tab.href === '/'
              ? pathname === '/'
              : pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 py-2 flex-1"
            >
              <Icon name={tab.icon} active={active} />
              <span
                className={`text-[10px] font-medium ${
                  active ? 'text-signal' : 'text-ink-faint'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe-area inset for iOS home-indicator phones. */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
