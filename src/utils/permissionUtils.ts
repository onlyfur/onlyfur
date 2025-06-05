import { User, Content, PlatformSubscriptionTier, PermissionCheck } from '@/types';
import { getTierById, getAllTiers } from '@/data/subscriptionTiers';

/**
 * Comprehensive permission validation utilities for the OnlyFur platform
 */

// Content Access Permissions
export const canAccessContent = (
  user: User | null,
  content: Content,
  isNewestPost: boolean = false
): PermissionCheck => {
  // Always allow access to newest post (free preview)
  if (isNewestPost) {
    return { allowed: true };
  }

  // Public content is always accessible
  if (content.privacyLevel === 'public') {
    return { allowed: true };
  }

  // Must be authenticated for non-public content
  if (!user) {
    return {
      allowed: false,
      reason: 'Login required to view this content',
      upgradeUrl: '/login'
    };
  }

  // Admin can access everything
  if (user.role === 'admin') {
    return { allowed: true };
  }

  // Creator can access their own content
  if (user.id === content.creatorId) {
    return { allowed: true };
  }

  // Check subscription requirements
  if (content.requiresSubscription) {
    const userTier = user.subscriptionTier;
    
    if (!userTier || userTier.status !== 'active') {
      return {
        allowed: false,
        reason: 'Active subscription required',
        requiredTier: getRequiredTierForContent(content.privacyLevel),
        upgradeUrl: '/subscription'
      };
    }

    // Check privacy level requirements
    switch (content.privacyLevel) {
      case 'subscribers':
        return { allowed: true };
        
      case 'premium':
        if (!userTier.contentAccess.canViewPremiumContent) {
          return {
            allowed: false,
            reason: 'Pro Subscriber tier or higher required',
            requiredTier: 'Pro Subscriber',
            currentTier: userTier.name,
            upgradeUrl: '/subscription'
          };
        }
        return { allowed: true };
        
      case 'private':
        if (!userTier.contentAccess.canViewExclusiveContent) {
          return {
            allowed: false,
            reason: 'VIP Subscriber tier required for exclusive content',
            requiredTier: 'VIP Subscriber',
            currentTier: userTier.name,
            upgradeUrl: '/subscription'
          };
        }
        return { allowed: true };
        
      default:
        return { allowed: true };
    }
  }

  return { allowed: true };
};

// Messaging Permissions
export const canSendMessage = (
  sender: User | null,
  recipient: User,
  currentConversationCount: number = 0
): PermissionCheck => {
  if (!sender) {
    return {
      allowed: false,
      reason: 'You must be logged in to send messages',
      upgradeUrl: '/login'
    };
  }

  // Users can message themselves (notes, drafts)
  if (sender.id === recipient.id) {
    return { allowed: true };
  }

  // Admin can message anyone
  if (sender.role === 'admin') {
    return { allowed: true };
  }

  const senderTier = sender.subscriptionTier;
  const recipientTier = recipient.subscriptionTier;

  // Check if sender has an active subscription
  if (!senderTier || senderTier.status !== 'active') {
    return {
      allowed: false,
      reason: 'Active subscription required to send messages',
      requiredTier: 'Basic Subscriber',
      upgradeUrl: '/subscription'
    };
  }

  // Check daily conversation limits
  if (senderTier.maxConversations !== -1) {
    if (currentConversationCount >= senderTier.maxConversations) {
      return {
        allowed: false,
        reason: `Daily conversation limit reached (${senderTier.maxConversations})`,
        requiredTier: 'Pro Subscriber',
        currentTier: senderTier.name,
        upgradeUrl: '/subscription'
      };
    }
  }

  // Check if recipient (creator) allows messages from sender's tier
  if (recipient.role === 'creator' && recipientTier) {
    const allowedTiers = recipientTier.messagingFeatures?.allowedSenderTiers || [];
    
    if (!allowedTiers.includes(senderTier.id)) {
      const requiredTier = getHighestAllowedTier(allowedTiers);
      return {
        allowed: false,
        reason: `This creator only accepts messages from ${requiredTier} or higher`,
        requiredTier: requiredTier,
        currentTier: senderTier.name,
        upgradeUrl: '/subscription'
      };
    }
  }

  return { allowed: true };
};

