'use client';

import { Livestream } from '@/shared/services/supabase';

interface LivestreamGridProps {
  livestreams: Livestream[];
  onLivestreamSelect: (livestream: Livestream) => void;
}

export function LivestreamGrid({ livestreams, onLivestreamSelect }: LivestreamGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {livestreams.map((livestream) => (
        <LivestreamCard
          key={livestream.id}
          livestream={livestream}
          onClick={() => onLivestreamSelect(livestream)}
        />
      ))}
    </div>
  );
}

interface LivestreamCardProps {
  livestream: Livestream;
  onClick: () => void;
}

function LivestreamCard({ livestream, onClick }: LivestreamCardProps) {
  const getStreamerName = () => {
    if (livestream.verified_profiles?.ministry_name) {
      return livestream.verified_profiles.ministry_name;
    }
    if (livestream.verified_profiles) {
      return `${livestream.verified_profiles.first_name} ${livestream.verified_profiles.last_name}`;
    }
    return 'Streamer Name';
  };

  const getStreamerPhoto = () => {
    return livestream.verified_profiles?.profile_photo_url || null;
  };

  return (
    <div 
      className="bg-white dark:bg-dark-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
        {/* Placeholder thumbnail - in real app this would be the actual thumbnail */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-4xl text-gray-400">📺</div>
        </div>
        
        {/* LIVE Badge */}
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
          LIVE
        </div>
        
        {/* Viewer Count */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {livestream.viewer_count} viewers
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {livestream.title}
        </h3>
        
        <div className="flex items-center space-x-2 mb-3">
          {getStreamerPhoto() ? (
            <img
              src={getStreamerPhoto()!}
              alt={getStreamerName()}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary-500">
                {getStreamerName().charAt(0)}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {getStreamerName()}
          </span>
        </div>

        {/* JOIN NOW Button */}
        <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
          JOIN NOW
        </button>
      </div>
    </div>
  );
}
