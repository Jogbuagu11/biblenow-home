'use client';

import { useState, useEffect } from 'react';
import { GroupsList } from './GroupsList';
import { SuggestedGroups } from './SuggestedGroups';
import { CreateGroupButton } from './CreateGroupButton';
import { getUserGroups, Group } from '@/shared/services/supabase';
import { useAuth } from '@/app/providers';

interface GroupsSectionProps {
  canCreateGroup: boolean;
}

interface GroupsData {
  owned: Group[];
  joined: Group[];
}

export function GroupsSection({ canCreateGroup }: GroupsSectionProps) {
  const { user } = useAuth();
  const [groupsData, setGroupsData] = useState<GroupsData>({ owned: [], joined: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadGroups();
    } else {
      // If user is not authenticated, show empty state
      setLoading(false);
      setGroupsData({ owned: [], joined: [] });
    }
  }, [user]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading groups...');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      // Call the getUserGroups function (same as Flutter app)
      const data = await Promise.race([
        getUserGroups(),
        timeoutPromise
      ]) as { owned: Group[]; joined: Group[] };
      
      console.log('Groups data received:', data);
      setGroupsData(data);
    } catch (err) {
      console.error('Error loading groups:', err);
      setError('Failed to load groups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const allGroups = [...groupsData.owned, ...groupsData.joined];
  const hasGroups = allGroups.length > 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Main Groups Card - Matches Flutter Design */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-300 dark:to-dark-400 rounded-xl shadow-lg border border-primary-200 dark:border-primary-500 p-8">
        {/* Header - Matches Flutter Groups Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-200 dark:bg-primary-800 rounded-lg">
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1-1.5c-.47-.62-1.21-.99-2.01-.99H9.46c-.8 0-1.54.37-2.01.99L5 10.5l-1-1.5C3.53 8.37 2.79 8 2 8H.5L3 15.5V22h2v-6h2v6h2v-6h2v6h2v-6h2v6h2z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Groups
            </h2>
          </div>
          {canCreateGroup && (
            <CreateGroupButton onGroupCreated={loadGroups} />
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={loadGroups}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : !hasGroups ? (
          <div className="w-full p-6 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-200">
            <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
              You haven't created or joined any groups yet.
            </p>
          </div>
        ) : (
          <GroupsList groupsData={groupsData} onGroupUpdated={loadGroups} />
        )}
      </div>

      {/* Suggested Groups Section */}
      {(hasGroups || !user || error) && (
        <div className="mt-8">
          <SuggestedGroups />
        </div>
      )}
    </div>
  );
}
