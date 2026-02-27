'use client';

import { useState, useEffect } from 'react';
import { getFeaturedStreamers, isFollowing, followUser, unfollowUser } from '@/shared/services/supabase';
import { Profile } from '@/shared/services/supabase';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { VerifiedBadgeInline } from '@/components/ui/VerifiedBadge';

interface StreamerWithFollowing extends Profile {
  isFollowing?: boolean;
}

export function FeaturedStreamers() {
  const { user } = useAuth();
  const [streamers, setStreamers] = useState<StreamerWithFollowing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadFeaturedStreamers = async () => {
      try {
        const featuredStreamers = await getFeaturedStreamers(5);
        
        // Check if current user is following each streamer
        const streamersWithFollowing = await Promise.all(
          featuredStreamers.map(async (streamer) => {
            let isFollowingUser = false;
            if (user) {
              isFollowingUser = await isFollowing(user.id, streamer.id);
            }
            return {
              ...streamer,
              isFollowing: isFollowingUser,
            };
          })
        );
        
        setStreamers(streamersWithFollowing);
      } catch (error) {
        console.error('Error loading featured streamers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedStreamers();
  }, [user]);

  const toggleFollow = async (streamerId: string) => {
    if (!user) return;
    
    const streamer = streamers.find(s => s.id === streamerId);
    if (!streamer) return;

    try {
      if (streamer.isFollowing) {
        // Unfollow
        await unfollowUser(user.id, streamerId);
      } else {
        // Follow
        await followUser(user.id, streamerId);
      }
      
      // Update local state
      setStreamers(prev => 
        prev.map(s => 
          s.id === streamerId 
            ? { ...s, isFollowing: !s.isFollowing }
            : s
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Featured Streamers
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Featured Streamers
        </h2>
        <button className="text-primary-500 hover:text-primary-600 font-medium">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {streamers.map((streamer) => (
          <div
            key={streamer.id}
            className="card p-6 text-center group"
          >
            {/* Avatar */}
            <div className="relative mb-4">
              <button
                onClick={() => router.push(`/profile/${streamer.id}`)}
                className="avatar-lg bg-primary-100 dark:bg-primary-900 mx-auto hover:ring-2 hover:ring-primary-300 dark:hover:ring-primary-400 transition-all cursor-pointer"
              >
                {streamer.profile_photo_url ? (
                  <img
                    src={streamer.profile_photo_url}
                    alt={streamer.first_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-500 text-xl font-bold">
                    {(streamer.first_name || 'U').charAt(0)}
                  </span>
                )}
              </button>
              
              {/* Live indicator - you could check if they're currently streaming */}
              <div className="absolute -top-1 -right-1">
                <span className="badge-live text-xs px-2 py-1">
                  LIVE
                </span>
              </div>
            </div>

            {/* Streamer Info */}
            <div className="mb-4">
              <button
                onClick={() => router.push(`/profile/${streamer.id}`)}
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
              >
                {streamer.ministry_name || `${streamer.first_name} ${streamer.last_name}`}
                {streamer.is_verified && (
                  <VerifiedBadgeInline className="ml-1" />
                )}
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {(streamer.follower_count || 0).toLocaleString()} followers
              </p>
            </div>

            {/* Follow Button - Only show for verified users */}
            {streamer.is_verified && (
              <button
                onClick={() => toggleFollow(streamer.id)}
                className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  streamer.isFollowing
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                {streamer.isFollowing ? (
                  <span className="text-red-500">❤️</span>
                ) : (
                  <span>🤍</span>
                )}
                <span>{streamer.isFollowing ? 'Following' : 'Follow'}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
