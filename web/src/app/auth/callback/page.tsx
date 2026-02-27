'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/shared/services/supabase';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!data.session) throw new Error('No session found after authentication');

        const redirectTo = searchParams?.get('redirectTo');
        const destination = redirectTo ? decodeURIComponent(redirectTo) : '/app';
        if (destination.startsWith('/')) {
          router.replace(destination);
        } else {
          window.location.href = destination;
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Authentication error');
      }
    };
    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-biblenow-brown">
        <div className="auth-card w-full max-w-md p-6">
          <h1 className="text-2xl font-serif font-semibold text-biblenow-beige mb-4">Authentication Error</h1>
          <p className="text-biblenow-beige/60 mb-6">{error}</p>
          <a href="/auth" className="auth-btn-primary w-full block text-center py-2 rounded-md">
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-biblenow-brown">
      <div className="auth-card w-full max-w-md p-6 flex flex-col items-center">
        <h1 className="text-2xl font-serif font-semibold text-biblenow-beige mb-4">Completing Sign In</h1>
        <div className="w-16 h-16 border-4 border-biblenow-gold/30 border-t-biblenow-gold rounded-full animate-spin my-8" />
        <p className="text-biblenow-beige/60">Please wait...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-biblenow-brown">
        <div className="w-16 h-16 border-4 border-biblenow-gold/30 border-t-biblenow-gold rounded-full animate-spin" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
