const { getDatabase } = require('../backend/database');
const { createRoutes } = require('../backend/routes');
const { JWTHandler } = require('../backend/utils');

describe('Backend Simple Integration Tests', () => {
    let db;
    let routes;

    const testUser = {
        email: 'simpletest@example.com',
        username: 'simpletest',
        displayName: 'Simple Test User',
        password: 'password123'
    };

    beforeAll(async () => {
        // Initialize database and routes
        db = getDatabase();
        await db.connect();
        routes = createRoutes(db);

        console.log('🧪 Backend simple integration tests initialized');
    });

    afterAll(async () => {
        // Cleanup
        try {
            if (db && db.client) {
                await db.client.query(
                    'DELETE FROM users WHERE email = $1',
                    [testUser.email]
                );
            }
        } catch (error) {
            console.warn('Test cleanup warning:', error.message);
        }

        if (db) {
            await db.disconnect();
        }

        console.log('🧪 Backend simple integration tests completed');
    });

    describe('Database Operations', () => {
        test('should connect to database', () => {
            expect(db.isConnected).toBe(true);
        });

        test('should find admin user', async () => {
            const adminEmail = process.env.ADMIN_EMAIL;
            const admin = await db.findUserByEmail(adminEmail);

            expect(admin).toBeTruthy();
            expect(admin.role).toBe('ADMIN');
            expect(admin.isActive).toBe(true);
        });

        test('should create and find new user', async () => {
            // Create user
            const newUser = await db.createUser(testUser);

            expect(newUser).toBeTruthy();
            expect(newUser.email).toBe(testUser.email);
            expect(newUser.username).toBe(testUser.username);
            expect(newUser.role).toBe('SUBSCRIBER');

            // Find user by email
            const foundUser = await db.findUserByEmail(testUser.email);
            expect(foundUser).toBeTruthy();
            expect(foundUser.id).toBe(newUser.id);

            // Find user by username
            const foundByUsername = await db.findUserByUsername(testUser.username);
            expect(foundByUsername).toBeTruthy();
            expect(foundByUsername.id).toBe(newUser.id);
        });

        test('should verify password correctly', async () => {
            const { PasswordHasher } = require('../backend/database');
            const user = await db.findUserByEmail(testUser.email);

            expect(user).toBeTruthy();

            // Test correct password
            const isValidCorrect = await PasswordHasher.compare(testUser.password, user.password);
            expect(isValidCorrect).toBe(true);

            // Test incorrect password
            const isValidIncorrect = await PasswordHasher.compare('wrongpassword', user.password);
            expect(isValidIncorrect).toBe(false);
        });

        test('should update user password', async () => {
            const user = await db.findUserByEmail(testUser.email);
            const newPassword = 'newpassword123';

            const updated = await db.updateUserPassword(user.id, newPassword);
            expect(updated).toBe(true);

            // Verify new password works
            const { PasswordHasher } = require('../backend/database');
            const updatedUser = await db.findUserByEmail(testUser.email);
            const isValid = await PasswordHasher.compare(newPassword, updatedUser.password);
            expect(isValid).toBe(true);

            // Restore original password
            await db.updateUserPassword(user.id, testUser.password);
        });

        test('should handle custom URL operations', async () => {
            const user = await db.findUserByEmail(testUser.email);
            const customUrl = 'mycustomurl';

            // Check availability
            const isAvailable = await db.checkCustomUrlAvailability(customUrl);
            expect(isAvailable).toBe(true);

            // Update user profile with custom URL
            const updated = await db.updateUserProfile(user.id, { customUrl });
            expect(updated).toBe(true);

            // Find user by custom URL
            const foundByUrl = await db.findUserByCustomUrl(customUrl);
            expect(foundByUrl).toBeTruthy();
            expect(foundByUrl.id).toBe(user.id);

            // Check availability again (should be false now)
            const isStillAvailable = await db.checkCustomUrlAvailability(customUrl);
            expect(isStillAvailable).toBe(false);
        });
    });

    describe('Route Handlers', () => {
        test('should have all required routes', () => {
            const expectedRoutes = [
                'GET /api/health',
                'GET /api',
                'POST /api/auth/login',
                'POST /api/auth/register',
                'GET /api/auth/me',
                'POST /api/auth/google/login',
                'POST /api/auth/request-password-reset',
                'POST /api/auth/reset-password',
                'GET /api/admin/panel',
                'POST /api/auth/logout'
            ];

            const routeKeys = Object.keys(routes);

            expectedRoutes.forEach(route => {
                expect(routeKeys).toContain(route);
                expect(typeof routes[route]).toBe('function');
            });
        });
    });

    describe('JWT Token Operations', () => {
        test('should generate and verify tokens', () => {
            const user = { id: 'test123', email: 'test@example.com', role: 'SUBSCRIBER' };
            const secret = process.env.JWT_SECRET;

            // Generate token
            const token = JWTHandler.sign(user, secret, '1h');
            expect(token).toBeTruthy();
            expect(typeof token).toBe('string');

            // Verify token
            const decoded = JWTHandler.verify(token, secret);
            expect(decoded.id).toBe(user.id);
            expect(decoded.email).toBe(user.email);
            expect(decoded.role).toBe(user.role);
        });

        test('should handle token expiration', () => {
            const user = { id: 'test123', email: 'test@example.com', role: 'SUBSCRIBER' };
            const secret = process.env.JWT_SECRET;

            // Create token with past expiration
            const expiredPayload = {
                ...user,
                exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
            };

            const header = { alg: 'HS256', typ: 'JWT' };
            const encodedHeader = JWTHandler.base64UrlEncode(JSON.stringify(header));
            const encodedPayload = JWTHandler.base64UrlEncode(JSON.stringify(expiredPayload));

            const signature = require('crypto')
                .createHmac('sha256', secret)
                .update(`${encodedHeader}.${encodedPayload}`)
                .digest('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');

            const expiredToken = `${encodedHeader}.${encodedPayload}.${signature}`;

            expect(() => {
                JWTHandler.verify(expiredToken, secret);
            }).toThrow('Invalid token');
        });
    });

    describe('Password Reset Flow', () => {
        test('should set and find password reset token', async () => {
            const user = await db.findUserByEmail(testUser.email);
            const resetToken = 'test-reset-token-123';
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            // Set reset token
            const setResult = await db.setPasswordResetToken(user.email, resetToken, expiresAt);
            expect(setResult).toBe(true);

            // Find user by reset token
            const foundUser = await db.findUserByResetToken(resetToken);
            expect(foundUser).toBeTruthy();
            expect(foundUser.id).toBe(user.id);
        });

        test('should not find expired reset token', async () => {
            const expiredToken = 'expired-token-123';
            const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

            // Set expired token
            const user = await db.findUserByEmail(testUser.email);
            await db.setPasswordResetToken(user.email, expiredToken, expiredDate);

            // Should not find expired token
            const foundUser = await db.findUserByResetToken(expiredToken);
            expect(foundUser).toBeNull();
        });
    });

    describe('Google User Operations', () => {
        const googleUser = {
            email: 'googletest@gmail.com',
            googleId: 'google123456789',
            name: 'Google Test User',
            picture: 'https://example.com/avatar.jpg'
        };

        afterEach(async () => {
            // Cleanup Google test user
            try {
                await db.client.query(
                    'DELETE FROM users WHERE email = $1',
                    [googleUser.email]
                );
            } catch (error) {
                // Ignore cleanup errors
            }
        });

        test('should create Google user', async () => {
            const newUser = await db.createGoogleUser(googleUser);

            expect(newUser).toBeTruthy();
            expect(newUser.email).toBe(googleUser.email);
            expect(newUser.googleId).toBe(googleUser.googleId);
            expect(newUser.displayName).toBe(googleUser.name);
            expect(newUser.authProvider).toBe('GOOGLE');
            expect(newUser.avatar).toBe(googleUser.picture);
        });

        test('should find user by Google ID', async () => {
            await db.createGoogleUser(googleUser);

            const foundUser = await db.findUserByGoogleId(googleUser.googleId);
            expect(foundUser).toBeTruthy();
            expect(foundUser.email).toBe(googleUser.email);
        });

        test('should link Google account to existing user', async () => {
            // Create regular user first
            const regularUser = await db.createUser({
                email: googleUser.email,
                username: 'googlelinked',
                displayName: 'Google Linked User',
                password: 'password123'
            });

            // Link Google account
            const linked = await db.linkGoogleAccount(regularUser.id, googleUser.googleId);
            expect(linked).toBe(true);

            // Verify link
            const foundUser = await db.findUserByGoogleId(googleUser.googleId);
            expect(foundUser).toBeTruthy();
            expect(foundUser.id).toBe(regularUser.id);
            expect(foundUser.authProvider).toBe('GOOGLE');
        });
    });

    describe('User Profile Management', () => {
        test('should generate unique custom URL', async () => {
            const baseUsername = 'testuser';

            const customUrl = await db.generateUniqueCustomUrl(baseUsername);
            expect(customUrl).toBeTruthy();
            expect(typeof customUrl).toBe('string');
            expect(customUrl.length).toBeGreaterThan(0);

            // Should be URL-safe
            expect(customUrl).toMatch(/^[a-z0-9_-]+$/);
        });

        test('should update user profile', async () => {
            const user = await db.findUserByEmail(testUser.email);

            const updates = {
                bio: 'This is my test bio',
                website: 'https://example.com',
                isPrivate: true,
                allowMessages: false
            };

            const updated = await db.updateUserProfile(user.id, updates);
            expect(updated).toBe(true);

            // Verify updates
            const updatedUser = await db.findUserById(user.id);
            expect(updatedUser.bio).toBe(updates.bio);
            expect(updatedUser.website).toBe(updates.website);
            expect(updatedUser.isPrivate).toBe(updates.isPrivate);
            expect(updatedUser.allowMessages).toBe(updates.allowMessages);
        });
    });

    describe('Environment Configuration', () => {
        test('should have required environment variables', () => {
            const requiredVars = [
                'DATABASE_URL',
                'JWT_SECRET',
                'JWT_REFRESH_SECRET',
                'ADMIN_EMAIL',
                'ADMIN_PASSWORD',
                'ADMIN_USERNAME'
            ];

            requiredVars.forEach(varName => {
                expect(process.env[varName]).toBeTruthy();
            });
        });

        test('should have proper configuration values', () => {
            // NODE_ENV should be set (test or development)
            expect(process.env.NODE_ENV).toBeTruthy();

            // BCRYPT_ROUNDS should be lower for tests
            const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
            expect(bcryptRounds).toBeGreaterThan(0);

            expect(process.env.CLIENT_BASE_URL).toBeTruthy();
        });
    });
});