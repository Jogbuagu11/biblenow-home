'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Profile, VerifiedProfile } from '@/shared/services/supabase';
import { getShekelBalance, getFollowerCount, getFollowingCount, getFollowing } from '@/shared/services/supabase';
import { Layout } from '@/components/layout/Layout';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { VerifiedBadgeInline } from '@/components/ui/VerifiedBadge';
import { isUserVerified } from '@/shared/services/supabase';

interface InternalProfileViewProps {
  profile: Profile;
  verifiedProfile: VerifiedProfile | null;
  isVerified: boolean;
}

export function InternalProfileView({ profile, verifiedProfile, isVerified }: InternalProfileViewProps) {
  const [shekelBalance, setShekelBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [followerCount, setFollowerCount] = useState<number>(profile?.follower_count ?? 0);
  const [followingCount, setFollowingCount] = useState<number>(profile?.following_count ?? 0);
  const [followingList, setFollowingList] = useState<Profile[]>([]);
  const [followingListLoading, setFollowingListLoading] = useState(true);
  const [verifiedFollowingIds, setVerifiedFollowingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadCounts = async () => {
      if (profile?.follower_count != null || profile?.following_count != null) {
        setFollowerCount(profile.follower_count ?? 0);
        setFollowingCount(profile.following_count ?? 0);
        return;
      }
      try {
        const [followers, following] = await Promise.all([
          getFollowerCount(profile.id),
          getFollowingCount(profile.id),
        ]);
        setFollowerCount(followers);
        setFollowingCount(following);
      } catch {
        // keep 0
      }
    };
    loadCounts();
  }, [profile?.id, profile?.follower_count, profile?.following_count]);

  useEffect(() => {
    const loadShekelBalance = async () => {
      try {
        const balance = await getShekelBalance(profile.id);
        setShekelBalance(balance);
      } catch (error) {
        console.error('Error loading shekel balance:', error);
      } finally {
        setLoadingBalance(false);
      }
    };

    loadShekelBalance();
  }, [profile.id]);

  useEffect(() => {
    getFollowing(profile.id)
      .then((list) => {
        setFollowingList(list);
        return Promise.all(list.map((p) => isUserVerified(p.id).then((v) => ({ id: p.id, v }))));
      })
      .then((checks) => setVerifiedFollowingIds(new Set(checks.filter((c) => c.v).map((c) => c.id))))
      .catch(() => setFollowingList([]))
      .finally(() => setFollowingListLoading(false));
  }, [profile.id]);

  const displayName = isVerified && verifiedProfile?.ministry_name 
    ? verifiedProfile.ministry_name 
    : `${profile.first_name} ${profile.last_name}`;

  const profilePhotoUrl = isVerified && verifiedProfile?.profile_photo_url 
    ? verifiedProfile.profile_photo_url 
    : profile.profile_photo_url;

  const coverPhotoUrl = isVerified && verifiedProfile?.cover_photo_url 
    ? verifiedProfile.cover_photo_url 
    : null; // Unverified profiles don't have cover photos

  return (
    <Layout>
      <div className="min-h-screen bg-primary-50 dark:bg-dark-500">
        {/* Cover Photo - Only for verified profiles */}
        {isVerified && coverPhotoUrl && (
          <div className="relative h-64 bg-gradient-to-r from-primary-400 to-primary-600">
            <img
              src={coverPhotoUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        )}

        {/* Profile Header */}
        <div className={`px-6 pb-6 ${isVerified && coverPhotoUrl ? 'relative -mt-16' : 'pt-8'}`}>
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <div className="flex items-start space-x-6">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
                  {profilePhotoUrl ? (
                    <img
                      src={profilePhotoUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-500 text-4xl font-bold">
                      {displayName.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isVerified && verifiedProfile?.ministry_name ? (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {verifiedProfile.ministry_name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                      <span>{verifiedProfile.first_name} {verifiedProfile.last_name}</span>
                      <VerifiedBadge size={20} primaryBackground />
                    </p>
                  </>
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span>{displayName}</span>
                    {isVerified && <VerifiedBadge size={20} primaryBackground />}
                  </h1>
                )}

                {/* Followers / Following */}
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>{followerCount.toLocaleString()}</strong> followers
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>{followingCount.toLocaleString()}</strong> following
                  </span>
                </div>
                
                {/* Join Date */}
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {profile.created_at ? (
                    <>
                      Joined{' '}
                      {new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </>
                  ) : (
                    <>Joined —</>
                  )}
                </div>

                {/* Edit Profile Button */}
                <Link href="/settings" className="mt-4 btn-primary inline-block text-center">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-6 space-y-6">
          {/* Shekel Balance Widget */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Shekel Balance
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-3xl">💰</div>
              <div>
                {loadingBalance ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-24 rounded"></div>
                ) : (
                  <div className="text-3xl font-bold text-primary-500">
                    {shekelBalance.toLocaleString()}
                  </div>
                )}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Shekels
                </div>
              </div>
            </div>
          </div>

          {/* Bio Widget */}
          {profile.bio && (
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Bio
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Following Section */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Following
            </h2>
            {followingListLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
              </div>
            ) : followingList.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6">Not following anyone yet.</p>
            ) : (
              <ul className="space-y-3">
                {followingList.map((p) => {
                  const name = [p.first_name, p.last_name].filter(Boolean).join(' ').trim() || 'User';
                  const showVerified = verifiedFollowingIds.has(p.id);
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/profile/${p.id}`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 overflow-hidden flex items-center justify-center text-sm font-semibold text-primary-700 dark:text-primary-300 shrink-0">
                          {p.profile_photo_url ? (
                            <img src={p.profile_photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-1">
                          {(p as any).ministry_name || name}
                          {showVerified && <VerifiedBadgeInline className="shrink-0" />}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}
