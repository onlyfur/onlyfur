#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

// Password hashing function (same as in your backend)
async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(32).toString('hex');
    crypto.pbkdf2(password, salt, 12000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

// Default users for local development
const defaultUsers = [
  {
    email: 'admin@onlyfur.net',
    username: 'admin',
    displayName: 'Admin User',
    password: 'admin123',
    role: 'ADMIN',
    subscriptionTier: 'pro-subscriber',
    subscriptionStatus: 'ACTIVE'
  },
  {
    email: 'creator@onlyfur.net',
    username: 'democreator',
    displayName: 'Demo Creator',
    password: 'creator123',
    role: 'CREATOR',
    subscriptionTier: 'basic-creator',
    subscriptionStatus: 'ACTIVE'
  },
  {
    email: 'subscriber@onlyfur.net',
    username: 'demosubscriber',
    displayName: 'Demo Subscriber',
    password: 'subscriber123',
    role: 'SUBSCRIBER',
    subscriptionTier: 'basic-subscriber',
    subscriptionStatus: 'FREE'
  },
  {
    email: 'user@example.com',
    username: 'testuser',
    displayName: 'Test User',
    password: 'test123',
    role: 'SUBSCRIBER',
    subscriptionTier: 'basic-subscriber',
    subscriptionStatus: 'FREE'
  }
];

async function seedDatabase() {
  console.log('🌱 Seeding local development database...');
  console.log('===============================================');

  try {
    // Check if users already exist
    const existingUsers = await prisma.users.findMany({
      select: { email: true }
    });
    
    const existingEmails = existingUsers.map(user => user.email);
    
    for (const userData of defaultUsers) {
      if (existingEmails.includes(userData.email)) {
        console.log(`⏭️  User ${userData.email} already exists, skipping...`);
        continue;
      }
      
      console.log(`👤 Creating user: ${userData.email} (${userData.role})...`);
      
      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create user
      const user = await prisma.users.create({
        data: {
          id: uuidv4(),
          email: userData.email,
          username: userData.username,
          displayName: userData.displayName,
          password: hashedPassword,
          role: userData.role,
          authProvider: 'EMAIL',
          isActive: true,
          isVerified: true,
          isEmailVerified: true,
          subscriptionTier: userData.subscriptionTier,
          subscriptionStatus: userData.subscriptionStatus,
          updatedAt: new Date()
        }
      });
      
      console.log(`✅ Created user: ${user.email} (ID: ${user.id})`);
    }
    
    // Get final user count
    const totalUsers = await prisma.users.count();
    
    console.log('');
    console.log('🎉 Database seeding completed!');
    console.log('===============================================');
    console.log(`📊 Total users in database: ${totalUsers}`);
    console.log('');
    console.log('👥 Available test accounts:');
    console.log('   📧 admin@onlyfur.net / admin123 (ADMIN)');
    console.log('   📧 creator@onlyfur.net / creator123 (CREATOR)');
    console.log('   📧 subscriber@onlyfur.net / subscriber123 (SUBSCRIBER)');
    console.log('   📧 user@example.com / test123 (SUBSCRIBER)');
    console.log('');
    console.log('✅ Ready for local development!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, defaultUsers };
