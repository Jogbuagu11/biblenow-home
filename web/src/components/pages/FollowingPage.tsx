'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { Layout } from '@/components/layout/Layout';
import { getFollowing, unfollowUser, type Profile } from '@/shared/services/supabase';
import Link from 'next/link';
import { VerifiedBadgeInline } from '@/components/ui/VerifiedBadge';
import { isUserVerified } from '@/shared/services/supabase';

export function FollowingPage() {
  const { user } = useAuth();
  const [list, setList] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null);
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    getFollowing(user.id)
      .then((profiles) => {
        setList(profiles);
        return Promise.all(profiles.map((p) => isUserVerified(p.id).then((v) => ({ id: p.id, v }))));
      })
      .then((checks) => {
        setVerifiedIds(new Set(checks.filter((c) => c.v).map((c) => c.id)));
      })
      .catch((err) => setError(err?.message ?? 'Failed to load following'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleUnfollow = async (followingId: string) => {
    if (!user?.id) return;
    setUnfollowingId(followingId);
    try {
      await unfollowUser(user.id, followingId);
      setList((prev) => prev.filter((p) => p.id !== followingId));
    } catch {
      // keep list as is
    } finally {
      setUnfollowingId(null);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="bg-white dark:bg-dark-300 rounded-2xl shadow-xl border border-primary-200/50 dark:border-dark-200 p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Following</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Sign in to see who you follow.</p>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Following</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">
            People you follow. Visit their profiles or unfollow.
          </p>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="animate-spin w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          )}

          {!loading && error && (
            <div className="bg-white dark:bg-dark-300 rounded-2xl border border-gray-200 dark:border-dark-200 p-8 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  getFollowing(user.id).then(setList).catch((e) => setError(e?.message ?? 'Error')).finally(() => setLoading(false));
                }}
                className="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && list.length === 0 && (
            <div className="bg-white dark:bg-dark-300 rounded-2xl border border-gray-200 dark:border-dark-200 p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary-100/80 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4 text-4xl">
                ❤️
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Not following anyone yet</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-6">
                When you follow verified creators or friends, they’ll show up here.
              </p>
              <Link href="/app" className="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline">
                Discover on Home →
              </Link>
            </div>
          )}

          {!loading && !error && list.length > 0 && (
            <ul className="bg-white dark:bg-dark-300 rounded-2xl border border-gray-200 dark:border-dark-200 divide-y divide-gray-100 dark:divide-dark-200 overflow-hidden">
              {list.map((profile) => {
                const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() || 'User';
                const isVerified = verifiedIds.has(profile.id);
                return (
                  <li key={profile.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-dark-700/50">
                    <Link href={`/profile/${profile.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 overflow-hidden flex-shrink-0 flex items-center justify-center text-lg font-semibold text-primary-700 dark:text-primary-300">
                        {profile.profile_photo_url ? (
                          <img src={profile.profile_photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-1">
                          {(profile as any).ministry_name || name}
                          {isVerified && <VerifiedBadgeInline className="shrink-0" />}
                        </p>
                        {(profile as any).ministry_name && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{name}</p>
                        )}
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleUnfollow(profile.id)}
                      disabled={unfollowingId === profile.id}
                      className="flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {unfollowingId === profile.id ? '…' : 'Unfollow'}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
