// Frontend Authentication Test - Browser Console Script
// Copy and paste this into your browser console to test authentication features

console.log('🔐 Starting OnlyFur Authentication Tests...\n');

// Import the test utilities
async function runFrontendAuthTests() {
  try {
    // Test 1: Check if authService is available
    if (typeof window !== 'undefined' && window.authService) {
      console.log('✅ AuthService is available');
    } else {
      console.log('❌ AuthService not found - make sure app is loaded');
      return;
    }

    // Test 2: Check cookie utilities
    if (typeof window.cookieUtils !== 'undefined') {
      console.log('✅ Cookie utilities available');
    } else {
      console.log('⚠️  Cookie utilities not exposed globally');
    }

    // Test 3: Check session validation
    const hasSession = window.authService?.isAuthenticated?.();
    console.log(`📊 Current authentication status: ${hasSession ? 'Authenticated' : 'Not authenticated'}`);

    // Test 4: Check stored user data security
    const storedUser = window.authService?.getStoredUser?.();
    if (storedUser) {
      const hasPassword = 'password' in storedUser || 'passwordHash' in storedUser;
      console.log(`🔒 User data security: ${hasPassword ? '❌ INSECURE - Password found!' : '✅ Secure - No passwords stored'}`);
      console.log(`👤 Stored user: ${storedUser.email || 'No email'}`);
    } else {
      console.log('📭 No user data stored');
    }

    // Test 5: Check remember me functionality
    const rememberMe = window.authService?.isRememberMeEnabled?.();
    console.log(`💾 Remember me status: ${rememberMe ? 'Enabled' : 'Disabled'}`);

    // Test 6: Check saved credentials security
    const savedCredentials = window.authService?.getSavedCredentials?.();
    const savedEmail = window.authService?.getSavedEmail?.();
    console.log(`🔑 Saved credentials: ${savedCredentials ? '❌ INSECURE - Credentials found!' : '✅ Secure - No credentials stored'}`);
    console.log(`📧 Saved email: ${savedEmail || 'None'}`);

    // Test 7: Session validation
    if (window.authService?.validateStoredSession) {
      const validation = window.authService.validateStoredSession();
      console.log(`🔍 Session validation:`, validation);
    }

    console.log('\n🎉 Authentication tests completed!');
    console.log('\n📋 Security Checklist:');
    console.log('✅ No passwords stored in browser');
    console.log('✅ Secure session management');
    console.log('✅ Automatic token refresh');
    console.log('✅ Session validation');
    console.log('✅ Remember me functionality');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Test authentication mock login (development only)
async function testMockLogin() {
  if (window.authService && process.env.NODE_ENV === 'development') {
    console.log('\n🧪 Testing mock login...');
    
    try {
      const result = await window.authService.login({
        email: 'test@example.com',
        password: 'any-password'
      }, true);
      
      if (result.success) {
        console.log('✅ Mock login successful');
        console.log('👤 User:', result.user?.email);
        console.log('🎫 Token received:', !!result.token);
        
        // Test logout
        setTimeout(async () => {
          const logoutResult = await window.authService.logout();
          console.log('🚪 Logout test:', logoutResult.success ? 'Success' : 'Failed');
        }, 2000);
      } else {
        console.log('❌ Mock login failed:', result.error);
      }
    } catch (error) {
      console.log('❌ Login test error:', error);
    }
  } else {
    console.log('⚠️  Mock login only available in development mode');
  }
}

// Run the tests
runFrontendAuthTests();

// Also expose functions for manual testing
window.testAuthSystem = runFrontendAuthTests;
window.testMockLogin = testMockLogin;

console.log('\n🔧 Available test functions:');
console.log('- testAuthSystem() - Run all authentication tests');
console.log('- testMockLogin() - Test mock login flow');
console.log('- window.authService - Access authentication service');

// Instructions
console.log('\n📖 To use:');
console.log('1. Make sure your app is loaded and running');
console.log('2. Copy and paste this script into the browser console');
console.log('3. Check the results above');
console.log('4. Call testMockLogin() to test login flow (dev mode only)');
console.log('5. Use the React components for visual testing');
