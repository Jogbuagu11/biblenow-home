'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { getPublicFeed, togglePostLike, togglePostPrayer, Post } from '@/shared/services/supabase';

// Post interface is now imported from supabase.ts

export function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async (before?: string) => {
    try {
      const fetchedPosts = await getPublicFeed(20, before);
      
      if (before) {
        setPosts(prev => [...prev, ...fetchedPosts]);
      } else {
        setPosts(fetchedPosts);
      }
      
      setHasMore(fetchedPosts.length === 20); // Assuming 20 is the page size
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleLike = async (postId: string) => {
    const newLikedState = await togglePostLike(postId);
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: newLikedState,
            like_count: newLikedState ? post.like_count + 1 : post.like_count - 1
          }
        : post
    ));
  };

  const handlePray = async (postId: string) => {
    const newPrayedState = await togglePostPrayer(postId);
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            prayed: newPrayedState,
            prayer_count: newPrayedState ? post.prayer_count + 1 : post.prayer_count - 1
          }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    // TODO: Open comments modal
    console.log('Open comments for post:', postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const lastPost = posts[posts.length - 1];
    loadPosts(lastPost.created_at);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Be the first to share something with the community!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Subheader */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
          From the community
        </h2>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
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
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="btn-primary disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
