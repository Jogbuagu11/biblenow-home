'use client';

import { useState, useEffect } from 'react';
import { Profile, VerifiedProfile } from '@/shared/services/supabase';
import { isFollowing, followUser, unfollowUser } from '@/shared/services/supabase';
import { useAuth } from '@/app/providers';
import { Layout } from '@/components/layout/Layout';

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
                {isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full p-2">
                    <span className="text-sm text-[#E1AB31]">✓</span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {displayName}
                </h1>
                {isVerified && verifiedProfile?.ministry_name && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {verifiedProfile.first_name} {verifiedProfile.last_name}
                  </p>
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
                <div className="text-3xl font-bold text-primary-500">
                  {profile.shekel_balance || 0}
                </div>
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
            <div className="text-center text-gray-500 dark:text-gray-400">
              Following list will be displayed here
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
