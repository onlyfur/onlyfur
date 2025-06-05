const { PrismaClient } = require('@prisma/client');

let prisma = null;
let isConnected = false;

// Initialize database service
async function initializeDatabase() {
  try {
    // Check if DATABASE_URL is provided
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️  DATABASE_URL not provided, using mock database for development');
      initializeMockDatabase();
      return;
    }

    // Try to connect to real database
    console.log('🔌 Connecting to PostgreSQL database...');
    
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });

    // Test the connection
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    
    isConnected = true;
    console.log('✅ Successfully connected to PostgreSQL database');

    // Initialize default data
    await initializeDefaultData();
    
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error.message);
    console.log('🔄 Falling back to mock database for development...');
    
    // Disconnect failed Prisma instance
    if (prisma) {
      try {
        await prisma.$disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
    }
    
    // Fall back to mock database
    initializeMockDatabase();
  }
}

// Mock database for development
function initializeMockDatabase() {
  const mockData = {
    users: new Map(),
    platformSubscriptionTiers: new Map(),
    subscriptions: new Map(),
    content: new Map(),
    messages: new Map(),
    transactions: new Map()
  };

  // Initialize default subscription tiers
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
        'Join community discussions'
      ],
      limitations: [
        'Limited to 5 conversations per day',
        'Cannot send media in messages'
      ],
      messagingFeatures: {
        canMessageCreators: true,
        maxConversationsPerDay: 5,
        canSendMedia: false
      },
      contentAccess: {
        canViewPremiumContent: false,
        canViewExclusiveContent: false
      },
      isPopular: false,
      isActive: true,
      color: 'bg-blue-500',
      badge: 'Basic',
      createdAt: new Date(),
      updatedAt: new Date()
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
        'Priority customer support'
      ],
      limitations: [
        'Limited to 15 conversations per day'
      ],
      messagingFeatures: {
        canMessageCreators: true,
        maxConversationsPerDay: 15,
        canSendMedia: true
      },
      contentAccess: {
        canViewPremiumContent: true,
        canViewExclusiveContent: false
      },
      isPopular: true,
      isActive: true,
      color: 'bg-purple-500',
      badge: 'Pro',
      createdAt: new Date(),
      updatedAt: new Date()
    },
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
        'Upload up to 10 posts per month',
        'Basic analytics dashboard',
        'Accept tips from subscribers'
      ],
      limitations: [
        'Limited to 10 posts per month',
        'Basic analytics only'
      ],
      messagingFeatures: {
        canMessageCreators: true,
        maxConversationsPerDay: 20,
        canSendMedia: true
      },
      contentAccess: {
        canViewPremiumContent: false,
        canViewExclusiveContent: false
      },
      creatorFeatures: {
        maxPostsPerMonth: 10,
        canCreatePremiumContent: false,
        commissionRate: 0.15
      },
      isPopular: false,
      isActive: true,
      color: 'bg-green-500',
      badge: 'Creator',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Populate mock data
  defaultTiers.forEach(tier => {
    mockData.platformSubscriptionTiers.set(tier.id, tier);
  });

  // Create admin user
  const adminUser = {
    id: 'admin-user-id',
    email: process.env.ADMIN_EMAIL || 'admin@onlyfur.com',
    username: process.env.ADMIN_USERNAME || 'admin',
    displayName: 'OnlyFur Admin',
    role: 'ADMIN',
    isVerified: true,
    authProvider: 'EMAIL',
    subscriptionTier: 'pro-subscriber',
    subscriptionStatus: 'ACTIVE',
    avatar: '/images/branding/onlyfur-logo.png',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockData.users.set(adminUser.id, adminUser);

  // Mock Prisma client
  prisma = createMockPrismaClient(mockData);
  isConnected = true;
  
  console.log('✅ Mock database initialized with default data');
}

