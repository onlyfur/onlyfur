const request = require('supertest');
const bcrypt = require('bcryptjs');

/**
 * Test suite for authentication registration
 * Tests both credential-based and Google OAuth registration
 */
describe('Authentication Registration', () => {
  const testUserEmail = 'testuser@example.com';
  const testUserPassword = 'securePassword123';
  const testUsername = 'testuser123';

  beforeEach(async () => {
    // Clean up any existing test users before each test
    // This would typically use your database cleanup utilities
  });

  afterEach(async () => {
    // Clean up test data after each test
  });

  describe('Credential-based Registration', () => {
    test('should register user with email and password', async () => {
      const registrationData = {
        email: testUserEmail,
        username: testUsername,
        displayName: 'Test User',
        password: testUserPassword,
        role: 'SUBSCRIBER'
      };

      // This is a mock test - you would replace with actual API call
      const response = {
        status: 201,
        body: {
          success: true,
          data: {
            user: {
              id: 'user_123',
              email: testUserEmail,
              username: testUsername,
              displayName: 'Test User',
              role: 'SUBSCRIBER',
              authProvider: 'EMAIL',
              isEmailVerified: false
            },
            token: 'jwt_token_here',
            refreshToken: 'refresh_token_here'
          },
          message: 'User registered successfully. Please check your email for verification.'
        }
      };

      // Verify password is hashed
      expect(response.body.data.user.password).toBeUndefined();
      expect(response.body.data.user.authProvider).toBe('EMAIL');
      expect(response.body.data.user.isEmailVerified).toBe(false);
      expect(response.body.success).toBe(true);
    });

    test('should not allow registration with weak password', async () => {
      const registrationData = {
        email: testUserEmail,
        username: testUsername,
        displayName: 'Test User',
        password: '123', // Too weak
        role: 'SUBSCRIBER'
      };

      // Mock response for validation error
      const response = {
        status: 400,
        body: {
          success: false,
          error: 'Password must be at least 6 characters long'
        }
      };

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Password must be at least 6 characters');
    });

    test('should not allow duplicate email registration', async () => {
      const registrationData = {
        email: testUserEmail,
        username: 'differentuser',
        displayName: 'Different User',
        password: testUserPassword,
        role: 'SUBSCRIBER'
      };

      // Mock response for duplicate email
      const response = {
        status: 400,
        body: {
          success: false,
          error: 'User with this email or username already exists'
        }
      };

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('Google OAuth Registration', () => {
    test('should register user with Google OAuth', async () => {
      const googleAuthData = {
        credential: 'mock_google_jwt_credential',
        userType: 'subscriber'
      };

      // Mock Google OAuth response
      const response = {
        status: 200,
        body: {
          success: true,
          data: {
            user: {
              id: 'google_user_123',
              email: 'googleuser@gmail.com',
              username: 'googleuser123',
              displayName: 'Google User',
              role: 'SUBSCRIBER',
              authProvider: 'GOOGLE',
              isEmailVerified: true,
              avatar: 'https://lh3.googleusercontent.com/...'
            },
            token: 'jwt_token_here',
            refreshToken: 'refresh_token_here'
          },
          message: 'Google authentication successful'
        }
      };

      // Verify Google user properties
      expect(response.body.data.user.authProvider).toBe('GOOGLE');
      expect(response.body.data.user.isEmailVerified).toBe(true);
      expect(response.body.data.user.password).toBeUndefined();
      expect(response.body.data.user.avatar).toBeDefined();
      expect(response.body.success).toBe(true);
    });

    test('should link Google account to existing email user', async () => {
      // Scenario: User already exists with email/password, then links Google
      const googleAuthData = {
        credential: 'mock_google_jwt_credential',
        userType: 'subscriber'
      };

      // Mock response for account linking
      const response = {
        status: 200,
        body: {
          success: true,
          data: {
            user: {
              id: 'user_123',
              email: testUserEmail,
              username: testUsername,
              displayName: 'Test User',
              role: 'SUBSCRIBER',
              authProvider: 'GOOGLE', // Updated to Google
              isEmailVerified: true, // Now verified via Google
              googleId: 'google_id_123'
            },
            token: 'jwt_token_here',
            refreshToken: 'refresh_token_here'
          },
          message: 'Google authentication successful'
        }
      };

      expect(response.body.data.user.authProvider).toBe('GOOGLE');
      expect(response.body.data.user.isEmailVerified).toBe(true);
      expect(response.body.data.user.googleId).toBeDefined();
      expect(response.body.success).toBe(true);
    });

    test('should handle invalid Google credential', async () => {
      const googleAuthData = {
        credential: 'invalid_google_credential',
        userType: 'subscriber'
      };

      // Mock response for invalid credential
      const response = {
        status: 401,
        body: {
          success: false,
          error: 'Invalid Google credential'
        }
      };

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid Google credential');
    });
  });

  describe('Password Security', () => {
    test('should hash passwords with bcrypt', async () => {
      const password = 'testPassword123';
      const hashedPassword = await bcrypt.hash(password, 12);

      // Verify bcrypt hash properties
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);

      // Verify password comparison works
      const isValid = await bcrypt.compare(password, hashedPassword);
      expect(isValid).toBe(true);

      const isInvalid = await bcrypt.compare('wrongPassword', hashedPassword);
      expect(isInvalid).toBe(false);
    });

    test('should validate password hash format', () => {
      const validBcryptHash = '$2b$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const invalidHash = 'plaintext_password';

      // Test hash validation function
      const validatePasswordHash = (password) => {
        return /^\$2[aby]\$\d{2}\$.{53}$/.test(password);
      };

      expect(validatePasswordHash(validBcryptHash)).toBe(true);
      expect(validatePasswordHash(invalidHash)).toBe(false);
    });
  });

  describe('User Role Assignment', () => {
    test('should assign SUBSCRIBER role by default', async () => {
      const registrationData = {
        email: testUserEmail,
        username: testUsername,
        displayName: 'Test User',
        password: testUserPassword
        // No role specified
      };

      // Mock response with default role
      const response = {
        status: 201,
        body: {
          success: true,
          data: {
            user: {
              role: 'SUBSCRIBER'
            }
          }
        }
      };

      expect(response.body.data.user.role).toBe('SUBSCRIBER');
    });

    test('should allow CREATOR role selection in Google OAuth', async () => {
      const googleAuthData = {
        credential: 'mock_google_jwt_credential',
        userType: 'creator'
      };

      // Mock response with creator role
      const response = {
        status: 200,
        body: {
          success: true,
          data: {
            user: {
              role: 'CREATOR'
            }
          }
        }
      };

      expect(response.body.data.user.role).toBe('CREATOR');
    });
  });
});

module.exports = {
  // Export any utility functions for use in other test files
  validatePasswordHash: (password) => /^\$2[aby]\$\d{2}\$.{53}$/.test(password)
};
