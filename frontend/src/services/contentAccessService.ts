import { Content, User } from '@/types';
import { tierValidationService } from './tierValidationService';

/**
 * Content Access Service
 * Handles content filtering and access control logic for the OnlyFur platform
 */

export interface ContentWithAccess {
  content: Content;
  canAccess: boolean;
  isNewestPost: boolean;
  accessReason?: string;
  requiredTier?: string;
  isPreview?: boolean;
}

export interface CreatorContentGroup {
  creatorId: string;
  creatorName: string;
  newestPublicPost?: ContentWithAccess;
  restrictedContent: ContentWithAccess[];
  accessibleContent: ContentWithAccess[];
}

export class ContentAccessService {
  private static instance: ContentAccessService;

  private constructor() {}

  public static getInstance(): ContentAccessService {
    if (!ContentAccessService.instance) {
      ContentAccessService.instance = new ContentAccessService();
    }
    return ContentAccessService.instance;
  }

  /**
   * Filter content based on user's subscription and access rights
   * Implements the "newest post visible, rest blurred" logic
   */
  public filterContentForUser(
    allContent: Content[], 
    user: User | null,
    options: {
      groupByCreator?: boolean;
      showPreviewsOnly?: boolean;
      includePublicContent?: boolean;
    } = {}
  ): ContentWithAccess[] {
    const { groupByCreator = false, showPreviewsOnly = false, includePublicContent = true } = options;

    // Sort content by creation date (newest first)
    const sortedContent = [...allContent].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (groupByCreator) {
      return this.filterContentByCreator(sortedContent, user, options);
    }

    return this.filterContentFlat(sortedContent, user, options);
  }

  /**
   * Filter content grouped by creator with newest post logic
   */
  public filterContentByCreator(
    content: Content[], 
    user: User | null,
    options: { showPreviewsOnly?: boolean; includePublicContent?: boolean } = {}
  ): ContentWithAccess[] {
    const { showPreviewsOnly = false, includePublicContent = true } = options;
    
    // Group content by creator
    const contentByCreator = new Map<string, Content[]>();
    
    content.forEach(item => {
      if (!contentByCreator.has(item.creatorId)) {
        contentByCreator.set(item.creatorId, []);
      }
      contentByCreator.get(item.creatorId)!.push(item);
    });

    const result: ContentWithAccess[] = [];

    // Process each creator's content
    contentByCreator.forEach((creatorContent, creatorId) => {
      // Sort creator's content by date (newest first)
      const sortedCreatorContent = creatorContent.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Find the newest public post for non-subscribers
      const newestPublicPost = sortedCreatorContent.find(
        item => item.privacyLevel === 'public'
      );

      // Process each piece of content
      sortedCreatorContent.forEach((item, index) => {
        const isNewestPost = index === 0 && item.privacyLevel === 'public';
        const isNewestPublicForCreator = newestPublicPost?.id === item.id;
        
        // For non-authenticated users or non-subscribers
        if (!user || !this.hasValidSubscription(user)) {
          if (isNewestPublicForCreator) {
            // Show newest public post as preview
            result.push({
              content: item,
              canAccess: true,
              isNewestPost: true,
              isPreview: true
            });
          } else if (includePublicContent && item.privacyLevel === 'public') {
            // Show other public content normally
            result.push({
              content: item,
              canAccess: true,
              isNewestPost: false,
              isPreview: false
            });
          } else if (!showPreviewsOnly) {
            // Show restricted content as blurred
            result.push({
              content: item,
              canAccess: false,
              isNewestPost: false,
              accessReason: 'Subscription required to view this content',
              requiredTier: this.getRequiredTierForContent(item),
              isPreview: false
            });
          }
        } else {
          // For authenticated users with subscriptions
          const accessCheck = tierValidationService.validateContentAccess(user, item, { isNewestPost });
          
          result.push({
            content: item,
            canAccess: accessCheck.allowed,
            isNewestPost,
            accessReason: accessCheck.reason,
            requiredTier: accessCheck.requiredTier,
            isPreview: false
          });
        }
      });
    });

    return result.sort(
      (a, b) => new Date(b.content.createdAt).getTime() - new Date(a.content.createdAt).getTime()
    );
  }

