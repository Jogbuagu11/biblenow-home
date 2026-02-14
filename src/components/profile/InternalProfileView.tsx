'use client';

import { useState, useEffect } from 'react';
import { Profile, VerifiedProfile } from '@/shared/services/supabase';
import { getShekelBalance } from '@/shared/services/supabase';
import { Layout } from '@/components/layout/Layout';

interface InternalProfileViewProps {
  profile: Profile;
  verifiedProfile: VerifiedProfile | null;
  isVerified: boolean;
}

export function InternalProfileView({ profile, verifiedProfile, isVerified }: InternalProfileViewProps) {
  const [shekelBalance, setShekelBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

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

                {/* Edit Profile Button */}
                <button className="mt-4 btn-primary">
                  Edit Profile
                </button>
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
            <div className="text-center text-gray-500 dark:text-gray-400">
              Following list will be displayed here
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
