import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CreditCard, 
  Download, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Clock,
  X,
  Eye,
  User,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { formatCurrency } from '../../utils/formatters';

interface Subscription {
  id: string;
  stripeSubscriptionId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  price: {
    amount: number;
    currency: string;
    interval: string;
    intervalCount: number;
  };
  product: {
    name: string;
    description?: string;
  };
}

interface Invoice {
  id: string;
  stripeInvoiceId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt?: string;
  dueDate?: string;
  invoiceNumber: string;
  invoiceUrl?: string;
}

interface SpendingData {
  totalSpent: number;
  monthlySpending: Array<{
    month: string;
    amount: number;
    subscriptions: number;
    oneTime: number;
  }>;
  activeSubscriptions: number;
  upcomingPayments: Array<{
    amount: number;
    currency: string;
    dueDate: string;
    description: string;
  }>;
  recentTransactions: Array<{
    id: string;
    amount: number;
    currency: string;
    description: string;
    date: string;
    status: string;
  }>;
}

export const MySubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [spending, setSpending] = useState<SpendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingSubscription, setCancelingSubscription] = useState<string | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'invoices' | 'spending'>('subscriptions');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subscriptionsRes, invoicesRes, spendingRes] = await Promise.all([
        apiClient.get('/api/stripe/subscriptions'),
        apiClient.get('/api/stripe/invoices'),
        apiClient.get('/api/stripe/spending')
      ]);

      if (subscriptionsRes.data.success) {
        setSubscriptions(subscriptionsRes.data.data);
      }
      if (invoicesRes.data.success) {
        setInvoices(invoicesRes.data.data);
      }
      if (spendingRes.data.success) {
        setSpending(spendingRes.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string, immediately: boolean = false) => {
    if (!confirm(`Are you sure you want to ${immediately ? 'immediately cancel' : 'cancel at period end'} this subscription?`)) {
      return;
    }

    setCancelingSubscription(subscriptionId);
    try {
      const response = await apiClient.post(`/api/stripe/subscriptions/${subscriptionId}/cancel`, {
        immediately
      });

      if (response.data.success) {
        await loadData();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cancel subscription');
    } finally {
      setCancelingSubscription(null);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    setDownloadingInvoice(invoiceId);
    try {
      const response = await apiClient.get(`/api/stripe/invoices/${invoiceId}/download`);
      
      if (response.data.success) {
        window.open(response.data.data.url, '_blank');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to download invoice');
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'canceled':
        return <X className="w-5 h-5 text-red-500" />;
      case 'past_due':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'incomplete':
        return <Clock className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'canceled': return 'Canceled';
      case 'past_due': return 'Past Due';
      case 'incomplete': return 'Incomplete';
      case 'unpaid': return 'Unpaid';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">Loading subscription data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Subscriptions
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your subscriptions, view invoices, and track your spending
        </p>
      </div>

      {spending && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(spending.totalSpent, 'USD')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {spending.activeSubscriptions}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(
                    spending.monthlySpending[0]?.amount || 0,
                    'USD'
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {spending.upcomingPayments.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'subscriptions', label: 'Subscriptions', count: subscriptions.length },
            { key: 'invoices', label: 'Invoices', count: invoices.length },
            { key: 'spending', label: 'Spending Analytics', count: null }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Subscriptions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                You don't have any active subscriptions yet.
              </p>
            </div>
          ) : (
            subscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={subscription.creator.avatar || '/images/default-avatar.png'}
                      alt={subscription.creator.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {subscription.creator.displayName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        @{subscription.creator.username}
                      </p>
                      <div className="flex items-center mt-2">
                        {getStatusIcon(subscription.status)}
                        <span className="ml-2 text-sm font-medium">
                          {getStatusText(subscription.status)}
                        </span>
                        {subscription.cancelAtPeriodEnd && (
                          <span className="ml-3 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                            Canceling at period end
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(subscription.price.amount, subscription.price.currency)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      per {subscription.price.interval}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Current Period</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(subscription.currentPeriodStart).toLocaleDateString()} - 
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">Trial Ends</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(subscription.trialEnd).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Next Billing</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {subscription.cancelAtPeriodEnd ? 'Will not renew' : new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => handleCancelSubscription(subscription.id, false)}
                      disabled={cancelingSubscription === subscription.id}
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                      {cancelingSubscription === subscription.id ? 'Canceling...' : 'Cancel at Period End'}
                    </button>
                    <button
                      onClick={() => handleCancelSubscription(subscription.id, true)}
                      disabled={cancelingSubscription === subscription.id}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {cancelingSubscription === subscription.id ? 'Canceling...' : 'Cancel Immediately'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Invoices</h3>
              <p className="text-gray-600 dark:text-gray-300">
                You don't have any invoices yet.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {invoice.invoiceNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : invoice.status === 'open'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {invoice.paidAt 
                            ? new Date(invoice.paidAt).toLocaleDateString()
                            : invoice.dueDate 
                            ? new Date(invoice.dueDate).toLocaleDateString()
                            : '-'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            disabled={downloadingInvoice === invoice.id}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                          >
                            {downloadingInvoice === invoice.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                            ) : (
                              <Download className="w-3 h-3 mr-1" />
                            )}
                            Download
                          </button>
                          {invoice.invoiceUrl && (
                            <button
                              onClick={() => window.open(invoice.invoiceUrl, '_blank')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'spending' && spending && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Monthly Spending
            </h3>
            <div className="space-y-4">
              {spending.monthlySpending.slice(0, 6).map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(month.month + '-01').toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(month.amount, 'USD')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (month.amount / Math.max(...spending.monthlySpending.map(m => m.amount))) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {spending.upcomingPayments.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Payments
              </h3>
              <div className="space-y-3">
                {spending.upcomingPayments.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {payment.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Due: {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Transactions
            </h3>
            <div className="space-y-3">
              {spending.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubscriptions;
