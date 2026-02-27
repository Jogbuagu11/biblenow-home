import { ProfilePage } from '@/components/pages/ProfilePage';

interface ProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserProfilePage({ params }: ProfilePageProps) {
  try {
    const { userId } = await params;
    
    if (!userId) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Invalid Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The profile ID is missing or invalid.
            </p>
          </div>
        </div>
      );
    }
    
    return <ProfilePage userId={userId} />;
  } catch (error) {
    console.error('Error in UserProfilePage:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Error Loading Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            There was an error loading the profile page.
          </p>
        </div>
      </div>
    );
  }
}
