'use client';

import { useState, useEffect } from 'react';
import { PostComposer } from '@/components/sections/PostComposer';
import { PostCard } from '@/components/sections/PostCard';
import { Post } from '@/shared/services/supabase';
import { getGroupFeed, togglePostLike, togglePostPrayer } from '@/shared/services/supabase';

interface GroupPostsFeedProps {
  groupId: string;
  isMember: boolean;
  isOwner: boolean;
}

export function GroupPostsFeed({ groupId, isMember, isOwner }: GroupPostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedKey, setFeedKey] = useState(0);

  useEffect(() => {
    loadPosts();
  }, [groupId]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const groupPosts = await getGroupFeed(groupId);
      setPosts(groupPosts);
    } catch (err) {
      console.error('Error loading group posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    setFeedKey(prev => prev + 1);
    loadPosts();
  };

  const handlePostUpdated = () => {
    loadPosts();
  };

  const handleLike = async (postId: string) => {
    const newLikedState = await togglePostLike(postId);
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              liked: newLikedState,
              like_count: newLikedState ? post.like_count + 1 : post.like_count - 1,
            }
          : post,
      ),
    );
  };

  const handlePray = async (postId: string) => {
    const newPrayedState = await togglePostPrayer(postId);
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              prayed: newPrayedState,
              prayer_count: newPrayedState ? post.prayer_count + 1 : post.prayer_count - 1,
            }
          : post,
      ),
    );
  };

  const handleComment = (postId: string) => {
    // TODO: Open comments modal
    console.log('Open comments for post:', postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  return (
    <div className="space-y-6">
      {/* Post Composer - Only for members */}
      {isMember && (
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-primary-200 dark:border-dark-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Share something with the group
          </h2>
          <PostComposer 
            key={feedKey}
            onPostCreated={handlePostCreated}
            groupId={groupId}
          />
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-primary-200 dark:border-dark-200 p-6">
                <div className="animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-primary-200 dark:border-dark-200 p-6 text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={loadPosts}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-primary-200 dark:border-dark-200 p-6 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isMember 
                ? "Be the first to share something with the group!" 
                : "Join the group to see posts and participate in discussions."
              }
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              authorId={post.user_id}
              authorName={`${post.author.first_name} ${post.author.last_name}`}
              authorPhoto={post.author.profile_photo_url}
              isVerified={post.author.is_verified}
              content={post.content}
              images={post.images}
              audioUrl={post.audio_url}
              videoUrl={post.link_url}
              timestamp={post.created_at}
              likeCount={post.like_count}
              prayerCount={post.prayer_count}
              commentCount={post.comment_count}
              shareCount={post.share_count}
              isLiked={post.liked}
              isPrayed={post.prayed}
              onLike={() => handleLike(post.id)}
              onPray={() => handlePray(post.id)}
              onComment={() => handleComment(post.id)}
              onShare={() => handleShare(post.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

