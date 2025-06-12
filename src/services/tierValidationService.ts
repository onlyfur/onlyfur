import { User, Content, PlatformSubscriptionTier, PermissionCheck } from '@/types';
import { getTierById } from '@/data/subscriptionTiers';
import { 
  canAccessContent, 
  canSendMessage, 
  canSendMedia, 
  canUploadContent,
  canLiveStream,
  canSendBulkMessages,
  validateFileUpload
} from '@/utils/permissionUtils';

// Mock request object for server-side rendering compatibility
const mockRequest = {
  method: 'GET',
  path: '/'
};

// Get request object (works in both browser and server environments)
const getRequest = () => {
  if (typeof window !== 'undefined' && window.location) {
    return {
      method: 'GET',
      path: window.location.pathname
    };
  }
  return mockRequest;
};

/**
 * Centralized tier validation service for the OnlyFur platform
 * Provides comprehensive permission checking and enforcement
 */

export class TierValidationService {
  private static instance: TierValidationService;

  private constructor() {}

  public static getInstance(): TierValidationService {
    if (!TierValidationService.instance) {
      TierValidationService.instance = new TierValidationService();
    }
    return TierValidationService.instance;
  }

  /**
   * Validate content access permissions
   */
  public validateContentAccess(
    user: User | null,
    content: Content,
    options: { isNewestPost?: boolean } = {}
  ): PermissionCheck {
    return canAccessContent(user, content, options.isNewestPost || false);
  }

  /**
   * Validate messaging permissions
   */
  public validateMessaging(
    sender: User | null,
    recipient: User,
    currentConversationCount: number = 0
  ): PermissionCheck {
    return canSendMessage(sender, recipient, currentConversationCount);
  }

  /**
   * Validate media sharing permissions
   */
  public validateMediaSharing(user: User | null): PermissionCheck {
    return canSendMedia(user);
  }

  /**
   * Validate content upload permissions
   */
  public validateContentUpload(
    user: User | null,
    dailyUploadCount: number = 0
  ): PermissionCheck {
    return canUploadContent(user, dailyUploadCount);
  }

  /**
   * Validate live streaming permissions
   */
  public validateLiveStreaming(user: User | null): PermissionCheck {
    return canLiveStream(user);
  }

  /**
   * Validate bulk messaging permissions
   */
  public validateBulkMessaging(
    user: User | null,
    todaysBulkCount: number = 0
  ): PermissionCheck {
    return canSendBulkMessages(user, todaysBulkCount);
  }

  /**
   * Validate file upload permissions
   */
  public validateFileUpload(user: User | null, file: File): PermissionCheck {
    return validateFileUpload(user, file);
  }

  /**
   * Check if user can access advanced creator features
   */
  public validateAdvancedCreatorFeatures(
    user: User | null,
    feature: 'analytics' | 'branding' | 'scheduling' | 'pricing' | 'collections'
  ): PermissionCheck {
    if (!user) {
      return {
        allowed: false,
        reason: 'Login required to access creator features',
        upgradeUrl: '/login'
      };
    }

    if (user.role !== 'creator') {
      return {
        allowed: false,
        reason: 'Only creators can access these features',
        upgradeUrl: '/register?role=creator'
      };
    }

    const userTier = user.subscriptionTier;
    
    if (!userTier || userTier.status !== 'active' || !userTier.creatorFeatures) {
      return {
        allowed: false,
        reason: 'Active creator subscription required',
        requiredTier: 'Pro Creator',
        upgradeUrl: '/subscription'
      };
    }

    const features = userTier.creatorFeatures;

    switch (feature) {
      case 'analytics':
        if (!features.analyticsAccess || (features.analyticsAccess === 'basic' && feature === 'analytics')) {
          return {
            allowed: false,
            reason: 'Advanced analytics requires Pro Creator or higher',
            requiredTier: 'Pro Creator',
            currentTier: userTier.name,
            upgradeUrl: '/subscription'
          };
        }
        break;

      case 'branding':
        if (!features.customBranding) {
          return {
            allowed: false,
            reason: 'Custom branding requires Pro Creator or higher',
            requiredTier: 'Pro Creator',
            currentTier: userTier.name,
            upgradeUrl: '/subscription'
          };
        }
        break;

      case 'scheduling':
        if (!features.advancedScheduling) {
          return {
            allowed: false,
            reason: 'Advanced scheduling requires Pro Creator or higher',
            requiredTier: 'Pro Creator',
            currentTier: userTier.name,
            upgradeUrl: '/subscription'
          };
        }
        break;

      case 'pricing':
        if (features.customPricing === undefined || !features.customPricing) {
          return {
            allowed: false,
            reason: 'Custom pricing requires Pro Creator or higher',
            requiredTier: 'Pro Creator',
            currentTier: userTier.name,
            upgradeUrl: '/subscription'
          };
        }
        break;

      case 'collections':
        if (!features.canCreateCollections) {
          return {
            allowed: false,
            reason: 'Content collections require Pro Creator or higher',
            requiredTier: 'Pro Creator',
            currentTier: userTier.name,
            upgradeUrl: '/subscription'
          };
        }
        break;
    }

    return { allowed: true };
  }

