import { PrismaClient } from '@prisma/client';
import { logger, logDatabaseOperation } from '../middleware/logger';

// Extend PrismaClient with logging
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Log database queries in development
if (process.env.NODE_ENV === 'development' && process.env.ENABLE_DEBUG_LOGGING === 'true') {
  prisma.$on('query', (e) => {
    logDatabaseOperation('Query', 'N/A', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
      timestamp: e.timestamp
    });
  });
}

// Log database errors
prisma.$on('error', (e) => {
  logger.error('Database Error:', {
    message: e.message,
    target: e.target,
    timestamp: e.timestamp
  });
});

// Log database info and warnings
prisma.$on('info', (e) => {
  logger.info('Database Info:', {
    message: e.message,
    target: e.target,
    timestamp: e.timestamp
  });
});

prisma.$on('warn', (e) => {
  logger.warn('Database Warning:', {
    message: e.message,
    target: e.target,
    timestamp: e.timestamp
  });
});

// Database initialization
export async function initializeDatabase(): Promise<void> {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Successfully connected to PostgreSQL database');

    // Check if database is accessible
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database query test successful');

    // Initialize default data if needed
    await initializeDefaultData();
    
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
}

// Initialize default data (subscription tiers, admin user, etc.)
export async function initializeDefaultData(): Promise<void> {
  try {
    // Check if default subscription tiers exist
    const tierCount = await prisma.platformSubscriptionTier.count();
    
    if (tierCount === 0) {
      logger.info('Initializing default subscription tiers...');
      await createDefaultSubscriptionTiers();
    }

    // Check if admin user exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@onlyfur.com';
    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!adminUser) {
      logger.info('Creating default admin user...');
      await createDefaultAdminUser();
    }

    logger.info('Default data initialization completed');
  } catch (error) {
    logger.error('Failed to initialize default data:', error);
    throw error;
  }
}

