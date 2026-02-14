'use client';

import { GroupCard } from './GroupCard';

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

interface GroupsData {
  owned: Group[];
  joined: Group[];
}

interface GroupsListProps {
  groupsData: GroupsData;
  onGroupUpdated: () => void;
}

export function GroupsList({ groupsData, onGroupUpdated }: GroupsListProps) {
  const { owned, joined } = groupsData;

  return (
    <div className="space-y-6">
      {/* Your Groups (Owned) */}
      {owned.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
            Your Groups
          </h3>
          <div className="space-y-0">
            {owned.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isOwner={true}
                onGroupUpdated={onGroupUpdated}
              />
            ))}
          </div>
        </div>
      )}

      {/* Groups You Joined */}
      {joined.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
            Groups You Joined
          </h3>
          <div className="space-y-0">
            {joined.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isOwner={false}
                onGroupUpdated={onGroupUpdated}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
