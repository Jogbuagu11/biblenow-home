'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';

interface SupportTicketHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: keyof typeof PRIORITY_COLORS;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  description: string;
  response?: string;
  response_date?: string;
}

const STATUS_COLORS = {
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function SupportTicketHistoryModal({ isOpen, onClose }: SupportTicketHistoryModalProps) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTickets();
    }
  }, [isOpen]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement support ticket fetching with Supabase
      console.log('Loading support tickets for user:', user?.id);

      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTickets: SupportTicket[] = [
        {
          id: 'TKT-001',
          subject: 'Login issues on mobile app',
          category: 'technical',
          priority: 'high',
          status: 'resolved',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-16T14:20:00Z',
          description: 'Unable to login to the mobile app. Getting error message "Invalid credentials" even though password is correct.',
          response: 'Thank you for reporting this issue. We have identified and fixed the authentication bug. Please try logging in again and let us know if you continue to experience issues.',
          response_date: '2024-01-16T14:20:00Z',
        },
        {
          id: 'TKT-002',
          subject: 'Feature request: Dark mode toggle',
          category: 'feature_request',
          priority: 'medium',
          status: 'in_progress',
          created_at: '2024-01-20T09:15:00Z',
          updated_at: '2024-01-22T11:45:00Z',
          description: 'Would love to see a dark mode toggle in the settings. The current light theme is too bright for evening use.',
          response: 'Thank you for your suggestion! We are currently working on implementing dark mode support. This feature is planned for our next major update.',
          response_date: '2024-01-22T11:45:00Z',
        },
        {
          id: 'TKT-003',
          subject: 'Billing question about subscription',
          category: 'billing',
          priority: 'low',
          status: 'open',
          created_at: '2024-01-25T16:20:00Z',
          updated_at: '2024-01-25T16:20:00Z',
          description: 'I was charged twice for my monthly subscription. Can you please help me understand why this happened?',
        },
      ];

      setTickets(mockTickets);
    } catch (err) {
      setError('Failed to load support tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Support Ticket History
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <span className="sr-only">Close</span>
              <span className="text-2xl">×</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-error mb-4">⚠️</div>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <button
                onClick={loadTickets}
                className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">📋</div>
              <p className="text-gray-600 dark:text-gray-400">No support tickets found.</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Create your first support ticket to get help with any issues.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {ticket.subject}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[ticket.status]}`}>
                          {getStatusLabel(ticket.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[ticket.priority]}`}>
                          {getPriorityLabel(ticket.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {ticket.description.length > 100 
                          ? `${ticket.description.substring(0, 100)}...` 
                          : ticket.description
                        }
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                        <span>ID: {ticket.id}</span>
                        <span>Created: {formatDate(ticket.created_at)}</span>
                        {ticket.updated_at !== ticket.created_at && (
                          <span>Updated: {formatDate(ticket.updated_at)}</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="text-gray-400">›</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ticket Detail Modal */}
          {selectedTicket && (
            <div className="fixed inset-0 z-60 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-dark-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Ticket Details
                    </h3>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <span className="sr-only">Close</span>
                      <span className="text-2xl">×</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {selectedTicket.subject}
                      </h4>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selectedTicket.status]}`}>
                          {getStatusLabel(selectedTicket.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[selectedTicket.priority]}`}>
                          {getPriorityLabel(selectedTicket.priority)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                          ID: {selectedTicket.id}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Description</h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {selectedTicket.description}
                      </p>
                    </div>

                    {selectedTicket.response && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Response</h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {selectedTicket.response}
                        </p>
                        {selectedTicket.response_date && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            Responded: {formatDate(selectedTicket.response_date)}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200 dark:border-dark-600">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-500">Created:</span>
                          <p className="text-gray-900 dark:text-gray-100">{formatDate(selectedTicket.created_at)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-500">Last Updated:</span>
                          <p className="text-gray-900 dark:text-gray-100">{formatDate(selectedTicket.updated_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
