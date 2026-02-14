
import React from "react";
import AuthLayout from "@/components/AuthLayout";

const CheckEmail: React.FC = () => (
  <AuthLayout>
    <div className="flex flex-col items-center justify-center space-y-6 px-4 py-8">
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="text-biblenow-gold mb-2">
        <rect width="24" height="24" rx="12" fill="currentColor" fillOpacity="0.1"/>
        <path stroke="currentColor" strokeWidth="2" d="M4 8.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8.5M4 8.5 12 14l8-5.5M4 8.5 12 14M12 14l8-5.5"/>
      </svg>
      <h1 className="text-2xl font-bold text-biblenow-gold text-center">Confirmation Email Sent</h1>
      <p className="text-center text-biblenow-beige/70">
        Please check your email for a confirmation link. Once you confirm, you can sign in!
      </p>
    </div>
  </AuthLayout>
);

export default CheckEmail;
