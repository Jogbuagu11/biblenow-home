import { Layout } from '@/components/layout/Layout';
import { getCourseById } from '@/shared/services/supabase';
import Link from 'next/link';
import { VerifiedBadgeInline } from '@/components/ui/VerifiedBadge';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  const course = courseId ? await getCourseById(courseId) : null;

  if (!course) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Course not found or not available.</p>
          <Link href="/courses" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Back to Courses
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <Link href="/courses" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 inline-block">
          ← Back to Courses
        </Link>
        <div className="bg-white dark:bg-dark-300 rounded-2xl border border-gray-200 dark:border-dark-200 overflow-hidden">
          <div className="aspect-video bg-gray-100 dark:bg-dark-700">
            {course.cover_photo_url ? (
              <img src={course.cover_photo_url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">📖</div>
            )}
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{course.title}</h1>
            {course.instructor && (
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                {course.instructor}
                <VerifiedBadgeInline />
              </p>
            )}
            <div className="flex gap-4 mt-4 text-sm">
              {course.is_free ? (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-lg font-medium">Free</span>
              ) : (
                <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-lg font-medium">{course.price_shekelz} Shekelz</span>
              )}
              <span className="text-gray-500 dark:text-gray-400">{course.enrollments_count} enrolled</span>
              {course.category && <span className="text-gray-500 dark:text-gray-400">{course.category}</span>}
            </div>
            {course.description && (
              <div className="mt-6 prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{course.description}</p>
              </div>
            )}
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              Full course experience and enrollment are available in the BibleNOW mobile app.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
