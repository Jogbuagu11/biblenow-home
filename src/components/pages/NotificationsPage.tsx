'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { Layout } from '@/components/layout/Layout';
import Link from 'next/link';
import { getNotifications, markNotificationRead, markAllNotificationsRead, type AppNotification } from '@/shared/services/supabase';

function formatTime(createdAt: string) {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(diffDays / 7);
  return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
}

export function NotificationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getNotifications(user.id, {
          unreadOnly: filter === 'unread',
          limit: 50,
        });
        setNotifications(list);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Failed to load notifications');
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id, filter]);

  const handleMarkRead = async (n: AppNotification) => {
    if (n.is_read) return;
    try {
      await markNotificationRead(n.id, n.isVerifiedNotification ?? false);
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await markAllNotificationsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // ignore
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="bg-white dark:bg-dark-300 rounded-2xl shadow-xl border border-primary-200/50 dark:border-dark-200 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4 text-3xl">
              🔔
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Notifications</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Sign in to see your notifications.</p>
            <Link href="/auth" className="btn-primary inline-block">Sign In</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50 dark:bg-dark-600/30">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Notifications</h1>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-dark-300 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200 border border-gray-200 dark:border-dark-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-dark-300 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200 border border-gray-200 dark:border-dark-200'
              }`}
            >
              Unread
            </button>
          </div>

          <div className="bg-white dark:bg-dark-300 rounded-2xl shadow-sm border border-gray-200/80 dark:border-dark-200 overflow-hidden">
            {loading ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center py-16 px-4">
                <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 rounded-2xl bg-primary-100/80 dark:bg-primary-900/20 flex items-center justify-center mb-4 text-4xl">
                🔔
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No notifications yet</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-sm">
                When someone likes your content, follows you, or comments, you’ll see it here.
              </p>
            </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-dark-200">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</span>
                  {notifications.some((n) => !n.is_read) && (
                    <button type="button" onClick={handleMarkAllRead} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">Mark all read</button>
                  )}
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-dark-200">
                  {notifications.map((n) => (
                    <li key={n.id} onClick={() => handleMarkRead(n)} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors cursor-pointer ${!n.is_read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-lg">🔔</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title}</p>
                          {n.body ? <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{n.body}</p> : null}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatTime(n.created_at)}</p>
                        </div>
                        {!n.is_read ? <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500" title="Unread" /> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
