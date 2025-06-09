#!/usr/bin/env node

/**
 * Authentication Test Script for OnlyFur Platform
 * Tests Google OAuth configuration and backend connectivity
 */

const http = require('http');
const https = require('https');
const url = require('url');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const API_ENDPOINT = `${BASE_URL}/api/auth/google`;

async function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const client = options.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            data: null
          };
          
          if (res.headers['content-type']?.includes('application/json')) {
            response.data = JSON.parse(body);
          }
          
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

async function testHealthEndpoint() {
  console.log('🏥 Testing server health...');
  
  try {
    const healthUrl = `${BASE_URL}/api/health`;
    const options = {
      ...url.parse(healthUrl),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await makeRequest(options);
    
    if (response.statusCode === 200) {
      console.log('✅ Server is running and healthy');
      return true;
    } else {
      console.log(`❌ Server health check failed (${response.statusCode})`);
      console.log('Response:', response.body);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to server:', error.message);
    console.log(`🔍 Trying to connect to: ${BASE_URL}`);
    console.log('💡 Make sure your backend server is running');
    return false;
  }
}

async function testGoogleOAuthEndpoint() {
  console.log('\n🔐 Testing Google OAuth endpoint...');
  
  try {
    const options = {
      ...url.parse(API_ENDPOINT),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Test with invalid credential to check endpoint accessibility
    const testData = JSON.stringify({
      credential: 'test_invalid_credential',
      userType: 'subscriber'
    });

    const response = await makeRequest(options, testData);
    
    console.log(`📊 Response Status: ${response.statusCode}`);
    
    if (response.statusCode === 400 || response.statusCode === 401) {
      console.log('✅ OAuth endpoint is accessible (expected validation error)');
      
      if (response.data) {
        if (response.data.error?.includes('Google OAuth not configured')) {
          console.log('❌ Google OAuth not configured - missing environment variables');
          return false;
        } else if (response.data.error?.includes('Invalid Google token')) {
          console.log('✅ Google OAuth is configured correctly');
          return true;
        }
      }
    } else if (response.statusCode === 501) {
      console.log('❌ Google OAuth not configured on server');
      return false;
    } else {
      console.log('🤔 Unexpected response from OAuth endpoint');
      console.log('Response:', response.body);
    }
    
    return false;
  } catch (error) {
    console.log('❌ Failed to test OAuth endpoint:', error.message);
    return false;
  }
}

function checkEnvironmentVariables() {
  console.log('\n🔧 Checking environment variables...');
  
  const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'VITE_GOOGLE_CLIENT_ID'
  ];

  const missing = [];
  const present = [];

  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
      console.log(`✅ ${varName}: SET`);
    } else {
      missing.push(varName);
      console.log(`❌ ${varName}: NOT SET`);
    }
  });

  if (missing.length > 0) {
    console.log('\n📝 Missing environment variables:');
    missing.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n💡 Run: npm run setup:google-oauth');
    return false;
  }

  // Validate format
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
  if (clientId && !clientId.includes('.googleusercontent.com')) {
    console.log('⚠️  Warning: Client ID format looks incorrect');
    console.log('   Google Client IDs should end with .googleusercontent.com');
  }

  console.log('✅ All required environment variables are set');
  return true;
}

function generateTestInstructions() {
  console.log('\n📋 Manual Testing Instructions:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Open browser to: http://localhost:5173/login');
  console.log('3. Click "Sign in with Google"');
  console.log('4. Complete Google authentication');
  console.log('5. Check browser console for error messages');
  console.log('6. Verify you are redirected to dashboard');
  console.log('\n🔍 If authentication fails:');
  console.log('- Check browser console for JavaScript errors');
  console.log('- Check server logs for authentication attempts');
  console.log('- Verify Google Cloud Console redirect URIs');
}

async function runAllTests() {
  console.log('🧪 OnlyFur Platform - Authentication Test Suite\n');
  
  let allPassed = true;

  // Test 1: Environment Variables
  const envOk = checkEnvironmentVariables();
  allPassed = allPassed && envOk;

  // Test 2: Server Health
  const serverOk = await testHealthEndpoint();
  allPassed = allPassed && serverOk;

  // Test 3: OAuth Endpoint (only if server is running)
  let oauthOk = false;
  if (serverOk) {
    oauthOk = await testGoogleOAuthEndpoint();
    allPassed = allPassed && oauthOk;
  }

  // Results Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`Environment Variables: ${envOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Server Health: ${serverOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Google OAuth Config: ${oauthOk ? '✅ PASS' : '❌ FAIL'}`);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Google OAuth should work correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please fix the issues above.');
  }

  generateTestInstructions();
  
  return allPassed;
}

// Run tests if script is executed directly
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error.message);
      process.exit(1);
    });
}

module.exports = { runAllTests, testGoogleOAuthEndpoint, checkEnvironmentVariables };
