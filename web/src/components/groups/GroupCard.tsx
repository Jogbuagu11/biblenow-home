'use client';

import { useRouter } from 'next/navigation';

interface Group {
  id: string;
  name: string;
  description?: string;
  cover_photo_url?: string;
  member_count?: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

interface GroupCardProps {
  group: Group;
  isOwner: boolean;
  onGroupUpdated: () => void;
}

export function GroupCard({ group, isOwner, onGroupUpdated }: GroupCardProps) {
  const router = useRouter();

  const handleGroupClick = () => {
    // Navigate to group detail page (members will see the full group, non-members will be redirected to info page)
    router.push(`/groups/${group.id}`);
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
    <div
      onClick={handleGroupClick}
      className="w-full mb-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
    >
      <div className="flex items-center space-x-3">
        {getGroupAvatar()}
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {group.name}
          </h4>
          {isOwner && (
            <span className="inline-block mt-1 text-xs text-primary-600 dark:text-primary-400 font-medium">
              Owner
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
