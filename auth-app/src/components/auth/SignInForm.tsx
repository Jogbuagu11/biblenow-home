import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import ResetPasswordModal from '@/components/auth/ResetPasswordModal';
import { Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleIcon, AppleIcon } from '@/components/icons/SocialIcons';
import { toast } from 'sonner';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface SignInFormProps {
  onToggleForm: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!captchaToken) {
        toast.error('Please complete the CAPTCHA');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken
        }
      });

      captchaRef.current?.resetCaptcha();

      if (error) {
        toast.error('Login failed', { description: error.message });
      } else {
        toast.success('Welcome back!', { description: 'Signed in successfully.' });
        window.location.href = 'https://studio.biblenow.io/dashboard';
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone) {
      toast.error('Phone number is required');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone
      });

      if (error) {
        toast.error('SMS sign-in failed', { description: error.message });
      } else {
        setOtpSent(true);
        toast.success('OTP code sent', { description: 'Please check your phone for verification code.' });
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otpCode,
        type: 'sms'
      });

      if (error) {
        toast.error('OTP verification failed', { description: error.message });
      } else {
        toast.success('Verified successfully!');
        window.location.href = 'https://studio.biblenow.io/dashboard';
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // User will be redirected to OAuth provider
      console.log("Redirecting to OAuth provider:", data);
    } catch (error: any) {
      toast.error(`Social sign-in failed`, {
        description: error.message || "Could not connect to authentication provider"
      });
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const switchAuthMode = () => {
    setIsPhoneLogin(!isPhoneLogin);
    setOtpSent(false); // Reset OTP state when switching modes
  };

  return (
    <form onSubmit={isPhoneLogin ? (otpSent ? verifyOtp : handlePhoneSignIn) : handleSignIn} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-biblenow-beige">Sign In</h2>
        <div className="mt-2">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={switchAuthMode} 
            className="text-sm text-biblenow-gold hover:text-biblenow-gold/80"
          >
            {isPhoneLogin ? "Use Email Instead" : "Use Phone Instead"}
          </Button>
        </div>
      </div>

      {isPhoneLogin ? (
        <>
          {!otpSent ? (
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-biblenow-beige/40" />
              <input
                type="tel"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="auth-input pl-10"
                required
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter verification code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
              <p className="text-sm text-biblenow-beige/60">
                Enter the code sent to {phone}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="relative">
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

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-biblenow-beige/40" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input pl-10 pr-10"
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
        </>
      )}

      {!isPhoneLogin && (
        <div className="flex justify-between items-center text-sm">
          <button
            type="button"
            onClick={() => setShowReset(true)}
            className="text-biblenow-gold hover:underline"
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={onToggleForm}
            className="text-biblenow-gold hover:underline"
          >
            Create Account
          </button>
        </div>
      )}

      <div className="mt-4">
        <HCaptcha
          ref={captchaRef}
          sitekey={import.meta.env.VITE_HCAPTCHA_SITEKEY ?? ''}
          onVerify={(token) => {
            console.log("hCaptcha token received:", token);
            setCaptchaToken(token);
          }}
        />
      </div>

      <button
        type="submit"
        className="auth-btn-primary w-full"
        disabled={loading}
      >
        {loading 
          ? 'Please wait...' 
          : isPhoneLogin 
            ? (otpSent ? 'Verify Code' : 'Send Code') 
            : 'Sign In'
        }
      </button>

      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-biblenow-beige/20"></div>
        <span className="mx-2 text-xs text-biblenow-beige/60">or continue with</span>
        <div className="flex-grow h-px bg-biblenow-beige/20"></div>
      </div>
      <div className="flex space-x-2 mb-1">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 auth-btn-outline flex items-center justify-center gap-2"
          onClick={() => handleSocialSignIn("google")}
          disabled={loading}
        >
          <GoogleIcon /> Google
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 auth-btn-outline flex items-center justify-center gap-2"
          onClick={() => handleSocialSignIn("apple")}
          disabled={loading}
        >
          <AppleIcon /> Apple
        </Button>
      </div>

      <ResetPasswordModal isOpen={showReset} onClose={() => setShowReset(false)} />
    </form>
  );
};

export default SignInForm;
