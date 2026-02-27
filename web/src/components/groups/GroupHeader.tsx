'use client';

import { Group } from '@/shared/services/supabase';

interface GroupHeaderProps {
  group: Group;
  isMember: boolean;
  isOwner: boolean;
  loadingMembership: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

export function GroupHeader({ 
  group, 
  isMember, 
  isOwner, 
  loadingMembership, 
  onJoin, 
  onLeave 
}: GroupHeaderProps) {
  const getGroupAvatar = () => {
    if (group.cover_photo_url) {
      return (
        <img
          src={group.cover_photo_url}
          alt={group.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-dark-300 shadow-lg"
        />
      );
    }
    
    // Default group avatar
    return (
      <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-dark-600 border-4 border-white dark:border-dark-300 shadow-lg flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1-1.5c-.47-.62-1.21-.99-2.01-.99H9.46c-.8 0-1.54.37-2.01.99L5 10.5l-1-1.5C3.53 8.37 2.79 8 2 8H.5L3 15.5V22h2v-6h2v6h2v-6h2v6h2v-6h2v6h2z"/>
        </svg>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Cover Photo Background */}
      {group.cover_photo_url && (
        <div className="h-64 bg-gradient-to-r from-primary-400 to-primary-600 relative overflow-hidden">
          <img
            src={group.cover_photo_url}
            alt={group.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      )}
      
      {/* Header Content */}
      <div className={`px-8 pb-8 ${group.cover_photo_url ? 'relative -mt-16' : 'pt-8'}`}>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8">
          <div className="flex items-start space-x-6">
            {/* Group Avatar */}
            <div className="relative">
              {getGroupAvatar()}
              {isOwner && (
                <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full p-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Group Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {group.name}
                </h1>
                {group.is_private && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                    Private
                  </span>
                )}
              </div>
              
              {group.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {group.description}
                </p>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                {group.member_count && (
                  <span>{group.member_count} members</span>
                )}
                <span>
                  Created {new Date(group.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {loadingMembership ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-24 rounded-lg"></div>
              ) : isMember ? (
                <div className="flex space-x-3">
                  {isOwner ? (
                    <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
                      Manage Group
                    </button>
                  ) : (
                    <button
                      onClick={onLeave}
                      className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Leave Group
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={onJoin}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                  Join Group
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

