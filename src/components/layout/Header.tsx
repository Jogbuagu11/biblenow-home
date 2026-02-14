'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers';
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
    <header className="bg-white dark:bg-dark-400 border-b border-primary-200 dark:border-dark-200 sticky top-0 z-30">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Mobile menu button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <span className="text-lg">☰</span>
            </button>

            {/* Logo */}
            <div className="flex items-center ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold text-gradient">
                BibleNOW
              </h1>
            </div>
          </div>

          {/* Center - Search bar */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Right side - Navigation and User menu */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Toggle theme</span>
              {theme === 'dark' ? (
                <span>☀️</span>
              ) : (
                <span>🌙</span>
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 relative">
              <span className="sr-only">View notifications</span>
              <span>🔔</span>
              {/* Notification badge */}
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

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
                <a href="/auth" className="btn-outline text-sm">
                  Sign In
                </a>
                <a href="/auth" className="btn-primary text-sm">
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
