#!/usr/bin/env node

/**
 * Google OAuth Setup Script for OnlyFur Platform
 * This script helps configure Google OAuth authentication
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function setupGoogleOAuth() {
  console.log('\n🔧 Google OAuth Setup for OnlyFur Platform\n');
  console.log('This script will help you configure Google OAuth authentication.\n');
  
  console.log('📋 Prerequisites:');
  console.log('1. Google Cloud Console project created');
  console.log('2. Google+ API enabled');
  console.log('3. OAuth 2.0 Client ID created (Web application)');
  console.log('4. Authorized redirect URIs configured\n');
  
  const proceed = await question('Do you want to continue with setup? (y/n): ');
  if (proceed.toLowerCase() !== 'y') {
    console.log('Setup cancelled.');
    rl.close();
    return;
  }

  console.log('\n🔑 Enter your Google OAuth credentials:\n');
  
  const clientId = await question('Google Client ID: ');
  if (!clientId || clientId.trim() === '') {
    console.log('❌ Google Client ID is required!');
    rl.close();
    return;
  }

  const clientSecret = await question('Google Client Secret: ');
  if (!clientSecret || clientSecret.trim() === '') {
    console.log('❌ Google Client Secret is required!');
    rl.close();
    return;
  }

  const domain = await question('Your domain (e.g., https://yourdomain.com or http://localhost:5173): ');
  const redirectUri = domain.endsWith('/') ? `${domain}auth/callback/google` : `${domain}/auth/callback/google`;

  console.log('\n📝 Generating environment configuration...\n');

  // Read existing .env.local or create new one
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('📄 Found existing .env.local file, updating...');
  } else {
    console.log('📄 Creating new .env.local file...');
  }

  // Remove existing Google OAuth entries
  envContent = envContent.replace(/^GOOGLE_CLIENT_ID=.*$/m, '');
  envContent = envContent.replace(/^GOOGLE_CLIENT_SECRET=.*$/m, '');
  envContent = envContent.replace(/^GOOGLE_REDIRECT_URI=.*$/m, '');
  envContent = envContent.replace(/^VITE_GOOGLE_CLIENT_ID=.*$/m, '');
  
  // Clean up empty lines
  envContent = envContent.replace(/\n\n+/g, '\n\n');

  // Add Google OAuth configuration
  const googleConfig = `
# Google OAuth Configuration
GOOGLE_CLIENT_ID="${clientId}"
GOOGLE_CLIENT_SECRET="${clientSecret}"
GOOGLE_REDIRECT_URI="${redirectUri}"
VITE_GOOGLE_CLIENT_ID="${clientId}"
`;

  envContent += googleConfig;

  // Write the file
  fs.writeFileSync(envPath, envContent);

  console.log('✅ Environment configuration saved to .env.local\n');
  
  console.log('🔍 Google Cloud Console Configuration Check:');
  console.log(`📍 Authorized JavaScript origins should include: ${domain}`);
  console.log(`📍 Authorized redirect URIs should include: ${redirectUri}`);
  console.log('\nIf these don\'t match, please update them in your Google Cloud Console.\n');

  console.log('🚀 Next Steps:');
  console.log('1. Restart your development server');
  console.log('2. Test Google authentication on your login page');
  console.log('3. Check browser console for any errors\n');

  const testNow = await question('Would you like to test the configuration now? (y/n): ');
  if (testNow.toLowerCase() === 'y') {
    await testGoogleOAuth(clientId);
  }

  rl.close();
}

async function testGoogleOAuth(clientId) {
  console.log('\n🧪 Testing Google OAuth configuration...\n');
  
  // Basic validation
  const issues = [];
  
  if (!clientId.includes('.googleusercontent.com')) {
    issues.push('❌ Client ID format appears incorrect (should end with .googleusercontent.com)');
  }
  
  if (clientId.length < 50) {
    issues.push('❌ Client ID seems too short (Google Client IDs are typically 70+ characters)');
  }

  if (issues.length > 0) {
    console.log('⚠️  Potential Issues Detected:');
    issues.forEach(issue => console.log(issue));
    console.log('\nPlease double-check your Google Cloud Console configuration.\n');
  } else {
    console.log('✅ Basic validation passed!');
    console.log('📍 Client ID format looks correct');
    console.log('\n💡 To test fully:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Navigate to the login page');
    console.log('3. Click "Sign in with Google"');
    console.log('4. Check browser console for detailed error messages if issues occur\n');
  }
}

// Handle script execution
if (require.main === module) {
  setupGoogleOAuth().catch(error => {
    console.error('❌ Setup failed:', error.message);
    rl.close();
    process.exit(1);
  });
}

module.exports = { setupGoogleOAuth };
