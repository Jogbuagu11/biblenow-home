'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GroupsSection } from '@/components/groups/GroupsSection';
import { useAuth } from '@/app/providers';

export function GroupsPage() {
  const { isVerified } = useAuth();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/80 dark:bg-dark-600/30">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Groups
            </h1>
          </div>

          <GroupsSection canCreateGroup={isVerified} />
        </div>
      </div>
    </Layout>
  );
}
