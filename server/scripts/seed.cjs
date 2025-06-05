const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create subscription tiers for subscribers
    const subscriberTiers = [
      {
        name: 'Basic Subscriber',
        type: 'SUBSCRIBER',
        level: 'BASIC',
        price: 9.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Access to basic content from your favorite creators',
        features: {
          contentAccess: ['public', 'subscribers'],
          messaging: { enabled: true, dailyLimit: 50 },
          downloads: { enabled: false },
          adFree: true,
          supportPriority: 'standard'
        },
        limitations: {
          messagingDaily: 50,
          downloadMonthly: 0,
          liveStreamAccess: false
        },
        messagingFeatures: {
          directMessages: true,
          groupChats: false,
          fileSharing: false,
          voiceMessages: false,
          videoChat: false
        },
        contentAccess: {
          levels: ['PUBLIC', 'SUBSCRIBERS'],
          excludes: ['PREMIUM'],
          downloadEnabled: false
        },
        isPopular: false,
        color: '#10B981',
        badge: '✨',
        isActive: true
      },
      {
        name: 'Pro Subscriber',
        type: 'SUBSCRIBER',
        level: 'PRO',
        price: 19.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Enhanced access with premium content and features',
        features: {
          contentAccess: ['public', 'subscribers', 'premium'],
          messaging: { enabled: true, dailyLimit: 200 },
          downloads: { enabled: true, monthlyLimit: 100 },
          adFree: true,
          supportPriority: 'priority'
        },
        limitations: {
          messagingDaily: 200,
          downloadMonthly: 100,
          liveStreamAccess: true
        },
        messagingFeatures: {
          directMessages: true,
          groupChats: true,
          fileSharing: true,
          voiceMessages: true,
          videoChat: false
        },
        contentAccess: {
          levels: ['PUBLIC', 'SUBSCRIBERS', 'PREMIUM'],
          excludes: [],
          downloadEnabled: true,
          downloadLimit: 100
        },
        isPopular: true,
        color: '#8B5CF6',
        badge: '🚀',
        isActive: true
      },
      {
        name: 'VIP Subscriber',
        type: 'SUBSCRIBER',
        level: 'VIP',
        price: 39.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Ultimate access with exclusive VIP content and perks',
        features: {
          contentAccess: ['public', 'subscribers', 'premium', 'vip'],
          messaging: { enabled: true, unlimited: true },
          downloads: { enabled: true, unlimited: true },
          adFree: true,
          supportPriority: 'vip'
        },
        limitations: {
          messagingDaily: -1,
          downloadMonthly: -1,
          liveStreamAccess: true
        },
        messagingFeatures: {
          directMessages: true,
          groupChats: true,
          fileSharing: true,
          voiceMessages: true,
          videoChat: true
        },
        contentAccess: {
          levels: ['PUBLIC', 'SUBSCRIBERS', 'PREMIUM', 'PRIVATE'],
          excludes: [],
          downloadEnabled: true,
          unlimited: true
        },
        isPopular: false,
        color: '#F59E0B',
        badge: '👑',
        isActive: true
      }
    ];

    // Create subscription tiers for creators
    const creatorTiers = [
      {
        name: 'Basic Creator',
        type: 'CREATOR',
        level: 'BASIC',
        price: 0.00,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Start your creative journey with essential tools',
        features: {
          uploads: { maxFileSize: 100, videoQuality: '720p' },
          analytics: { basic: true, advanced: false },
          messaging: { bulkMessaging: false },
          monetization: { tips: true, customPricing: false },
          promotion: { featured: false, boost: false }
        },
        limitations: {
          uploadSizeMB: 100,
          videoQuality: '720p',
          monthlyUploads: 50,
          bulkMessaging: false
        },
        messagingFeatures: {
          directMessages: true,
          bulkMessages: false,
          autoReplies: false,
          messageTemplates: false
        },
        creatorFeatures: {
          uploadLimit: 100,
          videoQuality: '720p',
          liveStreaming: false,
          analytics: 'basic',
          customBranding: false,
          prioritySupport: false
        },
        isPopular: false,
        color: '#6B7280',
        badge: '🎨',
        isActive: true
      },
      {
        name: 'Pro Creator',
        type: 'CREATOR',
        level: 'PRO',
        price: 29.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Advanced tools for growing creators',
        features: {
          uploads: { maxFileSize: 500, videoQuality: '1080p' },
          analytics: { basic: true, advanced: true },
          messaging: { bulkMessaging: true, dailyLimit: 100 },
          monetization: { tips: true, customPricing: true },
          promotion: { featured: true, boost: false }
        },
        limitations: {
          uploadSizeMB: 500,
          videoQuality: '1080p',
          monthlyUploads: 200,
          bulkMessagingDaily: 100
        },
        messagingFeatures: {
          directMessages: true,
          bulkMessages: true,
          autoReplies: true,
          messageTemplates: true
        },
        creatorFeatures: {
          uploadLimit: 500,
          videoQuality: '1080p',
          liveStreaming: true,
          analytics: 'advanced',
          customBranding: true,
          prioritySupport: false
        },
        isPopular: true,
        color: '#3B82F6',
        badge: '⭐',
        isActive: true
      },
      {
        name: 'Premium Creator',
        type: 'CREATOR',
        level: 'PREMIUM',
        price: 59.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Ultimate creator toolkit with maximum features',
        features: {
          uploads: { maxFileSize: 2000, videoQuality: '4K' },
          analytics: { basic: true, advanced: true, realTime: true },
          messaging: { bulkMessaging: true, dailyLimit: 500 },
          monetization: { tips: true, customPricing: true, exclusiveDeals: true },
          promotion: { featured: true, boost: true, priority: true }
        },
        limitations: {
          uploadSizeMB: 2000,
          videoQuality: '4K',
          monthlyUploads: -1,
          bulkMessagingDaily: 500
        },
        messagingFeatures: {
          directMessages: true,
          bulkMessages: true,
          autoReplies: true,
          messageTemplates: true
        },
        creatorFeatures: {
          uploadLimit: 2000,
          videoQuality: '4K',
          liveStreaming: true,
          analytics: 'premium',
          customBranding: true,
          prioritySupport: true
        },
        isPopular: false,
        color: '#EF4444',
        badge: '🏆',
        isActive: true
      }
    ];

    // Insert subscription tiers
    console.log('📦 Creating subscription tiers...');
    
    // Clear existing tiers first (development only)
    await prisma.platformSubscriptionTier.deleteMany({});
    
    // Create all tiers
    await prisma.platformSubscriptionTier.createMany({
      data: [...subscriberTiers, ...creatorTiers]
    });

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await prisma.user.upsert({
      where: { email: 'admin@onlyfur.com' },
      update: {},
      create: {
        email: 'admin@onlyfur.com',
        username: 'admin',
        displayName: 'Platform Administrator',
        role: 'ADMIN',
        password: hashedPassword,
        isVerified: true,
        isActive: true,
        isEmailVerified: true,
        authProvider: 'EMAIL',
        subscriptionStatus: 'FREE',
        bio: 'OnlyFur Platform Administrator',
        avatar: '/images/branding/paw-logo.jpg'
      }
    });

    // Create sample users
    console.log('👥 Creating sample users...');
    
    // Sample Creator
    const creatorPassword = await bcrypt.hash('creator123', 12);
    await prisma.user.upsert({
      where: { email: 'creator@onlyfur.com' },
      update: {},
      create: {
        email: 'creator@onlyfur.com',
        username: 'samplecreator',
        displayName: 'Furry Artist',
        role: 'CREATOR',
        password: creatorPassword,
        isVerified: true,
        isActive: true,
        isEmailVerified: true,
        authProvider: 'EMAIL',
        subscriptionStatus: 'FREE',
        bio: 'Professional furry artist sharing exclusive content with fans. Commission work available!',
        avatar: '/images/branding/fox-mascot.webp',
        coverImage: '/images/branding/fursuit-icon.jpg',
        socialLinks: {
          twitter: '@furryartist',
          instagram: '@furryartwork',
          portfolio: 'https://furryart.example.com'
        }
      }
    });

    // Sample Subscriber
    const subscriberPassword = await bcrypt.hash('subscriber123', 12);
    await prisma.user.upsert({
      where: { email: 'subscriber@onlyfur.com' },
      update: {},
      create: {
        email: 'subscriber@onlyfur.com',
        username: 'furryfan',
        displayName: 'Furry Fan',
        role: 'SUBSCRIBER',
        password: subscriberPassword,
        isVerified: true,
        isActive: true,
        isEmailVerified: true,
        authProvider: 'EMAIL',
        subscriptionStatus: 'FREE',
        bio: 'Love supporting furry creators and enjoying amazing content!',
        avatar: '/images/branding/paw-favicon.png'
      }
    });

    // Create sample content
    console.log('📝 Creating sample content...');
    const creator = await prisma.user.findUnique({
      where: { email: 'creator@onlyfur.com' }
    });

    if (creator) {
      await prisma.content.createMany({
        data: [
          {
            creatorId: creator.id,
            title: 'Welcome to My Furry Art World!',
            description: 'A special welcome post for all my new followers. Thank you for supporting furry art!',
            type: 'TEXT',
            mediaUrls: [],
            privacyLevel: 'PUBLIC',
            status: 'PUBLISHED',
            tags: ['welcome', 'furryart', 'introduction'],
            category: 'Announcement',
            likesCount: 15,
            commentsCount: 8,
            viewsCount: 142
          },
          {
            creatorId: creator.id,
            title: 'Exclusive Fursuit Photo Session',
            description: 'Behind-the-scenes photos from my latest fursuit photoshoot. Subscribers only!',
            type: 'PHOTO',
            mediaUrls: ['/images/branding/fursuit-icon.jpg'],
            thumbnailUrl: '/images/branding/fursuit-icon.jpg',
            privacyLevel: 'SUBSCRIBERS',
            status: 'PUBLISHED',
            tags: ['fursuit', 'photoshoot', 'exclusive'],
            category: 'Photography',
            likesCount: 28,
            commentsCount: 12,
            viewsCount: 89
          },
          {
            creatorId: creator.id,
            title: 'Premium Art Commission Process',
            description: 'Watch me create a custom character design from sketch to final art. Premium subscribers get access to the full process!',
            type: 'VIDEO',
            mediaUrls: [],
            privacyLevel: 'PREMIUM',
            status: 'PUBLISHED',
            tags: ['commission', 'process', 'art', 'premium'],
            category: 'Tutorial',
            likesCount: 45,
            commentsCount: 23,
            viewsCount: 156
          }
        ]
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Created:');
    console.log(`  - ${subscriberTiers.length} subscriber tiers`);
    console.log(`  - ${creatorTiers.length} creator tiers`);
    console.log('  - 3 sample users (admin, creator, subscriber)');
    console.log('  - 3 sample content items');
    console.log('');
    console.log('🔐 Login credentials:');
    console.log('  Admin: admin@onlyfur.com / admin123');
    console.log('  Creator: creator@onlyfur.com / creator123');
    console.log('  Subscriber: subscriber@onlyfur.com / subscriber123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
