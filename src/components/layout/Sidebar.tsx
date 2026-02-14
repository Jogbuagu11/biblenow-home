'use client';

import { useAuth } from '@/app/providers';
import { useTheme } from '@/hooks/useTheme';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, profile, verifiedProfile, isVerified, signOut } = useAuth();
  const { theme } = useTheme();

  const displayName = isVerified 
    ? `${verifiedProfile?.first_name} ${verifiedProfile?.last_name}`.trim()
    : `${profile?.first_name} ${profile?.last_name}`.trim();

  const avatarUrl = isVerified 
    ? verifiedProfile?.profile_photo_url 
    : profile?.profile_photo_url;

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠', current: true },
    { name: 'Livestreams', href: '/livestreams', icon: '📹', current: false },
    { name: 'Groups', href: '/groups', icon: '👥', current: false },
    { name: 'Settings', href: '/settings', icon: '⚙️', current: false },
  ];

  const userNavigation = [
    { name: 'Profile', href: user ? `/profile/${user.id}` : '/profile', icon: '👤' },
    { name: 'Following', href: '/following', icon: '❤️' },
    { name: 'Messages', href: '/messages', icon: '💬' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-dark-400 border-r border-primary-200 dark:border-dark-200 pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gradient">
              BibleNOW
            </h1>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'bg-primary-100 dark:bg-primary-500 text-primary-700 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
              >
                <span
                  className={`${
                    item.current
                      ? 'text-primary-500 dark:text-white'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  } mr-3 text-lg`}
                >
                  {item.icon}
                </span>
                {item.name}
              </a>
            ))}
          </nav>

          {/* User section */}
          {user && (
            <div className="flex-shrink-0 flex border-t border-primary-200 dark:border-dark-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="avatar-md"
                    />
                  ) : (
                    <span className="h-10 w-10 text-gray-400 text-3xl">👤</span>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {displayName || 'User'}
                  </p>
                  {isVerified && (
                    <p className="text-xs text-primary-500">Verified</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* User navigation */}
          {user && (
            <div className="flex-shrink-0 px-2 pb-4">
              <div className="space-y-1">
                {userNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  >
                    <span className="mr-3 text-lg text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">
                      {item.icon}
                    </span>
                    {item.name}
                  </a>
                ))}
                <button
                  onClick={signOut}
                  className="w-full text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                >
                  <span className="mr-3 text-lg text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-400 border-r border-primary-200 dark:border-dark-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-primary-200 dark:border-dark-200">
            <h1 className="text-xl font-bold text-gradient">
              BibleNOW
            </h1>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`${
                  item.current
                    ? 'bg-primary-100 dark:bg-primary-500 text-primary-700 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
              >
                <span
                  className={`${
                    item.current
                      ? 'text-primary-500 dark:text-white'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  } mr-3 text-lg`}
                >
                  {item.icon}
                </span>
                {item.name}
              </a>
            ))}
          </nav>

          {/* User section */}
          {user ? (
            <div className="border-t border-primary-200 dark:border-dark-200 p-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="avatar-md"
                    />
                  ) : (
                    <span className="h-10 w-10 text-gray-400 text-3xl">👤</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {displayName || 'User'}
                  </p>
                  {isVerified && (
                    <p className="text-xs text-primary-500">Verified</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                {userNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  >
                    <span className="mr-3 text-lg text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">
                      {item.icon}
                    </span>
                    {item.name}
                  </a>
                ))}
                <button
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                  className="w-full text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                >
                  <span className="mr-3 text-lg text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-primary-200 dark:border-dark-200 p-4">
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