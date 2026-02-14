'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { updateEmail } from '@/shared/services/supabase';

interface UpdateEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateEmailModal({ isOpen, onClose }: UpdateEmailModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    newEmail: '',
    currentPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.newEmail || !formData.currentPassword) {
      setError('All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.newEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.newEmail === user?.email) {
      setError('New email must be different from current email');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateEmail(formData.newEmail, formData.currentPassword);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            newEmail: '',
            currentPassword: '',
          });
        }, 2000);
      } else {
        setError(result.error || 'Failed to update email. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Update Email
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
                Email Updated!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your email has been successfully updated. Please check your new email for verification.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Email Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Email
                </label>
                <div className="input bg-gray-50 dark:bg-dark-700 text-gray-500 dark:text-gray-400">
                  {user?.email || 'No email set'}
                </div>
              </div>

              {/* New Email */}
              <div>
                <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Email
                </label>
                <input
                  type="email"
                  id="newEmail"
                  name="newEmail"
                  value={formData.newEmail}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Enter your new email address"
                  required
                  disabled={isUpdating}
                />
              </div>

              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="input pr-10 w-full"
                    placeholder="Enter your current password"
                    required
                    disabled={isUpdating}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <span className="text-gray-400">
                      {showPassword ? '🙈' : '👁️'}
                    </span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-error text-sm">{error}</div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Email'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
