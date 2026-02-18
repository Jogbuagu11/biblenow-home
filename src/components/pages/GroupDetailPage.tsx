'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { GroupHeader } from '@/components/groups/GroupHeader';
import { GroupPostsFeed } from '@/components/groups/GroupPostsFeed';
import { GroupMembersSection } from '@/components/groups/GroupMembersSection';
import { Group } from '@/shared/services/supabase';
import { getGroup, joinGroup, leaveGroup, isGroupMember } from '@/shared/services/supabase';
import { useAuth } from '@/app/providers';

interface GroupDetailPageProps {
  groupId: string;
}

export function GroupDetailPage({ groupId }: GroupDetailPageProps) {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loadingMembership, setLoadingMembership] = useState(true);

  useEffect(() => {
    loadGroupData();
  }, [groupId, currentUser]);

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

      // Check if current user is a member
      if (currentUser) {
        console.log('Checking membership for user:', currentUser.id, 'in group:', groupId);
        const membership = await isGroupMember(currentUser.id, groupId);
        console.log('Membership result:', membership);
        setIsMember(membership.isMember);
        setIsOwner(membership.isOwner);
        
        // If user is not a member, redirect to group info page
        if (!membership.isMember) {
          console.log('User is not a member, redirecting to info page');
          router.push(`/groups/${groupId}/info`);
          return;
        } else {
          console.log('User is a member, allowing access to group page');
        }
      } else {
        // If user is not authenticated, redirect to group info page
        console.log('User not authenticated, redirecting to info page');
        router.push(`/groups/${groupId}/info`);
        return;
      }
    } catch (err) {
      console.error('Error loading group:', err);
      setError('Failed to load group');
    } finally {
      setLoading(false);
      setLoadingMembership(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!currentUser) return;

    try {
      const success = await joinGroup(groupId);
      if (success) {
        setIsMember(true);
        // Refresh group data to update member count
        loadGroupData();
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!currentUser) return;

    try {
      const success = await leaveGroup(groupId);
      if (success) {
        setIsMember(false);
        // Refresh group data to update member count
        loadGroupData();
      }
    } catch (error) {
      console.error('Error leaving group:', error);
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
        {/* Group Header */}
        <GroupHeader 
          group={group} 
          isMember={isMember}
          isOwner={isOwner}
          loadingMembership={loadingMembership}
          onJoin={handleJoinGroup}
          onLeave={handleLeaveGroup}
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Posts Feed */}
            <div className="lg:col-span-2">
              <GroupPostsFeed 
                groupId={groupId} 
                isMember={isMember}
                isOwner={isOwner}
              />
            </div>

            {/* Right Column - Members & Info */}
            <div className="lg:col-span-1">
              <GroupMembersSection 
                groupId={groupId}
                isOwner={isOwner}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
