'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GroupsSection } from '@/components/groups/GroupsSection';
import { useAuth } from '@/app/providers';

export function GroupsPage() {
  const { isVerified } = useAuth();

  return (
    <Layout>
      <div className="min-h-screen bg-primary-50 dark:bg-dark-500">
        <div className="px-8 py-12">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Groups
            </h1>
          </div>

          <GroupsSection canCreateGroup={isVerified} />
        </div>
      </div>
    </Layout>
  );
}
