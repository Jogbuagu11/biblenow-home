import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { safeRedirect } from "@/utils/redirectUtils";

const EmailConfirmed: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for redirect parameter and redirect after a short delay
    const redirectUrl = searchParams.get('redirectTo');
    
    if (redirectUrl) {
      // Redirect after 3 seconds to allow user to see the confirmation message
      const timer = setTimeout(() => {
        safeRedirect(redirectUrl);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const redirectUrl = searchParams.get('redirectTo');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-biblenow-brown">
      <div className="auth-card w-full max-w-md p-8 flex flex-col items-center">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="text-biblenow-gold mb-4">
          <rect width="24" height="24" rx="12" fill="currentColor" fillOpacity="0.1"/>
          <path stroke="currentColor" strokeWidth="2" d="M4 8.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8.5M4 8.5 12 14l8-5.5M4 8.5 12 14M12 14l8-5.5"/>
        </svg>
        <h1 className="text-2xl font-bold text-biblenow-gold text-center mb-4">Your Email has been Confirmed</h1>
        <p className="text-center text-biblenow-beige/70 mb-8">
          {redirectUrl 
            ? "You will be redirected to your destination shortly..."
            : "You may now close this window."
          }
        </p>
        {redirectUrl && (
          <button
            onClick={() => safeRedirect(redirectUrl)}
            className="auth-btn-primary"
          >
            Continue Now
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmed;
