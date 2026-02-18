'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/providers';
import { getConversationDetail } from '@/shared/services/supabase';

interface ConversationThreadProps {
  conversationId: string;
}

export function ConversationThread({ conversationId }: ConversationThreadProps) {
  const { user } = useAuth();
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof getConversationDetail>>>(null);
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
    getConversationDetail(conversationId, user.id)
      .then((d) => {
        if (!cancelled) {
          setDetail(d);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? 'Failed to load conversation');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [conversationId, user?.id]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Sign in to view this conversation.</p>
        <Link href="/auth" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center py-12 px-4">
        <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error ?? 'Conversation not found'}</p>
        <Link href="/messages" className="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline">
          Back to Messages
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/messages"
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
          aria-label="Back to messages"
        >
          ←
        </Link>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 overflow-hidden flex items-center justify-center text-sm font-semibold text-primary-700 dark:text-primary-300 flex-shrink-0">
            {detail.other_user.avatar_url ? (
              <Image
                src={detail.other_user.avatar_url}
                alt=""
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              (detail.other_user.display_name || '?').charAt(0).toUpperCase()
            )}
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {detail.other_user.display_name}
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-300 rounded-2xl border border-gray-200/80 dark:border-dark-200 overflow-hidden">
        <div className="min-h-[300px] p-4 space-y-3">
          {detail.messages.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">No messages in this conversation yet.</p>
          ) : (
            detail.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    m.sender_id === user.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  <p className={`text-xs mt-1 ${m.sender_id === user.id ? 'text-primary-100' : 'text-gray-400 dark:text-gray-500'}`}>
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-dark-200">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Sending messages from the web app is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
