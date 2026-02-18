'use client';

import { useState, useEffect } from 'react';
import { Profile, VerifiedProfile, getProductsBySeller, getFollowing, isUserVerified, type Product } from '@/shared/services/supabase';
import { isFollowing, followUser, unfollowUser, getFollowerCount, getFollowingCount } from '@/shared/services/supabase';
import { useAuth } from '@/app/providers';
import { Layout } from '@/components/layout/Layout';
import { VerifiedBadge, VerifiedBadgeInline } from '@/components/ui/VerifiedBadge';
import Link from 'next/link';

interface PublicProfileViewProps {
  profile: Profile;
  verifiedProfile: VerifiedProfile | null;
  isVerified: boolean;
  userId: string;
}

export function PublicProfileView({ profile, verifiedProfile, isVerified, userId }: PublicProfileViewProps) {
  const { user: currentUser } = useAuth();
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingFollowStatus, setLoadingFollowStatus] = useState(true);
  const [followerCount, setFollowerCount] = useState<number>(profile?.follower_count ?? 0);
  const [followingCount, setFollowingCount] = useState<number>(profile?.following_count ?? 0);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [followingList, setFollowingList] = useState<Profile[]>([]);
  const [followingListLoading, setFollowingListLoading] = useState(true);
  const [verifiedFollowingIds, setVerifiedFollowingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadCounts = async () => {
      const hasCounts = profile && (profile.follower_count != null || profile.following_count != null);
      if (hasCounts) {
        setFollowerCount(profile.follower_count ?? 0);
        setFollowingCount(profile.following_count ?? 0);
        return;
      }
      try {
        const [followers, following] = await Promise.all([
          getFollowerCount(userId),
          getFollowingCount(userId),
        ]);
        setFollowerCount(followers);
        setFollowingCount(following);
      } catch {
        // keep 0
      }
    };
    loadCounts();
  }, [userId, profile?.follower_count, profile?.following_count]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser) {
        setLoadingFollowStatus(false);
        return;
      }

      try {
        const following = await isFollowing(currentUser.id, userId);
        setIsFollowingUser(following);
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setLoadingFollowStatus(false);
      }
    };

    checkFollowStatus();
  }, [currentUser, userId]);

  useEffect(() => {
    if (!isVerified || !userId) return;
    setProductsLoading(true);
    getProductsBySeller(userId)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, [isVerified, userId]);

  useEffect(() => {
    getFollowing(userId)
      .then((list) => {
        setFollowingList(list);
        return Promise.all(list.map((p) => isUserVerified(p.id).then((v) => ({ id: p.id, v }))));
      })
      .then((checks) => setVerifiedFollowingIds(new Set(checks.filter((c) => c.v).map((c) => c.id))))
      .catch(() => setFollowingList([]))
      .finally(() => setFollowingListLoading(false));
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!currentUser) return;

    setLoadingFollow(true);
    try {
      if (isFollowingUser) {
        await unfollowUser(currentUser.id, userId);
        setIsFollowingUser(false);
      } else {
        await followUser(currentUser.id, userId);
        setIsFollowingUser(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoadingFollow(false);
    }
  };

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

                {/* Followers / Following – only for verified profiles */}
                {isVerified && (
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>{followerCount.toLocaleString()}</strong> followers
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>{followingCount.toLocaleString()}</strong> following
                    </span>
                  </div>
                )}

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

                {/* Follow Button - Only show for verified users */}
                {currentUser && isVerified && (
                  <button
                    onClick={handleFollowToggle}
                    disabled={loadingFollow || loadingFollowStatus}
                    className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isFollowingUser
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-dark-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loadingFollow ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {isFollowingUser ? (
                          <>
                            <span className="text-red-500">❤️</span>
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <span>🤍</span>
                            <span>Follow</span>
                          </>
                        )}
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections - no shekel balance on public profile */}
        <div className="px-6 space-y-6">
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

          {/* Merch / Products – Vine & Cedar verified tier feature */}
          {isVerified && (
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Merch
              </h2>
              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
                </div>
              ) : products.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-6">
                  No products listed yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border border-gray-200 dark:border-dark-200 overflow-hidden hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
                    >
                      <div className="aspect-square bg-gray-100 dark:bg-dark-700 relative">
                        {p.thumbnail_url ? (
                          <img
                            src={p.thumbnail_url}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-2xl">
                            🛍️
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                          {p.title}
                        </p>
                        <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                          ${Number(p.price).toFixed(2)}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Following Section – shown for all profiles (verified and unverified) */}
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