  /**
   * Filter content in flat list format
   */
  private filterContentFlat(
    content: Content[], 
    user: User | null,
    options: { showPreviewsOnly?: boolean; includePublicContent?: boolean } = {}
  ): ContentWithAccess[] {
    const { showPreviewsOnly = false, includePublicContent = true } = options;
    const result: ContentWithAccess[] = [];

    // Track newest public post per creator for preview logic
    const newestPublicByCreator = new Map<string, Content>();
    
    content.forEach(item => {
      if (item.privacyLevel === 'public') {
        const existing = newestPublicByCreator.get(item.creatorId);
        if (!existing || new Date(item.createdAt) > new Date(existing.createdAt)) {
          newestPublicByCreator.set(item.creatorId, item);
        }
      }
    });

    content.forEach(item => {
      const isNewestPublicForCreator = newestPublicByCreator.get(item.creatorId)?.id === item.id;
      
      // For non-authenticated users or non-subscribers
      if (!user || !this.hasValidSubscription(user)) {
        if (isNewestPublicForCreator) {
          // Show newest public post as preview
          result.push({
            content: item,
            canAccess: true,
            isNewestPost: true,
            isPreview: true
          });
        } else if (includePublicContent && item.privacyLevel === 'public') {
          // Show other public content normally
          result.push({
            content: item,
            canAccess: true,
            isNewestPost: false,
            isPreview: false
          });
        } else if (!showPreviewsOnly) {
          // Show restricted content as blurred
          result.push({
            content: item,
            canAccess: false,
            isNewestPost: false,
            accessReason: 'Subscription required to view this content',
            requiredTier: this.getRequiredTierForContent(item),
            isPreview: false
          });
        }
      } else {
        // For authenticated users with subscriptions
        const accessCheck = tierValidationService.validateContentAccess(
          user, 
          item, 
          { isNewestPost: isNewestPublicForCreator }
        );
        
        result.push({
          content: item,
          canAccess: accessCheck.allowed,
          isNewestPost: isNewestPublicForCreator,
          accessReason: accessCheck.reason,
          requiredTier: accessCheck.requiredTier,
          isPreview: false
        });
      }
    });

    return result;
  }

  /**
   * Get content grouped by creator with access information
   */
  public getContentByCreator(
    content: Content[], 
    user: User | null
  ): CreatorContentGroup[] {
    const contentByCreator = new Map<string, Content[]>();
    
    // Group content by creator
    content.forEach(item => {
      if (!contentByCreator.has(item.creatorId)) {
        contentByCreator.set(item.creatorId, []);
      }
      contentByCreator.get(item.creatorId)!.push(item);
    });

    const result: CreatorContentGroup[] = [];

    contentByCreator.forEach((creatorContent, creatorId) => {
      // Sort content by date (newest first)
      const sortedContent = creatorContent.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Find newest public post
      const newestPublicPost = sortedContent.find(item => item.privacyLevel === 'public');
      
      const group: CreatorContentGroup = {
        creatorId,
        creatorName: `Creator ${creatorId}`, // In real app, get from creator data
        restrictedContent: [],
        accessibleContent: []
      };

      // Set newest public post as preview for non-subscribers
      if (newestPublicPost && (!user || !this.hasValidSubscription(user))) {
        group.newestPublicPost = {
          content: newestPublicPost,
          canAccess: true,
          isNewestPost: true,
          isPreview: true
        };
      }

      // Categorize remaining content
      sortedContent.forEach(item => {
        const isNewestPublic = newestPublicPost?.id === item.id;
        
        if (isNewestPublic && (!user || !this.hasValidSubscription(user))) {
          // Skip - already handled as newest public post
          return;
        }

        const accessCheck = tierValidationService.validateContentAccess(user, item, { isNewestPost: false });
        
        if (accessCheck.allowed) {
          group.accessibleContent.push({
            content: item,
            canAccess: true,
            isNewestPost: false,
            isPreview: false
          });
        } else {
          group.restrictedContent.push({
            content: item,
            canAccess: false,
            isNewestPost: false,
            accessReason: accessCheck.reason,
            requiredTier: accessCheck.requiredTier,
            isPreview: false
          });
        }
      });

      result.push(group);
    });

    return result;
  }

