'use client';

import { useState, useEffect } from 'react';
import { SuggestedGroupCard } from './SuggestedGroupCard';
import { getPublicGroups, Group } from '@/shared/services/supabase';

// Use the Group interface from supabase.ts
type SuggestedGroup = Group;

export function SuggestedGroups() {
  const [suggestedGroups, setSuggestedGroups] = useState<SuggestedGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestedGroups();
  }, []);

  const loadSuggestedGroups = async () => {
    try {
      setLoading(true);
      
      // Get public groups for suggestions
      const groups = await getPublicGroups(6);
      setSuggestedGroups(groups);
    } catch (error) {
      console.error('Error loading suggested groups:', error);
      setSuggestedGroups([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-primary-200 dark:border-dark-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Suggested Groups
        </h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (suggestedGroups.length === 0) {
    return null; // Don't show the section if no suggestions
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-primary-200 dark:border-dark-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Suggested Groups
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {suggestedGroups.map((group) => (
          <SuggestedGroupCard
            key={group.id}
            group={group}
            onGroupJoined={() => {
              // Refresh the main groups list
              window.location.reload();
            }}
          />
        ))}
      </div>
    </div>
  );
}
