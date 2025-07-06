#!/usr/bin/env node

const fs = require('fs');

function createEnvDevelopmentTemplate(force = false) {
  const templatePath = 'env/.env.development';
  
  if (!force && fs.existsSync(templatePath)) {
    console.log('✅ .env.development already exists');
    console.log('💡 Use --force to overwrite the existing file');
    return false;
  }
  
  console.log('📝 Creating .env.development template...');
  
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
  
  fs.writeFileSync(templatePath, envDevelopmentTemplate);
  console.log('✅ Created env/.env.development template');
  console.log('📋 This file contains standard development environment variables');
  console.log('🔧 Developers can customize values as needed for their local setup');
  console.log('');
  console.log('💡 Next steps for new developers:');
  console.log('   1. Run: npm run dev:backend');
  console.log('   2. The system will automatically set up PostgreSQL and create .env.local');
  console.log('   3. Customize env/.env.development if needed for your specific setup');
  
  return true;
}

// Handle command line arguments
const args = process.argv.slice(2);
const force = args.includes('--force') || args.includes('-f');

if (require.main === module) {
  createEnvDevelopmentTemplate(force);
}

module.exports = { createEnvDevelopmentTemplate };
