
// File: src/pages/Auth.tsx
import React, { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const Auth: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <ToggleGroup
          type="single"
          value={isSignIn ? 'signin' : 'signup'}
          onValueChange={(value) => {
            if (value) setIsSignIn(value === 'signin');
          }}
          className="w-full border border-biblenow-gold/30 rounded-md overflow-hidden"
        >
          <ToggleGroupItem
            value="signin"
            className="w-1/2 py-2 data-[state=on]:bg-biblenow-gold/20 data-[state=on]:text-biblenow-gold"
          >
            Sign In
          </ToggleGroupItem>
          <ToggleGroupItem
            value="signup"
            className="w-1/2 py-2 data-[state=on]:bg-biblenow-gold/20 data-[state=on]:text-biblenow-gold"
          >
            Create Account
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {isSignIn ? (
        <SignInForm onToggleForm={toggleForm} />
      ) : (
        <SignUpForm onToggleForm={toggleForm} />
      )}
    </AuthLayout>
  );
};

export default Auth;
