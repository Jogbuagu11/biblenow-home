import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const TwoFactorSetup: React.FC = () => {
  const [contact, setContact] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [expectedCode, setExpectedCode] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const sendCode = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      toast({ title: 'Error', description: 'Unable to retrieve user.' });
      return;
    }

    const isEmail = contact.includes('@');
    const functionName = isEmail ? 'send-verification-code' : 'send-2fa-sms';

    const { data, error: funcError } = await supabase.functions.invoke(functionName, {
      body: {
        user_id: user.id,
        ...(isEmail ? { email: contact } : { phone_number: contact }),
      },
    });

    if (funcError || !data?.verification_code) {
      toast({ title: 'Error', description: 'Failed to send verification code.' });
      return;
    }

    setExpectedCode(data.verification_code);
    setStep('verify');
    toast({ title: 'Code Sent', description: `Check your ${isEmail ? 'email' : 'phone'}` });
  };

  const verifyCode = async () => {
    if (code !== expectedCode) {
      toast({ title: 'Error', description: 'Invalid verification code.' });
      return;
    }

    const update = await supabase.auth.updateUser({
      data: { has_completed_2fa: true },
    });

    if (update.error) {
      toast({ title: 'Error', description: 'Failed to enable 2FA.' });
      return;
    }

    toast({ title: 'Success', description: 'Two-Factor Authentication enabled.' });
    window.location.href = 'https://studio.biblenow.io/dashboard';
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {step === 'input' ? (
        <>
          <h2 className="text-xl font-bold mb-4 text-biblebrown-900">Set Up 2FA</h2>
          <p className="mb-4 text-biblebrown-700">Enter your phone number or email to receive a verification code.</p>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            placeholder="+1 555 123 4567 or your@email.com"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <Button className="w-full" onClick={sendCode}>
            Send Verification Code
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4 text-biblebrown-900">Verify Your Code</h2>
          <p className="mb-4 text-biblebrown-700">Enter the 6-digit code sent to your {contact.includes('@') ? 'email' : 'phone'}.</p>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4 text-center text-xl tracking-widest"
            placeholder="123456"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button className="w-full" onClick={verifyCode}>
            Verify Code
          </Button>
        </>
      )}
    </div>
  );
};

export default TwoFactorSetup;
