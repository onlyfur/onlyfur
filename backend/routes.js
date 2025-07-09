const bcrypt = require('bcrypt');
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
          realData: {
            platformStats: 'GET /api/real-data/platform-stats',
            creators: 'GET /api/real-data/creators'
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
        const { email, username, displayName, password, role = 'SUBSCRIBER' } = await getRequestBody(req);
        
        // Validation
        if (!email || !username || !displayName || !password) {
          return sendError(res, 400, 'All fields are required');
        }
        
        if (password.length < 6) {
          return sendError(res, 400, 'Password must be at least 6 characters');
        }
        
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
          
        // Create user
        const newUser = await db.createUser({
          email,
          username,
          displayName,
          password,
          role: role.toUpperCase()
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

    // Admin user credentials management routes
    'GET /api/admin/users/credentials': async (req, res) => {
      try {
        if (!db.isConnected) {
          await db.connect();
        }
        const user = await authenticateToken(req, db);
        
        // Check if user is admin
        if (user.role !== 'ADMIN') {
          return sendError(res, 403, 'Access denied. Admin privileges required.');
        }

        const page = parseInt(req.query?.page) || 1;
        const limit = parseInt(req.query?.limit) || 20;
        const skip = (page - 1) * limit;
        
        const search = req.query?.search;
        const role = req.query?.role;
        const isActive = req.query?.isActive;
        const sortBy = req.query?.sortBy || 'createdAt';
        const sortOrder = req.query?.sortOrder || 'desc';

        // Build where clause for filters
        const whereClause = {};
        
        if (search) {
          whereClause.$or = [
            { email: { $regex: search, $options: 'i' } },
            { username: { $regex: search, $options: 'i' } },
            { displayName: { $regex: search, $options: 'i' } }
          ];
        }
        
        if (role && role !== 'all') {
          whereClause.role = role;
        }
        
        if (isActive && isActive !== 'all') {
          whereClause.isActive = isActive === 'true';
        }

        // Get users and statistics
        const users = await db.users.find(whereClause)
          .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        const total = await db.users.countDocuments(whereClause);
        const totalActive = await db.users.countDocuments({ isActive: true });
        const totalVerified = await db.users.countDocuments({ isVerified: true });
        const totalCreators = await db.users.countDocuments({ role: 'CREATOR' });
        const totalAdmins = await db.users.countDocuments({ role: 'ADMIN' });

        sendResponse(res, 200, {
          success: true,
          data: {
            users: users.map(u => ({
              ...normalizeUser(u),
              failedLoginAttempts: u.failedLoginAttempts || 0,
              lockedUntil: u.lockedUntil || null,
              isTwoFactorEnabled: u.isTwoFactorEnabled || false,
              lastActivityAt: u.lastActivityAt || u.updatedAt,
              _count: {
                content: 0, // TODO: implement content counting
                subscriptions: 0, // TODO: implement subscription counting
                payment_intents: 0 // TODO: implement payment counting
              }
            })),
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit)
            },
            metadata: {
              totalActiveUsers: totalActive,
              totalVerifiedUsers: totalVerified,
              totalCreators,
              totalSubscribers: total - totalCreators - totalAdmins,
              totalAdmins
            }
          }
        });
      } catch (error) {
        sendError(res, 500, 'Failed to fetch user credentials', error);
      }
    },

    'GET /api/admin/users/:id/credentials': async (req, res) => {
      try {
        if (!db.isConnected) {
          await db.connect();
        }
        const user = await authenticateToken(req, db);
        
        // Check if user is admin
        if (user.role !== 'ADMIN') {
          return sendError(res, 403, 'Access denied. Admin privileges required.');
        }

        const userId = req.params?.id;
        if (!userId) {
          return sendError(res, 400, 'User ID is required');
        }

        const targetUser = await db.users.findOne({ _id: userId });
        if (!targetUser) {
          return sendError(res, 404, 'User not found');
        }

        sendResponse(res, 200, {
          success: true,
          data: {
            user: {
              ...normalizeUser(targetUser),
              failedLoginAttempts: targetUser.failedLoginAttempts || 0,
              lockedUntil: targetUser.lockedUntil || null,
              isTwoFactorEnabled: targetUser.isTwoFactorEnabled || false,
              lastActivityAt: targetUser.lastActivityAt || targetUser.updatedAt,
              _count: {
                content: 0, // TODO: implement content counting
                subscriptions: 0, // TODO: implement subscription counting
                payment_intents: 0 // TODO: implement payment counting
              }
            }
          }
        });
      } catch (error) {
        sendError(res, 500, 'Failed to fetch user details', error);
      }
    },

    'PUT /api/admin/users/:id/credentials': async (req, res) => {
      try {
        if (!db.isConnected) {
          await db.connect();
        }
        const user = await authenticateToken(req, db);
        
        // Check if user is admin
        if (user.role !== 'ADMIN') {
          return sendError(res, 403, 'Access denied. Admin privileges required.');
        }

        const userId = req.params?.id;
        if (!userId) {
          return sendError(res, 400, 'User ID is required');
        }

        const targetUser = await db.users.findOne({ _id: userId });
        if (!targetUser) {
          return sendError(res, 404, 'User not found');
        }

        const updateData = await getRequestBody(req);
        
        // Validate update data
        const allowedFields = ['email', 'username', 'displayName', 'role', 'isVerified', 'isActive', 'subscriptionStatus'];
        const filteredData = {};
        
        for (const field of allowedFields) {
          if (updateData[field] !== undefined) {
            filteredData[field] = updateData[field];
          }
        }

        if (Object.keys(filteredData).length === 0) {
          return sendError(res, 400, 'No valid fields to update');
        }

        // Add updated timestamp
        filteredData.updatedAt = new Date();

        const result = await db.users.updateOne(
          { _id: userId },
          { $set: filteredData }
        );

        if (result.modifiedCount === 0) {
          return sendError(res, 500, 'Failed to update user');
        }

        const updatedUser = await db.users.findOne({ _id: userId });

        sendResponse(res, 200, {
          success: true,
          message: 'User credentials updated successfully',
          data: {
            user: normalizeUser(updatedUser)
          }
        });
      } catch (error) {
        sendError(res, 500, 'Failed to update user credentials', error);
      }
    },

    'DELETE /api/admin/users/:id': async (req, res) => {
      try {
        if (!db.isConnected) {
          await db.connect();
        }
        const user = await authenticateToken(req, db);
        
        // Check if user is admin
        if (user.role !== 'ADMIN') {
          return sendError(res, 403, 'Access denied. Admin privileges required.');
        }

        const userId = req.params?.id;
        if (!userId) {
          return sendError(res, 400, 'User ID is required');
        }

        const targetUser = await db.users.findOne({ _id: userId });
        if (!targetUser) {
          return sendError(res, 404, 'User not found');
        }

        // Prevent deletion of admin users
        if (targetUser.role === 'ADMIN') {
          return sendError(res, 403, 'Cannot delete admin users');
        }

        const result = await db.users.deleteOne({ _id: userId });

        if (result.deletedCount === 0) {
          return sendError(res, 500, 'Failed to delete user');
        }

        sendResponse(res, 200, {
          success: true,
          message: 'User deleted successfully'
        });
      } catch (error) {
        sendError(res, 500, 'Failed to delete user', error);
      }
    },

    'POST /api/admin/users/:id/reset-password': async (req, res) => {
      try {
        if (!db.isConnected) {
          await db.connect();
        }
        const user = await authenticateToken(req, db);
        
        // Check if user is admin
        if (user.role !== 'ADMIN') {
          return sendError(res, 403, 'Access denied. Admin privileges required.');
        }

        const userId = req.params?.id;
        if (!userId) {
          return sendError(res, 400, 'User ID is required');
        }

        const targetUser = await db.users.findOne({ _id: userId });
        if (!targetUser) {
          return sendError(res, 404, 'User not found');
        }

        const { newPassword } = await getRequestBody(req);
        
        if (!newPassword || newPassword.length < 8) {
          return sendError(res, 400, 'Password must be at least 8 characters long');
        }

        // Hash the new password securely using bcrypt
        const saltRounds = 10; // Adjust computational cost as needed
        const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

        const result = await db.users.updateOne(
          { _id: userId },
          { 
            $set: { 
              password: hashedPassword,
              updatedAt: new Date(),
              passwordChangedAt: new Date()
            }
          }
        );

        if (result.modifiedCount === 0) {
          return sendError(res, 500, 'Failed to reset password');
        }

        sendResponse(res, 200, {
          success: true,
          message: 'Password reset successfully'
        });
      } catch (error) {
        sendError(res, 500, 'Failed to reset password', error);
      }
    },

    'POST /api/admin/users/bulk-action': async (req, res) => {
      try {
        if (!db.isConnected) {
          await db.connect();
        }
        const user = await authenticateToken(req, db);
        
        // Check if user is admin
        if (user.role !== 'ADMIN') {
          return sendError(res, 403, 'Access denied. Admin privileges required.');
        }

        const { userIds, action, reason } = await getRequestBody(req);
        
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
          return sendError(res, 400, 'User IDs array is required');
        }

        if (!action) {
          return sendError(res, 400, 'Action is required');
        }

        const validActions = ['activate', 'deactivate', 'verify', 'unverify', 'delete'];
        if (!validActions.includes(action)) {
          return sendError(res, 400, 'Invalid action');
        }

        let updateData = {};
        let deleteAction = false;

        switch (action) {
          case 'activate':
            updateData = { isActive: true, updatedAt: new Date() };
            break;
          case 'deactivate':
            updateData = { isActive: false, updatedAt: new Date() };
            break;
          case 'verify':
            updateData = { isVerified: true, updatedAt: new Date() };
            break;
          case 'unverify':
            updateData = { isVerified: false, updatedAt: new Date() };
            break;
          case 'delete':
            deleteAction = true;
            break;
        }

        let result;
        if (deleteAction) {
          // Prevent deletion of admin users
          const adminCount = await db.users.countDocuments({ 
            _id: { $in: userIds },
            role: 'ADMIN'
          });
          
          if (adminCount > 0) {
            return sendError(res, 403, 'Cannot delete admin users');
          }

          result = await db.users.deleteMany({
            _id: { $in: userIds }
          });
        } else {
          result = await db.users.updateMany(
            { _id: { $in: userIds } },
            { $set: updateData }
          );
        }

        const affectedCount = deleteAction ? result.deletedCount : result.modifiedCount;

        sendResponse(res, 200, {
          success: true,
          message: `Bulk action '${action}' completed successfully. ${affectedCount} users affected.`,
          data: {
            affectedCount,
            action,
            reason
          }
        });
      } catch (error) {
        sendError(res, 500, 'Failed to perform bulk action', error);
      }
    },

    'GET /api/admin/users/export': async (req, res) => {
      try {
        if (!db.isConnected) {
          await db.connect();
        }
        const user = await authenticateToken(req, db);
        
        // Check if user is admin
        if (user.role !== 'ADMIN') {
          return sendError(res, 403, 'Access denied. Admin privileges required.');
        }

        const format = req.query?.format || 'json';
        
        if (!['csv', 'json'].includes(format)) {
          return sendError(res, 400, 'Invalid format. Use csv or json');
        }

        const users = await db.users.find({}, {
          password: 0, // Exclude password field
          googleAccessToken: 0, // Exclude sensitive tokens
          googleRefreshToken: 0
        }).toArray();

        if (format === 'csv') {
          // Convert to CSV
          const csvHeader = 'id,email,username,displayName,role,isActive,isVerified,createdAt,updatedAt\\n';
          const csvRows = users.map(u => 
            `${u._id},${u.email},${u.username},"${u.displayName}",${u.role},${u.isActive},${u.isVerified},${u.createdAt},${u.updatedAt}`
          ).join('\\n');
          
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename="users-export.csv"');
          res.send(csvHeader + csvRows);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Disposition', 'attachment; filename="users-export.json"');
          sendResponse(res, 200, {
            success: true,
            data: {
              users: users.map(normalizeUser),
              exportedAt: new Date().toISOString(),
              totalCount: users.length
            }
          });
        }
      } catch (error) {
        sendError(res, 500, 'Failed to export users', error);
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
    },

    // Contact form submission
    'POST /api/contact': async (req, res) => {
      try {
        const body = await getRequestBody(req);
        const { name, email, category, message } = body;

        // Validate required fields
        if (!name || !email || !category || !message) {
          return sendError(res, 400, 'All fields are required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return sendError(res, 400, 'Invalid email format');
        }

        // Validate category
        const validCategories = ['general', 'technical', 'billing', 'content', 'partnership', 'other'];
        if (!validCategories.includes(category)) {
          return sendError(res, 400, 'Invalid category');
        }

        // Initialize email service
        const emailService = EmailService;

        // Send email to support
        const supportSubject = `[OnlyFur Contact] ${category.charAt(0).toUpperCase() + category.slice(1)} - ${name}`;
        const supportHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B5CF6; margin-bottom: 20px;">New Contact Form Submission</h2>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Category:</strong> ${category}</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #333;">Message</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              This message was sent through the OnlyFur contact form at ${new Date().toLocaleString()}.
            </p>
          </div>
        `;

        await emailService.sendEmail(
          process.env.SUPPORT_EMAIL || 'support@onlyfur.net',
          supportSubject,
          supportHtml
        );

        // Send auto-reply to user
        const autoReplySubject = 'Thank you for contacting OnlyFur - We\'ve received your message';
        const autoReplyHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B5CF6; margin-bottom: 20px;">Thank you for contacting us!</h2>
            
            <p>Hi ${name},</p>
            
            <p>Thank you for reaching out to OnlyFur. We've received your message regarding <strong>${category}</strong> and will get back to you as soon as possible.</p>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #8B5CF6; margin: 20px 0;">
              <p style="margin: 0;"><strong>Your message summary:</strong></p>
              <p style="margin: 10px 0 0 0; color: #666;">${message.substring(0, 150)}${message.length > 150 ? '...' : ''}</p>
            </div>
            
            <p>Our typical response time is 24-48 hours during business days. For urgent matters, please don't hesitate to reach out to us directly.</p>
            
            <p>Best regards,<br>
            The OnlyFur Team</p>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated response. Please do not reply to this email. If you need immediate assistance, please contact us through our website.
            </p>
          </div>
        `;

        await emailService.sendEmail(
          email,
          autoReplySubject,
          autoReplyHtml
        );

        sendResponse(res, 200, {
          success: true,
          message: 'Your message has been sent successfully. We\'ll get back to you soon!'
        });

      } catch (error) {
        console.error('Contact form error:', error);
        sendError(res, 500, 'Failed to send message. Please try again later.');
      }
    },

    // Real Data Endpoints
    'GET /api/real-data/platform-stats': async (req, res) => {
      try {
        // Mock platform stats for now - can be replaced with real database queries
        const stats = {
          totalUsers: 15247,
          totalCreators: 3421,
          totalSubscriptions: 8945,
          totalRevenue: 234567.89,
          activeUsers: 12456,
          newUsersToday: 67,
          averageSubscriptionPrice: 9.99,
          topCategories: [
            { name: 'Gaming', count: 1234 },
            { name: 'Art', count: 987 },
            { name: 'Music', count: 765 },
            { name: 'Fitness', count: 543 },
            { name: 'Education', count: 421 }
          ]
        };
        
        const origin = req.headers?.origin;
        sendResponse(res, 200, { success: true, stats }, origin);
      } catch (error) {
        console.error('Error fetching platform stats:', error);
        const origin = req.headers?.origin;
        sendError(res, 500, 'Failed to fetch platform stats', error, origin);
      }
    },

    'GET /api/real-data/creators': async (req, res) => {
      try {
        const limit = parseInt(req.query?.limit) || 12;
        const offset = parseInt(req.query?.offset) || 0;
        
        // Mock creator data - can be replaced with real database queries
        const creators = [];
        for (let i = 0; i < limit; i++) {
          const id = offset + i + 1;
          creators.push({
            id,
            username: `creator${id}`,
            displayName: `Creator ${id}`,
            bio: `Professional content creator with ${Math.floor(Math.random() * 1000) + 100} followers`,
            subscriberCount: Math.floor(Math.random() * 10000) + 100,
            contentCount: Math.floor(Math.random() * 500) + 10,
            isVerified: Math.random() > 0.7,
            profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
            category: ['Gaming', 'Art', 'Music', 'Fitness', 'Education'][Math.floor(Math.random() * 5)],
            subscriptionPrice: (Math.random() * 20 + 5).toFixed(2),
            rating: (Math.random() * 2 + 3).toFixed(1),
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
        
        sendResponse(res, 200, { 
          success: true, 
          creators,
          pagination: {
            limit,
            offset,
            total: 1000, // Mock total
            hasMore: offset + limit < 1000
          }
        });
      } catch (error) {
        console.error('Error fetching creators:', error);
        sendError(res, 500, 'Failed to fetch creators');
      }
    },

    // Online Status Routes
    'POST /api/online-status/set-online': async (req, res) => {
      try {
        // Online status route called
        // Extract user info from JWT token (check both Authorization header and cookies)
        const authHeader = req.headers?.authorization;
        let token = authHeader && authHeader.split(' ')[1];
        
        // Try to get user data from cookies first (regardless of token)
        let userEmail = 'unknown';
        if (req.headers.cookie) {
          const cookies = req.headers.cookie.split('; ');
          for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === 'onlyfur_user_data') {
              try {
                const userData = JSON.parse(decodeURIComponent(value));
                userEmail = userData.email || userData.username || 'unknown';
                break;
              } catch (e) {
                console.log('Error parsing user data cookie:', e);
              }
            }
          }
        }
        
        // If no Authorization header, check cookies for token
        if (!token && req.headers.cookie) {
          const cookies = req.headers.cookie.split('; ');
          for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === 'onlyfur_auth_token') {
              token = value;
              break;
            }
          }
        }
        
        if (!token) {
          console.log(`🟢 User ${userEmail} set online status`);
          return sendResponse(res, 200, { success: true, message: 'Online status updated' });
        }
        
        console.log(`🟢 User ${userEmail} set online status`);
        return sendResponse(res, 200, { success: true, message: 'Online status updated' });
        
        const jwt = require('jsonwebtoken');
        const jwtSecret = process.env.JWT_SECRET;
        
        if (!jwtSecret) {
          console.log('🔍 DEBUG: JWT secret not configured');
          return sendError(res, 500, 'JWT secret not configured');
        }
        
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.userId;
        console.log('🔍 DEBUG: Decoded userId:', userId);
        
        // Get user from database to get email
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, username: true }
        });
        
        console.log('🔍 DEBUG: User from database:', user);
        
        if (!user) {
          console.log('🔍 DEBUG: User not found in database');
          return sendError(res, 401, 'User not found');
        }
        
        // Mock online status for now - can be replaced with real functionality
        console.log(`🟢 User ${user.email || user.username || userId} set online status`);
        sendResponse(res, 200, { success: true, message: 'Online status updated' });
      } catch (error) {
        console.error('Error setting online status:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
          return sendError(res, 401, 'Invalid or expired token');
        }
        sendError(res, 500, 'Failed to update online status');
      }
    },

    'POST /api/online-status/set-offline': async (req, res) => {
      try {
        // Offline status route called
        // Extract user info from JWT token (check both Authorization header and cookies)
        const authHeader = req.headers?.authorization;
        let token = authHeader && authHeader.split(' ')[1];
        
        // Try to get user data from cookies first (regardless of token)
        let userEmail = 'unknown';
        if (req.headers.cookie) {
          const cookies = req.headers.cookie.split('; ');
          for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === 'onlyfur_user_data') {
              try {
                const userData = JSON.parse(decodeURIComponent(value));
                userEmail = userData.email || userData.username || 'unknown';
                break;
              } catch (e) {
                console.log('Error parsing user data cookie:', e);
              }
            }
          }
        }
        
        // If no Authorization header, check cookies for token
        if (!token && req.headers.cookie) {
          const cookies = req.headers.cookie.split('; ');
          for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === 'onlyfur_auth_token') {
              token = value;
              break;
            }
          }
        }
        
        if (!token) {
          console.log(`🔴 User ${userEmail} set offline status`);
          return sendResponse(res, 200, { success: true, message: 'Offline status updated' });
        }
        
        console.log(`🔴 User ${userEmail} set offline status`);
        return sendResponse(res, 200, { success: true, message: 'Offline status updated' });
        
        const jwt = require('jsonwebtoken');
        const jwtSecret = process.env.JWT_SECRET;
        
        if (!jwtSecret) {
          console.log('🔍 DEBUG: JWT secret not configured');
          return sendError(res, 500, 'JWT secret not configured');
        }
        
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.userId;
        console.log('🔍 DEBUG: Decoded userId:', userId);
        
        // Get user from database to get email
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, username: true }
        });
        
        console.log('🔍 DEBUG: User from database:', user);
        
        if (!user) {
          console.log('🔍 DEBUG: User not found in database');
          return sendError(res, 401, 'User not found');
        }
        
        // Mock offline status for now - can be replaced with real functionality
        console.log(`🔴 User ${user.email || user.username || userId} set offline status`);
        sendResponse(res, 200, { success: true, message: 'Offline status updated' });
      } catch (error) {
        console.error('Error setting offline status:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
          return sendError(res, 401, 'Invalid or expired token');
        }
        sendError(res, 500, 'Failed to update offline status');
      }
    },

    'GET /api/online-status/:userId': async (req, res) => {
      try {
        const { userId } = req.params;
        // Mock online status for now - can be replaced with real functionality
        const isOnline = Math.random() > 0.5;
        sendResponse(res, 200, { success: true, isOnline, lastSeen: new Date().toISOString() });
      } catch (error) {
        console.error('Error getting online status:', error);
        sendError(res, 500, 'Failed to get online status');
      }
    }
  };
}

module.exports = { createRoutes };
