'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { reportContent } from '@/shared/services/supabase';

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam or misleading content' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'hate_speech', label: 'Hate speech or discrimination' },
  { value: 'violence', label: 'Violence or graphic content' },
  { value: 'inappropriate', label: 'Sexually inappropriate content' },
  { value: 'false_info', label: 'False information' },
  { value: 'copyright', label: 'Copyright violation' },
  { value: 'other', label: 'Other' },
];

export function ReportContentModal({ isOpen, onClose }: ReportContentModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    reason: '',
    details: '',
    contentUrl: '',
    contentType: 'post', // post, comment, user, group, etc.
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reason) {
      setError('Please select a reason for reporting');
      return;
    }

    if (!formData.details.trim()) {
      setError('Please provide additional details');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await reportContent({
        reason_key: formData.reason,
        custom_reason: formData.details,
        report_url: formData.contentUrl || undefined,
        content_type: formData.contentType,
        additional_notes: formData.details,
      });
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            reason: '',
            details: '',
            contentUrl: '',
            contentType: 'post',
          });
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit report. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Report Content
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <span className="sr-only">Close</span>
              <span className="text-2xl">×</span>
            </button>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Report Submitted!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Thank you for helping keep BibleNOW safe. We'll review your report and take appropriate action.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Content Type */}
              <div>
                <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  What are you reporting?
                </label>
                <select
                  id="contentType"
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                  disabled={isSubmitting}
                >
                  <option value="post">Post</option>
                  <option value="comment">Comment</option>
                  <option value="user">User Profile</option>
                  <option value="group">Group</option>
                  <option value="livestream">Livestream</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Content URL (Optional) */}
              <div>
                <label htmlFor="contentUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content URL (Optional)
                </label>
                <input
                  type="url"
                  id="contentUrl"
                  name="contentUrl"
                  value={formData.contentUrl}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Paste the URL of the content you're reporting"
                  disabled={isSubmitting}
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Why are you reporting this content?
                </label>
                <div className="space-y-2">
                  {REPORT_REASONS.map((reason) => (
                    <label key={reason.value} className="flex items-start">
                      <input
                        type="radio"
                        name="reason"
                        value={reason.value}
                        checked={formData.reason === reason.value}
                        onChange={handleInputChange}
                        className="mt-1 mr-3"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {reason.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  className="input w-full h-24 resize-none"
                  placeholder="Please provide more details about why you're reporting this content..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="text-error text-sm">{error}</div>
              )}

              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
                <p className="text-sm text-primary-800 dark:text-primary-200">
                  <strong>Note:</strong> Reports are reviewed by our moderation team. 
                  False reports may result in account restrictions.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-error hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
