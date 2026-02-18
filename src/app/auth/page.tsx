'use client';

import { Suspense, useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthSignInForm from '@/components/auth/AuthSignInForm';
import AuthSignUpForm from '@/components/auth/AuthSignUpForm';

function AuthPageContent() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <AuthLayout>
      <div className="mb-6">
        <div
          className="w-full border border-biblenow-gold/30 rounded-md overflow-hidden flex"
          role="tablist"
        >
          <button
            type="button"
            onClick={() => setIsSignIn(true)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              isSignIn
                ? 'bg-biblenow-gold/20 text-biblenow-gold'
                : 'text-biblenow-beige/70 hover:text-biblenow-beige'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignIn(false)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              !isSignIn
                ? 'bg-biblenow-gold/20 text-biblenow-gold'
                : 'text-biblenow-beige/70 hover:text-biblenow-beige'
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      {isSignIn ? (
        <AuthSignInForm onToggleForm={() => setIsSignIn(false)} />
      ) : (
        <AuthSignUpForm onToggleForm={() => setIsSignIn(true)} />
      )}
    </AuthLayout>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-biblenow-brown">
        <div className="w-16 h-16 border-4 border-biblenow-gold/30 border-t-biblenow-gold rounded-full animate-spin" />
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
