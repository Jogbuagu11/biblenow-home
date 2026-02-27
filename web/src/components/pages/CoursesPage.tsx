'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { Layout } from '@/components/layout/Layout';
import { getPublicCourses, type Course } from '@/shared/services/supabase';
import Link from 'next/link';
import { VerifiedBadgeInline } from '@/components/ui/VerifiedBadge';

export function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicCourses({ limit: 48 })
      .then(setCourses)
      .catch((err) => setError(err?.message ?? 'Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50 dark:bg-dark-600/30">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">
            Learn from verified creators. Browse and enroll in courses.
          </p>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="animate-spin w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          )}

          {!loading && error && (
            <div className="bg-white dark:bg-dark-300 rounded-2xl border border-gray-200 dark:border-dark-200 p-8 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  getPublicCourses({ limit: 48 }).then(setCourses).catch((e) => setError(e?.message ?? 'Error')).finally(() => setLoading(false));
                }}
                className="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && courses.length === 0 && (
            <div className="bg-white dark:bg-dark-300 rounded-2xl border border-gray-200 dark:border-dark-200 p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary-100/80 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4 text-4xl">
                📚
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No courses yet</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                When verified creators publish courses, they’ll show up here.
              </p>
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group bg-white dark:bg-dark-300 rounded-2xl border border-gray-200 dark:border-dark-200 overflow-hidden hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                >
                  <div className="aspect-video bg-gray-100 dark:bg-dark-700 relative">
                    {course.cover_photo_url ? (
                      <img
                        src={course.cover_photo_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 dark:text-gray-500">
                        📖
                      </div>
                    )}
                    {!course.is_free && (
                      <span className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                        {course.price_shekelz} Shekelz
                      </span>
                    )}
                    {course.is_free && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                        Free
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {course.title}
                    </h2>
                    {course.instructor && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        {course.instructor}
                        <VerifiedBadgeInline className="shrink-0" />
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {course.enrollments_count} enrolled
                      {course.category ? ` · ${course.category}` : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
