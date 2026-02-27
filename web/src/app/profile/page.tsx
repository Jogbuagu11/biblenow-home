import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/shared/services/supabase';

export default async function ProfilePage() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      redirect('/auth');
    }
    
    // Redirect to the user's own profile
    redirect(`/profile/${user.id}`);
  } catch (error) {
    console.error('Error getting current user:', error);
    redirect('/auth');
  }
}
