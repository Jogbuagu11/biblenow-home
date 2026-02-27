'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { getShekelPackages, getShekelBalance, getShekelPurchaseHistory } from '@/shared/services/supabase';

interface BuyShekelzModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShekelPackage {
  id: string;
  name: string;
  shekelz_amount: number;
  price_usd: number;
  bonus_shekelz: number;
  is_active: boolean;
  display_order: number;
}

interface PurchaseHistory {
  id: string;
  shekelz_amount: number;
  total_price_usd: number;
  status: string;
  created_at: string;
}

export function BuyShekelzModal({ isOpen, onClose }: BuyShekelzModalProps) {
  const { user } = useAuth();
  const [packages, setPackages] = useState<ShekelPackage[]>([]);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [processingPackage, setProcessingPackage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'packages' | 'history'>('packages');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadData();
    } else {
      // Reset state when modal closes
      setPackages([]);
      setCurrentBalance(0);
      setPurchaseHistory([]);
      setIsLoading(true);
      setError(null);
      setActiveTab('packages');
    }
  }, [isOpen, user]);

  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [packagesData, balance, history] = await Promise.all([
        getShekelPackages(),
        getShekelBalance(user.id),
        getShekelPurchaseHistory(user.id, 10)
      ]);

      setPackages(packagesData);
      setCurrentBalance(balance);
      setPurchaseHistory(history);
    } catch (err) {
      setError('Failed to load shekel data');
      console.error('Error loading shekel data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPurchaseHistory = async () => {
    if (!user) return;
    
    setIsLoadingHistory(true);
    try {
      const history = await getShekelPurchaseHistory(user.id, 20);
      setPurchaseHistory(history);
    } catch (err) {
      setError('Failed to load purchase history');
      console.error('Error loading purchase history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handlePurchase = async (pkg: ShekelPackage) => {
    if (!user || processingPackage) return;

    setProcessingPackage(pkg.id);
    setError(null);

    try {
      // For now, we'll simulate a purchase process
      // In a real implementation, this would integrate with Stripe or another payment processor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh balance and history after purchase
      await loadData();
      
      // Show success message
      alert(`Purchase successful! You've added ${pkg.shekelz_amount + pkg.bonus_shekelz} Shekels to your account.`);
      
    } catch (err) {
      setError('Failed to process purchase. Please try again.');
      console.error('Error processing purchase:', err);
    } finally {
      setProcessingPackage(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Buy Shekelz</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {/* Current Balance */}
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">💰</div>
              <div>
                <div className="text-sm text-primary-800 dark:text-primary-200">Current Balance</div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {currentBalance.toLocaleString()} Shekels
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-dark-700 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'packages'
                  ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Packages
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                if (purchaseHistory.length === 0) {
                  loadPurchaseHistory();
                }
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Purchase History
            </button>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">💰</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {pkg.name}
                        </h3>
                        
                        <div className="mb-3">
                          <div className="text-2xl font-bold text-primary-500">
                            {pkg.shekelz_amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Shekels
                          </div>
                        </div>

                        {pkg.bonus_shekelz > 0 && (
                          <div className="bg-success/10 text-success text-sm px-2 py-1 rounded-full mb-3">
                            +{pkg.bonus_shekelz} Bonus Shekels
                          </div>
                        )}

                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                          {formatPrice(pkg.price_usd)}
                        </div>

                        <button
                          onClick={() => handlePurchase(pkg)}
                          disabled={processingPackage === pkg.id}
                          className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                        >
                          {processingPackage === pkg.id ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            'Purchase'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Purchase History Tab */}
          {activeTab === 'history' && (
            <div>
              {isLoadingHistory ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
              ) : purchaseHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">📋</div>
                  <p className="text-gray-600 dark:text-gray-400">No purchase history found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {purchaseHistory.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">💰</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {purchase.shekelz_amount.toLocaleString()} Shekels
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {formatDate(purchase.created_at)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatPrice(purchase.total_price_usd)}
                          </div>
                          <div className={`text-sm px-2 py-1 rounded-full ${
                            purchase.status === 'completed' 
                              ? 'bg-success/10 text-success' 
                              : 'bg-warning/10 text-warning'
                          }`}>
                            {purchase.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg mt-6">
            <p className="text-sm text-primary-800 dark:text-primary-200">
              <strong>Note:</strong> Shekels are used to access premium features, send tips to creators, 
              and unlock exclusive content. All purchases are processed securely and your balance 
              is updated immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

