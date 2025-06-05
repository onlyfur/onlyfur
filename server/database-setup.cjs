const { PrismaClient } = require('@prisma/client');

// Mock database setup for development/demo
// This simulates PostgreSQL functionality using in-memory data

class MockPrismaClient {
  constructor() {
    // In-memory data storage
    this.data = {
      platformSubscriptionTier: new Map(),
      user: new Map(),
      subscription: new Map(),
      content: new Map(),
      message: new Map(),
    };
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  async initializeDefaultData() {
    // Create default admin user from environment variables
    await this.createDefaultAdminUser();
    
    // Add default subscription tiers
    const defaultTiers = [
      {
        id: 'basic-subscriber',
        name: 'Basic Subscriber',
        type: 'SUBSCRIBER',
        level: 'BASIC',
        price: 9.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
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
        isActive: true,
        color: 'bg-blue-500',
        badge: 'Basic'
      },
      {
        id: 'pro-subscriber',
        name: 'Pro Subscriber',
        type: 'SUBSCRIBER',
        level: 'PRO',
        price: 19.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
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
        isActive: true,
        color: 'bg-purple-500',
        badge: 'Pro'
      },
      {
        id: 'vip-subscriber',
        name: 'VIP Subscriber',
        type: 'SUBSCRIBER',
        level: 'VIP',
        price: 39.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
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
          maxConversationsPerDay: -1,
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
        isActive: true,
        color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        badge: 'VIP'
      },
      // Creator Tiers
      {
        id: 'basic-creator',
        name: 'Basic Creator',
        type: 'CREATOR',
        level: 'BASIC',
        price: 0,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
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
        },
        contentAccess: {
          canViewPremiumContent: false,
          canViewExclusiveContent: false,
          downloadPermissions: false,
          earlyAccess: false,
        },
        creatorFeatures: {
          maxUploadsPerDay: 10,
          maxSubscribers: -1,
          analyticsAccess: 'basic',
          customBranding: false,
          liveStreamingEnabled: false,
          bulkMessageLimit: 0,
        },
        isPopular: false,
        isActive: true,
        color: 'bg-green-500',
        badge: 'Creator'
      },
      {
        id: 'pro-creator',
        name: 'Pro Creator',
        type: 'CREATOR',
        level: 'PRO',
        price: 29.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
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
        },
        contentAccess: {
          canViewPremiumContent: true,
          canViewExclusiveContent: false,
          downloadPermissions: true,
          earlyAccess: true,
        },
        creatorFeatures: {
          maxUploadsPerDay: 25,
          maxSubscribers: -1,
          analyticsAccess: 'advanced',
          customBranding: true,
          liveStreamingEnabled: true,
          bulkMessageLimit: 100,
        },
        isPopular: true,
        isActive: true,
        color: 'bg-indigo-500',
        badge: 'Pro Creator'
      },
      {
        id: 'premium-creator',
        name: 'Premium Creator',
        type: 'CREATOR',
        level: 'PREMIUM',
        price: 59.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
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
          maxConversationsPerDay: -1,
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
          maxUploadsPerDay: -1,
          maxSubscribers: -1,
          analyticsAccess: 'premium',
          customBranding: true,
          liveStreamingEnabled: true,
          bulkMessageLimit: -1,
        },
        isPopular: false,
        isActive: true,
        color: 'bg-gradient-to-r from-purple-600 to-pink-600',
        badge: 'Premium Creator'
      }
    ];

    // Add tiers to storage
    defaultTiers.forEach(tier => {
      this.data.platformSubscriptionTier.set(tier.id, tier);
    });
  }

  // Mock Prisma methods
  async $connect() {
    console.log('Connected to mock database');
    return Promise.resolve();
  }

  async $disconnect() {
    console.log('Disconnected from mock database');
    return Promise.resolve();
  }

  // Mock PlatformSubscriptionTier operations
  platformSubscriptionTier = {
    findMany: async (options = {}) => {
      const tiers = Array.from(this.data.platformSubscriptionTier.values());
      
      if (options.where?.isActive) {
        return tiers.filter(tier => tier.isActive);
      }
      
      if (options.orderBy) {
        const sorted = [...tiers];
        if (Array.isArray(options.orderBy)) {
          // Handle multiple sort criteria
          sorted.sort((a, b) => {
            for (const criterion of options.orderBy) {
              const key = Object.keys(criterion)[0];
              const order = criterion[key];
              
              if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
              if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
            }
            return 0;
          });
        }
        return sorted;
      }
      
      return tiers;
    },

    create: async ({ data }) => {
      this.data.platformSubscriptionTier.set(data.id, data);
      return data;
    },

    count: async () => {
      return this.data.platformSubscriptionTier.size;
    },

    findUnique: async ({ where }) => {
      return this.data.platformSubscriptionTier.get(where.id) || null;
    }
  };

  // Create default admin user from environment variables
  async createDefaultAdminUser() {
    const bcrypt = require('bcryptjs');
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@onlyfur.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminDisplayName = process.env.ADMIN_DISPLAY_NAME || 'Platform Administrator';
    
    // Check if admin user already exists
    const existingAdmin = Array.from(this.data.user.values()).find(u => u.email === adminEmail);
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const adminId = `admin_${Date.now()}`;
      
      const adminUser = {
        id: adminId,
        email: adminEmail,
        username: adminUsername,
        displayName: adminDisplayName,
        avatar: '/images/branding/onlyfur-logo.png',
        role: 'ADMIN',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: hashedPassword,
        authProvider: 'EMAIL',
        subscriptionValidUntil: null
      };
      
      this.data.user.set(adminId, adminUser);
      console.log(`✅ Default admin user created: ${adminEmail}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
    }
  }

  // Mock User operations
  user = {
    findUnique: async ({ where, include }) => {
      const users = Array.from(this.data.user.values());
      const user = users.find(u => u.id === where.id || u.email === where.email);
      
      if (user && include?.subscriptions) {
        user.subscriptions = Array.from(this.data.subscription.values())
          .filter(sub => sub.userId === user.id);
      }
      
      return user || null;
    },

    findFirst: async ({ where }) => {
      const users = Array.from(this.data.user.values());
      return users.find(u => 
        (where.OR?.some(condition => 
          (condition.email && u.email === condition.email) ||
          (condition.username && u.username === condition.username)
        )) ||
        (where.email && u.email === where.email) ||
        (where.username && u.username === where.username)
      ) || null;
    },

    create: async ({ data }) => {
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const user = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        subscriptionValidUntil: null,
        isVerified: false,
        authProvider: 'EMAIL'
      };
      this.data.user.set(id, user);
      return user;
    },

    update: async ({ where, data }) => {
      const user = this.data.user.get(where.id);
      if (user) {
        const updated = { ...user, ...data, updatedAt: new Date() };
        this.data.user.set(where.id, updated);
        return updated;
      }
      return null;
    },

    updateMany: async ({ where, data }) => {
      let count = 0;
      this.data.user.forEach((user, id) => {
        if (where.id && user.id === where.id) {
          this.data.user.set(id, { ...user, ...data, updatedAt: new Date() });
          count++;
        }
      });
      return { count };
    }
  };

  // Mock Subscription operations
  subscription = {
    create: async ({ data, include }) => {
      const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const subscription = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      if (include?.tier) {
        subscription.tier = this.data.platformSubscriptionTier.get(data.tierId);
      }
      
      this.data.subscription.set(id, subscription);
      return subscription;
    },

    updateMany: async ({ where, data }) => {
      let count = 0;
      this.data.subscription.forEach((sub, id) => {
        if (where.userId && sub.userId === where.userId && where.status && sub.status === where.status) {
          this.data.subscription.set(id, { ...sub, ...data, updatedAt: new Date() });
          count++;
        }
      });
      return { count };
    }
  };

  // Mock Content operations
  content = {
    findMany: async ({ where, orderBy, include }) => {
      const content = Array.from(this.data.content.values());
      
      let filtered = content;
      if (where?.status) {
        filtered = content.filter(c => c.status === where.status);
      }
      
      if (orderBy?.createdAt === 'desc') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      if (include?.creator) {
        filtered = filtered.map(c => ({
          ...c,
          creator: Array.from(this.data.user.values()).find(u => u.id === c.creatorId)
        }));
      }
      
      return filtered;
    },

    create: async ({ data }) => {
      const id = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const content = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.data.content.set(id, content);
      return content;
    }
  };
}

// Export the mock client for use in development
module.exports = {
  PrismaClient: MockPrismaClient,
  mockPrismaClient: new MockPrismaClient()
};
