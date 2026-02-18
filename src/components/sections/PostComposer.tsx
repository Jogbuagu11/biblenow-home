'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { createPost } from '@/shared/services/supabase';
import { useRouter } from 'next/navigation';

interface PostComposerProps {
  onPostCreated?: () => void;
  groupId?: string;
}

export function PostComposer({ onPostCreated, groupId }: PostComposerProps) {
  const { user, profile, verifiedProfile, isVerified } = useAuth();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const router = useRouter();

  const handleAvatarClick = () => {
    if (user?.id) {
      router.push(`/profile/${user.id}`);
    }
  };

  const displayName = isVerified && verifiedProfile?.ministry_name 
    ? verifiedProfile.ministry_name 
    : `${profile?.first_name} ${profile?.last_name}`;

  const avatarUrl = isVerified && verifiedProfile?.profile_photo_url 
    ? verifiedProfile.profile_photo_url 
    : profile?.profile_photo_url;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const newPost = await createPost(content.trim(), { groupId });
      if (newPost) {
        setContent('');
        onPostCreated?.(); // Refresh the feed
        console.log('Post created successfully:', newPost);
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="card p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <button
              onClick={handleAvatarClick}
              className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary-300 dark:hover:ring-primary-400 transition-all cursor-pointer"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary-500 text-sm font-bold">
                  {displayName?.charAt(0) || 'U'}
                </span>
              )}
            </button>
          </div>

          {/* Content Input */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your heart today?"
              className="w-full p-3 border border-primary-200 dark:border-dark-200 rounded-lg bg-white dark:bg-dark-300 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              disabled={isPosting}
            />
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  <span>📷</span>
                  <span className="text-sm">Photo</span>
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  <span>🎵</span>
                  <span className="text-sm">Audio</span>
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  <span>🎥</span>
                  <span className="text-sm">Video</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={!content.trim() || isPosting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPosting ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
