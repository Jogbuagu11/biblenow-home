'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers';
import Link from 'next/link';

const NAV_ITEMS: { name: string; href: string; icon: string; useUserId?: boolean }[] = [
  { name: 'Home', href: '/app', icon: '🏠' },
  { name: 'Livestream', href: '/livestreams', icon: '📹' },
  { name: 'Groups', href: '/groups', icon: '👥' },
  { name: 'Profile', href: '/profile', icon: '👤', useUserId: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const profileHref = user ? `/profile/${user.id}` : '/profile';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-dark-400/95 backdrop-blur-xl border-t border-gray-200/80 dark:border-dark-200 safe-area-pb"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
    >
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const href = item.useUserId ? profileHref : item.href;
          const current = item.useUserId
            ? pathname?.startsWith('/profile') ?? false
            : pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false);
          return (
            <Link
              key={item.name}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-0 gap-0.5 transition-colors ${
                current
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium truncate max-w-[72px]">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
