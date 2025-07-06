const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting simple database seeding...');

  try {
    // Create a simple subscription tier
    console.log('📦 Creating subscription tiers...');
    
    await prisma.platformSubscriptionTier.deleteMany({});
    
    const basicTier = await prisma.platformSubscriptionTier.create({
      data: {
        name: 'Basic Subscriber',
        type: 'SUBSCRIBER',
        level: 'BASIC',
        price: 9.99,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        description: 'Access to basic content from your favorite creators',
        features: {
          contentAccess: ['public', 'subscribers'],
          messaging: { enabled: true, dailyLimit: 50 }
        },
        limitations: {
          messagingDaily: 50
        },
        messagingFeatures: {
          directMessages: true,
          groupChats: false
        },
        contentAccess: {
          levels: ['PUBLIC', 'SUBSCRIBERS']
        },
        isPopular: false,
        color: '#10B981',
        badge: '✨',
        isActive: true
      }
    });

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await prisma.user.deleteMany({
      where: { email: 'admin@onlyfur.net' }
    });

    await prisma.user.create({
      data: {
        email: 'admin@onlyfur.net',
        username: 'admin',
        displayName: 'Platform Administrator',
        role: 'ADMIN',
        password: hashedPassword,
        isVerified: true,
        isActive: true,
        isEmailVerified: true,
        authProvider: 'EMAIL',
        subscriptionStatus: 'FREE',
        bio: 'OnlyFur Platform Administrator'
      }
    });

    console.log('✅ Simple database seeding completed successfully!');

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
