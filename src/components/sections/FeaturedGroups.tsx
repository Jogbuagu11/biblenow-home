'use client';

// import { UserGroupIcon } from '@heroicons/react/24/outline';
import { GroupCard } from '@/shared/types';

// Mock data - in real app, this would come from your Supabase backend
const featuredGroups: GroupCard[] = [
  {
    id: '1',
    name: 'Gaming Community',
    description: 'Connect with fellow Christian gamers',
    memberCount: 15200,
    category: 'Gaming',
    avatar: undefined,
    coverImage: undefined,
  },
  {
    id: '2',
    name: 'Creative Streamers',
    description: 'Art, music, and creative content creators',
    memberCount: 8500,
    category: 'Creative',
    avatar: undefined,
    coverImage: undefined,
  },
  {
    id: '3',
    name: 'Music Live Sessions',
    description: 'Worship music and live performances',
    memberCount: 12800,
    category: 'Music',
    avatar: undefined,
    coverImage: undefined,
  },
  {
    id: '4',
    name: 'Tech Talk',
    description: 'Technology discussions and tutorials',
    memberCount: 9300,
    category: 'Technology',
    avatar: undefined,
    coverImage: undefined,
  },
];

export function FeaturedGroups() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Featured Groups
        </h2>
        <button className="text-primary-500 hover:text-primary-600 font-medium">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredGroups.map((group) => (
          <div
            key={group.id}
            className="card-hover p-6 group"
          >
            {/* Group Avatar */}
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-xl mb-4 mx-auto">
              <span className="text-3xl text-primary-500">👥</span>
            </div>

            {/* Group Info */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {group.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {group.description}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {group.memberCount.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  members
                </span>
              </div>
            </div>

            {/* Join Button */}
            <div className="mt-4">
              <button className="w-full btn-outline text-sm">
                Join Group
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
