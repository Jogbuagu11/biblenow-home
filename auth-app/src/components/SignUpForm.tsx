// src/components/auth/SignUpForm.tsx

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format, parse } from 'date-fns';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [birthDateString, setBirthDateString] = useState('');
  const [ageVerified, setAgeVerified] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const birthdate = parse(birthDateString, 'yyyy-MM-dd', new Date());

    if (!firstName || !lastName || !email || !password || !gender || !birthdate) {
      setError('All fields are required.');
      return;
    }

    if (!ageVerified || !agreedToTerms) {
      setError('You must verify your age and agree to the terms.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!captchaToken) {
      setError('Please complete the CAPTCHA.');
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        data: {
          first_name: firstName,
          last_name: lastName,
          gender,
          birthdate: format(birthdate, 'yyyy-MM-dd'),
        },
        emailRedirectTo: `${window.location.origin}/email-confirmed`,
      }
    });

    captchaRef.current?.resetCaptcha();

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Manually insert signup data into auth_signups table
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { error: insertError } = await supabase
          .from('auth_signups')
          .insert({
            user_id: userData.user.id,
            email: email,
            birthdate: format(birthdate, 'yyyy-MM-dd'),
            gender: gender,
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
      }
    } catch (insertError) {
      console.warn("Error inserting auth_signups data:", insertError);
      // Don't fail the signup process if this fails
    }

    navigate('/check-email');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-biblenow-beige">First Name</label>
          <input className="auth-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm text-biblenow-beige">Last Name</label>
          <input className="auth-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="block text-sm text-biblenow-beige">Email</label>
        <input type="email" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm text-biblenow-beige">Date of Birth</label>
        <input
          type="date"
          className="auth-input"
          value={birthDateString}
          onChange={(e) => setBirthDateString(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm text-biblenow-beige mb-1">Gender</label>
        <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <label htmlFor="male">Male</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <label htmlFor="female">Female</label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <label className="block text-sm text-biblenow-beige">Password</label>
        <input type="password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm text-biblenow-beige">Confirm Password</label>
        <input type="password" className="auth-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox checked={ageVerified} onCheckedChange={(c) => setAgeVerified(c === true)} />
        <label className="text-sm">I am at least 13 years old</label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox checked={agreedToTerms} onCheckedChange={(c) => setAgreedToTerms(c === true)} />
        <label className="text-sm">
          I agree to the <a href="https://terms.biblenow.io" className="text-blue-600 underline">Terms</a> and <a href="https://policy.biblenow.io" className="text-blue-600 underline">Privacy Policy</a>
        </label>
      </div>

      <div className="mt-4">
        <HCaptcha
          sitekey={import.meta.env.VITE_HCAPTCHA_SITEKEY ?? ''}
          onVerify={(token) => setCaptchaToken(token)}
          ref={captchaRef}
        />
      </div>

      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </form>
  );
};

export default SignUpForm;
