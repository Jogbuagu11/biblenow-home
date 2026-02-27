'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { sendInvite } from '@/shared/services/supabase';

interface InviteUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteUsersModal({ isOpen, onClose }: InviteUsersModalProps) {
  const { user } = useAuth();
  const [inviteMethod, setInviteMethod] = useState<'email' | 'link'>('email');
  const [emailAddresses, setEmailAddresses] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const handleEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailAddresses.trim()) {
      setError('Please enter at least one email address');
      return;
    }

    const emails = emailAddresses.split(',').map(email => email.trim()).filter(email => email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    for (const email of emails) {
      if (!emailRegex.test(email)) {
        setError(`Invalid email address: ${email}`);
        return;
      }
    }

    setIsInviting(true);
    setError(null);

    try {
      // Send invites to each email address
      const results = await Promise.allSettled(
        emails.map(email => sendInvite(email, customMessage))
      );

      const failedEmails = [];
      const successfulEmails = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          successfulEmails.push(emails[index]);
        } else {
          failedEmails.push(emails[index]);
        }
      });

      if (successfulEmails.length > 0) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setEmailAddresses('');
          setCustomMessage('');
        }, 2000);
      } else {
        setError('Failed to send invites. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  const handleLinkInvite = () => {
    // Generate invite link
    const baseUrl = window.location.origin;
    const inviteCode = `invite_${user?.id}_${Date.now()}`;
    const link = `${baseUrl}/auth/signup?invite=${inviteCode}`;
    
    setInviteLink(link);
    setSuccess(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      // TODO: Show success toast
      console.log('Link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Invite Users
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
                {inviteMethod === 'email' ? 'Invites Sent!' : 'Invite Link Created!'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {inviteMethod === 'email' 
                  ? 'Your friends will receive an invitation email shortly.'
                  : 'Share this link with your friends to invite them to BibleNOW.'
                }
              </p>
              {inviteMethod === 'link' && inviteLink && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="input flex-1 text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 text-sm rounded-lg font-medium transition-colors duration-200"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Invite Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Invite Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="email"
                      checked={inviteMethod === 'email'}
                      onChange={(e) => setInviteMethod(e.target.value as 'email')}
                      className="mr-3"
                    />
                    <span className="text-gray-900 dark:text-gray-100">Send Email Invites</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="link"
                      checked={inviteMethod === 'link'}
                      onChange={(e) => setInviteMethod(e.target.value as 'link')}
                      className="mr-3"
                    />
                    <span className="text-gray-900 dark:text-gray-100">Generate Invite Link</span>
                  </label>
                </div>
              </div>

              {inviteMethod === 'email' ? (
                <form onSubmit={handleEmailInvite} className="space-y-4">
                  {/* Email Addresses */}
                  <div>
                    <label htmlFor="emailAddresses" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Addresses
                    </label>
                    <textarea
                      id="emailAddresses"
                      value={emailAddresses}
                      onChange={(e) => setEmailAddresses(e.target.value)}
                      className="input w-full h-20 resize-none"
                      placeholder="Enter email addresses separated by commas"
                      required
                      disabled={isInviting}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Separate multiple emails with commas
                    </p>
                  </div>

                  {/* Custom Message */}
                  <div>
                    <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Custom Message (Optional)
                    </label>
                    <textarea
                      id="customMessage"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="input w-full h-20 resize-none"
                      placeholder="Add a personal message to your invitation"
                      disabled={isInviting}
                    />
                  </div>

                  {error && (
                    <div className="text-error text-sm">{error}</div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                      disabled={isInviting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                      disabled={isInviting}
                    >
                      {isInviting ? 'Sending...' : 'Send Invites'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Generate a unique invite link that you can share with your friends. 
                      They can use this link to sign up and join BibleNOW.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLinkInvite}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Generate Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