  /**
   * Check storage limits for creators
   */
  public validateStorageLimit(
    user: User | null,
    currentStorageGB: number,
    additionalSizeGB: number = 0
  ): PermissionCheck {
    if (!user || user.role !== 'creator') {
      return {
        allowed: false,
        reason: 'Storage limits apply to creators only'
      };
    }

    const userTier = user.subscriptionTier;
    
    if (!userTier || !userTier.creatorFeatures) {
      return {
        allowed: false,
        reason: 'Creator subscription required for storage'
      };
    }

    const maxStorage = userTier.creatorFeatures.maxStorageGB;
    
    if (maxStorage === -1) {
      return { allowed: true }; // Unlimited storage
    }

    const totalNeeded = currentStorageGB + additionalSizeGB;
    
    if (totalNeeded > maxStorage) {
      return {
        allowed: false,
        reason: `Storage limit exceeded (${maxStorage}GB max)`,
        requiredTier: 'Premium Creator',
        currentTier: userTier.name,
        upgradeUrl: '/subscription'
      };
    }

    // Warning if approaching limit (80%)
    if (totalNeeded > maxStorage * 0.8) {
      return {
        allowed: true,
        reason: `Approaching storage limit (${totalNeeded.toFixed(1)}GB of ${maxStorage}GB used)`
      };
    }

    return { allowed: true };
  }

  /**
   * Validate subscriber tier requirements for specific content
   */
  public validateSubscriberAccess(
    user: User | null,
    requiredTierLevel: 'basic' | 'pro' | 'premium' | 'vip'
  ): PermissionCheck {
    if (!user) {
      return {
        allowed: false,
        reason: 'Login required',
        upgradeUrl: '/login'
      };
    }

    const userTier = user.subscriptionTier;
    
    if (!userTier || userTier.status !== 'active') {
      return {
        allowed: false,
        reason: 'Active subscription required',
        requiredTier: `${requiredTierLevel} Subscriber`.replace('basic', 'Basic').replace('pro', 'Pro').replace('vip', 'VIP'),
        upgradeUrl: '/subscription'
      };
    }

    const tierHierarchy = { basic: 1, pro: 2, premium: 3, vip: 4 };
    const userLevel = tierHierarchy[userTier.level as keyof typeof tierHierarchy] || 0;
    const requiredLevel = tierHierarchy[requiredTierLevel] || 0;

    if (userLevel < requiredLevel) {
      return {
        allowed: false,
        reason: `${requiredTierLevel.charAt(0).toUpperCase() + requiredTierLevel.slice(1)} Subscriber tier or higher required`,
        requiredTier: `${requiredTierLevel} Subscriber`.replace('basic', 'Basic').replace('pro', 'Pro').replace('vip', 'VIP'),
        currentTier: userTier.name,
        upgradeUrl: '/subscription'
      };
    }

    return { allowed: true };
  }

