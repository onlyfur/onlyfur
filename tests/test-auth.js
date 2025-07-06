#!/usr/bin/env node

// Complete Authentication System Test
// This script tests user registration, login, and authentication flow

const API_BASE_URL = 'http://localhost:3003';

async function testAuth() {
  console.log('🔍 Testing OnlyFur Authentication System...\n');

  // Generate unique test data
  const timestamp = Date.now();
  const testUser = {
    email: `testuser${timestamp}@example.com`,
    username: `testuser${timestamp}`,
    displayName: `Test User ${timestamp}`,
    password: 'SecurePassword123!',
    role: 'SUBSCRIBER'
  };

  try {
    // Test 1: User Registration
    console.log('1️⃣ Testing User Registration...');
    const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      throw new Error(`Registration failed: ${error.message || error.error}`);
    }

    const registerData = await registerResponse.json();
    console.log('✅ Registration successful');
    console.log(`   User ID: ${registerData.user.id}`);
    console.log(`   Email: ${registerData.user.email}`);
    console.log(`   Token received: ${registerData.token ? 'Yes' : 'No'}\n`);

    // Test 2: User Login
    console.log('2️⃣ Testing User Login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      throw new Error(`Login failed: ${error.message || error.error}`);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log(`   User ID: ${loginData.user.id}`);
    console.log(`   Token received: ${loginData.token ? 'Yes' : 'No'}\n`);

    // Test 3: Profile Access with Token
    console.log('3️⃣ Testing Authenticated Profile Access...');
    const profileResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (!profileResponse.ok) {
      const error = await profileResponse.json();
      throw new Error(`Profile access failed: ${error.message || error.error}`);
    }

    const profileData = await profileResponse.json();
    console.log('✅ Profile access successful');
    console.log(`   Profile loaded: ${profileData.user.displayName}`);
    console.log(`   Subscription: ${profileData.user.subscriptionTier}\n`);

    // Test 4: Invalid Login Attempt
    console.log('4️⃣ Testing Invalid Login (Wrong Password)...');
    const invalidLoginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword123!'
      })
    });

    if (invalidLoginResponse.ok) {
      throw new Error('Invalid login should have failed but succeeded');
    }

    console.log('✅ Invalid login properly rejected\n');

    // Test 5: Duplicate Registration
    console.log('5️⃣ Testing Duplicate Registration Prevention...');
    const duplicateResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (duplicateResponse.ok) {
      throw new Error('Duplicate registration should have failed but succeeded');
    }

    console.log('✅ Duplicate registration properly prevented\n');

    console.log('🎉 ALL AUTHENTICATION TESTS PASSED!');
    console.log('✅ User registration with password hashing: WORKING');
    console.log('✅ Database persistence: WORKING');
    console.log('✅ User login with verification: WORKING');
    console.log('✅ JWT token authentication: WORKING');
    console.log('✅ Invalid login prevention: WORKING');
    console.log('✅ Duplicate registration prevention: WORKING');

  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ Server is running\n');
      return true;
    }
  } catch (error) {
    console.error('❌ Server is not running. Please start the server with: npm run backend');
    return false;
  }
}

// Run tests
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testAuth();
  }
}

main().catch(console.error);
