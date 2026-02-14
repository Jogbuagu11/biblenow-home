'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinGroup } from '@/shared/services/supabase';

interface SuggestedGroup {
  id: string;
  name: string;
  description?: string;
  cover_photo_url?: string;
  member_count?: number;
  owner_id: string;
  created_at: string;
}

interface SuggestedGroupCardProps {
  group: SuggestedGroup;
  onGroupJoined: () => void;
}

export function SuggestedGroupCard({ group, onGroupJoined }: SuggestedGroupCardProps) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinGroup = async () => {
    if (hasJoined) return;
    
    try {
      setIsJoining(true);
      
      // Call the joinGroup function
      const success = await joinGroup(group.id);
      
      if (success) {
        setHasJoined(true);
        onGroupJoined();
      } else {
        console.error('Failed to join group');
      }
    } catch (error) {
      console.error('Error joining group:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const getGroupAvatar = () => {
    if (group.cover_photo_url) {
      return (
        <img
          src={group.cover_photo_url}
          alt={group.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-dark-200"
        />
      );
    }
    
    // Default group avatar - matches Flutter design
    return (
      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-dark-600 border border-gray-300 dark:border-dark-200 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1-1.5c-.47-.62-1.21-.99-2.01-.99H9.46c-.8 0-1.54.37-2.01.99L5 10.5l-1-1.5C3.53 8.37 2.79 8 2 8H.5L3 15.5V22h2v-6h2v6h2v-6h2v6h2v-6h2v6h2z"/>
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-200 p-3">
      <div className="flex flex-col items-center text-center space-y-2">
        <div 
          className="cursor-pointer"
          onClick={() => router.push(`/groups/${group.id}/info`)}
        >
          {getGroupAvatar()}
        </div>

        <div className="w-full">
          <h4 
            className="font-semibold text-gray-900 dark:text-gray-100 text-xs truncate cursor-pointer hover:text-primary-500"
            onClick={() => router.push(`/groups/${group.id}/info`)}
          >
            {group.name}
          </h4>

          {group.member_count && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {group.member_count} members
            </p>
          )}
        </div>

        <button
          onClick={handleJoinGroup}
          disabled={isJoining || hasJoined}
          className={`w-full px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
            hasJoined
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 cursor-not-allowed'
              : isJoining
              ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
        >
          {hasJoined ? 'Joined' : isJoining ? 'Joining...' : 'Join'}
        </button>
      </div>
    </div>
  );
}
