'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VerifiedBadgeInline } from '@/components/ui/VerifiedBadge';

interface PostCardProps {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  isVerified: boolean;
  content: string;
  images?: string[];
  audioUrl?: string;
  videoUrl?: string;
  timestamp: string;
  likeCount: number;
  prayerCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isPrayed: boolean;
  onLike: () => void;
  onPray: () => void;
  onComment: () => void;
  onShare: () => void;
}

export function PostCard({
  id,
  authorId,
  authorName,
  authorPhoto,
  isVerified,
  content,
  images = [],
  audioUrl,
  videoUrl,
  timestamp,
  likeCount,
  prayerCount,
  commentCount,
  shareCount,
  isLiked,
  isPrayed,
  onLike,
  onPray,
  onComment,
  onShare,
}: PostCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const router = useRouter();

  const handleUserClick = () => {
    if (authorId) {
      router.push(`/profile/${authorId}`);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const safeContent = content || '';
  const shouldTruncate = safeContent.length > 200;
  const displayContent = shouldTruncate && !showFullContent 
    ? safeContent.substring(0, 200) + '...' 
    : safeContent;

  return (
    <div className="card p-5 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <button
            onClick={handleUserClick}
            className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary-300 dark:hover:ring-primary-400 transition-all cursor-pointer"
          >
            {authorPhoto ? (
              <img
                src={authorPhoto}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary-500 text-sm font-bold">
                {(authorName || 'U').charAt(0)}
              </span>
            )}
          </button>

          {/* Author Info */}
          <div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleUserClick}
                className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer text-left"
              >
                {authorName || 'Unknown User'}
              </button>
              {isVerified && (
                <VerifiedBadgeInline className="ml-0.5" />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTimestamp(timestamp)}
            </p>
          </div>
        </div>

        {/* More Options */}
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <span>⋯</span>
        </button>
      </div>

      {/* Content */}
      {safeContent && (
        <div className="mb-4">
          <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
            {displayContent}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-primary-500 hover:text-primary-600 text-sm mt-2"
            >
              {showFullContent ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Media */}
      {images && images.length > 0 && (
        <div className="mb-4">
          <div className={`grid gap-2 ${
            images.length === 1 ? 'grid-cols-1' :
            images.length === 2 ? 'grid-cols-2' :
            images.length === 3 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg ${
                  images.length === 1 ? 'aspect-video' :
                  images.length === 2 ? 'aspect-square' :
                  images.length === 3 && index === 0 ? 'row-span-2' :
                  'aspect-square'
                }`}
              >
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {images.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      +{images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {audioUrl && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-dark-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white">🎵</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Audio Message
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tap to play
              </p>
            </div>
            <button className="text-primary-500 hover:text-primary-600">
              ▶️
            </button>
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="mb-4">
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              controls
            />
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-primary-200 dark:border-dark-200 my-4"></div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked 
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
              : 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          <span>{isLiked ? '❤️' : '🤍'}</span>
          <span className="text-sm font-medium">
            {(likeCount || 0) > 0 ? likeCount : 'Like'}
          </span>
        </button>

        <button
          onClick={onPray}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isPrayed 
              ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
          }`}
        >
          <span>{isPrayed ? '✨' : '⭐'}</span>
          <span className="text-sm font-medium">
            {(prayerCount || 0) > 0 ? prayerCount : 'Pray'}
          </span>
        </button>

        <button
          onClick={onComment}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
        >
          <span>💬</span>
          <span className="text-sm font-medium">
            {(commentCount || 0) > 0 ? commentCount : 'Comment'}
          </span>
        </button>

        <button
          onClick={onShare}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
        >
          <span>📤</span>
          <span className="text-sm font-medium">
            {(shareCount || 0) > 0 ? shareCount : 'Share'}
          </span>
        </button>
      </div>
    </div>
  );
}