  /**
   * Get upgrade recommendations based on user's current usage
   */
  public getUpgradeRecommendations(
    user: User | null,
    usage: {
      dailyUploads?: number;
      dailyMessages?: number;
      storageUsedGB?: number;
      monthlyEarnings?: number;
    } = {}
  ): Array<{
    feature: string;
    reason: string;
    recommendedTier: string;
    benefit: string;
  }> {
    if (!user || !user.subscriptionTier) return [];

    const recommendations: Array<{
      feature: string;
      reason: string;
      recommendedTier: string;
      benefit: string;
    }> = [];

    const currentTier = user.subscriptionTier;

    // Creator-specific recommendations
    if (user.role === 'creator' && currentTier.creatorFeatures) {
      const features = currentTier.creatorFeatures;

      // Upload limits
      if (usage.dailyUploads && features.maxUploadsPerDay !== -1) {
        const utilizationRate = usage.dailyUploads / features.maxUploadsPerDay;
        if (utilizationRate > 0.8) {
          recommendations.push({
            feature: 'Upload Limits',
            reason: `Using ${Math.round(utilizationRate * 100)}% of daily upload limit`,
            recommendedTier: currentTier.level === 'basic' ? 'Pro Creator' : 'Premium Creator',
            benefit: 'Get unlimited or higher daily upload limits'
          });
        }
      }

      // Storage recommendations
      if (usage.storageUsedGB && features.maxStorageGB !== -1) {
        const storageUtilization = usage.storageUsedGB / features.maxStorageGB;
        if (storageUtilization > 0.8) {
          recommendations.push({
            feature: 'Storage Space',
            reason: `Using ${Math.round(storageUtilization * 100)}% of storage limit`,
            recommendedTier: 'Premium Creator',
            benefit: 'Get unlimited storage space'
          });
        }
      }

      // Earnings-based recommendations
      if (usage.monthlyEarnings) {
        const platformFee = features.platformFeePercentage / 100;
        const currentTake = usage.monthlyEarnings * (1 - platformFee);
        
        if (currentTier.level === 'basic' && usage.monthlyEarnings > 100) {
          const proTake = usage.monthlyEarnings * 0.85; // 15% fee
          const savings = proTake - currentTake;
          
          recommendations.push({
            feature: 'Platform Fees',
            reason: `Could save $${savings.toFixed(2)}/month with lower fees`,
            recommendedTier: 'Pro Creator',
            benefit: 'Reduce platform fee from 20% to 15%'
          });
        }
        
        if (currentTier.level === 'pro' && usage.monthlyEarnings > 500) {
          const premiumTake = usage.monthlyEarnings * 0.90; // 10% fee
          const savings = premiumTake - currentTake;
          
          recommendations.push({
            feature: 'Platform Fees',
            reason: `Could save $${savings.toFixed(2)}/month with lower fees`,
            recommendedTier: 'Premium Creator',
            benefit: 'Reduce platform fee from 15% to 10%'
          });
        }
      }

      // Feature-based recommendations
      if (!features.liveStreamingEnabled) {
        recommendations.push({
          feature: 'Live Streaming',
          reason: 'Unlock live streaming capabilities',
          recommendedTier: 'Pro Creator',
          benefit: 'Engage with subscribers in real-time'
        });
      }

      if (!features.customBranding) {
        recommendations.push({
          feature: 'Custom Branding',
          reason: 'Stand out with custom branding',
          recommendedTier: 'Pro Creator',
          benefit: 'Personalize your creator profile'
        });
      }
    }

    // Subscriber-specific recommendations
    if (user.role === 'subscriber') {
      if (usage.dailyMessages && currentTier.messagingFeatures.maxConversationsPerDay !== -1) {
        const messageUtilization = usage.dailyMessages / currentTier.messagingFeatures.maxConversationsPerDay;
        if (messageUtilization > 0.8) {
          recommendations.push({
            feature: 'Messaging Limits',
            reason: `Using ${Math.round(messageUtilization * 100)}% of daily message limit`,
            recommendedTier: currentTier.level === 'basic' ? 'Pro Subscriber' : 'VIP Subscriber',
            benefit: 'Get unlimited or higher messaging limits'
          });
        }
      }

      if (!currentTier.contentAccess.canViewPremiumContent) {
        recommendations.push({
          feature: 'Premium Content',
          reason: 'Access exclusive premium content',
          recommendedTier: 'Pro Subscriber',
          benefit: 'View premium content from all creators'
        });
      }

      if (!currentTier.contentAccess.canViewExclusiveContent) {
        recommendations.push({
          feature: 'VIP Exclusive Content',
          reason: 'Access the most exclusive content',
          recommendedTier: 'VIP Subscriber',
          benefit: 'View VIP-only content and events'
        });
      }
    }

    return recommendations.slice(0, 3); // Return top 3 recommendations
  }

