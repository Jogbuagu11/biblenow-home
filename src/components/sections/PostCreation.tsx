'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
// import { 
//   PhotoIcon, 
//   VideoCameraIcon, 
//   FaceSmileIcon,
//   UserCircleIcon
// } from '@heroicons/react/24/outline';

interface PostCreationProps {
  user: User | null;
}

export function PostCreation({ user }: PostCreationProps) {
  const [postContent, setPostContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim()) {
      // Handle post creation
      console.log('Creating post:', postContent);
      setPostContent('');
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {user ? (
            <div className="avatar-md bg-primary-100 dark:bg-primary-900">
              <span className="text-primary-500 font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          ) : (
            <span className="h-12 w-12 text-gray-400 text-4xl">👤</span>
          )}
        </div>

        {/* Post Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 resize-none"
              rows={3}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <span>📷</span>
                  <span className="text-sm font-medium">Photo</span>
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <span>📹</span>
                  <span className="text-sm font-medium">Video</span>
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <span>😊</span>
                  <span className="text-sm font-medium">Feeling</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={!postContent.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
