'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { LivestreamGrid } from '@/components/livestreams/LivestreamGrid';
import { LivestreamViewer } from '@/components/livestreams/LivestreamViewer';
import { getActiveLivestreams, Livestream } from '@/shared/services/supabase';

export function LivestreamsPage() {
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLivestream, setSelectedLivestream] = useState<Livestream | null>(null);

  useEffect(() => {
    const loadLivestreams = async () => {
      try {
        setLoading(true);
        const activeLivestreams = await getActiveLivestreams();
        setLivestreams(activeLivestreams);
      } catch (error) {
        console.error('Error loading livestreams:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLivestreams();
  }, []);

  const handleLivestreamSelect = (livestream: Livestream) => {
    setSelectedLivestream(livestream);
  };

  const handleCloseViewer = () => {
    setSelectedLivestream(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/80 dark:bg-dark-600/30">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Current Livestreams
            </h1>
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : livestreams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-white dark:bg-dark-300 rounded-2xl shadow-sm border border-gray-200/80 dark:border-dark-200 p-12 text-center">
                <div className="text-6xl mb-4">📺</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No active livestreams right now
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for live content
                </p>
              </div>
            </div>
          ) : (
            <LivestreamGrid 
              livestreams={livestreams} 
              onLivestreamSelect={handleLivestreamSelect}
            />
          )}
        </div>

        {/* Livestream Viewer Modal */}
        {selectedLivestream && (
          <LivestreamViewer
            livestream={selectedLivestream}
            onClose={handleCloseViewer}
          />
        )}
      </div>
    </Layout>
  );
}

