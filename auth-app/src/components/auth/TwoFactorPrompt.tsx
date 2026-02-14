import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, ShieldAlert } from 'lucide-react';

const TwoFactorPrompt: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSetup2FA = () => {
    navigate('/auth/setup-2fa');
  };
  
  const handleSkip2FA = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { twofa_skipped: true }
      });
      
      if (error) {
        toast.error('Error updating user preferences', {
          description: error.message
        });
        return;
      }
      
      toast.success('Preference saved', {
        description: 'You can enable 2FA anytime in your account settings'
      });
      
      // Redirect to studio dashboard
      window.location.href = 'https://studio.biblenow.io/dashboard';
    } catch (err: any) {
      toast.error('An error occurred', {
        description: err.message
      });
    }
  };

  return (
    <div className="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-biblenow-gold/10 text-biblenow-gold mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-serif font-semibold text-biblenow-brown text-center">
          Protect Your Account
        </h2>
        <p className="text-center text-biblenow-brown/80 mt-2">
          Add an extra layer of security to your BibleNOW account with Two-Factor Authentication.
        </p>
      </div>
      
      <div className="bg-biblenow-beige/30 p-4 rounded-md mb-6 border border-biblenow-gold/20">
        <div className="flex items-start">
          <Shield className="text-biblenow-gold mt-1 mr-3 flex-shrink-0" size={20} />
          <p className="text-sm text-biblenow-brown">
            Two-Factor Authentication requires a verification code when you sign in, 
            keeping your account secure even if your password is compromised.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={handleSetup2FA} 
          className="w-full bg-biblenow-gold hover:bg-biblenow-gold/80 text-white"
        >
          Set Up 2FA Now
        </Button>
        <Button 
          onClick={handleSkip2FA} 
          variant="outline" 
          className="w-full border-biblenow-gold/30 text-biblenow-brown hover:bg-biblenow-gold/10"
        >
          Remind Me Later
        </Button>
      </div>
    </div>
  );
};

export default TwoFactorPrompt;
