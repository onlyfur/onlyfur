#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { setupLocalDatabase } = require('./setup-local-db.js');
const { seedDatabase } = require('./seed-local-db.js');

console.log('🚀 Starting OnlyFur Development Backend...');
console.log('===============================================');

// Create .env.development template if it doesn't exist
function createEnvDevelopmentTemplate() {
  if (!fs.existsSync('env/.env.development')) {
    console.log('📝 Creating env/.env.development template for team development...');
    
    const envDevelopmentTemplate = `# OnlyFur Platform Development Environment Variables
# Copy this file to .env.local for local development

# Database Configuration - Local PostgreSQL (Auto-created)
DATABASE_URL="postgresql://onlyfur_dev:onlyfur_password@localhost:5432/onlyfur_dev"

# JWT Configuration
JWT_SECRET="dev-jwt-secret-key-must-be-at-least-32-characters-long-for-security"
JWT_REFRESH_SECRET="dev-jwt-refresh-secret-key-must-be-at-least-32-characters-long"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# Google OAuth Configuration (for development)
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
GOOGLE_REDIRECT_URI="http://localhost:5173/auth/callback/google"

# Frontend Google OAuth (for Vite)
VITE_GOOGLE_CLIENT_ID="your-google-client-id-here"

# API Configuration
VITE_API_BASE_URL="http://localhost:3001/api"

# Server Configuration
NODE_ENV="development"
PORT="3001"
CLIENT_BASE_URL="http://localhost:5173"
FRONTEND_URL="http://localhost:5173"
CORS_ORIGIN="http://localhost:5173"

# Admin Account - Default Development Admin
ADMIN_EMAIL="admin@onlyfur.net"
ADMIN_PASSWORD="admin123"
ADMIN_USERNAME="admin"

# Email Configuration (for local development)
FROM_EMAIL="noreply@onlyfur.local"
FROM_NAME="OnlyFur Development"
SUPPORT_EMAIL="support@onlyfur.local"

# Development Database Settings
DEV_DB_NAME="onlyfur_dev"
DEV_DB_USER="onlyfur_dev"
DEV_DB_PASSWORD="onlyfur_password"
DEV_DB_PORT="5432"

# Development flags
DEBUG="true"
ENABLE_MOCK_DATA="true"

# Optional: Stripe test keys for development
STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
`;
    
    // Ensure env directory exists
    if (!fs.existsSync('env')) {
      fs.mkdirSync('env');
    }
    
    fs.writeFileSync('env/.env.development', envDevelopmentTemplate);
    console.log('✅ Created env/.env.development template');
    console.log('📋 This file contains standard development environment variables');
    console.log('🔧 Developers can customize values as needed for their local setup');
    return true;
  } else {
    console.log('✅ env/.env.development template already exists');
    return false;
  }
}

// Check if .env.local exists and has local database config
function checkLocalEnv() {
  if (!fs.existsSync('.env.local')) {
    console.log('📁 No .env.local found, will create one with local database');
    return false;
  }
  
  const envContent = fs.readFileSync('.env.local', 'utf8');
  if (envContent.includes('postgresql://onlyfur_dev:onlyfur_password@localhost:5432/onlyfur_dev')) {
    console.log('✅ Local database configuration found');
    return true;
  }
  
  console.log('📁 .env.local exists but not configured for local database');
  return false;
}

// Check if local database is accessible
function checkDatabaseConnection() {
  return new Promise((resolve, reject) => {
    exec('psql -h localhost -p 5432 -U onlyfur_dev -d onlyfur_dev -c "SELECT 1;" 2>/dev/null', (error, stdout, stderr) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// Start the complete authentication backend
function startBackend() {
  return new Promise((resolve, reject) => {
    console.log('🔐 Starting complete authentication backend...');
    
    const backend = spawn('node', ['server/complete-auth-backend.js'], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    backend.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Backend exited with code ${code}`));
      } else {
        resolve();
      }
    });
    
    // Give backend time to start
    setTimeout(() => {
      console.log('✅ Backend startup initiated');
      resolve();
    }, 3000);
  });
}

// Main startup function
async function startDevelopmentBackend() {
  try {
    // Step 0: Ensure .env.development template exists for team consistency
    createEnvDevelopmentTemplate();
    
    // Step 1: Check if local environment is configured
    const hasLocalEnv = checkLocalEnv();
    
    if (!hasLocalEnv) {
      console.log('🔧 Setting up local PostgreSQL database...');
      await setupLocalDatabase();
    }
    
    // Step 2: Check database connection
    console.log('🔍 Checking database connection...');
    const dbConnected = await checkDatabaseConnection();
    
    if (!dbConnected) {
      console.log('❌ Cannot connect to local database, running setup...');
      await setupLocalDatabase();
    } else {
      console.log('✅ Database connection successful');
    }
    
    // Step 3: Seed database with default users
    console.log('🌱 Ensuring database has default users...');
    await seedDatabase();
    
    // Step 4: Start the backend
    console.log('🚀 Starting backend server...');
    await startBackend();
    
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Check if PostgreSQL is installed: brew install postgresql@15');
    console.log('   2. Check if PostgreSQL is running: brew services start postgresql@15');
    console.log('   3. Try manual setup: npm run db:setup');
    console.log('   4. Check database connection: psql -h localhost -p 5432 -U onlyfur_dev -d onlyfur_dev');
    process.exit(1);
  }
}

// Handle script termination
process.on('SIGINT', () => {
  console.log('\\n🛑 Development backend stopped');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\\n🛑 Development backend terminated');
  process.exit(0);
});

// Run startup if called directly
if (require.main === module) {
  startDevelopmentBackend();
}

module.exports = { startDevelopmentBackend };