// Create default subscription tiers
async function createDefaultSubscriptionTiers(): Promise<void> {
  const defaultTiers = [
    // Subscriber Tiers
    {
      id: 'basic-subscriber',
      name: 'Basic Subscriber',
      type: 'SUBSCRIBER' as const,
      level: 'BASIC' as const,
      price: 9.99,
      currency: 'USD',
      billingPeriod: 'MONTHLY' as const,
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
      },
      contentAccess: {
        canViewPremiumContent: false,
        canViewExclusiveContent: false,
        downloadPermissions: false,
        earlyAccess: false,
      },
      isPopular: false,
      color: 'bg-blue-500',
      badge: 'Basic'
    },
    {
      id: 'pro-subscriber',
      name: 'Pro Subscriber',
      type: 'SUBSCRIBER' as const,
      level: 'PRO' as const,
      price: 19.99,
      currency: 'USD',
      billingPeriod: 'MONTHLY' as const,
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
      },
      contentAccess: {
        canViewPremiumContent: true,
        canViewExclusiveContent: false,
        downloadPermissions: true,
        earlyAccess: true,
      },
      isPopular: true,
      color: 'bg-purple-500',
      badge: 'Pro'
    },
    {
      id: 'vip-subscriber',
      name: 'VIP Subscriber',
      type: 'SUBSCRIBER' as const,
      level: 'VIP' as const,
      price: 39.99,
      currency: 'USD',
      billingPeriod: 'MONTHLY' as const,
      description: 'Ultimate furry experience with exclusive access',
      features: [
        'Access to all content including VIP exclusive',
        'Unlimited messaging with all creators',
        'Send any type of media',
        'VIP customer support',
        'Beta access to new features',
        'Custom profile themes',
        'Priority content downloads',
        'Exclusive community access'
      ],
      limitations: [],
      messagingFeatures: {
        canMessageCreators: true,
        allowedCreatorTiers: ['basic-creator', 'pro-creator', 'premium-creator'],
        maxConversationsPerDay: -1, // unlimited
        canSendMedia: true,
        canReceivePrioritySupport: true,
      },
      contentAccess: {
        canViewPremiumContent: true,
        canViewExclusiveContent: true,
        downloadPermissions: true,
        earlyAccess: true,
      },
      isPopular: false,
      color: 'bg-yellow-500',
      badge: 'VIP'
    },
    // Creator Tiers
    {
      id: 'basic-creator',
      name: 'Basic Creator',
      type: 'CREATOR' as const,
      level: 'BASIC' as const,
      price: 0,
      currency: 'USD',
      billingPeriod: 'MONTHLY' as const,
      description: 'Start your furry content creation journey',
      features: [
        'Upload up to 10 posts per month',
        'Basic analytics dashboard',
        'Accept tips from subscribers',
        'Basic profile customization',
        'Community guidelines support'
      ],
      limitations: [
        'Limited to 10 posts per month',
        'Basic analytics only',
        'No premium content features',
        '5% higher platform commission'
      ],
      messagingFeatures: {
        canMessageCreators: true,
        allowedCreatorTiers: ['basic-creator', 'pro-creator'],
        maxConversationsPerDay: 20,
        canSendMedia: true,
        canReceivePrioritySupport: false,
      },
      contentAccess: {
        canViewPremiumContent: false,
        canViewExclusiveContent: false,
        downloadPermissions: false,
        earlyAccess: false,
      },
      creatorFeatures: {
        maxPostsPerMonth: 10,
        canCreatePremiumContent: false,
        canCreateExclusiveContent: false,
        canSchedulePosts: false,
        advancedAnalytics: false,
        customBranding: false,
        prioritySupport: false,
        commissionRate: 0.15 // 15%
      },
      isPopular: false,
      color: 'bg-green-500',
      badge: 'Creator'
    },
    {
      id: 'pro-creator',
      name: 'Pro Creator',
      type: 'CREATOR' as const,
      level: 'PRO' as const,
      price: 29.99,
      currency: 'USD',
      billingPeriod: 'MONTHLY' as const,
      description: 'Professional tools for serious creators',
      features: [
        'Upload up to 50 posts per month',
        'Advanced analytics and insights',
        'Create premium content',
        'Schedule posts in advance',
        'Custom profile branding',
        'Priority creator support',
        'Lower platform commission (10%)'
      ],
      limitations: [
        'Limited to 50 posts per month',
        'Cannot create VIP exclusive content'
      ],
      messagingFeatures: {
        canMessageCreators: true,
        allowedCreatorTiers: ['basic-creator', 'pro-creator', 'premium-creator'],
        maxConversationsPerDay: 50,
        canSendMedia: true,
        canReceivePrioritySupport: true,
      },
      contentAccess: {
        canViewPremiumContent: true,
        canViewExclusiveContent: false,
        downloadPermissions: true,
        earlyAccess: true,
      },
      creatorFeatures: {
        maxPostsPerMonth: 50,
        canCreatePremiumContent: true,
        canCreateExclusiveContent: false,
        canSchedulePosts: true,
        advancedAnalytics: true,
        customBranding: true,
        prioritySupport: true,
        commissionRate: 0.10 // 10%
      },
      isPopular: true,
      color: 'bg-indigo-500',
      badge: 'Pro Creator'
    },
    {
      id: 'premium-creator',
      name: 'Premium Creator',
      type: 'CREATOR' as const,
      level: 'PREMIUM' as const,
      price: 59.99,
      currency: 'USD',
      billingPeriod: 'MONTHLY' as const,
      description: 'Elite creator tools with maximum reach',
      features: [
        'Unlimited posts',
        'Full analytics suite',
        'Create all content types including VIP exclusive',
        'Advanced scheduling and automation',
        'Full custom branding',
        'Dedicated creator support',
        'Lowest platform commission (5%)',
        'Revenue optimization tools'
      ],
      limitations: [],
      messagingFeatures: {
        canMessageCreators: true,
        allowedCreatorTiers: ['basic-creator', 'pro-creator', 'premium-creator'],
        maxConversationsPerDay: -1, // unlimited
        canSendMedia: true,
        canReceivePrioritySupport: true,
      },
      contentAccess: {
        canViewPremiumContent: true,
        canViewExclusiveContent: true,
        downloadPermissions: true,
        earlyAccess: true,
      },
      creatorFeatures: {
        maxPostsPerMonth: -1, // unlimited
        canCreatePremiumContent: true,
        canCreateExclusiveContent: true,
        canSchedulePosts: true,
        advancedAnalytics: true,
        customBranding: true,
        prioritySupport: true,
        commissionRate: 0.05 // 5%
      },
      isPopular: false,
      color: 'bg-pink-500',
      badge: 'Premium Creator'
    }
  ];

  for (const tier of defaultTiers) {
    await prisma.platformSubscriptionTier.create({
      data: tier
    });
  }

  logger.info(`Created ${defaultTiers.length} default subscription tiers`);
}

// Create default admin user
async function createDefaultAdminUser(): Promise<void> {
  const bcrypt = await import('bcryptjs');
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@onlyfur.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.create({
    data: {
      email: adminEmail,
      username: adminUsername,
      displayName: 'OnlyFur Admin',
      role: 'ADMIN',
      isVerified: true,
      authProvider: 'EMAIL',
      subscriptionTier: 'vip-subscriber',
      subscriptionStatus: 'ACTIVE',
      avatar: '/images/branding/onlyfur-logo.png'
    }
  });

  logger.info(`Created admin user: ${adminEmail}`);
}

// Database connection test
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database connection test failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
  }
}

export { prisma };
export default prisma;
