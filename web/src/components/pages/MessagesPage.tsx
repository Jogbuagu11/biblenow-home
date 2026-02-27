'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { Layout } from '@/components/layout/Layout';
import Link from 'next/link';
import { getConversations, type ConversationSummary } from '@/shared/services/supabase';
import Image from 'next/image';

export function MessagesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getConversations(user.id)
      .then((list) => {
        if (!cancelled) {
          setConversations(list);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? 'Failed to load messages');
          setConversations([]);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [user?.id]);

  if (!user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="bg-white dark:bg-dark-300 rounded-2xl shadow-xl border border-primary-200/50 dark:border-dark-200 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4 text-3xl">
              💬
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Messages</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Sign in to view and send messages.</p>
            <Link href="/auth" className="btn-primary inline-block">Sign In</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const filtered = search.trim()
    ? conversations.filter(
        (c) =>
          c.other_user.display_name.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50 dark:bg-dark-600/30">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Messages</h1>

          <div className="bg-white dark:bg-dark-300 rounded-2xl shadow-sm border border-gray-200/80 dark:border-dark-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-dark-200">
              <input
                type="search"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input rounded-xl bg-gray-50 dark:bg-dark-700 border-0 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {loading && (
              <div className="min-h-[300px] flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
              </div>
            )}

            {!loading && error && (
              <div className="min-h-[300px] flex flex-col items-center justify-center py-12 px-4">
                <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    if (!user?.id) return;
                    setError(null);
                    setLoading(true);
                    getConversations(user.id)
                      .then(setConversations)
                      .catch((err) => setError(err?.message ?? 'Failed to load messages'))
                      .finally(() => setLoading(false));
                  }}
                  className="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <ul className="divide-y divide-gray-100 dark:divide-dark-200">
                {filtered.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/messages/${c.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 overflow-hidden flex items-center justify-center text-lg font-semibold text-primary-700 dark:text-primary-300">
                        {c.other_user.avatar_url ? (
                          <Image
                            src={c.other_user.avatar_url}
                            alt=""
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (c.other_user.display_name || '?').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {c.other_user.display_name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {c.last_message
                            ? (c.last_message.sender_id === user.id ? 'You: ' : '') + c.last_message.content
                            : 'No messages yet'}
                        </p>
                      </div>
                      {c.last_message && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {new Date(c.last_message.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="min-h-[400px] flex flex-col items-center justify-center py-16 px-4">
                <div className="w-20 h-20 rounded-2xl bg-primary-100/80 dark:bg-primary-900/20 flex items-center justify-center mb-4 text-4xl">
                  💬
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No messages yet</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-sm mb-6">
                  When you have conversations, they’ll show up here. Start by connecting with others from the feed or groups.
                </p>
                <Link href="/app" className="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline">
                  Go to Home →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
