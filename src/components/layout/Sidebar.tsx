'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { useTheme } from '@/hooks/useTheme';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, profile, verifiedProfile, isVerified, signOut } = useAuth();
  const { theme } = useTheme();

  const displayName = isVerified 
    ? `${verifiedProfile?.first_name} ${verifiedProfile?.last_name}`.trim()
    : `${profile?.first_name} ${profile?.last_name}`.trim();

  const avatarUrl = isVerified 
    ? verifiedProfile?.profile_photo_url 
    : profile?.profile_photo_url;

  const navigation = [
    { name: 'Home', href: '/app', icon: '🏠' },
    { name: 'Livestreams', href: '/livestreams', icon: '📹' },
    { name: 'Courses', href: '/courses', icon: '📚' },
    { name: 'Groups', href: '/groups', icon: '👥' },
    { name: 'Messages', href: '/messages', icon: '💬' },
    { name: 'Notifications', href: '/notifications', icon: '🔔' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ].map((item) => ({
    ...item,
    current: pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false),
  }));

  const userNavigation = [
    { name: 'Profile', href: user ? `/profile/${user.id}` : '/profile', icon: '👤' },
    { name: 'Following', href: '/following', icon: '❤️' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/95 dark:bg-dark-400/95 backdrop-blur-xl border-r border-gray-200/80 dark:border-dark-200 pt-6 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-5">
            <h1 className="text-xl font-bold tracking-tight text-gradient">
              BibleNOW
            </h1>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-3 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-200 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100'
                } group flex items-center px-3 py-2.5 text-sm rounded-xl transition-all duration-200`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>

          {/* User section */}
          {user && (
            <div className="flex-shrink-0 flex border-t border-gray-200/80 dark:border-dark-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="avatar-md" />
                  ) : (
                    <span className="h-12 w-12 rounded-full bg-gray-200 dark:bg-dark-600 flex items-center justify-center text-gray-400 text-2xl">👤</span>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {displayName || 'User'}
                  </p>
                  {isVerified && (
                    <p className="text-xs text-primary-500 font-medium">Verified</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {user && (
            <div className="flex-shrink-0 px-3 pb-4">
              <div className="space-y-0.5">
                {userNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100 group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </a>
                ))}
                <button
                  onClick={signOut}
                  className="w-full text-left text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
                >
                  <span className="mr-3 text-lg">🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white/98 dark:bg-dark-400/98 backdrop-blur-xl border-r border-gray-200/80 dark:border-dark-200 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/80 dark:border-dark-200">
            <h1 className="text-xl font-bold tracking-tight text-gradient">BibleNOW</h1>
            <button onClick={onClose} className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700">
              <span className="text-xl">✕</span>
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`${item.current ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-200 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'} group flex items-center px-3 py-2.5 text-sm rounded-xl transition-all duration-200`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>
          {user ? (
            <div className="border-t border-gray-200/80 dark:border-dark-200 p-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  {avatarUrl ? <img src={avatarUrl} alt={displayName} className="avatar-md" /> : <span className="h-12 w-12 rounded-full bg-gray-200 dark:bg-dark-600 flex items-center justify-center text-2xl">👤</span>}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{displayName || 'User'}</p>
                  {isVerified && <p className="text-xs text-primary-500 font-medium">Verified</p>}
                </div>
              </div>
              <div className="space-y-0.5">
                {userNavigation.map((item) => (
                  <a key={item.name} href={item.href} onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all">
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </a>
                ))}
                <button onClick={() => { signOut(); onClose(); }} className="w-full text-left text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl">
                  <span className="mr-3 text-lg">🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200/80 dark:border-dark-200 p-4">
              <div className="space-y-2">
                <a
                  href="/auth"
                  onClick={onClose}
                  className="w-full btn-outline text-sm text-center block"
                >
                  Sign In
                </a>
                <a
                  href="/auth"
                  onClick={onClose}
                  className="w-full btn-primary text-sm text-center block"
                >
                  Sign Up
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}