const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting production database seeding...');

  try {
    // Create subscription tiers
    console.log('📦 Creating subscription tiers...');
    
    const tiers = [
      {
        id: 'free-tier',
        name: 'Free',
        type: 'SUBSCRIBER',
        level: 'BASIC',
        price: 0,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Basic access to public content',
        features: JSON.stringify({
          contentAccess: ['public'],
          messaging: { enabled: true, dailyLimit: 10 },
          downloads: { enabled: false }
        }),
        limitations: JSON.stringify({
          messagingDaily: 10,
          downloadMonthly: 0
        }),
        messagingFeatures: JSON.stringify({
          directMessages: true,
          groupChats: false,
          fileSharing: false
        }),
        contentAccess: JSON.stringify({
          levels: ['PUBLIC'],
          downloadEnabled: false
        }),
        isPopular: false,
        color: '#6B7280',
        badge: '🆓',
        isActive: true
      },
      {
        id: 'basic-subscriber',
        name: 'Basic Subscriber',
        type: 'SUBSCRIBER',
        level: 'BASIC',
        price: 9.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Access to basic content from creators',
        features: JSON.stringify({
          contentAccess: ['public', 'subscribers'],
          messaging: { enabled: true, dailyLimit: 50 },
          downloads: { enabled: false }
        }),
        limitations: JSON.stringify({
          messagingDaily: 50,
          downloadMonthly: 0
        }),
        messagingFeatures: JSON.stringify({
          directMessages: true,
          groupChats: false,
          fileSharing: false
        }),
        contentAccess: JSON.stringify({
          levels: ['PUBLIC', 'SUBSCRIBERS'],
          downloadEnabled: false
        }),
        isPopular: false,
        color: '#10B981',
        badge: '✨',
        isActive: true
      },
      {
        id: 'pro-subscriber',
        name: 'Pro Subscriber',
        type: 'SUBSCRIBER',
        level: 'PRO',
        price: 19.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Enhanced access with premium content',
        features: JSON.stringify({
          contentAccess: ['public', 'subscribers', 'premium'],
          messaging: { enabled: true, dailyLimit: 200 },
          downloads: { enabled: true, monthlyLimit: 100 }
        }),
        limitations: JSON.stringify({
          messagingDaily: 200,
          downloadMonthly: 100
        }),
        messagingFeatures: JSON.stringify({
          directMessages: true,
          groupChats: true,
          fileSharing: true
        }),
        contentAccess: JSON.stringify({
          levels: ['PUBLIC', 'SUBSCRIBERS', 'PREMIUM'],
          downloadEnabled: true,
          downloadLimit: 100
        }),
        isPopular: true,
        color: '#8B5CF6',
        badge: '🚀',
        isActive: true
      },
      {
        id: 'basic-creator',
        name: 'Basic Creator',
        type: 'CREATOR',
        level: 'BASIC',
        price: 0,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Start your creative journey',
        features: JSON.stringify({
          uploads: { maxFileSize: 100, videoQuality: '720p' },
          analytics: { basic: true },
          monetization: { tips: true }
        }),
        limitations: JSON.stringify({
          uploadSizeMB: 100,
          monthlyUploads: 50
        }),
        messagingFeatures: JSON.stringify({
          directMessages: true,
          bulkMessages: false
        }),
        contentAccess: JSON.stringify({
          levels: ['PUBLIC'],
          uploadEnabled: true
        }),
        creatorFeatures: JSON.stringify({
          uploadLimit: 100,
          videoQuality: '720p',
          analytics: 'basic'
        }),
        isPopular: false,
        color: '#6B7280',
        badge: '🎨',
        isActive: true
      },
      {
        id: 'pro-creator',
        name: 'Pro Creator',
        type: 'CREATOR',
        level: 'PRO',
        price: 29.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Advanced tools for growing creators',
        features: JSON.stringify({
          uploads: { maxFileSize: 500, videoQuality: '1080p' },
          analytics: { basic: true, advanced: true },
          monetization: { tips: true, customPricing: true }
        }),
        limitations: JSON.stringify({
          uploadSizeMB: 500,
          monthlyUploads: 200
        }),
        messagingFeatures: JSON.stringify({
          directMessages: true,
          bulkMessages: true,
          autoReplies: true
        }),
        contentAccess: JSON.stringify({
          levels: ['PUBLIC', 'SUBSCRIBERS', 'PREMIUM'],
          uploadEnabled: true
        }),
        creatorFeatures: JSON.stringify({
          uploadLimit: 500,
          videoQuality: '1080p',
          analytics: 'advanced',
          customBranding: true
        }),
        isPopular: true,
        color: '#3B82F6',
        badge: '⭐',
        isActive: true
      }
    ];

    // Insert tiers using upsert to avoid duplicates
    for (const tier of tiers) {
      await prisma.platformSubscriptionTier.upsert({
        where: { id: tier.id },
        update: tier,
        create: tier
      });
    }

    console.log('✅ Subscription tiers created successfully');

    // Create admin user
    console.log('👤 Creating admin user...');
    
    const hashedPassword = await bcrypt.hash('OnlyFur2024!', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@onlyfur.com' },
      update: {},
      create: {
        email: 'admin@onlyfur.com',
        username: 'admin',
        displayName: 'Platform Administrator',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true,
        subscriptionTier: 'pro-subscriber',
        subscriptionStatus: 'ACTIVE',
        subscriptionValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      }
    });

    console.log('✅ Admin user created successfully');

    // No demo users - platform will start clean for real user registrations

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📝 Default Users Created:');
    console.log('👤 Admin: admin@onlyfur.com / OnlyFur2024!');
    console.log('\n✨ Platform ready for real user registrations - no demo users created!');

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
