'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Group } from '@/shared/services/supabase';
import { getGroup, requestToJoinGroup } from '@/shared/services/supabase';
import { useAuth } from '@/app/providers';

interface GroupInfoPageProps {
  groupId: string;
}

export function GroupInfoPage({ groupId }: GroupInfoPageProps) {
  const { user: currentUser } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [requestingJoin, setRequestingJoin] = useState(false);
  const [joinRequested, setJoinRequested] = useState(false);

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load group details
      const groupData = await getGroup(groupId);
      if (!groupData) {
        setError('Group not found');
        return;
      }
      setGroup(groupData);
    } catch (err) {
      console.error('Error loading group:', err);
      setError('Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestToJoin = async () => {
    if (!currentUser) return;

    try {
      setRequestingJoin(true);
      const success = await requestToJoinGroup(groupId, joinMessage.trim());
      if (success) {
        setJoinRequested(true);
      }
    } catch (error) {
      console.error('Error requesting to join group:', error);
    } finally {
      setRequestingJoin(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-primary-50 dark:bg-dark-500 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !group) {
    return (
      <Layout>
        <div className="min-h-screen bg-primary-50 dark:bg-dark-500 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">👥</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {error || 'Group not found'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The group you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-primary-50 dark:bg-dark-500">
        <div className="max-w-2xl mx-auto px-8 py-12">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-primary-200 dark:border-dark-200 p-8">
            {/* Cover Photo */}
            {group.cover_photo_url && (
              <div className="mb-6">
                <img
                  src={group.cover_photo_url}
                  alt={group.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Group Info */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {group.name}
              </h1>
              
              {group.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {group.description}
                </p>
              )}

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                {group.member_count && (
                  <span>{group.member_count} members</span>
                )}
                <span>
                  Created {new Date(group.created_at).toLocaleDateString()}
                </span>
                {group.is_private && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                    Private
                  </span>
                )}
              </div>
            </div>

            {/* Join Request Form */}
            {!joinRequested ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="joinMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    id="joinMessage"
                    value={joinMessage}
                    onChange={(e) => setJoinMessage(e.target.value)}
                    rows={3}
                    maxLength={200}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell the group why you'd like to join..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {joinMessage.length}/200 characters
                  </p>
                </div>

                <button
                  onClick={handleRequestToJoin}
                  disabled={requestingJoin || !currentUser}
                  className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
                >
                  {requestingJoin ? 'Requesting...' : 'Request to Join'}
                </button>

                {!currentUser && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Please sign in to request to join this group
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Join Request Sent!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your request to join this group has been sent to the group administrators. 
                  You'll be notified when they respond.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

