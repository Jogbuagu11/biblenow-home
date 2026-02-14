
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetPasswordModal = ({ isOpen, onClose }: ResetPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error('Password reset failed', { description: error.message });
      } else {
        setIsSuccess(true);
        toast.success('Reset email sent', { description: 'Check your inbox for password reset instructions.' });
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-biblenow-dark border border-biblenow-beige/20 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-biblenow-beige mb-6">Reset Password</h2>
        
        {!isSuccess ? (
          <form onSubmit={handleResetPassword}>
            <p className="text-biblenow-beige/80 mb-6">
              Enter your email address and we'll send you instructions to reset your password.
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
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-biblenow-beige/80 mb-6">
              Password reset instructions have been sent to <strong>{email}</strong>. 
              Please check your inbox.
            </p>
            <Button 
              type="button"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
