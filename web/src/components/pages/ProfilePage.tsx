'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { getProfile, getVerifiedProfile, isUserVerified } from '@/shared/services/supabase';
import { Profile, VerifiedProfile } from '@/shared/services/supabase';
import { InternalProfileView } from '@/components/profile/InternalProfileView';
import { PublicProfileView } from '@/components/profile/PublicProfileView';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProfilePageProps {
  userId: string;
}

export function ProfilePage({ userId }: ProfilePageProps) {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [verifiedProfile, setVerifiedProfile] = useState<VerifiedProfile | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wait for auth to be ready before deciding internal vs public, so we never show
  // public profile to the logged-in user when they click their own avatar.
  useEffect(() => {
    if (authLoading) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Strict comparison: only treat as own profile when ids match (avoids showing external UI for self)
        const isOwnProfile = Boolean(
          currentUser?.id && userId && String(currentUser.id) === String(userId)
        );
        setIsCurrentUser(isOwnProfile);

        const verified = await isUserVerified(userId);
        setIsVerified(verified);

        let profileFound = false;

        if (verified) {
          const vProfile = await getVerifiedProfile(userId);
          setVerifiedProfile(vProfile);
          if (vProfile) {
            setProfile(vProfile);
            profileFound = true;
          }
        } else {
          const regProfile = await getProfile(userId);
          setProfile(regProfile);
          if (regProfile) profileFound = true;
        }

        if (!profileFound) setError('Profile not found');
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, currentUser, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Profile Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Profile Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This profile could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  // Render internal profile view for current user, public view for others
  if (isCurrentUser) {
    return (
      <InternalProfileView 
        profile={profile}
        verifiedProfile={verifiedProfile}
        isVerified={isVerified}
      />
    );
  } else {
    return (
      <PublicProfileView 
        profile={profile}
        verifiedProfile={verifiedProfile}
        isVerified={isVerified}
        userId={userId}
      />
    );
  }
}
