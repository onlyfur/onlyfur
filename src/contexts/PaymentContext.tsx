import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SubscriptionTier,
  Subscription,
  PaymentMethod,
  Transaction,
  Invoice,
  Payout,
  Revenue,
  PaymentAnalytics,
  SubscriptionAnalytics,
  PaymentContextType,
  SubscriptionFormData,
  PaymentMethodFormData,
  TierFormData,
} from '@/types';
import { useAuth } from './AuthContext';

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: React.ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // State
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
  const [creatorSubscriptions, setCreatorSubscriptions] = useState<Subscription[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const [paymentAnalytics, setPaymentAnalytics] = useState<PaymentAnalytics | null>(null);
  const [subscriptionAnalytics, setSubscriptionAnalytics] = useState<SubscriptionAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
      generateMockData();
    }
  }, [user]);

  const loadUserData = () => {
    try {
      // Load from localStorage
      const storedTiers = localStorage.getItem(`subscription-tiers-${user?.id}`);
      const storedSubscriptions = localStorage.getItem(`user-subscriptions-${user?.id}`);
      const storedPaymentMethods = localStorage.getItem(`payment-methods-${user?.id}`);
      const storedTransactions = localStorage.getItem(`transactions-${user?.id}`);
      
      if (storedTiers) {
        setSubscriptionTiers(JSON.parse(storedTiers));
      }
      if (storedSubscriptions) {
        setUserSubscriptions(JSON.parse(storedSubscriptions));
      }
      if (storedPaymentMethods) {
        setPaymentMethods(JSON.parse(storedPaymentMethods));
      }
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error('Failed to load user payment data:', error);
    }
  };

  const generateMockData = () => {
    // Mock subscription tiers for demo
    const mockTiers: SubscriptionTier[] = [
      {
        id: 'tier-1',
        creatorId: user?.id || '1',
        name: 'Basic',
        description: 'Access to basic content and updates',
        price: 999, // $9.99 in cents
        benefits: ['Weekly updates', 'Basic content access', 'Community chat'],
        color: '#3B82F6',
        isActive: true,
        subscriberCount: 45,
        contentAccess: 'tier-specific',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'tier-2',
        creatorId: user?.id || '1',
        name: 'Premium',
        description: 'Full access to all content plus exclusive perks',
        price: 1999, // $19.99 in cents
        benefits: ['All basic benefits', 'Exclusive content', 'Direct messaging', 'Monthly video calls'],
        color: '#8B5CF6',
        isActive: true,
        subscriberCount: 23,
        contentAccess: 'all',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'tier-3',
        creatorId: user?.id || '1',
        name: 'VIP',
        description: 'Ultimate access with personalized content',
        price: 4999, // $49.99 in cents
        benefits: ['All premium benefits', 'Custom content requests', 'Priority support', '1-on-1 sessions'],
        color: '#F59E0B',
        isActive: true,
        subscriberCount: 8,
        contentAccess: 'premium-only',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Mock user subscriptions
    const mockSubscriptions: Subscription[] = [
      {
        id: 'sub-1',
        subscriberId: user?.id || '1',
        creatorId: 'creator-1',
        tierId: 'tier-2',
        status: 'active',
        currentPeriodStart: new Date(2024, 0, 1),
        currentPeriodEnd: new Date(2024, 1, 1),
        cancelAtPeriodEnd: false,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date(),
      },
    ];

    // Mock payment methods
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: 'pm-1',
        userId: user?.id || '1',
        type: 'stripe',
        provider: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2028,
        isDefault: true,
        createdAt: new Date(),
      },
      {
        id: 'pm-2',
        userId: user?.id || '1',
        type: 'paypal',
        provider: 'paypal',
        paypalEmail: 'demo@example.com',
        isDefault: false,
        createdAt: new Date(),
      },
    ];

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: 'tx-1',
        userId: user?.id || '1',
        creatorId: 'creator-1',
        subscriptionId: 'sub-1',
        amount: 1999,
        currency: 'usd',
        type: 'subscription',
        status: 'completed',
        paymentMethodType: 'stripe',
        description: 'Premium subscription - January 2024',
        fees: 88,
        netAmount: 1911,
        createdAt: new Date(2024, 0, 1),
        processedAt: new Date(2024, 0, 1),
      },
      {
        id: 'tx-2',
        userId: user?.id || '1',
        creatorId: 'creator-2',
        amount: 500,
        currency: 'usd',
        type: 'tip',
        status: 'completed',
        paymentMethodType: 'paypal',
        description: 'Tip for amazing content',
        fees: 30,
        netAmount: 470,
        createdAt: new Date(2024, 0, 15),
        processedAt: new Date(2024, 0, 15),
      },
    ];

    // Mock analytics
    const mockPaymentAnalytics: PaymentAnalytics = {
      totalRevenue: 125000,
      monthlyRevenue: 15600,
      revenueGrowth: 12.5,
      totalSubscribers: 76,
      activeSubscriptions: 71,
      churnRate: 3.2,
      averageRevenuePerUser: 18.42,
      lifetimeValue: 245.60,
      revenueByTier: [
        { tierId: 'tier-1', tierName: 'Basic', revenue: 44955, subscriberCount: 45 },
        { tierId: 'tier-2', tierName: 'Premium', revenue: 45977, subscriberCount: 23 },
        { tierId: 'tier-3', tierName: 'VIP', revenue: 39992, subscriberCount: 8 },
      ],
      revenueOverTime: [
        { date: '2024-01-01', revenue: 12000, subscribers: 65 },
        { date: '2024-01-15', revenue: 13500, subscribers: 68 },
        { date: '2024-02-01', revenue: 14200, subscribers: 71 },
        { date: '2024-02-15', revenue: 15600, subscribers: 76 },
      ],
      paymentMethodDistribution: [
        { type: 'Credit Card', count: 52, percentage: 68.4 },
        { type: 'PayPal', count: 19, percentage: 25.0 },
        { type: 'Apple Pay', count: 5, percentage: 6.6 },
      ],
      topEarningContent: [
        { contentId: '1', title: 'Exclusive Photoshoot', revenue: 2400, views: 1200 },
        { contentId: '2', title: 'Behind the Scenes', revenue: 1800, views: 950 },
      ],
    };

    setSubscriptionTiers(mockTiers);
    setUserSubscriptions(mockSubscriptions);
    setPaymentMethods(mockPaymentMethods);
    setTransactions(mockTransactions);
    setPaymentAnalytics(mockPaymentAnalytics);

    // Save to localStorage
    localStorage.setItem(`subscription-tiers-${user?.id}`, JSON.stringify(mockTiers));
    localStorage.setItem(`user-subscriptions-${user?.id}`, JSON.stringify(mockSubscriptions));
    localStorage.setItem(`payment-methods-${user?.id}`, JSON.stringify(mockPaymentMethods));
    localStorage.setItem(`transactions-${user?.id}`, JSON.stringify(mockTransactions));
  };

  // Subscription Tier Management
  const createTier = async (tierData: TierFormData): Promise<SubscriptionTier> => {
    setIsLoading(true);
    try {
      const newTier: SubscriptionTier = {
        id: `tier-${Date.now()}`,
        creatorId: user?.id || '1',
        name: tierData.name,
        description: tierData.description,
        price: Math.round(tierData.price * 100), // Convert to cents
        benefits: tierData.benefits,
        color: tierData.color,
        isActive: true,
        subscriberCount: 0,
        contentAccess: tierData.contentAccess,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTiers = [...subscriptionTiers, newTier];
      setSubscriptionTiers(updatedTiers);
      localStorage.setItem(`subscription-tiers-${user?.id}`, JSON.stringify(updatedTiers));
      
      return newTier;
    } catch (error) {
      setError('Failed to create subscription tier');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTier = async (tierId: string, updates: Partial<SubscriptionTier>): Promise<SubscriptionTier> => {
    const tierIndex = subscriptionTiers.findIndex(t => t.id === tierId);
    if (tierIndex === -1) throw new Error('Tier not found');

    const updatedTier = {
      ...subscriptionTiers[tierIndex],
      ...updates,
      updatedAt: new Date(),
    };

    const updatedTiers = [...subscriptionTiers];
    updatedTiers[tierIndex] = updatedTier;
    
    setSubscriptionTiers(updatedTiers);
    localStorage.setItem(`subscription-tiers-${user?.id}`, JSON.stringify(updatedTiers));
    
    return updatedTier;
  };

  const deleteTier = async (tierId: string): Promise<void> => {
    const updatedTiers = subscriptionTiers.filter(t => t.id !== tierId);
    setSubscriptionTiers(updatedTiers);
    localStorage.setItem(`subscription-tiers-${user?.id}`, JSON.stringify(updatedTiers));
  };

  // Subscription Management
  const subscribe = async (subscriptionData: SubscriptionFormData): Promise<Subscription> => {
    setIsLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newSubscription: Subscription = {
        id: `sub-${Date.now()}`,
        subscriberId: user?.id || '1',
        creatorId: 'creator-demo',
        tierId: subscriptionData.tierId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedSubscriptions = [...userSubscriptions, newSubscription];
      setUserSubscriptions(updatedSubscriptions);
      localStorage.setItem(`user-subscriptions-${user?.id}`, JSON.stringify(updatedSubscriptions));

      // Create transaction record
      const tier = subscriptionTiers.find(t => t.id === subscriptionData.tierId);
      if (tier) {
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          userId: user?.id || '1',
          creatorId: 'creator-demo',
          subscriptionId: newSubscription.id,
          amount: tier.price,
          currency: 'usd',
          type: 'subscription',
          status: 'completed',
          paymentMethodType: subscriptionData.paymentMethodType,
          description: `${tier.name} subscription`,
          fees: Math.round(tier.price * 0.029 + 30), // Stripe fees
          netAmount: tier.price - Math.round(tier.price * 0.029 + 30),
          createdAt: new Date(),
          processedAt: new Date(),
        };

        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions);
        localStorage.setItem(`transactions-${user?.id}`, JSON.stringify(updatedTransactions));
      }

      return newSubscription;
    } catch (error) {
      setError('Failed to create subscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string): Promise<void> => {
    const subscriptionIndex = userSubscriptions.findIndex(s => s.id === subscriptionId);
    if (subscriptionIndex === -1) throw new Error('Subscription not found');

    const updatedSubscription = {
      ...userSubscriptions[subscriptionIndex],
      cancelAtPeriodEnd: true,
      canceledAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSubscriptions = [...userSubscriptions];
    updatedSubscriptions[subscriptionIndex] = updatedSubscription;
    
    setUserSubscriptions(updatedSubscriptions);
    localStorage.setItem(`user-subscriptions-${user?.id}`, JSON.stringify(updatedSubscriptions));
  };

  const resumeSubscription = async (subscriptionId: string): Promise<void> => {
    const subscriptionIndex = userSubscriptions.findIndex(s => s.id === subscriptionId);
    if (subscriptionIndex === -1) throw new Error('Subscription not found');

    const updatedSubscription = {
      ...userSubscriptions[subscriptionIndex],
      cancelAtPeriodEnd: false,
      canceledAt: undefined,
      updatedAt: new Date(),
    };

    const updatedSubscriptions = [...userSubscriptions];
    updatedSubscriptions[subscriptionIndex] = updatedSubscription;
    
    setUserSubscriptions(updatedSubscriptions);
    localStorage.setItem(`user-subscriptions-${user?.id}`, JSON.stringify(updatedSubscriptions));
  };

  // Payment Method Management
  const addPaymentMethod = async (paymentMethodData: PaymentMethodFormData): Promise<PaymentMethod> => {
    setIsLoading(true);
    try {
      const newPaymentMethod: PaymentMethod = {
        id: `pm-${Date.now()}`,
        userId: user?.id || '1',
        type: paymentMethodData.type,
        provider: paymentMethodData.type === 'stripe' ? 'card' : 'paypal',
        last4: paymentMethodData.cardNumber?.slice(-4),
        brand: 'visa', // Mock
        expiryMonth: paymentMethodData.expiryMonth,
        expiryYear: paymentMethodData.expiryYear,
        paypalEmail: paymentMethodData.paypalEmail,
        isDefault: paymentMethodData.setAsDefault || paymentMethods.length === 0,
        createdAt: new Date(),
      };

      let updatedPaymentMethods = [...paymentMethods, newPaymentMethod];
      
      // If setting as default, update other methods
      if (newPaymentMethod.isDefault) {
        updatedPaymentMethods = updatedPaymentMethods.map(pm => ({
          ...pm,
          isDefault: pm.id === newPaymentMethod.id,
        }));
      }

      setPaymentMethods(updatedPaymentMethods);
      localStorage.setItem(`payment-methods-${user?.id}`, JSON.stringify(updatedPaymentMethods));
      
      return newPaymentMethod;
    } catch (error) {
      setError('Failed to add payment method');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removePaymentMethod = async (paymentMethodId: string): Promise<void> => {
    const updatedPaymentMethods = paymentMethods.filter(pm => pm.id !== paymentMethodId);
    setPaymentMethods(updatedPaymentMethods);
    localStorage.setItem(`payment-methods-${user?.id}`, JSON.stringify(updatedPaymentMethods));
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<void> => {
    const updatedPaymentMethods = paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === paymentMethodId,
    }));
    
    setPaymentMethods(updatedPaymentMethods);
    localStorage.setItem(`payment-methods-${user?.id}`, JSON.stringify(updatedPaymentMethods));
  };

  // Transaction & Billing
  const getTransactionHistory = async (filters?: any): Promise<Transaction[]> => {
    // In real app, this would filter based on passed filters
    return transactions;
  };

  const getInvoices = async (): Promise<Invoice[]> => {
    // Mock invoices
    return invoices;
  };

  // Payouts & Revenue
  const requestPayout = async (amount: number, payoutMethod: any): Promise<Payout> => {
    const newPayout: Payout = {
      id: `payout-${Date.now()}`,
      creatorId: user?.id || '1',
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      status: 'pending',
      payoutMethodType: payoutMethod.type,
      fees: Math.round(amount * 0.01 * 100), // 1% fee
      netAmount: Math.round(amount * 0.99 * 100),
      scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    };

    const updatedPayouts = [...payouts, newPayout];
    setPayouts(updatedPayouts);
    
    return newPayout;
  };

  const getRevenue = async (period: string): Promise<Revenue> => {
    // Mock revenue data
    const mockRevenue: Revenue = {
      id: `revenue-${Date.now()}`,
      creatorId: user?.id || '1',
      period: period as any,
      periodStart: new Date(2024, 0, 1),
      periodEnd: new Date(2024, 0, 31),
      grossRevenue: 15600,
      platformFees: 780,
      paymentProcessingFees: 452,
      netRevenue: 14368,
      subscriptionRevenue: 14100,
      tipRevenue: 1200,
      oneTimeRevenue: 300,
      subscriberCount: 76,
      newSubscribers: 8,
      churnedSubscribers: 3,
      averageRevenuePerUser: 205.26,
      createdAt: new Date(),
    };

    return mockRevenue;
  };

  // Analytics
  const refreshAnalytics = async (): Promise<void> => {
    // Refresh analytics data
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Analytics would be recalculated here
    } finally {
      setIsLoading(false);
    }
  };

  const value: PaymentContextType = {
    // Subscription Tiers
    subscriptionTiers,
    createTier,
    updateTier,
    deleteTier,
    
    // Subscriptions
    userSubscriptions,
    creatorSubscriptions,
    subscribe,
    cancelSubscription,
    resumeSubscription,
    
    // Payment Methods
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    
    // Transactions & Billing
    transactions,
    invoices,
    getTransactionHistory,
    getInvoices,
    
    // Payouts & Revenue
    payouts,
    revenue,
    requestPayout,
    getRevenue,
    
    // Analytics
    paymentAnalytics,
    subscriptionAnalytics,
    refreshAnalytics,
    
    // State
    isLoading,
    error,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
