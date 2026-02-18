'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/shared/services/supabase';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { GoogleIcon, AppleIcon } from './SocialIcons';
import ResetPasswordModal from './ResetPasswordModal';

const HCAPTCHA_SITEKEY = typeof process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY === 'string'
  ? process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY
  : '';

interface AuthSignInFormProps {
  onToggleForm: () => void;
}

export default function AuthSignInForm({ onToggleForm }: AuthSignInFormProps) {
  const router = useRouter();
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
  const [HCaptchaComponent, setHCaptchaComponent] = useState<React.ComponentType<{
    ref?: React.Ref<unknown>;
    sitekey: string;
    onVerify: (token: string) => void;
  }> | null>(null);
  const captchaRef = useRef<{ resetCaptcha: () => void } | null>(null);

  useEffect(() => {
    if (!HCAPTCHA_SITEKEY) return;
    import('@hcaptcha/react-hcaptcha')
      .then((mod) => setHCaptchaComponent(mod.default as unknown as React.ComponentType<{ ref?: React.Ref<unknown>; sitekey: string; onVerify: (token: string) => void }>))
      .catch(() => setHCaptchaComponent(null));
  }, []);

  const useCaptcha = Boolean(HCAPTCHA_SITEKEY && HCaptchaComponent);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error('Please enter your email');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    if (useCaptcha && !captchaToken) {
      toast.error('Please complete the CAPTCHA');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
        ...(useCaptcha && captchaToken ? { options: { captchaToken } } : {}),
      });
      captchaRef.current?.resetCaptcha?.();
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Signed in successfully.');
      router.push('/app');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      toast.error(message);
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
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) toast.error(error.message);
      else {
        setOtpSent(true);
        toast.success('Check your phone for the verification code.');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otpCode,
        type: 'sms',
      });
      if (error) toast.error(error.message);
      else {
        toast.success('Verified successfully!');
        router.push('/app');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    try {
      setLoading(true);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not connect to provider');
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={isPhoneLogin ? (otpSent ? verifyOtp : handlePhoneSignIn) : handleSignIn}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-biblenow-beige">Sign In</h2>
        <div className="mt-2">
          <button
            type="button"
            onClick={() => {
              setIsPhoneLogin(!isPhoneLogin);
              setOtpSent(false);
            }}
            className="text-sm text-biblenow-gold hover:text-biblenow-gold/80"
          >
            {isPhoneLogin ? 'Use Email Instead' : 'Use Phone Instead'}
          </button>
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
              <input
                type="text"
                placeholder="Enter verification code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="auth-input"
                required
              />
              <p className="text-sm text-biblenow-beige/60">Enter the code sent to {phone}</p>
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
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input pl-10 pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-biblenow-beige/40 hover:text-biblenow-beige"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </>
      )}

      {!isPhoneLogin && (
        <div className="flex justify-between items-center text-sm">
          <button type="button" onClick={() => setShowReset(true)} className="text-biblenow-gold hover:underline">
            Forgot Password?
          </button>
          <button type="button" onClick={onToggleForm} className="text-biblenow-gold hover:underline">
            Create Account
          </button>
        </div>
      )}

      {!isPhoneLogin && HCAPTCHA_SITEKEY && HCaptchaComponent && (
        <div className="mt-4">
          <HCaptchaComponent
            ref={captchaRef}
            sitekey={HCAPTCHA_SITEKEY}
            onVerify={(token) => setCaptchaToken(token)}
          />
        </div>
      )}

      <button type="submit" className="auth-btn-primary w-full" disabled={loading}>
        {loading
          ? 'Please wait...'
          : isPhoneLogin
            ? otpSent
              ? 'Verify Code'
              : 'Send Code'
            : 'Sign In'}
      </button>

      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-biblenow-beige/20" />
        <span className="mx-2 text-xs text-biblenow-beige/60">or continue with</span>
        <div className="flex-grow h-px bg-biblenow-beige/20" />
      </div>
      <div className="flex space-x-2 mb-1">
        <button
          type="button"
          className="flex-1 auth-btn-outline flex items-center justify-center gap-2 py-2 rounded-md"
          onClick={() => handleSocialSignIn('google')}
          disabled={loading}
        >
          <GoogleIcon /> Google
        </button>
        <button
          type="button"
          className="flex-1 auth-btn-outline flex items-center justify-center gap-2 py-2 rounded-md"
          onClick={() => handleSocialSignIn('apple')}
          disabled={loading}
        >
          <AppleIcon /> Apple
        </button>
      </div>

      <ResetPasswordModal isOpen={showReset} onClose={() => setShowReset(false)} />
    </form>
  );
}
