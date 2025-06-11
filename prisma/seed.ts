import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create subscription tiers
    const tiers = [
      {
        id: 'free',
        name: 'Free',
        description: 'Basic access to the platform',
        price: 0,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        type: 'SUBSCRIBER',
        level: 'BASIC',
        features: JSON.stringify(['Basic content access', 'Community features']),
        limitations: JSON.stringify(['Limited messages per day']),
        messagingFeatures: JSON.stringify({ maxConversations: 5, maxFileSize: 5 }),
        contentAccess: JSON.stringify(['free']),
        color: '#6B7280',
        isActive: true,
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'Full access with premium features',
        price: 999, // $9.99 in cents
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        type: 'SUBSCRIBER',
        level: 'PREMIUM',
        features: JSON.stringify(['All content access', 'Unlimited messaging', 'Early access']),
        limitations: JSON.stringify([]),
        messagingFeatures: JSON.stringify({ maxConversations: -1, maxFileSize: 50 }),
        contentAccess: JSON.stringify(['free', 'premium']),
        color: '#8B5CF6',
        isActive: true,
      },
    ];

    for (const tier of tiers) {
      await prisma.platformSubscriptionTier.upsert({
        where: { id: tier.id },
        update: tier,
        create: tier,
      });
    }

    console.log('✅ Subscription tiers created');

    // Create admin user
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'admin123',
      12
    );

    await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL || 'admin@onlyfur.com' },
      update: {},
      create: {
        email: process.env.ADMIN_EMAIL || 'admin@onlyfur.com',
        username: process.env.ADMIN_USERNAME || 'admin',
        displayName: 'Platform Administrator',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true,
        subscriptionTier: 'premium',
        subscriptionStatus: 'ACTIVE',
        authProvider: 'EMAIL',
      },
    });

    console.log('✅ Admin user created');

    // Create test users
    const testUsers = [
      {
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
        password: 'password123',
        role: 'SUBSCRIBER',
      },
      {
        email: 'creator@example.com',
        username: 'creator',
        displayName: 'Test Creator',
        password: 'password123',
        role: 'CREATOR',
      },
    ];

    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          ...user,
          password: hashedPassword,
          isActive: true,
          isEmailVerified: true,
          subscriptionTier: 'free',
          subscriptionStatus: 'FREE',
          authProvider: 'EMAIL',
        },
      });
    }

    console.log('✅ Test users created');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
