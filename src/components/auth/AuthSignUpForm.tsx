'use client';

import { useRef, useState, useEffect } from 'react';
import { supabase } from '@/shared/services/supabase';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { GoogleIcon, AppleIcon } from './SocialIcons';

const HCAPTCHA_SITEKEY = typeof process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY === 'string'
  ? process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY
  : '';

interface AuthSignUpFormProps {
  onToggleForm: () => void;
}

export default function AuthSignUpForm({ onToggleForm }: AuthSignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDateString, setBirthDateString] = useState('');
  const [gender, setGender] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [HCaptchaComponent, setHCaptchaComponent] = useState<React.ComponentType<{ ref?: React.Ref<unknown>; sitekey: string; onVerify: (t: string) => void }> | null>(null);
  const captchaRef = useRef<{ resetCaptcha: () => void } | null>(null);

  useEffect(() => {
    if (!HCAPTCHA_SITEKEY) return;
    import('@hcaptcha/react-hcaptcha').then((m) => setHCaptchaComponent(m.default as unknown as React.ComponentType<{ ref?: React.Ref<unknown>; sitekey: string; onVerify: (t: string) => void }>)).catch(() => setHCaptchaComponent(null));
  }, []);

  const useCaptcha = Boolean(HCAPTCHA_SITEKEY && HCaptchaComponent);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (useCaptcha && !captchaToken) {
      toast.error('Please complete the CAPTCHA.');
      return;
    }
    if (!birthDateString || !gender) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const birthdate = new Date(birthDateString);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const emailRedirectTo = `${origin}/app`;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken: captchaToken || undefined,
          data: {
            first_name: firstName,
            last_name: lastName,
            gender,
            birthdate: format(birthdate, 'yyyy-MM-dd'),
          },
          emailRedirectTo,
        },
      });

      if (error) {
        setFormError(error.message);
        toast.error(error.message);
        return;
      }

      if (data.user) {
        try {
          await supabase.from('auth_signups').insert({
            user_id: data.user.id,
            email,
            birthdate: format(birthdate, 'yyyy-MM-dd'),
            gender,
            signup_time: new Date().toISOString(),
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
            device_type: typeof navigator !== 'undefined' && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          });
        } catch {
          // non-blocking
        }
      }

      toast.success('Check your email to confirm your account.');
      captchaRef.current?.resetCaptcha();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'apple') => {
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
    <form onSubmit={handleSignUp} className="space-y-4">
      {formError && <div className="text-red-400 text-sm">{formError}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-biblenow-beige mb-1 block">First Name</label>
          <input type="text" required className="auth-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-biblenow-beige mb-1 block">Last Name</label>
          <input type="text" required className="auth-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-sm text-biblenow-beige mb-1 block">Email</label>
        <input type="email" required className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div>
        <label className="text-sm text-biblenow-beige mb-1 block">Password</label>
        <input type="password" required className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <div>
        <label className="text-sm text-biblenow-beige mb-1 block">Birth Date</label>
        <input type="date" required className="auth-input" value={birthDateString} onChange={(e) => setBirthDateString(e.target.value)} />
      </div>

      <div>
        <label className="text-sm text-biblenow-beige mb-1 block">Gender</label>
        <select required className="auth-input" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {HCAPTCHA_SITEKEY && HCaptchaComponent && (
        <div>
          <HCaptchaComponent
            sitekey={HCAPTCHA_SITEKEY}
            onVerify={(token) => setCaptchaToken(token)}
            ref={captchaRef}
          />
        </div>
      )}

      <button type="submit" className="w-full auth-btn-primary py-2 rounded-md" disabled={loading}>
        Create Account
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
          onClick={() => handleSocialSignUp('google')}
          disabled={loading}
        >
          <GoogleIcon /> Google
        </button>
        <button
          type="button"
          className="flex-1 auth-btn-outline flex items-center justify-center gap-2 py-2 rounded-md"
          onClick={() => handleSocialSignUp('apple')}
          disabled={loading}
        >
          <AppleIcon /> Apple
        </button>
      </div>

      <p className="text-center text-sm text-biblenow-beige/60 mt-4">
        Already have an account?{' '}
        <button type="button" onClick={onToggleForm} className="auth-link">
          Sign In
        </button>
      </p>
    </form>
  );
}
