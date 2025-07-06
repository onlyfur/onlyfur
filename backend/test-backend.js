#!/usr/bin/env node

// Simple test script to verify the new backend structure works
const { getDatabase } = require('./database');
const { createRoutes } = require('./routes');

async function testBackend() {
  console.log('🧪 Testing refactored backend...');
  
  try {
    // Test database connection
    console.log('📊 Testing database connection...');
    const db = getDatabase();
    const connected = await db.connect();
    
    if (connected) {
      console.log('✅ Database connection successful');
    } else {
      console.log('❌ Database connection failed');
      return;
    }
    
    // Test route creation
    console.log('🛣️ Testing route creation...');
    const routes = createRoutes(db);
    
    if (routes && typeof routes === 'object') {
      console.log(`✅ Routes created successfully (${Object.keys(routes).length} routes)`);
      console.log('📋 Available routes:');
      Object.keys(routes).forEach(route => {
        console.log(`   - ${route}`);
      });
    } else {
      console.log('❌ Route creation failed');
      return;
    }
    
    // Test environment variables
    console.log('🔧 Testing environment configuration...');
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'ADMIN_EMAIL',
      'ADMIN_PASSWORD',
      'ADMIN_USERNAME'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
      console.log('✅ All required environment variables are set');
    } else {
      console.log('⚠️ Missing environment variables:');
      missingVars.forEach(varName => {
        console.log(`   - ${varName}`);
      });
    }
    
    // Cleanup
    await db.disconnect();
    console.log('🔌 Database disconnected');
    
    console.log('\n🎉 Backend refactoring test completed successfully!');
    console.log('🚀 Ready for both local development and Vercel deployment');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testBackend();
}

module.exports = { testBackend };
