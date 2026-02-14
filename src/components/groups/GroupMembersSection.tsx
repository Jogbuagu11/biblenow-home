'use client';

import { useState, useEffect } from 'react';
import { getGroupMembers, GroupMember } from '@/shared/services/supabase';

interface GroupMembersSectionProps {
  groupId: string;
  isOwner: boolean;
}

export function GroupMembersSection({ groupId, isOwner }: GroupMembersSectionProps) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
  }, [groupId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get group members from Supabase
      const groupMembers = await getGroupMembers(groupId);
      setMembers(groupMembers);
    } catch (err) {
      console.error('Error loading group members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const getMemberAvatar = (member: GroupMember) => {
    if (member.avatar) {
      return (
        <img
          src={member.avatar}
          alt={member.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-dark-200"
        />
      );
    }
    
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-600 border border-gray-300 dark:border-dark-200 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
          {member.name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
            Owner
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            Admin
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Group Members */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-primary-200 dark:border-dark-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Members
          </h3>
          {isOwner && (
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              Manage
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={loadMembers}
              className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center space-x-3">
                {getMemberAvatar(member)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {member.name}
                    </p>
                    {getRoleBadge(member.role)}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Joined {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group Info */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-primary-200 dark:border-dark-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          About This Group
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Members</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {members.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Posts</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              -- {/* This would come from the group data */}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Created</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              -- {/* This would come from the group data */}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {isOwner && (
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-primary-200 dark:border-dark-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Group Management
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors">
              Edit Group Settings
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors">
              Manage Members
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors">
              View Reports
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
