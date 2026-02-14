// File: src/pages/SignIn.tsx
import React from 'react';
import AuthLayout from '@/components/AuthLayout';
import SignInForm from '@/components/SignInForm';

const SignIn: React.FC = () => {
  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-center mb-6 text-biblenow-gold">Welcome Back</h1>
      <SignInForm onToggleForm={() => {}} />
    </AuthLayout>
  );
};

export default SignIn;
