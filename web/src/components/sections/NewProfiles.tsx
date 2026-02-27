'use client';

import { useState, useEffect } from 'react';
import { getNewProfiles } from '@/shared/services/supabase';
import { Profile } from '@/shared/services/supabase';
import { useRouter } from 'next/navigation';

export function NewProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadNewProfiles = async () => {
      try {
        const newProfiles = await getNewProfiles(4);
        setProfiles(newProfiles);
      } catch (error) {
        console.error('Error loading new profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNewProfiles();
  }, []);


  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-primary-500">
            New Profiles
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-primary-500 text-glow">
          New Profiles
        </h2>
        <button className="text-primary-500 hover:text-primary-600 font-medium">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="card p-6 group"
          >
            {/* Avatar */}
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => router.push(`/profile/${profile.id}`)}
                className="avatar-md bg-primary-100 dark:bg-primary-500 hover:ring-2 hover:ring-primary-300 dark:hover:ring-primary-400 transition-all cursor-pointer"
              >
                {profile.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={profile.first_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-500 font-semibold">
                    {(profile.first_name || 'U').charAt(0)}
                  </span>
                )}
              </button>
              <div className="flex-1">
                <button
                  onClick={() => router.push(`/profile/${profile.id}`)}
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer text-left"
                >
                  {`${profile.first_name} ${profile.last_name}`}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {profile.created_at ? (
                    <>Joined {new Date(profile.created_at).toLocaleDateString()}</>
                  ) : (
                    <>Joined —</>
                  )}
                </p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {profile.bio || 'New to BibleNOW! Welcome to our community.'}
            </p>

            {/* No follow button for unverified users */}
          </div>
        ))}
      </div>
    </div>
  );
}
