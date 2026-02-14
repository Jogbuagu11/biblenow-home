import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Base Function URL
const FUNCTION_URL = 'https://jhlawjmyorpmafokxtuh.supabase.co/functions/v1';

// Type for API response
type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

export const useApi = () => {
  // Send verification code to email
  const sendVerificationCode = async (email: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      console.log("Sending verification code to:", email);
      
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Send verification code response:", { data, error });

      if (error) {
        console.error("Error sending verification code:", error);
        return { data: null, error: error.message, loading: false };
      }

      return { data, error: null, loading: false };
    } catch (err: any) {
      console.error("Exception sending verification code:", err);
      return { data: null, error: err.message || 'An error occurred', loading: false };
    }
  };

  // Verify email with code
  const verifyEmailCode = async (email: string, code: string): Promise<ApiResponse<{ verified: boolean }>> => {
    try {
      console.log("Verifying email code:", { email, code });
      
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: { email, code },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Verify email code response:", { data, error });

      if (error) {
        console.error("Error verifying email code:", error);
        return { data: null, error: error.message, loading: false };
      }

      return { data, error: null, loading: false };
    } catch (err: any) {
      console.error("Exception verifying email code:", err);
      return { data: null, error: err.message || 'An error occurred', loading: false };
    }
  };

  // Setup 2FA
  const setup2FA = async (user_id: string, phone_number: string): Promise<ApiResponse<{ success: boolean, verification_code: string }>> => {
    try {
      console.log("Setting up 2FA:", { user_id, phone_number });
      
      const { data, error } = await supabase.functions.invoke('setup-2fa', {
        body: { user_id, phone_number },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Setup 2FA response:", { data, error });

      if (error) {
        console.error("Error setting up 2FA:", error);
        return { data: null, error: error.message, loading: false };
      }

      return { data, error: null, loading: false };
    } catch (err: any) {
      console.error("Exception setting up 2FA:", err);
      return { data: null, error: err.message || 'An error occurred', loading: false };
    }
  };

  // Verify 2FA code
  const verify2FACode = async (user_id: string, code: string, expected_code: string): Promise<ApiResponse<{ verified: boolean }>> => {
    try {
      console.log("Verifying 2FA code:", { user_id, code });
      
      const { data, error } = await supabase.functions.invoke('verify-2fa-code', {
        body: { user_id, code, expected_code },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Verify 2FA code response:", { data, error });

      if (error) {
        console.error("Error verifying 2FA code:", error);
        return { data: null, error: error.message, loading: false };
      }

      return { data, error: null, loading: false };
    } catch (err: any) {
      console.error("Exception verifying 2FA code:", err);
      return { data: null, error: err.message || 'An error occurred', loading: false };
    }
  };

  // Skip 2FA
  const skip2FA = async (user_id: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      console.log("Skipping 2FA for user:", user_id);
      
      const { data, error } = await supabase.functions.invoke('skip-2fa', {
        body: { user_id },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Skip 2FA response:", { data, error });

      if (error) {
        console.error("Error skipping 2FA:", error);
        return { data: null, error: error.message, loading: false };
      }

      return { data, error: null, loading: false };
    } catch (err: any) {
      console.error("Exception skipping 2FA:", err);
      return { data: null, error: err.message || 'An error occurred', loading: false };
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      console.log("Requesting password reset for:", email);
      
      const { data, error } = await supabase.functions.invoke('password-reset-request', {
        body: { email },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Password reset request response:", { data, error });

      if (error) {
        console.error("Error requesting password reset:", error);
        return { data: null, error: error.message, loading: false };
      }

      return { data, error: null, loading: false };
    } catch (err: any) {
      console.error("Exception requesting password reset:", err);
      return { data: null, error: err.message || 'An error occurred', loading: false };
    }
  };

  // Create Supabase user with user metadata
  const createUserWithMetadata = async (
    email: string, 
    password: string, 
    metadata: any
  ): Promise<ApiResponse<any>> => {
    try {
      console.log("Creating user with metadata:", { email, metadata });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        }
      });

      console.log("Create user response:", { data, error });

      if (error) {
        console.error("Error creating user:", error);
        return { data: null, error: error.message, loading: false };
      }

      return { data, error: null, loading: false };
    } catch (err: any) {
      console.error("Exception creating user:", err);
      return { data: null, error: err.message || 'An error occurred', loading: false };
    }
  };

  // Reset password
  const resetPassword = async (email: string, password: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      console.log("Resetting password for:", email);
      
      // We use the updateUser method which requires the user to be authenticated
      // with a session from the password reset email
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error("Error resetting password:", error);
        return { data: null, error: error.message, loading: false };
      }

      return { data: { success: true }, error: null, loading: false };
    } catch (err: any) {
      console.error("Exception resetting password:", err);
      return { data: null, error: err.message || 'An error occurred', loading: false };
    }
  };

  return {
    sendVerificationCode,
    verifyEmailCode,
    setup2FA,
    verify2FACode,
    skip2FA,
    requestPasswordReset,
    createUserWithMetadata,
    resetPassword,
  };
};
