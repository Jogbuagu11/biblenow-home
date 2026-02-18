'use client';

import { useState } from 'react';
import { supabase } from '@/shared/services/supabase';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResetPasswordModal({ isOpen, onClose }: ResetPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success('Check your inbox for password reset instructions.');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-biblenow-brown border border-biblenow-beige/20 rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold text-biblenow-beige mb-6">Reset Password</h2>
        {!isSuccess ? (
          <form onSubmit={handleResetPassword}>
            <p className="text-biblenow-beige/80 mb-6">
              Enter your email and we&apos;ll send you instructions to reset your password.
            </p>
            <div className="relative mb-6">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-biblenow-beige/40" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input pl-10"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button type="button" onClick={onClose} className="flex-1 auth-btn-outline py-2 rounded-md">
                Cancel
              </button>
              <button type="submit" className="flex-1 auth-btn-primary py-2 rounded-md" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-biblenow-beige/80 mb-6">
              Password reset instructions have been sent to <strong>{email}</strong>. Check your inbox.
            </p>
            <button type="button" onClick={onClose} className="auth-btn-primary py-2 px-4 rounded-md">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
