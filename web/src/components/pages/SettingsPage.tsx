'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { ChangePasswordModal } from '@/components/modals/ChangePasswordModal';
import { UpdateEmailModal } from '@/components/modals/UpdateEmailModal';
import { InviteUsersModal } from '@/components/modals/InviteUsersModal';
import { ReportContentModal } from '@/components/modals/ReportContentModal';
import { CreateSupportTicketModal } from '@/components/modals/CreateSupportTicketModal';
import { SupportTicketHistoryModal } from '@/components/modals/SupportTicketHistoryModal';
import { BuyShekelzModal } from '@/components/modals/BuyShekelzModal';

export function SettingsPage() {
  const { user, signOut, isVerified } = useAuth();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [modals, setModals] = useState({
    changePassword: false,
    updateEmail: false,
    inviteUsers: false,
    reportContent: false,
    createSupportTicket: false,
    supportTicketHistory: false,
    buyShekelz: false,
  });

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    setIsDeletingAccount(true);
    try {
      // TODO: Implement account deletion
      console.log('Account deletion not implemented yet');
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleBuyShekelz = () => {
    setModals(prev => ({ ...prev, buyShekelz: true }));
  };

  const handleInviteUser = () => {
    setModals(prev => ({ ...prev, inviteUsers: true }));
  };

  const handleAdDashboard = () => {
    // TODO: Implement ad dashboard
    console.log('Ad dashboard not implemented yet');
  };

  const handleChangePassword = () => {
    setModals(prev => ({ ...prev, changePassword: true }));
  };

  const handleUpdateEmail = () => {
    setModals(prev => ({ ...prev, updateEmail: true }));
  };

  const handleReportContent = () => {
    setModals(prev => ({ ...prev, reportContent: true }));
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  const handleCreateSupportTicket = () => {
    setModals(prev => ({ ...prev, createSupportTicket: true }));
  };

  const handleViewTicketHistory = () => {
    setModals(prev => ({ ...prev, supportTicketHistory: true }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-primary-50 dark:bg-dark-500">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="space-y-8">
            {/* Appearance Section */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Appearance
              </h2>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Change app appearance
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={(e) => setIsDarkMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>


            {/* Shekel Wallet Section */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Shekel Wallet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Purchase Shekelz to access premium features and content.
              </p>
              <button
                onClick={handleBuyShekelz}
                className="btn-primary flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Buy Shekelz</span>
              </button>
            </div>

            {/* Invite Users Section */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Invite Users
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Invite your friends to join you here on BibleNOW
              </p>
              <button
                onClick={handleInviteUser}
                className="btn-primary flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span>Invite User</span>
              </button>
            </div>

            {/* Ad Dashboard Section (Verified users only) */}
            {isVerified && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Ad Dashboard
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create and manage your advertisements
                </p>
                <button
                  onClick={handleAdDashboard}
                  className="bg-[#E1AB31] hover:bg-[#D4A574] text-black px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>Ad Dashboard</span>
                </button>
              </div>
            )}

            {/* Security Section */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Security
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleChangePassword}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Change Password
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </button>
                
                <button
                  onClick={handleUpdateEmail}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Update Email
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Report Content Section */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Report Content
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                See something inappropriate? Report content that violates our community guidelines.
              </p>
              <button
                onClick={handleReportContent}
                className="bg-[#754814] hover:bg-[#8B5A2B] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Report Content</span>
              </button>
            </div>

            {/* Support Section */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Support
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Need help? Create a support ticket and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleCreateSupportTicket}
                  className="w-1/2 bg-[#2E7D32] hover:bg-[#388E3C] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>Create Support Ticket</span>
                </button>
                
                <button
                  onClick={handleViewTicketHistory}
                  className="w-1/2 border border-gray-300 dark:border-dark-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-dark-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                  </svg>
                  <span>View Ticket History</span>
                </button>
              </div>
            </div>

            {/* Danger Zone Section */}
            <div className="card p-6 border-red-200 dark:border-red-800">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
                Danger Zone
              </h2>
              
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="w-1/2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isDeletingAccount ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Deleting Account...</span>
                  </>
                ) : (
                  <span>Delete Account</span>
                )}
              </button>
            </div>

            {/* Logout Section */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Logout
              </h2>
              
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-1/2 bg-[#754814] hover:bg-[#8B5A2B] disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isSigningOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing Out...</span>
                  </>
                ) : (
                  <span>Sign Out</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={modals.changePassword}
        onClose={() => closeModal('changePassword')}
      />
      
      <UpdateEmailModal
        isOpen={modals.updateEmail}
        onClose={() => closeModal('updateEmail')}
      />
      
      <InviteUsersModal
        isOpen={modals.inviteUsers}
        onClose={() => closeModal('inviteUsers')}
      />
      
      <ReportContentModal
        isOpen={modals.reportContent}
        onClose={() => closeModal('reportContent')}
      />
      
      <CreateSupportTicketModal
        isOpen={modals.createSupportTicket}
        onClose={() => closeModal('createSupportTicket')}
      />
      
      <SupportTicketHistoryModal
        isOpen={modals.supportTicketHistory}
        onClose={() => closeModal('supportTicketHistory')}
      />
      
      <BuyShekelzModal
        isOpen={modals.buyShekelz}
        onClose={() => closeModal('buyShekelz')}
      />
    </Layout>
  );
}
