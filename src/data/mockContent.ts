import { Content, User } from '@/types';

// Mock creators
export const mockCreators: User[] = [
  {
    id: 'creator-1',
    email: 'demo@onlyfur.com',
    username: 'demofox',
    displayName: 'Demo Fox',
    avatar: '/images/branding/fox-mascot.webp',
    role: 'creator',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    subscriptionTier: {
      id: 'pro-creator',
      name: 'Pro Creator',
      type: 'creator',
      level: 'pro',
      features: [],
      messagingPermissions: {
        canReceiveMessages: true,
        allowedSenderTiers: ['basic-subscriber', 'pro-subscriber', 'vip-subscriber'],
        canSendBulkMessages: true,
        maxMessagesPerDay: 100,
        canSendMedia: true,
        canReceiveTips: true,
      },
      contentAccessLevel: 2,
      canAccessPremiumContent: true,
      canMessageCreators: true,
      maxConversations: 50,
      supportLevel: 'priority',
      status: 'active',
    },
  },
  {
    id: 'creator-2',
    email: 'creator2@onlyfur.com',
    username: 'artdragon',
    displayName: 'Art Dragon',
    avatar: '/images/branding/fursuit-icon.jpg',
    role: 'creator',
    isVerified: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
  {
    id: 'creator-3',
    email: 'creator3@onlyfur.com',
    username: 'fursuitwolf',
    displayName: 'Fursuit Wolf',
    avatar: '/images/branding/paw-logo.jpg',
    role: 'creator',
    isVerified: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date(),
  },
];

// Mock content with different privacy levels
export const mockContent: Content[] = [
  {
    id: 'content-1',
    creatorId: 'creator-1',
    title: 'Welcome to my furry world! 🦊',
    description: 'Hey everyone! So excited to share my latest fursuit photos with you all. This is my newest fox character design.',
    type: 'photo',
    mediaUrl: '/images/branding/fox-mascot.webp',
    thumbnailUrl: '/images/branding/fox-mascot.webp',
    isPublic: true,
    requiresSubscription: false,
    privacyLevel: 'public',
    status: 'published',
    tags: ['fursuit', 'fox', 'character', 'introduction'],
    category: 'fursuit',
    likesCount: 124,
    commentsCount: 23,
    viewsCount: 1250,
    sharesCount: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'content-2',
    creatorId: 'creator-1',
    title: 'Exclusive fursuit photoshoot behind the scenes',
    description: 'Get an exclusive look at my latest photoshoot! See how I pose and bring my character to life.',
    type: 'photo',
    mediaUrl: '/images/branding/fursuit-icon.jpg',
    thumbnailUrl: '/images/branding/fursuit-icon.jpg',
    isPublic: false,
    requiresSubscription: true,
    privacyLevel: 'subscribers',
    status: 'published',
    tags: ['fursuit', 'photoshoot', 'exclusive', 'bts'],
    category: 'fursuit',
    likesCount: 89,
    commentsCount: 34,
    viewsCount: 567,
    sharesCount: 8,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(),
  },
  {
    id: 'content-3',
    creatorId: 'creator-2',
    title: 'Premium art commission showcase',
    description: 'Check out this amazing commission I just finished! Only available to premium subscribers.',
    type: 'photo',
    mediaUrl: '/images/branding/onlyfur-logo.png',
    thumbnailUrl: '/images/branding/onlyfur-logo.png',
    isPublic: false,
    requiresSubscription: true,
    privacyLevel: 'premium',
    status: 'published',
    tags: ['art', 'commission', 'premium', 'digital'],
    category: 'art',
    likesCount: 156,
    commentsCount: 45,
    viewsCount: 789,
    sharesCount: 22,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(),
  },
  {
    id: 'content-4',
    creatorId: 'creator-3',
    title: 'VIP exclusive: Convention meet & greet',
    description: 'Super exclusive content from the recent convention! VIP subscribers only.',
    type: 'video',
    mediaUrl: '/images/branding/paw-favicon.png',
    thumbnailUrl: '/images/branding/paw-favicon.png',
    isPublic: false,
    requiresSubscription: true,
    privacyLevel: 'private',
    status: 'published',
    tags: ['convention', 'vip', 'exclusive', 'meetup'],
    category: 'event',
    duration: 180, // 3 minutes
    likesCount: 67,
    commentsCount: 12,
    viewsCount: 234,
    sharesCount: 4,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(),
  },
  {
    id: 'content-5',
    creatorId: 'creator-2',
    title: 'Free furry art tutorial',
    description: 'Learn how to draw furry characters with this step-by-step tutorial! Free for everyone to enjoy.',
    type: 'text',
    isPublic: true,
    requiresSubscription: false,
    privacyLevel: 'public',
    status: 'published',
    tags: ['tutorial', 'art', 'free', 'education'],
    category: 'tutorial',
    likesCount: 298,
    commentsCount: 67,
    viewsCount: 2134,
    sharesCount: 89,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(),
  },
];

export const getCreatorById = (id: string): User | undefined => {
  return mockCreators.find(creator => creator.id === id);
};

export const getContentWithCreators = () => {
  return mockContent.map(content => ({
    content,
    creator: getCreatorById(content.creatorId)!,
  }));
};

// Sort content to show newest public content first (for non-subscribers)
export const getSortedContent = () => {
  const contentWithCreators = getContentWithCreators();
  
  // Sort by: public content first, then by creation date (newest first)
  return contentWithCreators.sort((a, b) => {
    // First, prioritize public content
    if (a.content.privacyLevel === 'public' && b.content.privacyLevel !== 'public') {
      return -1;
    }
    if (a.content.privacyLevel !== 'public' && b.content.privacyLevel === 'public') {
      return 1;
    }
    
    // Then sort by date (newest first)
    return b.content.createdAt.getTime() - a.content.createdAt.getTime();
  });
};
