'use client';

import { useState } from 'react';
import { CreateGroupModal } from './CreateGroupModal';

interface CreateGroupButtonProps {
  onGroupCreated: () => void;
}

export function CreateGroupButton({ onGroupCreated }: CreateGroupButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGroupCreated = () => {
    setIsModalOpen(false);
    onGroupCreated();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="text-sm font-semibold">Create Group</span>
      </button>

      {isModalOpen && (
        <CreateGroupModal
          onClose={() => setIsModalOpen(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </>
  );
}
