'use client';

// import { PlayIcon } from '@heroicons/react/24/solid';
import { Livestream } from '@/shared/services/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface HeroSectionProps {
  livestream: Livestream | null;
  loading: boolean;
}

export function HeroSection({ livestream, loading }: HeroSectionProps) {
  if (loading) {
    return (
      <div className="relative h-96 bg-gray-200 dark:bg-dark-700 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!livestream) {
    return (
      <div className="relative h-96 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-2xl overflow-hidden shadow-glow-primary">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full opacity-5 transform translate-x-32 translate-y-32"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4 text-glow">Welcome to BibleNOW</h2>
            <p className="text-xl opacity-95 font-medium">Connect, share, and grow in faith together</p>
            
            {/* Decorative Elements */}
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 bg-gray-900 rounded-2xl overflow-hidden">
      {/* Background Image/Video Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end p-8">
        <div className="flex-1">
          {/* Live Badge and Viewer Count */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="badge-live">
              LIVE
            </span>
            <span className="text-white text-sm font-medium">
              {(livestream.viewer_count ?? 0).toLocaleString()} watching
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-4">
            {livestream.title}
          </h1>

          {/* Streamer Info */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="avatar-sm bg-primary-500">
              {livestream.verified_profiles?.profile_photo_url ? (
                <img
                  src={livestream.verified_profiles.profile_photo_url}
                  alt={livestream.verified_profiles.ministry_name || livestream.verified_profiles.first_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-semibold">
                  {(livestream.verified_profiles?.ministry_name ||
                    livestream.verified_profiles?.first_name ||
                    'S'
                  ).charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="text-white font-semibold">
                {livestream.verified_profiles?.ministry_name ||
                  `${livestream.verified_profiles?.first_name || ''} ${livestream.verified_profiles?.last_name || ''}`.trim() ||
                  'Streamer'}
              </p>
            </div>
          </div>

          {/* Watch Now Button */}
          <button className="btn-primary flex items-center space-x-2 bg-primary-500 hover:bg-primary-600">
            <span>▶️</span>
            <span>Watch Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
