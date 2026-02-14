'use client';

import { useState, useEffect } from 'react';
import { getTrendingTopics } from '@/shared/services/supabase';

export function TrendingTopics() {
  const [trendingTopics, setTrendingTopics] = useState<{tag: string, posts: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingTopics = async () => {
      try {
        const topics = await getTrendingTopics(8);
        setTrendingTopics(topics);
      } catch (error) {
        console.error('Error loading trending topics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingTopics();
  }, []);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <span className="h-5 w-5 text-primary-500">📈</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Trending Topics
          </h3>
        </div>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <span className="h-5 w-5 text-primary-500">📈</span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Trending Topics
        </h3>
      </div>

      <div className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div
            key={topic.tag}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200 cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                #{index + 1}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-500 transition-colors duration-200">
                {topic.tag}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {topic.posts.toLocaleString()} posts
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
        <button className="w-full text-sm text-primary-500 hover:text-primary-600 font-medium">
          View All Trending Topics
        </button>
      </div>
    </div>
  );
}
