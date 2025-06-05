import { PlatformSubscriptionTier } from '@/types';

// Subscriber Tiers
export const subscriberTiers: PlatformSubscriptionTier[] = [
  {
    id: 'basic-subscriber',
    name: 'Basic Subscriber',
    type: 'subscriber',
    level: 'basic',
    price: 9.99,
    currency: 'USD',
    billingPeriod: 'monthly',
    description: 'Get started with furry content access',
    features: [
      'Access to public content',
      'Basic messaging with creators',
      'Join community discussions',
      'Basic profile customization',
      'View newest posts from all creators'
    ],
    limitations: [
      'Limited to 5 conversations per day',
      'Cannot send media in messages',
      'No priority support',
      'No premium content access'
    ],
    messagingFeatures: {
      canMessageCreators: true,
      allowedCreatorTiers: ['basic-creator'],
      maxConversationsPerDay: 5,
      canSendMedia: false,
      canReceivePrioritySupport: false,
      canSendBulkMessages: false,
      maxFileSize: 5, // 5MB
      allowedFileTypes: ['image/jpeg', 'image/png'],
    },
    contentAccess: {
      canViewPremiumContent: false,
      canViewExclusiveContent: false,
      downloadPermissions: false,
      earlyAccess: false,
      canViewLiveStreams: true,
      qualityLimits: 'sd',
    },
    isPopular: false,
    color: 'bg-blue-500',
    badge: 'Basic'
  },
  {
    id: 'pro-subscriber',
    name: 'Pro Subscriber',
    type: 'subscriber',
    level: 'pro',
    price: 19.99,
    currency: 'USD',
    billingPeriod: 'monthly',
    description: 'Enhanced furry experience with premium features',
    features: [
      'Access to premium content',
      'Enhanced messaging capabilities',
      'Send media in messages',
      'Priority customer support',
      'Early access to new features',
      'Advanced profile customization',
      'Download content for offline viewing'
    ],
    limitations: [
      'Limited to 15 conversations per day',
      'Cannot access exclusive VIP content'
    ],
    messagingFeatures: {
      canMessageCreators: true,
      allowedCreatorTiers: ['basic-creator', 'pro-creator'],
      maxConversationsPerDay: 15,
      canSendMedia: true,
      canReceivePrioritySupport: true,
      canSendBulkMessages: false,
      maxFileSize: 25, // 25MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    },
    contentAccess: {
      canViewPremiumContent: true,
      canViewExclusiveContent: false,
      downloadPermissions: true,
      earlyAccess: true,
      canViewLiveStreams: true,
      qualityLimits: 'hd',
    },
    isPopular: true,
    color: 'bg-purple-500',
    badge: 'Pro'
  },
  {
    id: 'vip-subscriber',
    name: 'VIP Subscriber',
    type: 'subscriber',
    level: 'vip',
    price: 39.99,
    currency: 'USD',
    billingPeriod: 'monthly',
    description: 'Ultimate furry content experience',
    features: [
      'Access to ALL content including exclusive VIP',
      'Unlimited messaging',
      'Direct line to creators',
      'VIP-only content and events',
      'Custom badges and profile effects',
      'Priority queue for live streams',
      'Exclusive community access',
      'Personal content recommendations'
    ],
    limitations: [],
    messagingFeatures: {
      canMessageCreators: true,
      allowedCreatorTiers: ['basic-creator', 'pro-creator', 'premium-creator'],
      maxConversationsPerDay: -1, // Unlimited
      canSendMedia: true,
      canReceivePrioritySupport: true,
      canSendBulkMessages: true,
      maxFileSize: 100, // 100MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'],
    },
    contentAccess: {
      canViewPremiumContent: true,
      canViewExclusiveContent: true,
      downloadPermissions: true,
      earlyAccess: true,
      canViewLiveStreams: true,
      qualityLimits: 'uhd',
    },
    isPopular: false,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    badge: 'VIP'
  }
];

// Creator Tiers
export const creatorTiers: PlatformSubscriptionTier[] = [
  {
    id: 'basic-creator',
    name: 'Basic Creator',
    type: 'creator',
    level: 'basic',
    price: 0,
    currency: 'USD',
    billingPeriod: 'monthly',
    description: 'Start your furry content creation journey',
    features: [
      'Upload unlimited content',
      'Basic analytics dashboard',
      'Accept tips and subscriptions',
      'Community interaction tools',
      'Basic profile customization'
    ],
    limitations: [
      '20% platform fee',
      'Max 10 uploads per day',
      'Basic analytics only',
      'No custom branding',
      'Standard support only'
    ],
    messagingFeatures: {
      canMessageCreators: true,
      allowedCreatorTiers: ['basic-creator', 'pro-creator', 'premium-creator'],
      maxConversationsPerDay: 20,
      canSendMedia: true,
      canReceivePrioritySupport: false,
      canSendBulkMessages: false,
      maxFileSize: 10, // 10MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    },
    contentAccess: {
      canViewPremiumContent: false,
      canViewExclusiveContent: false,
      downloadPermissions: false,
      earlyAccess: false,
      canViewLiveStreams: true,
      qualityLimits: 'hd',
    },
    creatorFeatures: {
      maxUploadsPerDay: 10,
      maxSubscribers: -1, // Unlimited
      analyticsAccess: 'basic',
      customBranding: false,
      liveStreamingEnabled: false,
      bulkMessageLimit: 0,
      platformFeePercentage: 20,
      canSetContentTiers: false,
      canCreateCollections: false,
      maxStorageGB: 10,
      advancedScheduling: false,
      customPricing: false,
    },
    isPopular: false,
    color: 'bg-green-500',
    badge: 'Creator'
  },
  {
    id: 'pro-creator',
    name: 'Pro Creator',
    type: 'creator',
    level: 'pro',
    price: 29.99,
    currency: 'USD',
    billingPeriod: 'monthly',
    description: 'Advanced tools for serious creators',
    features: [
      'Reduced 15% platform fee',
      'Advanced analytics and insights',
      'Custom branding options',
      'Live streaming capabilities',
      'Bulk messaging tools',
      'Priority support',
      'Scheduled content posting',
      'Enhanced profile features'
    ],
    limitations: [
      'Max 25 uploads per day',
      'Limited bulk messages (100/day)'
    ],
    messagingFeatures: {
      canMessageCreators: true,
      allowedCreatorTiers: ['basic-creator', 'pro-creator', 'premium-creator'],
      maxConversationsPerDay: 50,
      canSendMedia: true,
      canReceivePrioritySupport: true,
      canSendBulkMessages: true,
      maxFileSize: 50, // 50MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'],
    },
    contentAccess: {
      canViewPremiumContent: true,
      canViewExclusiveContent: false,
      downloadPermissions: true,
      earlyAccess: true,
      canViewLiveStreams: true,
      qualityLimits: 'hd',
    },
    creatorFeatures: {
      maxUploadsPerDay: 25,
      maxSubscribers: -1, // Unlimited
      analyticsAccess: 'advanced',
      customBranding: true,
      liveStreamingEnabled: true,
      bulkMessageLimit: 100,
      platformFeePercentage: 15,
      canSetContentTiers: true,
      canCreateCollections: true,
      maxStorageGB: 100,
      advancedScheduling: true,
      customPricing: true,
    },
    isPopular: true,
    color: 'bg-indigo-500',
    badge: 'Pro Creator'
  },
  {
    id: 'premium-creator',
    name: 'Premium Creator',
    type: 'creator',
    level: 'premium',
    price: 59.99,
    currency: 'USD',
    billingPeriod: 'monthly',
    description: 'Professional creator suite with maximum features',
    features: [
      'Lowest 10% platform fee',
      'Premium analytics suite',
      'Complete branding control',
      'Unlimited live streaming',
      'Advanced bulk messaging',
      'Dedicated account manager',
      'Early access to new features',
      'Custom integrations',
      'Advanced content scheduling',
      'VIP creator badge'
    ],
    limitations: [],
    messagingFeatures: {
      canMessageCreators: true,
      allowedCreatorTiers: ['basic-creator', 'pro-creator', 'premium-creator'],
      maxConversationsPerDay: -1, // Unlimited
      canSendMedia: true,
      canReceivePrioritySupport: true,
      canSendBulkMessages: true,
      maxFileSize: 200, // 200MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/mov'],
    },
    contentAccess: {
      canViewPremiumContent: true,
      canViewExclusiveContent: true,
      downloadPermissions: true,
      earlyAccess: true,
      canViewLiveStreams: true,
      qualityLimits: 'uhd',
    },
    creatorFeatures: {
      maxUploadsPerDay: -1, // Unlimited
      maxSubscribers: -1, // Unlimited
      analyticsAccess: 'premium',
      customBranding: true,
      liveStreamingEnabled: true,
      bulkMessageLimit: -1, // Unlimited
      platformFeePercentage: 10,
      canSetContentTiers: true,
      canCreateCollections: true,
      maxStorageGB: -1, // Unlimited
      advancedScheduling: true,
      customPricing: true,
    },
    isPopular: false,
    color: 'bg-gradient-to-r from-purple-600 to-pink-600',
    badge: 'Premium Creator'
  }
];

export const getAllTiers = (): PlatformSubscriptionTier[] => {
  return [...subscriberTiers, ...creatorTiers];
};

export const getTierById = (id: string): PlatformSubscriptionTier | undefined => {
  return getAllTiers().find(tier => tier.id === id);
};

export const getTiersByType = (type: 'subscriber' | 'creator'): PlatformSubscriptionTier[] => {
  return type === 'subscriber' ? subscriberTiers : creatorTiers;
};
