
// File: src/pages/SignUp.tsx
import React from 'react';
import AuthLayout from '@/components/AuthLayout';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUp: React.FC = () => {
  // Create a no-op function for the onToggleForm prop
  const handleToggleForm = () => {
    // This is a placeholder since this page doesn't actually toggle to sign in
  };
  
  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-center mb-6 text-biblenow-gold">Create Your Account</h1>
      <SignUpForm onToggleForm={handleToggleForm} />
    </AuthLayout>
  );
};

export default SignUp;
