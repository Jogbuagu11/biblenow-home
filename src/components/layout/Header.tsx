'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers';

function authHref() {
  const base = typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL.trim()
    ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, '')
    : '';
  return base ? base + '/auth' : '/auth';
}
// import { 
//   Bars3Icon, 
//   MagnifyingGlassIcon, 
//   BellIcon, 
//   UserCircleIcon,
//   SunIcon,
//   MoonIcon
// } from '@heroicons/react/24/outline';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, profile, verifiedProfile, isVerified } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const displayName = isVerified 
    ? `${verifiedProfile?.first_name} ${verifiedProfile?.last_name}`.trim()
    : `${profile?.first_name} ${profile?.last_name}`.trim();

  const avatarUrl = isVerified 
    ? verifiedProfile?.profile_photo_url 
    : profile?.profile_photo_url;

  return (
    <header className="bg-white/90 dark:bg-dark-400/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-dark-200 sticky top-0 z-30">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <span className="text-lg">☰</span>
            </button>
            <div className="flex items-center ml-3 lg:ml-0">
              <h1 className="text-xl font-bold tracking-tight text-gradient">BibleNOW</h1>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-6 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <span>🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search people, groups, livestreams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-11 py-2.5 rounded-xl bg-gray-100/80 dark:bg-dark-700 border-0 focus:ring-2 focus:ring-primary-500/20 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <span className="sr-only">Toggle theme</span>
              {theme === 'dark' ? (
                <span>☀️</span>
              ) : (
                <span>🌙</span>
              )}
            </button>

            {/* Notifications */}
            <a
              href="/notifications"
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 relative transition-colors"
              title="View notifications"
            >
              <span className="sr-only">View notifications</span>
              <span className="text-xl">🔔</span>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-accent-500 rounded-full ring-2 ring-white dark:ring-dark-400" />
            </a>

            {/* User profile */}
            {user ? (
              <div className="flex items-center space-x-3">
                <a 
                  href="/settings"
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  title="Settings"
                >
                  <span className="sr-only">Settings</span>
                  <span>⚙️</span>
                </a>
                <a 
                  href={`/profile/${user.id}`}
                  className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg p-2 transition-colors duration-200"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="avatar-sm"
                    />
                  ) : (
                    <span className="h-8 w-8 text-gray-400 text-2xl">👤</span>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {displayName || 'User'}
                    </p>
                    {isVerified && (
                      <p className="text-xs text-primary-500">Verified</p>
                    )}
                  </div>
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <a href={process.env.NEXT_PUBLIC_APP_URL ? String(process.env.NEXT_PUBLIC_APP_URL).replace(/\/+$/, '') + '/auth' : '/auth'} className="btn-outline text-sm">
                  Sign In
                </a>
                <a href={process.env.NEXT_PUBLIC_APP_URL ? String(process.env.NEXT_PUBLIC_APP_URL).replace(/\/+$/, '') + '/auth' : '/auth'} className="btn-primary text-sm">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
