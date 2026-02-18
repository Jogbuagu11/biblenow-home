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
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [verifiedProfile, setVerifiedProfile] = useState<VerifiedProfile | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('ProfilePage: Starting to load profile for userId:', userId);
        console.log('ProfilePage: Current user:', currentUser?.id);
        console.log('ProfilePage: Current user authenticated:', !!currentUser);

        // Check if this is the current user's profile
        const isOwnProfile = currentUser?.id === userId;
        setIsCurrentUser(isOwnProfile);
        console.log('ProfilePage: Is own profile:', isOwnProfile);

        // Check if user is verified
        const verified = await isUserVerified(userId);
        console.log('ProfilePage: User verified status:', verified);
        setIsVerified(verified);

        let profileFound = false;

        if (verified) {
          // Load verified profile
          console.log('ProfilePage: Loading verified profile...');
          const vProfile = await getVerifiedProfile(userId);
          console.log('ProfilePage: Verified profile data:', vProfile);
          setVerifiedProfile(vProfile);
          if (vProfile) {
            setProfile(vProfile);
            profileFound = true;
            console.log('ProfilePage: Verified profile found and set');
          } else {
            console.log('ProfilePage: No verified profile found');
          }
        } else {
          // Load regular profile
          console.log('ProfilePage: Loading regular profile...');
          const regProfile = await getProfile(userId);
          console.log('ProfilePage: Regular profile data:', regProfile);
          setProfile(regProfile);
          if (regProfile) {
            profileFound = true;
            console.log('ProfilePage: Regular profile found and set');
          } else {
            console.log('ProfilePage: No regular profile found');
          }
        }

        console.log('ProfilePage: Profile found:', profileFound);
        if (!profileFound) {
          console.log('ProfilePage: Setting error - Profile not found');
          setError('Profile not found');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    // Load profile regardless of currentUser status (for viewing other users' profiles)
    // But add a small delay to ensure auth state is settled
    const timer = setTimeout(() => {
      loadProfile();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [userId, currentUser]);

  if (loading) {
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
