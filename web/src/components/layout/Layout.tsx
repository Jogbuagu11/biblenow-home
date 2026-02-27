'use client';

import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-500">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="lg:pl-80 lg:pr-80">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 min-h-[calc(100vh-4rem)] pb-16 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Bottom nav (mobile only, like app) */}
      <BottomNav />

      {/* Right Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:w-80 lg:z-30">
        <div className="h-full bg-white/80 dark:bg-dark-400/90 backdrop-blur-xl border-l border-gray-200/80 dark:border-dark-200 overflow-y-auto">
          <div className="p-5 space-y-5">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-dark-300 rounded-2xl shadow-sm border border-gray-200/80 dark:border-dark-200 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Online Users</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    1,234
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Active Streams</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    12
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">New Posts</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    45
                  </span>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white dark:bg-dark-300 rounded-2xl shadow-sm border border-gray-200/80 dark:border-dark-200 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Trending
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  #PrayerRequest
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  #BibleStudy
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  #Worship
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  #Faith
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  John started a new livestream
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sarah shared a prayer request
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Mike joined a group
                </div>
              </div>
            </div>

            {/* Suggested Connections */}
            <div className="bg-white dark:bg-dark-300 rounded-2xl shadow-sm border border-gray-200/80 dark:border-dark-200 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Suggested
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-500">A</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Alex Johnson
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      12 mutual connections
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-500">B</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Beth Smith
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      8 mutual connections
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </div>
  );
}