  /**
   * Check if user can perform batch operations
   */
  public validateBatchOperation(
    user: User | null,
    operation: 'bulk_upload' | 'bulk_message' | 'bulk_delete',
    itemCount: number
  ): PermissionCheck {
    if (!user) {
      return {
        allowed: false,
        reason: 'Login required for batch operations',
        upgradeUrl: '/login'
      };
    }

    const userTier = user.subscriptionTier;
    
    if (!userTier || userTier.status !== 'active') {
      return {
        allowed: false,
        reason: 'Active subscription required for batch operations',
        upgradeUrl: '/subscription'
      };
    }

    switch (operation) {
      case 'bulk_upload':
        if (user.role !== 'creator') {
          return {
            allowed: false,
            reason: 'Only creators can bulk upload content'
          };
        }
        
        if (!userTier.creatorFeatures?.advancedScheduling) {
          return {
            allowed: false,
            reason: 'Bulk upload requires Pro Creator or higher',
            requiredTier: 'Pro Creator',
            currentTier: userTier.name,
            upgradeUrl: '/subscription'
          };
        }
        break;

      case 'bulk_message':
        const bulkLimit = userTier.creatorFeatures?.bulkMessageLimit || 0;
        if (bulkLimit === 0) {
          return {
            allowed: false,
            reason: 'Bulk messaging requires Pro Creator or higher',
            requiredTier: 'Pro Creator',
            currentTier: userTier.name,
            upgradeUrl: '/subscription'
          };
        }
        
        if (bulkLimit !== -1 && itemCount > bulkLimit) {
          return {
            allowed: false,
            reason: `Bulk message limit exceeded (${bulkLimit} max)`,
            requiredTier: 'Premium Creator',
            currentTier: userTier.name,
            upgradeUrl: '/subscription'
          };
        }
        break;

      case 'bulk_delete':
        // Basic bulk delete is allowed for all tiers
        if (itemCount > 50 && userTier.level === 'basic') {
          return {
            allowed: false,
            reason: 'Large bulk operations require Pro tier or higher',
            requiredTier: 'Pro Creator',
            currentTier: userTier.name,
            upgradeUrl: '/subscription'
          };
        }
        break;
    }

    return { allowed: true };
  }
}

// Export singleton instance
export const tierValidationService = TierValidationService.getInstance();

// Export convenience functions
export const validateTierAccess = tierValidationService.validateContentAccess.bind(tierValidationService);
export const validateTierMessaging = tierValidationService.validateMessaging.bind(tierValidationService);
export const validateTierUpload = tierValidationService.validateContentUpload.bind(tierValidationService);
export const validateTierStreaming = tierValidationService.validateLiveStreaming.bind(tierValidationService);
export const validateTierFeature = tierValidationService.validateAdvancedCreatorFeatures.bind(tierValidationService);
export const getUpgradeRecommendations = tierValidationService.getUpgradeRecommendations.bind(tierValidationService);
