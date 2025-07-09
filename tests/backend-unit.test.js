const { 
  JWTHandler, 
  corsHeaders, 
  GoogleOAuth, 
  EmailService,
  normalizeUser
} = require('../backend/utils');

const { PasswordHasher } = require('../backend/database');

describe('Backend Unit Tests', () => {
  describe('JWT Handler', () => {
    const testSecret = 'test-secret-key';
    const testPayload = {
      userId: '123',
      email: 'test@example.com',
      role: 'SUBSCRIBER'
    };

    test('should encode and decode base64 URL properly', () => {
      const testString = 'Hello, World!';
      const encoded = JWTHandler.base64UrlEncode(testString);
      const decoded = JWTHandler.base64UrlDecode(encoded);
      
      expect(encoded).not.toContain('+');
      expect(encoded).not.toContain('/');
      expect(encoded).not.toContain('=');
      expect(decoded).toBe(testString);
    });

    test('should sign JWT token correctly', () => {
      const token = JWTHandler.sign(testPayload, testSecret, '1h');
      
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // header.payload.signature
    });

    test('should verify valid JWT token', () => {
      const token = JWTHandler.sign(testPayload, testSecret, '1h');
      const decoded = JWTHandler.verify(token, testSecret);
      
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
      expect(decoded.iat).toBeTruthy();
      expect(decoded.exp).toBeTruthy();
    });

    test('should reject token with wrong secret', () => {
      const token = JWTHandler.sign(testPayload, testSecret, '1h');
      
      expect(() => {
        JWTHandler.verify(token, 'wrong-secret');
      }).toThrow('Invalid token');
    });

    test('should reject malformed token', () => {
      expect(() => {
        JWTHandler.verify('malformed.token', testSecret);
      }).toThrow('Invalid token');
    });

    test('should handle different expiration formats', () => {
      const tokenDays = JWTHandler.sign(testPayload, testSecret, '7d');
      const tokenHours = JWTHandler.sign(testPayload, testSecret, '24h');
      const tokenSeconds = JWTHandler.sign(testPayload, testSecret, '3600');
      
      const decodedDays = JWTHandler.verify(tokenDays, testSecret);
      const decodedHours = JWTHandler.verify(tokenHours, testSecret);
      const decodedSeconds = JWTHandler.verify(tokenSeconds, testSecret);
      
      expect(decodedDays.exp).toBeGreaterThan(decodedHours.exp);
      expect(decodedHours.exp).toBeGreaterThan(decodedSeconds.exp);
    });

    test('should reject expired token', () => {
      // Create a token with custom payload that's already expired
      const expiredPayload = {
        ...testPayload,
        exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
      };
      
      const header = { alg: 'HS256', typ: 'JWT' };
      const encodedHeader = JWTHandler.base64UrlEncode(JSON.stringify(header));
      const encodedPayload = JWTHandler.base64UrlEncode(JSON.stringify(expiredPayload));
      
      const signature = require('crypto')
        .createHmac('sha256', testSecret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      const expiredToken = `${encodedHeader}.${encodedPayload}.${signature}`;
      
      expect(() => {
        JWTHandler.verify(expiredToken, testSecret);
      }).toThrow('Invalid token');
    });
  });

  describe('Password Hasher', () => {
    const testPassword = 'testPassword123!';

    test('should hash password with salt', async () => {
      const hash = await PasswordHasher.hash(testPassword);
      
      expect(hash).toBeTruthy();
      expect(typeof hash).toBe('string');
      expect(hash).toContain(':'); // Should contain salt:hash
      expect(hash.split(':').length).toBe(2);
    });

    test('should verify correct password', async () => {
      const hash = await PasswordHasher.hash(testPassword);
      const isValid = await PasswordHasher.compare(testPassword, hash);
      
      expect(isValid).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const hash = await PasswordHasher.hash(testPassword);
      const isValid = await PasswordHasher.compare('wrongPassword', hash);
      
      expect(isValid).toBe(false);
    });

    test('should generate different hashes for same password', async () => {
      const hash1 = await PasswordHasher.hash(testPassword);
      const hash2 = await PasswordHasher.hash(testPassword);
      
      expect(hash1).not.toBe(hash2); // Different salts
      
      // But both should verify correctly
      const valid1 = await PasswordHasher.compare(testPassword, hash1);
      const valid2 = await PasswordHasher.compare(testPassword, hash2);
      
      expect(valid1).toBe(true);
      expect(valid2).toBe(true);
    });

    test('should handle empty or invalid hash', async () => {
      const isValid1 = await PasswordHasher.compare(testPassword, '');
      const isValid2 = await PasswordHasher.compare(testPassword, 'invalid-hash');
      const isValid3 = await PasswordHasher.compare(testPassword, null);
      
      expect(isValid1).toBe(false);
      expect(isValid2).toBe(false);
      expect(isValid3).toBe(false);
    });
  });

  describe('CORS Headers', () => {
    const originalEnv = process.env.CORS_ORIGIN;

    afterEach(() => {
      process.env.CORS_ORIGIN = originalEnv;
    });

    test('should return default CORS headers', () => {
      const headers = corsHeaders();
      
      expect(headers['Access-Control-Allow-Origin']).toBeTruthy();
      expect(headers['Access-Control-Allow-Methods']).toContain('GET');
      expect(headers['Access-Control-Allow-Methods']).toContain('POST');
      expect(headers['Access-Control-Allow-Headers']).toContain('Content-Type');
      expect(headers['Access-Control-Allow-Headers']).toContain('Authorization');
      expect(headers['Access-Control-Allow-Credentials']).toBe('true');
      expect(headers['Content-Type']).toBe('application/json');
    });

    test('should use custom frontend URL from environment', () => {
      process.env.CORS_ORIGIN = 'https://custom-frontend.com';
      
      const headers = corsHeaders('https://custom-frontend.com');
      
      expect(headers['Access-Control-Allow-Origin']).toBe('https://custom-frontend.com');
    });

    test('should fallback to default localhost URL', () => {
      delete process.env.CORS_ORIGIN;
      delete process.env.NODE_ENV;
      
      const headers = corsHeaders();
      
      expect(headers['Access-Control-Allow-Origin']).toBe('http://localhost:5173');
    });
  });

  describe('User Normalization', () => {
    test('should normalize user data correctly', () => {
      const rawUser = {
        id: 'user123',
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
        role: 'SUBSCRIBER',
        isVerified: true,
        isActive: true,
        authProvider: 'EMAIL',
        isEmailVerified: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
        lastLoginAt: '2023-01-03T00:00:00Z',
        // Extra fields that should not be included
        password: 'hashedpassword',
        passwordResetToken: 'token123',
        internalField: 'internal'
      };

      const normalized = normalizeUser(rawUser);

      expect(normalized.id).toBe(rawUser.id);
      expect(normalized.email).toBe(rawUser.email);
      expect(normalized.username).toBe(rawUser.username);
      expect(normalized.displayName).toBe(rawUser.displayName);
      expect(normalized.role).toBe(rawUser.role);
      expect(normalized.isVerified).toBe(rawUser.isVerified);
      expect(normalized.isActive).toBe(rawUser.isActive);
      expect(normalized.authProvider).toBe(rawUser.authProvider);
      expect(normalized.isEmailVerified).toBe(rawUser.isEmailVerified);
      expect(normalized.createdAt).toBe(rawUser.createdAt);
      expect(normalized.updatedAt).toBe(rawUser.updatedAt);
      expect(normalized.lastLoginAt).toBe(rawUser.lastLoginAt);

      // Default values
      expect(normalized.subscriptionTier).toBe('free');
      expect(normalized.subscriptionStatus).toBe('FREE');
      expect(normalized.setupComplete).toBe(false);

      // Should not include sensitive fields
      expect(normalized.password).toBeUndefined();
      expect(normalized.passwordResetToken).toBeUndefined();
      expect(normalized.internalField).toBeUndefined();
    });

    test('should handle missing optional fields', () => {
      const minimalUser = {
        id: 'user123',
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
        role: 'SUBSCRIBER',
        isVerified: true,
        isActive: true,
        authProvider: 'EMAIL',
        isEmailVerified: true
      };

      const normalized = normalizeUser(minimalUser);

      expect(normalized.subscriptionTier).toBe('free');
      expect(normalized.subscriptionStatus).toBe('FREE');
      expect(normalized.setupComplete).toBe(false);
      expect(normalized.avatar).toBeUndefined();
      expect(normalized.bio).toBeUndefined();
    });
  });

  describe('Google OAuth', () => {
    // Mock fetch for testing
    const originalFetch = global.fetch;
    
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    test('should verify valid Google ID token', async () => {
      const mockTokenInfo = {
        sub: 'google-user-id',
        email: 'user@gmail.com',
        name: 'Google User',
        picture: 'https://example.com/avatar.jpg',
        aud: 'test-client-id',
        exp: Math.floor(Date.now() / 1000) + 3600,
        email_verified: 'true'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokenInfo)
      });

      // Set environment variable for test
      const originalClientId = process.env.GOOGLE_CLIENT_ID;
      process.env.GOOGLE_CLIENT_ID = 'test-client-id';

      const result = await GoogleOAuth.verifyIdToken('test-token');

      expect(result.googleId).toBe(mockTokenInfo.sub);
      expect(result.email).toBe(mockTokenInfo.email);
      expect(result.name).toBe(mockTokenInfo.name);
      expect(result.picture).toBe(mockTokenInfo.picture);
      expect(result.emailVerified).toBe(true);

      // Restore environment
      process.env.GOOGLE_CLIENT_ID = originalClientId;
    });

    test('should reject token with wrong audience', async () => {
      const mockTokenInfo = {
        sub: 'google-user-id',
        email: 'user@gmail.com',
        name: 'Google User',
        aud: 'wrong-client-id',
        exp: Math.floor(Date.now() / 1000) + 3600,
        email_verified: 'true'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokenInfo)
      });

      const originalClientId = process.env.GOOGLE_CLIENT_ID;
      process.env.GOOGLE_CLIENT_ID = 'correct-client-id';

      await expect(GoogleOAuth.verifyIdToken('test-token')).rejects.toThrow('Token audience mismatch');

      process.env.GOOGLE_CLIENT_ID = originalClientId;
    });

    test('should reject expired token', async () => {
      const mockTokenInfo = {
        sub: 'google-user-id',
        email: 'user@gmail.com',
        name: 'Google User',
        aud: 'test-client-id',
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired
        email_verified: 'true'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokenInfo)
      });

      const originalClientId = process.env.GOOGLE_CLIENT_ID;
      process.env.GOOGLE_CLIENT_ID = 'test-client-id';

      await expect(GoogleOAuth.verifyIdToken('test-token')).rejects.toThrow('Token expired');

      process.env.GOOGLE_CLIENT_ID = originalClientId;
    });

    test('should handle Google API errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid token' })
      });

      await expect(GoogleOAuth.verifyIdToken('invalid-token')).rejects.toThrow('Invalid token');
    });
  });

  describe('Email Service', () => {
    const originalFetch = global.fetch;
    const originalEnv = {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      FROM_EMAIL: process.env.FROM_EMAIL,
      FROM_NAME: process.env.FROM_NAME,
      CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
      SUPPORT_EMAIL: process.env.SUPPORT_EMAIL
    };

    beforeEach(() => {
      global.fetch = jest.fn();
      // Set test environment variables
      process.env.FROM_EMAIL = 'test@example.com';
      process.env.FROM_NAME = 'Test Platform';
      process.env.CLIENT_BASE_URL = 'http://localhost:5174';
      process.env.SUPPORT_EMAIL = 'support@example.com';
    });

    afterEach(() => {
      global.fetch = originalFetch;
      // Restore environment variables
      Object.assign(process.env, originalEnv);
    });

    test('should use mock email when SendGrid API key is not set', async () => {
      delete process.env.SENDGRID_API_KEY;
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await EmailService.sendEmail(
        'user@example.com',
        'Test Subject',
        '<p>Test HTML</p>',
        'Test Text'
      );
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[MOCK] Email to user@example.com: Test Subject')
      );
      
      consoleSpy.mockRestore();
    });

    test('should send email via SendGrid when API key is set', async () => {
      process.env.SENDGRID_API_KEY = 'test-api-key';
      
      global.fetch.mockResolvedValueOnce({
        ok: true
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await EmailService.sendEmail(
        'user@example.com',
        'Test Subject',
        '<p>Test HTML</p>',
        'Test Text'
      );
      
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.sendgrid.com/v3/mail/send',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json'
          })
        })
      );
      
      consoleSpy.mockRestore();
    });

    test('should send password reset email with correct content', async () => {
      delete process.env.SENDGRID_API_KEY; // Use mock
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await EmailService.sendPasswordResetEmail(
        'user@example.com',
        'reset-token-123'
      );
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('📧 Sending password reset email to: user@example.com')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:5174/reset-password?token=reset-token-123')
      );
      
      consoleSpy.mockRestore();
    });

    test('should send welcome email with correct content', async () => {
      delete process.env.SENDGRID_API_KEY; // Use mock
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await EmailService.sendWelcomeEmail(
        'newuser@example.com',
        'New User'
      );
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('📧 Sending welcome email to: newuser@example.com')
      );
      
      consoleSpy.mockRestore();
    });

    test('should fall back to mock when SendGrid fails', async () => {
      process.env.SENDGRID_API_KEY = 'test-api-key';
      
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await EmailService.sendEmail(
        'user@example.com',
        'Test Subject',
        '<p>Test HTML</p>'
      );
      
      expect(result).toBe(true); // Should still return true for fallback
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ Email sending failed')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FALLBACK] Using mock email')
      );
      
      consoleSpy.mockRestore();
      logSpy.mockRestore();
    });
  });
});
