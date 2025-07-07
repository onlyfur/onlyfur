const crypto = require('crypto');
const { 
  JWTHandler, 
  sendResponse, 
  sendError, 
  getRequestBody, 
  authenticateToken, 
  normalizeUser, 
  GoogleOAuth, 
  EmailService 
} = require('./utils');

// Create route handlers factory
function createRoutes(db) {
  return {
    // Health check
    'GET /api/health': async (req, res) => {
      sendResponse(res, 200, {
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        message: 'OnlyFur Authentication Backend is running',
        database: db.isConnected ? 'Connected' : 'Disconnected',
        features: [
          'User Registration & Login',
          'Password Reset',
          'Email Change',
          'Google OAuth',
          'Admin Panel',
          'JWT Authentication'
        ]
      });
    },

    // API info
    'GET /api': async (req, res) => {
      sendResponse(res, 200, {
        message: 'OnlyFur Authentication API',
        version: '3.0.0',
        endpoints: {
          auth: {
            login: 'POST /api/auth/login',
            register: 'POST /api/auth/register',
            googleLogin: 'POST /api/auth/google/login',
            googleRegister: 'POST /api/auth/google/register',
            me: 'GET /api/auth/me',
            logout: 'POST /api/auth/logout',
            setupComplete: 'POST /api/auth/setup-complete',
            requestPasswordReset: 'POST /api/auth/request-password-reset',
            resetPassword: 'POST /api/auth/reset-password',
            changePassword: 'POST /api/auth/change-password',
            changeEmail: 'POST /api/auth/change-email',
            verifyEmail: 'POST /api/auth/verify-email'
          },
          user: {
            profile: 'GET /user/:username',
            updateProfile: 'PUT /api/user/profile',
            checkUrl: 'GET /api/user/check-url/:url',
            getUserContent: 'GET /api/user/content'
          },
          content: {
            create: 'POST /api/content'
          },
          admin: {
            panel: 'GET /api/admin/panel (Admin only)'
          }
        }
      });
    },

    // Login
    'POST /api/auth/login': async (req, res) => {
      try {
        console.log('🔐 Login attempt started');
        const { email, password } = await getRequestBody(req);
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password length: ${password ? password.length : 0}`);
        
        if (!email || !password) {
          console.log('❌ Missing email or password');
          return sendError(res, 400, 'Email and password are required');
        }
        
        // Ensure database is connected
        if (!db.isConnected) {
          await db.connect();
        }
        
        // Find user by email
        console.log(`🔍 Looking up user: ${email}`);
        let user = await db.findUserByEmail(email);
        
        // Special handling for admin login if user not found in database
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
        if (!user && ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          console.log('🔧 Admin user not found in database, attempting to create/reinitialize...');
          await db.initializeAdminUser();
          user = await db.findUserByEmail(email);
        }
        
        if (!user) {
          console.log('❌ User not found');
          return sendError(res, 401, 'Invalid email or password');
        }
        
        console.log(`👤 User found: ${user.username} (${user.role}), active: ${user.isActive}`);
        
        // Check if user is active
        if (!user.isActive) {
          console.log('❌ User account is disabled');
          // Special case: if this is admin, try to reactivate
          if (ADMIN_EMAIL && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            console.log('🔧 Reactivating admin user...');
            await db.client.query(
              'UPDATE users SET "isActive" = true, "updatedAt" = NOW() WHERE id = $1',
              [user.id]
            );
            user.isActive = true;
            console.log('✅ Admin user reactivated');
          } else {
            return sendError(res, 401, 'Account is disabled');
          }
        }

        // Verify password
        console.log('🔑 Verifying password...');
        const { PasswordHasher } = require('./database');
        let passwordValid = await PasswordHasher.compare(password, user.password);
        
        // Special fallback for admin user - if password doesn't match, try updating with env password
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
        if (!passwordValid && ADMIN_EMAIL && ADMIN_PASSWORD && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          console.log('🔧 Admin password mismatch, updating with environment password...');
          const hashedPassword = await PasswordHasher.hash(ADMIN_PASSWORD);
          await db.client.query(
            'UPDATE users SET password = $1, "updatedAt" = NOW() WHERE id = $2',
            [hashedPassword, user.id]
          );
          // Try again with the environment password
          passwordValid = await PasswordHasher.compare(password, hashedPassword);
          if (passwordValid) {
            console.log('✅ Admin password updated and verified');
            user.password = hashedPassword; // Update local object
          }
        }
        
        if (!passwordValid) {
          console.log('❌ Password verification failed');
          return sendError(res, 401, 'Invalid email or password');
        }

        // Generate tokens
        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
        const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
        
        const tokenPayload = {
          userId: user.id,
          email: user.email,
          role: user.role
        };
        
        const token = JWTHandler.sign(tokenPayload, JWT_SECRET, JWT_EXPIRES_IN);
        const refreshToken = JWTHandler.sign(tokenPayload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
        
        console.log(`✅ User logged in: ${user.email} (${user.role})`);
        
        sendResponse(res, 200, {
          success: true,
          message: 'Login successful',
          data: {
            user: normalizeUser(user),
            token,
            refreshToken
          }
        });
        
      } catch (error) {
        console.error('Login error:', error);
        sendError(res, 500, 'Internal server error', error);
      }
    },

    // Register
    'POST /api/auth/register': async (req, res) => {
      try {
        const { 
          email, 
          username, 
          displayName, 
          password, 
          role = 'SUBSCRIBER',
          selectedTier,
          agreeToTerms,
          newsletter
        } = await getRequestBody(req);
        
        // Validation
        if (!email || !username || !displayName || !password) {
          return sendError(res, 400, 'All fields are required');
        }
        
        if (password.length < 6) {
          return sendError(res, 400, 'Password must be at least 6 characters');
        }
        
        // Map frontend role values to database enum values
        const roleMapping = {
          'creator': 'CREATOR',
          'subscriber': 'SUBSCRIBER'
        };
        
        const dbRole = roleMapping[role.toLowerCase()] || 'SUBSCRIBER';
        
        // Ensure database is connected
        if (!db.isConnected) {
          await db.connect();
        }
        
        // Check if user already exists
        const existingUserByEmail = await db.findUserByEmail(email);
        if (existingUserByEmail) {
          return sendError(res, 409, 'Email already registered');
        }
        
        const existingUserByUsername = await db.findUserByUsername(username);
        if (existingUserByUsername) {
          return sendError(res, 409, 'Username already taken');
        }
          
        // Create user with new fields
        const newUser = await db.createUser({
          email,
          username,
          displayName,
          password,
          role: dbRole,
          subscriptionTier: selectedTier || null,
          registrationData: {
            selectedTier: selectedTier,
            agreeToTerms: agreeToTerms,
            newsletter: newsletter,
            registrationDate: new Date().toISOString(),
            userPath: role // Store the original path choice
          }
        });

        // Generate unique custom URL for the user
        const customUrl = await db.generateUniqueCustomUrl(username);
        await db.updateUserProfile(newUser.id, { customUrl });
        newUser.customUrl = customUrl;
        
        // Generate tokens
        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
        const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
        
        const tokenPayload = {
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role
        };
          
        const token = JWTHandler.sign(tokenPayload, JWT_SECRET, JWT_EXPIRES_IN);
        const refreshToken = JWTHandler.sign(tokenPayload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
        
        // Send welcome email (non-blocking)
        EmailService.sendWelcomeEmail(newUser.email, newUser.displayName).catch(error => {
          console.error('Welcome email failed:', error.message);
        });
        
        console.log(`✅ New user registered: ${newUser.email} (${newUser.role})`);
        
        sendResponse(res, 201, {
          success: true,
          message: 'Registration successful',
          data: {
            user: normalizeUser(newUser),
            token,
            refreshToken
          }
        });
        
      } catch (error) {
        console.error('Registration error:', error);
        if (error.code === '23505') { // PostgreSQL unique violation
          sendError(res, 409, 'Email or username already exists');
        } else {
          sendError(res, 500, 'Internal server error', error);
        }
      }
    },

    // Get current user
    'GET /api/auth/me': async (req, res) => {
      try {
        if (!db.isConnected) {
          await db.connect();
        }
        const user = await authenticateToken(req, db);
        sendResponse(res, 200, {
          success: true,
          data: normalizeUser(user)
        });
      } catch (error) {
        sendError(res, 401, error.message);
      }
    },

    // Google OAuth Login
    'POST /api/auth/google/login': async (req, res) => {
      try {
        const { credential } = await getRequestBody(req);
        
        if (!credential) {
          return sendError(res, 400, 'Google credential is required');
        }
        
        // Ensure database is connected
        if (!db.isConnected) {
          await db.connect();
        }
        
        // Verify Google token
        const googleUserInfo = await GoogleOAuth.verifyIdToken(credential);
        
        // Check if user exists by Google ID
        let user = await db.findUserByGoogleId(googleUserInfo.googleId);
        
        if (!user) {
          // Check if user exists by email (for account linking)
          user = await db.findUserByEmail(googleUserInfo.email);
          
          if (user) {
            // Link existing email account with Google
            const linked = await db.linkGoogleAccount(user.id, googleUserInfo.googleId);
            if (!linked) {
              return sendError(res, 500, 'Failed to link Google account');
            }
            
            // Refresh user data
            user = await db.findUserById(user.id);
          } else {
            // Create new user with Google
            user = await db.createGoogleUser({
              email: googleUserInfo.email,
              googleId: googleUserInfo.googleId,
              name: googleUserInfo.name,
              picture: googleUserInfo.picture
            });
          }
        }
        
        // Check if user is active
        if (!user.isActive) {
          return sendError(res, 401, 'Account is disabled');
        }
        
        // Generate tokens
        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
        const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
        
        const tokenPayload = {
          userId: user.id,
          email: user.email,
          role: user.role
        };
        
        const token = JWTHandler.sign(tokenPayload, JWT_SECRET, JWT_EXPIRES_IN);
        const refreshToken = JWTHandler.sign(tokenPayload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
        
        console.log(`✅ Google login successful: ${user.email} (${user.role})`);
        
        sendResponse(res, 200, {
          success: true,
          message: 'Google login successful',
          data: {
            user: normalizeUser(user),
            token,
            refreshToken
          }
        });
        
      } catch (error) {
        console.error('Google login error:', error);
        sendError(res, 500, 'Google authentication failed', error);
      }
    },

    // Request password reset
    'POST /api/auth/request-password-reset': async (req, res) => {
      try {
        const { email } = await getRequestBody(req);
        
        if (!email) {
          return sendError(res, 400, 'Email is required');
        }
        
        // Ensure database is connected
        if (!db.isConnected) {
          await db.connect();
        }
        
        // Find user by email
        const user = await db.findUserByEmail(email);
        if (!user) {
          // Don't reveal if email exists or not for security
          return sendResponse(res, 200, {
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.'
          });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        // Save reset token
        await db.setPasswordResetToken(email, resetToken, expiresAt);
        
        // Send email
        await EmailService.sendPasswordResetEmail(email, resetToken);
        
        console.log(`📧 Password reset requested for: ${email}`);
        
        sendResponse(res, 200, {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
        
      } catch (error) {
        console.error('Password reset request error:', error);
        sendError(res, 500, 'Internal server error', error);
      }
    },

    // Reset password with token
    'POST /api/auth/reset-password': async (req, res) => {
      try {
        const { token, newPassword } = await getRequestBody(req);
        
        if (!token || !newPassword) {
          return sendError(res, 400, 'Token and new password are required');
        }
        
        if (newPassword.length < 6) {
          return sendError(res, 400, 'Password must be at least 6 characters');
        }
        
        // Ensure database is connected
        if (!db.isConnected) {
          await db.connect();
        }
        
        // Find user by reset token
        const user = await db.findUserByResetToken(token);
        if (!user) {
          return sendError(res, 400, 'Invalid or expired reset token');
        }
        
        // Update password
        const success = await db.updateUserPassword(user.id, newPassword);
        if (!success) {
          return sendError(res, 500, 'Failed to update password');
        }
        
        console.log(`✅ Password reset completed for: ${user.email}`);
        
        sendResponse(res, 200, {
          success: true,
          message: 'Password reset successful'
        });
        
      } catch (error) {
        console.error('Password reset error:', error);
        sendError(res, 500, 'Internal server error', error);
      }
    },

    // Admin panel access (Admin only)
    'GET /api/admin/panel': async (req, res) => {
      try {
        if (!db.isConnected) {
          await db.connect();
        }
        const user = await authenticateToken(req, db);
        
        // Check if user is admin
        if (user.role !== 'ADMIN') {
          return sendError(res, 403, 'Access denied. Admin privileges required.');
        }
        
        sendResponse(res, 200, {
          success: true,
          message: 'Admin panel access granted',
          data: {
            user: normalizeUser(user),
            adminFeatures: [
              'User Management',
              'Content Moderation',
              'Analytics Dashboard',
              'System Settings',
              'Security Monitoring'
            ]
          }
        });
      } catch (error) {
        if (error.message.includes('token')) {
          sendError(res, 401, error.message);
        } else {
          sendError(res, 500, 'Internal server error', error);
        }
      }
    },

    // Logout
    'POST /api/auth/logout': async (req, res) => {
      try {
        // In a real implementation, you might want to blacklist the token
        // For now, we'll just send a success response
        sendResponse(res, 200, {
          success: true,
          message: 'Logout successful'
        });
      } catch (error) {
        sendError(res, 500, 'Internal server error', error);
      }
    }
  };
}

module.exports = { createRoutes };
