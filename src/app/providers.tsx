'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/shared/services/supabase';
import { User } from '@supabase/supabase-js';
import { Profile, VerifiedProfile } from '@/shared/types';
import { getProfile, getVerifiedProfile, isUserVerified } from '@/shared/services/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  verifiedProfile: VerifiedProfile | null;
  isVerified: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [verifiedProfile, setVerifiedProfile] = useState<VerifiedProfile | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          if (error.message !== 'Auth session missing!') {
            console.error('Error getting user:', error);
          }
          setUser(null);
          setLoading(false);
          return;
        }
        
        setUser(user);
        
        if (user) {
          try {
            // Check if user is verified
            const verified = await isUserVerified(user.id);
            setIsVerified(verified);
            
            if (verified) {
              // Load verified profile
              const verifiedProfileData = await getVerifiedProfile(user.id);
              setVerifiedProfile(verifiedProfileData);
            } else {
              // Load regular profile
              const profileData = await getProfile(user.id);
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Error loading user profile:', error);
          }
        }
      } catch (error) {
        console.error('Error in getUser:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user);
            
            try {
              const verified = await isUserVerified(session.user.id);
              setIsVerified(verified);
              
              if (verified) {
                const verifiedProfileData = await getVerifiedProfile(session.user.id);
                setVerifiedProfile(verifiedProfileData);
              } else {
                const profileData = await getProfile(session.user.id);
                setProfile(profileData);
              }
            } catch (error) {
              console.error('Error loading user profile:', error);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setProfile(null);
            setVerifiedProfile(null);
            setIsVerified(false);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    profile,
    verifiedProfile,
    isVerified,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
