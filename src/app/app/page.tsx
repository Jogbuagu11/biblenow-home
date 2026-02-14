import { Suspense } from 'react';
import { HomePage } from '@/components/pages/HomePage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AppHome() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomePage />
    </Suspense>
  );
}

