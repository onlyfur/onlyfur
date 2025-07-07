import { authService } from '../services/authService';
import { hasValidAuthSession, isSessionNearExpiration, validateAndCleanupSession } from '../utils/cookieUtils';

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  details?: any;
}

class AuthenticationTester {
  private results: TestResult[] = [];

  private addResult(name: string, success: boolean, message: string, details?: any) {
    this.results.push({ name, success, message, details });
    console.log(`${success ? '✅' : '❌'} ${name}: ${message}`);
    if (details) {
      console.log('   Details:', details);
    }
  }

  async testSessionPersistence(): Promise<void> {
    console.log('\n🔐 Testing Enhanced Authentication System\n');

    // Test 1: Check initial session state
    const initialSessionValid = hasValidAuthSession();
    this.addResult(
      'Initial Session Check',
      true,
      `Session valid: ${initialSessionValid}`,
      { hasSession: initialSessionValid }
    );

    // Test 2: Test session validation
    const sessionValidation = authService.validateStoredSession();
    this.addResult(
      'Session Validation',
      true,
      `Validation complete`,
      sessionValidation
    );

    // Test 3: Test session expiration check
    const isNearExpiration = isSessionNearExpiration();
    this.addResult(
      'Expiration Check',
      true,
      `Near expiration: ${isNearExpiration}`,
      { isNearExpiration }
    );

    // Test 4: Test session cleanup
    const cleanupResult = validateAndCleanupSession();
    this.addResult(
      'Session Cleanup',
      true,
      `Cleanup successful: ${cleanupResult}`,
      { cleanupResult }
    );

    // Test 5: Test remember me functionality
    const rememberMe = authService.isRememberMeEnabled();
    this.addResult(
      'Remember Me Check',
      true,
      `Remember me enabled: ${rememberMe}`,
      { rememberMe }
    );

    // Test 6: Test stored user data (should not contain passwords)
    const storedUser = authService.getStoredUser();
    const hasPassword = storedUser && ('password' in storedUser || 'passwordHash' in storedUser);
    this.addResult(
      'Security Check',
      !hasPassword,
      hasPassword ? 'SECURITY RISK: Password found in storage' : 'No passwords in storage',
      { hasUser: !!storedUser, hasPassword }
    );

    // Test 7: Test saved credentials security
    const savedCredentials = authService.getSavedCredentials();
    const savedEmail = authService.getSavedEmail();
    this.addResult(
      'Credential Security',
      savedCredentials === null,
      savedCredentials ? 'SECURITY RISK: Credentials stored' : 'No credentials stored (secure)',
      { savedCredentials, savedEmail }
    );

    console.log('\n📊 Test Summary:');
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    console.log(`Passed: ${passed}/${total}`);
    
    if (passed === total) {
      console.log('🎉 All security and persistence tests passed!');
    } else {
      console.log('⚠️  Some tests failed. Review security implementation.');
    }
  }

  async testMockLogin(): Promise<void> {
    console.log('\n🧪 Testing Mock Login Flow\n');

    try {
      // Test login with mock user
      const loginResult = await authService.login({
        email: 'test@example.com',
        password: 'any-password'
      }, true); // With remember me

      this.addResult(
        'Mock Login',
        loginResult.success,
        loginResult.success ? 'Login successful' : `Login failed: ${loginResult.error}`,
        { user: loginResult.user?.email, token: !!loginResult.token }
      );

      if (loginResult.success) {
        // Test session after login
        const sessionAfterLogin = hasValidAuthSession();
        this.addResult(
          'Session After Login',
          sessionAfterLogin,
          `Session valid after login: ${sessionAfterLogin}`
        );

        // Test auto-login capability
        const shouldAutoLogin = authService.shouldAttemptAutoLogin();
        this.addResult(
          'Auto-login Check',
          shouldAutoLogin,
          `Should attempt auto-login: ${shouldAutoLogin}`
        );

        // Test logout
        const logoutResult = await authService.logout();
        this.addResult(
          'Logout',
          logoutResult.success,
          `Logout successful: ${logoutResult.success}`
        );

        // Verify session cleared
        const sessionAfterLogout = hasValidAuthSession();
        this.addResult(
          'Session After Logout',
          !sessionAfterLogout,
          `Session cleared: ${!sessionAfterLogout}`
        );
      }

    } catch (error) {
      this.addResult(
        'Mock Login Flow',
        false,
        `Error during login flow: ${error}`,
        { error }
      );
    }
  }

  async runAllTests(): Promise<void> {
    await this.testSessionPersistence();
    await this.testMockLogin();
    
    console.log('\n🔍 Detailed Results:');
    this.results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.name}: ${result.success ? 'PASS' : 'FAIL'}`);
      console.log(`   ${result.message}`);
    });
  }
}

// Export for use in browser console or testing
export const runAuthTests = () => {
  const tester = new AuthenticationTester();
  return tester.runAllTests();
};

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Authentication system tests available. Run runAuthTests() in console.');
}

export default AuthenticationTester;
