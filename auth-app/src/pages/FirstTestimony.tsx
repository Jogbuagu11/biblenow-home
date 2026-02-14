import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const FirstTestimony: React.FC = () => {
  const [testimony, setTestimony] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast({ title: 'Error', description: 'User not authenticated' });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ testimony, has_completed_profile: true })
      .eq('id', user.id);

    if (error) {
      toast({ title: 'Error', description: error.message });
    } else {
      toast({ title: 'Saved', description: 'Your testimony has been saved.' });
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-md shadow">
      <h1 className="text-xl font-bold mb-4 text-biblebrown-900">Share Your Testimony</h1>
      <textarea
        value={testimony}
        onChange={(e) => setTestimony(e.target.value)}
        placeholder="How did you come to know the Lord?"
        rows={6}
        className="w-full border rounded-md p-3 text-biblebrown-800"
      />
      <button
        onClick={handleSave}
        disabled={loading}
        className="auth-btn-primary mt-4 w-full"
      >
        {loading ? 'Saving...' : 'Save and Continue'}
      </button>
    </div>
  );
};

export default FirstTestimony;