// Media Sharing Permissions
export const canSendMedia = (user: User | null): PermissionCheck => {
  if (!user) {
    return {
      allowed: false,
      reason: 'Login required to send media',
      upgradeUrl: '/login'
    };
  }

  const userTier = user.subscriptionTier;
  
  if (!userTier || userTier.status !== 'active') {
    return {
      allowed: false,
      reason: 'Active subscription required to send media',
      requiredTier: 'Pro Subscriber',
      upgradeUrl: '/subscription'
    };
  }

  if (!userTier.messagingFeatures?.canSendMedia) {
    return {
      allowed: false,
      reason: 'Your current tier does not allow media sharing',
      requiredTier: 'Pro Subscriber',
      currentTier: userTier.name,
      upgradeUrl: '/subscription'
    };
  }

  return { allowed: true };
};

// Content Upload Permissions
export const canUploadContent = (
  user: User | null,
  dailyUploadCount: number = 0
): PermissionCheck => {
  if (!user) {
    return {
      allowed: false,
      reason: 'Login required to upload content',
      upgradeUrl: '/login'
    };
  }

  if (user.role !== 'creator') {
    return {
      allowed: false,
      reason: 'Only creators can upload content',
      upgradeUrl: '/register?role=creator'
    };
  }

  const userTier = user.subscriptionTier;
  
  if (!userTier || userTier.status !== 'active') {
    return {
      allowed: false,
      reason: 'Active creator subscription required',
      requiredTier: 'Basic Creator',
      upgradeUrl: '/subscription'
    };
  }

  // Check daily upload limits
  const maxUploads = userTier.creatorFeatures?.maxUploadsPerDay || 0;
  if (maxUploads !== -1 && dailyUploadCount >= maxUploads) {
    return {
      allowed: false,
      reason: `Daily upload limit reached (${maxUploads})`,
      requiredTier: 'Pro Creator',
      currentTier: userTier.name,
      upgradeUrl: '/subscription'
    };
  }

  return { allowed: true };
};

// Live Streaming Permissions
export const canLiveStream = (user: User | null): PermissionCheck => {
  if (!user) {
    return {
      allowed: false,
      reason: 'Login required for live streaming',
      upgradeUrl: '/login'
    };
  }

  if (user.role !== 'creator') {
    return {
      allowed: false,
      reason: 'Only creators can live stream',
      upgradeUrl: '/register?role=creator'
    };
  }

  const userTier = user.subscriptionTier;
  
  if (!userTier || userTier.status !== 'active') {
    return {
      allowed: false,
      reason: 'Active creator subscription required',
      requiredTier: 'Pro Creator',
      upgradeUrl: '/subscription'
    };
  }

  if (!userTier.creatorFeatures?.liveStreamingEnabled) {
    return {
      allowed: false,
      reason: 'Live streaming not available in your current tier',
      requiredTier: 'Pro Creator',
      currentTier: userTier.name,
      upgradeUrl: '/subscription'
    };
  }

  return { allowed: true };
};

// Bulk Messaging Permissions
export const canSendBulkMessages = (
  user: User | null,
  todaysBulkCount: number = 0
): PermissionCheck => {
  if (!user) {
    return {
      allowed: false,
      reason: 'Login required for bulk messaging',
      upgradeUrl: '/login'
    };
  }

  const userTier = user.subscriptionTier;
  
  if (!userTier || userTier.status !== 'active') {
    return {
      allowed: false,
      reason: 'Active subscription required for bulk messaging',
      requiredTier: 'Pro Creator',
      upgradeUrl: '/subscription'
    };
  }

  if (!userTier.messagingFeatures?.canSendBulkMessages) {
    return {
      allowed: false,
      reason: 'Bulk messaging not available in your current tier',
      requiredTier: 'Pro Creator',
      currentTier: userTier.name,
      upgradeUrl: '/subscription'
    };
  }

  // Check bulk message limits for creators
  if (user.role === 'creator' && userTier.creatorFeatures) {
    const limit = userTier.creatorFeatures.bulkMessageLimit;
    if (limit !== -1 && todaysBulkCount >= limit) {
      return {
        allowed: false,
        reason: `Daily bulk message limit reached (${limit})`,
        requiredTier: 'Premium Creator',
        currentTier: userTier.name,
        upgradeUrl: '/subscription'
      };
    }
  }

  return { allowed: true };
};

// Helper Functions
function getRequiredTierForContent(privacyLevel: string): string {
  switch (privacyLevel) {
    case 'subscribers':
      return 'Basic Subscriber';
    case 'premium':
      return 'Pro Subscriber';
    case 'private':
      return 'VIP Subscriber';
    default:
      return 'Basic Subscriber';
  }
}