// Create mock Prisma client
function createMockPrismaClient(data) {
  return {
    // User operations
    user: {
      findUnique: async (params) => {
        const { where } = params;
        for (const user of data.users.values()) {
          if ((where.id && user.id === where.id) || 
              (where.email && user.email === where.email) ||
              (where.username && user.username === where.username)) {
            return user;
          }
        }
        return null;
      },
      findFirst: async (params) => {
        const { where } = params;
        if (where.OR) {
          for (const user of data.users.values()) {
            for (const condition of where.OR) {
              if ((condition.email && user.email === condition.email) ||
                  (condition.username && user.username === condition.username)) {
                return user;
              }
            }
          }
        }
        return null;
      },
      create: async (params) => {
        const { data: userData } = params;
        const newUser = {
          id: generateId(),
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        data.users.set(newUser.id, newUser);
        return newUser;
      },
      update: async (params) => {
        const { where, data: updateData } = params;
        const user = await this.user.findUnique({ where });
        if (user) {
          Object.assign(user, updateData, { updatedAt: new Date() });
          data.users.set(user.id, user);
          return user;
        }
        throw new Error('User not found');
      },
      count: async () => data.users.size
    },

    // Subscription tier operations
    platformSubscriptionTier: {
      findMany: async (params = {}) => {
        let tiers = Array.from(data.platformSubscriptionTiers.values());
        
        if (params.where) {
          if (params.where.isActive !== undefined) {
            tiers = tiers.filter(tier => tier.isActive === params.where.isActive);
          }
        }
        
        if (params.orderBy) {
          // Simple ordering by first field
          const orderField = Object.keys(params.orderBy[0] || {})[0];
          const orderDirection = params.orderBy[0][orderField];
          tiers.sort((a, b) => {
            if (orderDirection === 'asc') {
              return a[orderField] > b[orderField] ? 1 : -1;
            } else {
              return a[orderField] < b[orderField] ? 1 : -1;
            }
          });
        }
        
        return tiers;
      },
      findUnique: async (params) => {
        const { where } = params;
        return data.platformSubscriptionTiers.get(where.id) || null;
      },
      count: async () => data.platformSubscriptionTiers.size
    },

    // Subscription operations
    subscription: {
      findMany: async (params = {}) => {
        let subscriptions = Array.from(data.subscriptions.values());
        
        if (params.where) {
          subscriptions = subscriptions.filter(sub => {
            if (params.where.userId && sub.userId !== params.where.userId) return false;
            if (params.where.status && sub.status !== params.where.status) return false;
            return true;
          });
        }
        
        if (params.include && params.include.tier) {
          subscriptions = subscriptions.map(sub => ({
            ...sub,
            tier: data.platformSubscriptionTiers.get(sub.tierId)
          }));
        }
        
        return subscriptions;
      },
      findFirst: async (params) => {
        const subscriptions = await this.subscription.findMany(params);
        return subscriptions[0] || null;
      },
      create: async (params) => {
        const { data: subData } = params;
        const newSub = {
          id: generateId(),
          ...subData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        data.subscriptions.set(newSub.id, newSub);
        
        if (params.include && params.include.tier) {
          newSub.tier = data.platformSubscriptionTiers.get(newSub.tierId);
        }
        
        return newSub;
      },
      updateMany: async (params) => {
        const { where, data: updateData } = params;
        let count = 0;
        
        for (const sub of data.subscriptions.values()) {
          let shouldUpdate = true;
          
          if (where.userId && sub.userId !== where.userId) shouldUpdate = false;
          if (where.status && sub.status !== where.status) shouldUpdate = false;
          
          if (shouldUpdate) {
            Object.assign(sub, updateData, { updatedAt: new Date() });
            data.subscriptions.set(sub.id, sub);
            count++;
          }
        }
        
        return { count };
      },
      count: async (params = {}) => {
        if (!params.where) return data.subscriptions.size;
        
        let count = 0;
        for (const sub of data.subscriptions.values()) {
          if (params.where.status && sub.status === params.where.status) count++;
        }
        return count;
      }
    },

    // Transaction operations
    transaction: {
      create: async (params) => {
        const { data: txData } = params;
        const newTx = {
          id: generateId(),
          ...txData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        data.transactions.set(newTx.id, newTx);
        return newTx;
      },
      findMany: async () => Array.from(data.transactions.values()),
      count: async () => data.transactions.size,
      aggregate: async () => ({
        _sum: { amount: 0, netAmount: 0 },
        _count: 0
      })
    },

    // Content operations (placeholder)
    content: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async (params) => {
        const { data: contentData } = params;
        const newContent = {
          id: generateId(),
          ...contentData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        data.content.set(newContent.id, newContent);
        return newContent;
      },
      count: async () => 0,
      aggregate: async () => ({
        _sum: { viewsCount: 0, likesCount: 0 },
        _count: 0
      })
    },

    // Message operations (placeholder)
    message: {
      findMany: async () => [],
      findFirst: async () => null,
      create: async (params) => {
        const { data: msgData } = params;
        const newMsg = {
          id: generateId(),
          ...msgData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        data.messages.set(newMsg.id, newMsg);
        return newMsg;
      },
      count: async () => 0
    },

    // Database operations
    $connect: async () => { /* Mock connection */ },
    $disconnect: async () => { /* Mock disconnection */ },
    $queryRaw: async () => [],
    $executeRaw: async () => 0
  };
}

// Initialize default data for real database
async function initializeDefaultData() {
  if (!isConnected || !prisma) return;

  try {
    // Check if tiers already exist
    const tierCount = await prisma.platformSubscriptionTier.count();
    if (tierCount > 0) {
      console.log('✅ Default subscription tiers already exist');
      return;
    }

    console.log('🔄 Creating default subscription tiers...');
    
    // Create default tiers (same as mock data but for real database)
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
          'Join community discussions'
        ],
        limitations: [
          'Limited to 5 conversations per day',
          'Cannot send media in messages'
        ],
        messagingFeatures: {
          canMessageCreators: true,
          maxConversationsPerDay: 5,
          canSendMedia: false
        },
        contentAccess: {
          canViewPremiumContent: false,
          canViewExclusiveContent: false
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
          'Priority customer support'
        ],
        limitations: [
          'Limited to 15 conversations per day'
        ],
        messagingFeatures: {
          canMessageCreators: true,
          maxConversationsPerDay: 15,
          canSendMedia: true
        },
        contentAccess: {
          canViewPremiumContent: true,
          canViewExclusiveContent: false
        },
        isPopular: true,
        isActive: true,
        color: 'bg-purple-500',
        badge: 'Pro'
      },
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
          'Upload up to 10 posts per month',
          'Basic analytics dashboard',
          'Accept tips from subscribers'
        ],
        limitations: [
          'Limited to 10 posts per month',
          'Basic analytics only'
        ],
        messagingFeatures: {
          canMessageCreators: true,
          maxConversationsPerDay: 20,
          canSendMedia: true
        },
        contentAccess: {
          canViewPremiumContent: false,
          canViewExclusiveContent: false
        },
        creatorFeatures: {
          maxPostsPerMonth: 10,
          canCreatePremiumContent: false,
          commissionRate: 0.15
        },
        isPopular: false,
        isActive: true,
        color: 'bg-green-500',
        badge: 'Creator'
      }
    ];

    for (const tier of defaultTiers) {
      await prisma.platformSubscriptionTier.create({ data: tier });
    }

    console.log('✅ Default subscription tiers created successfully');
    
  } catch (error) {
    console.error('❌ Failed to create default data:', error.message);
  }
}

// Helper function to generate IDs
function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Test database connection
async function testDatabaseConnection() {
  if (!isConnected || !prisma) return false;
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    return false;
  }
}

// Graceful shutdown
async function disconnectDatabase() {
  if (prisma && isConnected) {
    try {
      await prisma.$disconnect();
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from database:', error.message);
    }
  }
}

module.exports = {
  prisma: () => prisma,
  initializeDatabase,
  testDatabaseConnection,
  disconnectDatabase,
  isConnected: () => isConnected
};
