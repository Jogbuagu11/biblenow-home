'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedGroups } from '@/components/sections/FeaturedGroups';
import { FeaturedStreamers } from '@/components/sections/FeaturedStreamers';
import { NewProfiles } from '@/components/sections/NewProfiles';
import { PostComposer } from '@/components/sections/PostComposer';
import { HomeFeed } from '@/components/sections/HomeFeed';
import { TrendingTopics } from '@/components/sections/TrendingTopics';
import { getActiveLivestreams, getFeaturedStreamers, getNewProfiles, getFeaturedGroups, getTrendingTopics } from '@/shared/services/supabase';
import { Livestream } from '@/shared/services/supabase';

export function HomePage() {
  const { user, loading } = useAuth();
  const [featuredLivestream, setFeaturedLivestream] = useState<Livestream | null>(null);
  const [livestreamsLoading, setLivestreamsLoading] = useState(true);
  const [hasGroups, setHasGroups] = useState(false);
  const [hasStreamers, setHasStreamers] = useState(false);
  const [hasNewProfiles, setHasNewProfiles] = useState(false);
  const [hasTrendingTopics, setHasTrendingTopics] = useState(false);
  const [feedKey, setFeedKey] = useState(0);

  useEffect(() => {
    const loadFeaturedLivestream = async () => {
      try {
        const livestreams = await getActiveLivestreams();
        if (livestreams.length > 0) {
          setFeaturedLivestream(livestreams[0]);
        }
      } catch (error) {
        console.error('Error loading featured livestream:', error);
      } finally {
        setLivestreamsLoading(false);
      }
    };

    loadFeaturedLivestream();
  }, []);

  useEffect(() => {
    const checkDataAvailability = async () => {
      try {
        // Check if groups exist
        const groups = await getFeaturedGroups(1);
        setHasGroups(groups.length > 0);

        // Check if streamers exist
        const streamers = await getFeaturedStreamers(1);
        setHasStreamers(streamers.length > 0);

        // Check if new profiles exist
        const newProfiles = await getNewProfiles(1);
        setHasNewProfiles(newProfiles.length > 0);

        // Check if trending topics exist
        const trendingTopics = await getTrendingTopics(1);
        setHasTrendingTopics(trendingTopics.length > 0);
      } catch (error) {
        console.error('Error checking data availability:', error);
      }
    };

    checkDataAvailability();
  }, []);

  // Show a welcome message for unauthenticated users
  if (!loading && !user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50/80 dark:bg-dark-600/30 flex items-center justify-center">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-4">
                Welcome to BibleNOW
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Connect, share, and grow in faith together
              </p>
            </div>
            <div className="space-y-4">
              <a href="/auth" className="w-full btn-primary block text-center">
                Get Started
              </a>
              <a href="/auth" className="w-full btn-outline block text-center">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/80 dark:bg-dark-600/30">
        {/* Hero Section - Featured Live Stream */}
        <div className="container-main py-8">
          <HeroSection 
            livestream={featuredLivestream} 
            loading={livestreamsLoading} 
          />
        </div>

        {/* Featured Groups Section - Only show if groups exist */}
        {hasGroups && (
          <div className="container-main py-8">
            <FeaturedGroups />
          </div>
        )}

        {/* Featured Streamers Section - Only show if streamers exist */}
        {hasStreamers && (
          <div className="container-main py-8">
            <FeaturedStreamers />
          </div>
        )}

        {/* New Profiles Section - Only show if new profiles exist */}
        {hasNewProfiles && (
          <div className="container-main py-8">
            <NewProfiles />
          </div>
        )}

        {/* Post Composer */}
        <div className="container-main py-8">
          <div className="max-w-2xl mx-auto">
            <PostComposer onPostCreated={() => setFeedKey(prev => prev + 1)} />
          </div>
        </div>

        {/* News Feed */}
        <div className="container-main py-8">
          <div className={`grid grid-cols-1 gap-8 ${hasTrendingTopics ? 'lg:grid-cols-4' : 'lg:grid-cols-1'}`}>
            {/* Home Feed */}
            <div className={hasTrendingTopics ? 'lg:col-span-3' : 'lg:col-span-1'}>
              <div className="max-w-2xl mx-auto">
                <HomeFeed key={feedKey} />
              </div>
            </div>
            
            {/* Trending Topics - Only show if trending topics exist */}
            {hasTrendingTopics && (
              <div className="lg:col-span-1">
                <TrendingTopics />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
