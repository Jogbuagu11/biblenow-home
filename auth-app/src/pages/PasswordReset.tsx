import React, { useState, useEffect } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const PasswordReset: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  
  // Check if we have a reset token from the URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      toast.error('Invalid reset link', { description: 'No reset token found in URL.' });
    }
  }, [searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        toast.error('Password reset failed', { description: error.message });
      } else {
        toast.success('Password updated', { description: 'Your password has been successfully reset.' });
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-biblenow-gold text-center">Reset Your Password</h2>
        
        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm text-biblenow-beige mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-biblenow-beige/40 hover:text-biblenow-beige"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-biblenow-beige mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-biblenow-beige/40 hover:text-biblenow-beige"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
          
          <p className="text-center text-sm text-biblenow-beige/60">
            Remember your password?{' '}
            <button type="button" onClick={() => navigate('/')} className="auth-link">
              Back to Login
            </button>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default PasswordReset;
