import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Session } from '@supabase/supabase-js';

interface AuthError {
  message: string;
}

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const navigate = useNavigate();
  
  // Function to sign in with email/password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Attempting to sign in with email/password:", email);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log("Sign in response:", data, signInError);
      
      if (signInError) {
        setError({ message: signInError.message });
        return false;
      }
      
      return true;
    } catch (err: any) {
      console.error('Error signing in:', err.message);
      setError({ message: err.message || 'An error occurred during sign in' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to sign in with phone OTP
  const signInWithPhone = async (phone: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone
      });
      
      if (error) {
        setError({ message: error.message });
        return false;
      }
      
      return true;
    } catch (err: any) {
      setError({ message: err.message || 'An error occurred sending the OTP code' });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to verify OTP code
  const verifyOtp = async (phone: string, token: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });
      
      if (error) {
        setError({ message: error.message });
        return false;
      }
      
      return true;
    } catch (err: any) {
      setError({ message: err.message || 'An error occurred verifying the OTP code' });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to sign up with email/password
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Attempting to sign up with email/password:", email);
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {},
          emailRedirectTo: `${window.location.origin}/email-confirmed`
        },
      });
      
      console.log("Sign up response:", data);
      
      if (signUpError) {
        setError({ message: signUpError.message });
        return false;
      }
      
      // Manually insert signup data into auth_signups table
      if (data.user) {
        try {
          const { error: insertError } = await supabase
            .from('auth_signups')
            .insert({
              user_id: data.user.id,
              email: email,
              birthdate: metadata?.birthdate || null,
              gender: metadata?.gender || null,
              signup_time: new Date().toISOString(),
              ip_address: null, // Could be populated from request headers
              user_agent: navigator.userAgent,
              device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
              country: null, // Could be populated from IP geolocation
              referral_source: null // Could be populated from URL parameters
            });

          if (insertError) {
            console.warn("Failed to insert auth_signups data:", insertError);
            // Don't fail the signup process if this fails
          }
        } catch (insertError) {
          console.warn("Error inserting auth_signups data:", insertError);
          // Don't fail the signup process if this fails
        }
      }
      
      toast('Account created', {
        description: 'Please check your email to confirm your account',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error signing up:', err.message);
      setError({ message: err.message || 'An error occurred during sign up' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to sign in with OAuth providers
  const signInWithOAuth = async (provider: 'google' | 'apple' | 'facebook' | 'github') => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        setError({ message: error.message });
        return false;
      }
      
      return true;
    } catch (err: any) {
      setError({ message: err.message || 'An error occurred during OAuth sign-in' });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (err: any) {
      console.error('Error signing out:', err.message);
      setError({ message: err.message || 'An error occurred during sign out' });
    }
  };
  
  // Function to reset password
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        setError({ message: error.message });
        return false;
      }
      
      return true;
    } catch (err: any) {
      setError({ message: err.message || 'An error occurred during password reset' });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to update user
  const updateUser = async (updates: { email?: string; password?: string; data?: Record<string, any> }) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.updateUser(updates);
      
      if (error) {
        setError({ message: error.message });
        return false;
      }
      
      return true;
    } catch (err: any) {
      setError({ message: err.message || 'An error occurred updating user information' });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to get current user
  const getUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        setError({ message: error.message });
        return null;
      }
      
      return user;
    } catch (err: any) {
      setError({ message: err.message || 'An error occurred getting user information' });
      return null;
    }
  };
  
  // Listen for auth changes
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error) {
          setError({ message: error.message });
        } else {
          setSession(session);
          setUser(session?.user || null);
        }
      } catch (err: any) {
        setError({ message: err.message || 'Unexpected error' });
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    error,
    setError,
    signIn,
    signUp,
    signOut,
    signInWithPhone,
    verifyOtp,
    signInWithOAuth,
    resetPassword,
    updateUser,
    getUser,
  };
};