function getHighestAllowedTier(allowedTierIds: string[]): string {
  const tiers = getAllTiers();
  const allowedTiers = tiers.filter(tier => allowedTierIds.includes(tier.id));
  
  if (allowedTiers.some(tier => tier.level === 'vip')) return 'VIP Subscriber';
  if (allowedTiers.some(tier => tier.level === 'premium')) return 'Premium Subscriber';
  if (allowedTiers.some(tier => tier.level === 'pro')) return 'Pro Subscriber';
  return 'Basic Subscriber';
}

// File Size and Type Validation
export const validateFileUpload = (
  user: User | null,
  file: File
): PermissionCheck => {
  if (!user) {
    return {
      allowed: false,
      reason: 'Login required to upload files',
      upgradeUrl: '/login'
    };
  }

  const userTier = user.subscriptionTier;
  
  if (!userTier || userTier.status !== 'active') {
    return {
      allowed: false,
      reason: 'Active subscription required to upload files',
      requiredTier: 'Basic Subscriber',
      upgradeUrl: '/subscription'
    };
  }

  const maxSize = userTier.messagingFeatures?.maxFileSize || 5; // MB
  const allowedTypes = userTier.messagingFeatures?.allowedFileTypes || [];
  
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSize) {
    return {
      allowed: false,
      reason: `File size exceeds limit (${maxSize}MB)`,
      requiredTier: getNextTierForFileSize(maxSize),
      currentTier: userTier.name,
      upgradeUrl: '/subscription'
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      allowed: false,
      reason: `File type not supported in your tier`,
      requiredTier: 'Pro Subscriber',
      currentTier: userTier.name,
      upgradeUrl: '/subscription'
    };
  }

  return { allowed: true };
};

function getNextTierForFileSize(currentLimit: number): string {
  if (currentLimit < 25) return 'Pro Subscriber';
  if (currentLimit < 100) return 'VIP Subscriber';
  return 'Premium Creator';
}

// Tier Comparison Utilities
export const getTierComparison = (): Array<{
  feature: string;
  basic: string | number | boolean;
  pro: string | number | boolean;
  vip: string | number | boolean;
}> => {
  return [
    {
      feature: 'Monthly Price',
      basic: '$9.99',
      pro: '$19.99',
      vip: '$39.99'
    },
    {
      feature: 'Premium Content Access',
      basic: false,
      pro: true,
      vip: true
    },
    {
      feature: 'VIP Exclusive Content',
      basic: false,
      pro: false,
      vip: true
    },
    {
      feature: 'Daily Conversations',
      basic: 5,
      pro: 15,
      vip: 'Unlimited'
    },
    {
      feature: 'Media Sharing',
      basic: false,
      pro: true,
      vip: true
    },
    {
      feature: 'File Upload Limit',
      basic: '5MB',
      pro: '25MB',
      vip: '100MB'
    },
    {
      feature: 'Video Quality',
      basic: 'SD',
      pro: 'HD',
      vip: 'UHD'
    },
    {
      feature: 'Download Content',
      basic: false,
      pro: true,
      vip: true
    },
    {
      feature: 'Priority Support',
      basic: false,
      pro: true,
      vip: true
    },
    {
      feature: 'Early Access',
      basic: false,
      pro: true,
      vip: true
    }
  ];
};

export const getCreatorTierComparison = (): Array<{
  feature: string;
  basic: string | number | boolean;
  pro: string | number | boolean;
  premium: string | number | boolean;
}> => {
  return [
    {
      feature: 'Monthly Price',
      basic: 'Free',
      pro: '$29.99',
      premium: '$59.99'
    },
    {
      feature: 'Platform Fee',
      basic: '20%',
      pro: '15%',
      premium: '10%'
    },
    {
      feature: 'Daily Uploads',
      basic: 10,
      pro: 25,
      premium: 'Unlimited'
    },
    {
      feature: 'Storage Space',
      basic: '10GB',
      pro: '100GB',
      premium: 'Unlimited'
    },
    {
      feature: 'Live Streaming',
      basic: false,
      pro: true,
      premium: true
    },
    {
      feature: 'Custom Branding',
      basic: false,
      pro: true,
      premium: true
    },
    {
      feature: 'Analytics Level',
      basic: 'Basic',
      pro: 'Advanced',
      premium: 'Premium'
    },
    {
      feature: 'Bulk Messaging',
      basic: 'None',
      pro: '100/day',
      premium: 'Unlimited'
    },
    {
      feature: 'Content Tiers',
      basic: false,
      pro: true,
      premium: true
    },
    {
      feature: 'Advanced Scheduling',
      basic: false,
      pro: true,
      premium: true
    }
  ];
};