  /**
   * Check if content should be shown as preview (newest public post)
   */
  public isPreviewContent(content: Content, allCreatorContent: Content[]): boolean {
    if (content.privacyLevel !== 'public') return false;
    
    const creatorContent = allCreatorContent
      .filter(item => item.creatorId === content.creatorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const newestPublic = creatorContent.find(item => item.privacyLevel === 'public');
    return newestPublic?.id === content.id;
  }

  /**
   * Get subscription upgrade recommendations based on restricted content
   */
  public getUpgradeRecommendations(
    restrictedContent: ContentWithAccess[],
    user: User | null
  ): Array<{
    tierName: string;
    contentCount: number;
    benefits: string[];
    estimatedValue: string;
  }> {
    if (!restrictedContent.length) return [];

    const tierCounts: Record<string, number> = {};
    
    restrictedContent.forEach(item => {
      if (item.requiredTier) {
        tierCounts[item.requiredTier] = (tierCounts[item.requiredTier] || 0) + 1;
      }
    });

    return Object.entries(tierCounts)
      .map(([tierName, count]) => ({
        tierName,
        contentCount: count,
        benefits: this.getTierBenefits(tierName),
        estimatedValue: this.calculateEstimatedValue(tierName, count)
      }))
      .sort((a, b) => b.contentCount - a.contentCount);
  }

  /**
   * Get content feed optimized for user's subscription level
   */
  public getOptimizedFeed(
    content: Content[],
    user: User | null,
    options: {
      includeUpgradePrompts?: boolean;
      maxRestrictedItems?: number;
      prioritizeCreators?: string[];
    } = {}
  ): ContentWithAccess[] {
    const { 
      includeUpgradePrompts = true, 
      maxRestrictedItems = 5,
      prioritizeCreators = []
    } = options;

    let filteredContent = this.filterContentForUser(content, user, { 
      includePublicContent: true 
    });

    // Prioritize content from specified creators
    if (prioritizeCreators.length > 0) {
      filteredContent.sort((a, b) => {
        const aPriority = prioritizeCreators.includes(a.content.creatorId) ? 1 : 0;
        const bPriority = prioritizeCreators.includes(b.content.creatorId) ? 1 : 0;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority; // Higher priority first
        }
        
        // Sort by date within same priority level
        return new Date(b.content.createdAt).getTime() - new Date(a.content.createdAt).getTime();
      });
    }

    // Limit restricted content to avoid overwhelming users
    if (!includeUpgradePrompts) {
      filteredContent = filteredContent.filter(item => item.canAccess);
    } else {
      const accessibleContent = filteredContent.filter(item => item.canAccess);
      const restrictedContent = filteredContent
        .filter(item => !item.canAccess)
        .slice(0, maxRestrictedItems);
      
      // Interleave accessible and restricted content
      filteredContent = this.interleaveContent(accessibleContent, restrictedContent);
    }

    return filteredContent;
  }

  /**
   * Helper methods
   */
  private hasValidSubscription(user: User): boolean {
    return !!(user.subscriptionTier && user.subscriptionTier.status === 'active');
  }

  private getRequiredTierForContent(content: Content): string {
    switch (content.privacyLevel) {
      case 'subscribers': return 'Basic Subscriber';
      case 'premium': return 'Pro Subscriber';
      case 'private': return 'VIP Subscriber';
      default: return 'Subscription';
    }
  }

  private getTierBenefits(tierName: string): string[] {
    const benefits: Record<string, string[]> = {
      'Basic Subscriber': [
        'Access to all subscriber content',
        'Direct messaging with creators',
        'Community discussions',
        'Early access to posts'
      ],
      'Pro Subscriber': [
        'All Basic benefits',
        'Premium HD content',
        'Download content offline',
        'Priority support',
        'Advanced messaging features'
      ],
      'VIP Subscriber': [
        'All Pro benefits',
        'VIP exclusive content',
        'Unlimited messaging',
        'Ultra HD streaming',
        'VIP events and perks'
      ]
    };
    
    return benefits[tierName] || ['Enhanced content access'];
  }

  private calculateEstimatedValue(tierName: string, contentCount: number): string {
    const basePrices: Record<string, number> = {
      'Basic Subscriber': 9.99,
      'Pro Subscriber': 19.99,
      'VIP Subscriber': 39.99
    };
    
    const price = basePrices[tierName] || 9.99;
    const valuePerContent = price / Math.max(contentCount, 1);
    
    return `$${valuePerContent.toFixed(2)} per content`;
  }

  private interleaveContent(
    accessible: ContentWithAccess[], 
    restricted: ContentWithAccess[]
  ): ContentWithAccess[] {
    const result: ContentWithAccess[] = [];
    const maxLength = Math.max(accessible.length, restricted.length);
    
    for (let i = 0; i < maxLength; i++) {
      // Add 2-3 accessible items
      for (let j = 0; j < 3 && (i * 3 + j) < accessible.length; j++) {
        result.push(accessible[i * 3 + j]);
      }
      
      // Add 1 restricted item
      if (i < restricted.length) {
        result.push(restricted[i]);
      }
    }
    
    return result;
  }
}

// Export singleton instance
export const contentAccessService = ContentAccessService.getInstance();

// Export convenience functions
export const filterContentForUser = contentAccessService.filterContentForUser.bind(contentAccessService);
export const getContentByCreator = contentAccessService.getContentByCreator.bind(contentAccessService);
export const getOptimizedFeed = contentAccessService.getOptimizedFeed.bind(contentAccessService);
export const isPreviewContent = contentAccessService.isPreviewContent.bind(contentAccessService);
export const getUpgradeRecommendations = contentAccessService.getUpgradeRecommendations.bind(contentAccessService);
