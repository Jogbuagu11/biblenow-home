'use client';

import { useEffect, useRef, useState } from 'react';

export default function VerificationCompletePage() {
  const [deepLink, setDeepLink] = useState<string>('biblenow://verification/complete');
  const [showFallback, setShowFallback] = useState(false);
  const redirected = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id') ?? params.get('vi') ?? params.get('verification_session') ?? params.get('id');
    const link = sessionId
      ? `biblenow://verification/complete?session_id=${encodeURIComponent(sessionId)}`
      : 'biblenow://verification/complete';
    setDeepLink(link);
    if (!redirected.current) {
      redirected.current = true;
      window.location.href = link;
    }
    const t = setTimeout(() => {
      if (document.visibilityState !== 'hidden') setShowFallback(true);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(135deg, #221206 0%, #3C2A16 100%)',
        color: 'white',
        margin: 0,
        padding: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 400, padding: '40px 20px' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 20, color: '#FFD700' }}>
          BibleNOW
        </div>
        <div style={{ margin: '20px 0' }}>
          {!showFallback ? (
            <>
              <div
                style={{
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#FFD700',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px',
                }}
              />
              <div style={{ marginBottom: 30, lineHeight: 1.6 }}>Redirecting you back to the app...</div>
            </>
          ) : (
            <div style={{ color: '#FFD700', marginBottom: 30 }}>
              <strong>Redirect failed</strong>
              <br />
              Please tap the button below to return to the BibleNOW app.
            </div>
          )}
        </div>
        <div style={{ marginBottom: 30, lineHeight: 1.6 }}>
          {!showFallback &&
            'If you\'re not automatically redirected, please tap the button below to return to the BibleNOW app.'}
        </div>
        <a
          href={deepLink}
          style={{
            background: '#FFD700',
            color: '#221206',
            padding: '15px 30px',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block',
            margin: 10,
          }}
        >
          Return to BibleNOW
        </a>
        <div style={{ fontSize: 14, opacity: 0.8, marginTop: 30 }}>
          If you&apos;re having trouble, please close this page and return to the BibleNOW app manually.
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { to { transform: rotate(360deg); } }' }} />
    </div>
  );
}
