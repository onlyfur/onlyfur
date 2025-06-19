const http = require('http');
const url = require('url');
const querystring = require('querystring');
const crypto = require('crypto');
const { Client } = require('pg');
const fetch = require('node-fetch');

// Load environment variables from .env file
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    
    envFile.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=');
          // Remove surrounding quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.warn('Warning: Could not load .env file:', error.message);
  }
}

// Load environment variables
loadEnvFile();

// Configuration
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = 'http://localhost:5173'; // Override for development
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

// Admin credentials from env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

// Database configuration
const DB_CONFIG = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

console.log('🔧 Configuration loaded:');
console.log(`   - Port: ${PORT}`);
console.log(`   - Frontend URL: ${FRONTEND_URL}`);
console.log(`   - Database: ${DB_CONFIG.connectionString ? 'Configured' : 'Not configured'}`);
console.log(`   - Admin Email: ${ADMIN_EMAIL}`);
console.log(`   - BCrypt Rounds: ${BCRYPT_ROUNDS}`);
console.log(`   - Google Client ID: ${process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured'}`);

// Password hashing utilities using Node.js crypto (bcrypt alternative)
class PasswordHasher {
  static async hash(password) {
    return new Promise((resolve, reject) => {
      // Generate a random salt
      const salt = crypto.randomBytes(32).toString('hex');
      
      // Hash password with salt using pbkdf2
      crypto.pbkdf2(password, salt, BCRYPT_ROUNDS * 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        else resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }
  
  static async compare(password, hash) {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(':');
      crypto.pbkdf2(password, salt, BCRYPT_ROUNDS * 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        else resolve(key === derivedKey.toString('hex'));
      });
    });
  }
}

// JWT utilities using Node.js crypto
class JWTHandler {
  static base64UrlEncode(str) {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  static base64UrlDecode(str) {
    str += '='.repeat(4 - str.length % 4);
    return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
  }
  
  static sign(payload, secret, expiresIn = '7d') {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const now = Math.floor(Date.now() / 1000);
    let exp;
    
    if (expiresIn.endsWith('d')) {
      exp = now + (parseInt(expiresIn) * 24 * 60 * 60);
    } else if (expiresIn.endsWith('h')) {
      exp = now + (parseInt(expiresIn) * 60 * 60);
    } else {
      exp = now + parseInt(expiresIn);
    }
    
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: exp
    };
    
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
    
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
  
  static verify(token, secret) {
    try {
      const [encodedHeader, encodedPayload, signature] = token.split('.');
      
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
      }
      
      const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
      
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }
      
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

// Database service
class DatabaseService {
  constructor() {
    this.client = null;
  }
    async connect() {
    try {
      this.client = new Client(DB_CONFIG);
      
      // Add error handler to prevent crashes
      this.client.on('error', (err) => {
        console.error('Database client error:', err);
      });
      
      await this.client.connect();
      console.log('✅ Connected to PostgreSQL database');
      
      // Initialize admin user if it doesn't exist
      await this.initializeAdminUser();
      
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }
  
  async disconnect() {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }
    async initializeAdminUser() {
    try {
      // Check if admin user exists by email
      const existingAdminByEmail = await this.client.query(
        'SELECT id, username, email FROM users WHERE email = $1',
        [ADMIN_EMAIL]
      );
      
      // Check if admin username exists
      const existingAdminByUsername = await this.client.query(
        'SELECT id, username, email FROM users WHERE username = $1',
        [ADMIN_USERNAME]
      );
      
      if (existingAdminByEmail.rows.length === 0 && existingAdminByUsername.rows.length === 0) {
        // Create new admin user - no conflicts
        const hashedPassword = await PasswordHasher.hash(ADMIN_PASSWORD);
        const adminId = crypto.randomUUID();
        
        await this.client.query(`
          INSERT INTO users (
            id, email, username, "displayName", role, password, 
            "isVerified", "isActive", "isEmailVerified", "authProvider",
            "createdAt", "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        `, [
          adminId,
          ADMIN_EMAIL,
          ADMIN_USERNAME,
          'Admin User',
          'ADMIN',
          hashedPassword,
          true,
          true,
          true,
          'EMAIL'
        ]);
        
        console.log('✅ Admin user created successfully');
      } else if (existingAdminByEmail.rows.length > 0) {
        // Admin exists by email - update password and role to ensure it's correct
        const hashedPassword = await PasswordHasher.hash(ADMIN_PASSWORD);
        
        await this.client.query(`
          UPDATE users SET 
            password = $1, 
            role = $2, 
            "isActive" = true, 
            "isVerified" = true,
            "updatedAt" = NOW()
          WHERE email = $3
        `, [hashedPassword, 'ADMIN', ADMIN_EMAIL]);
        
        console.log('✅ Admin user updated with environment credentials');
      } else {
        // Username conflict but different email
        console.log('⚠️ Username "admin" exists but with different email. Using email for admin identification.');
        
        // Create admin with different username
        const altUsername = `${ADMIN_USERNAME}_${Date.now()}`;
        const hashedPassword = await PasswordHasher.hash(ADMIN_PASSWORD);
        const adminId = crypto.randomUUID();
        
        await this.client.query(`
          INSERT INTO users (
            id, email, username, "displayName", role, password, 
            "isVerified", "isActive", "isEmailVerified", "authProvider",
            "createdAt", "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        `, [
          adminId,
          ADMIN_EMAIL,
          altUsername,
          'Admin User',
          'ADMIN',
          hashedPassword,
          true,
          true,
          true,
          'EMAIL'
        ]);
        
        console.log(`✅ Admin user created with username: ${altUsername}`);
      }
    } catch (error) {
      console.error('❌ Failed to initialize admin user:', error.message);
    }
  }
  
  async findUserByEmail(email) {
    try {
      const result = await this.client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error finding user by email:', error);
      return null;
    }
  }
  
  async findUserByUsername(username) {
    try {
      const result = await this.client.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error finding user by username:', error);
      return null;
    }
  }
  
  async findUserById(id) {
    try {
      const result = await this.client.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error finding user by ID:', error);
      return null;
    }
  }
  
  async findUserByGoogleId(googleId) {
    try {
      const result = await this.client.query(
        'SELECT * FROM users WHERE "googleId" = $1',
        [googleId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error finding user by Google ID:', error);
      return null;
    }
  }
  
  async createUser(userData) {
    try {
      const {
        email,
        username,
        displayName,
        password,
        role = 'SUBSCRIBER'
      } = userData;
      
      const hashedPassword = await PasswordHasher.hash(password);
      const userId = crypto.randomUUID();
        const result = await this.client.query(`
        INSERT INTO users (
          id, email, username, "displayName", role, password,
          "isVerified", "isActive", "isEmailVerified", "authProvider",
          "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        RETURNING *
      `, [
        userId,
        email,
        username,
        displayName,
        role.toUpperCase(),
        hashedPassword,
        true, // isVerified
        true, // isActive
        true, // isEmailVerified
        'EMAIL' // authProvider
      ]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Database error creating user:', error);
      throw error;
    }
  }
  
  async createGoogleUser(userData) {
    try {
      const {
        email,
        googleId,
        name,
        picture
      } = userData;
      
      const userId = crypto.randomUUID();
      
      // Generate username from email or name
      let username = email.split('@')[0];
      
      // Check if username exists and make it unique
      let uniqueUsername = username;
      let counter = 1;
      while (await this.findUserByUsername(uniqueUsername)) {
        uniqueUsername = `${username}${counter}`;
        counter++;
      }
      
      const result = await this.client.query(`
        INSERT INTO users (
          id, email, username, "displayName", role, "googleId",
          "isVerified", "isActive", "isEmailVerified", "authProvider",
          avatar, "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        RETURNING *
      `, [
        userId,
        email,
        uniqueUsername,
        name || uniqueUsername,
        'SUBSCRIBER', // Default role for Google users
        googleId,
        true, // isVerified
        true, // isActive
        true, // isEmailVerified (Google provides verified emails)
        'GOOGLE', // authProvider
        picture // avatar from Google
      ]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Database error creating Google user:', error);
      throw error;
    }
  }
  
  async linkGoogleAccount(userId, googleId) {
    try {
      await this.client.query(
        'UPDATE users SET "googleId" = $1, "authProvider" = $2 WHERE id = $3',
        [googleId, 'GOOGLE', userId]
      );
      return true;
    } catch (error) {
      console.error('Database error linking Google account:', error);
      return false;
    }
  }
  
  async updateUserLastLogin(userId) {
    try {
      await this.client.query(
        'UPDATE users SET "lastLoginAt" = NOW() WHERE id = $1',
        [userId]
      );
    } catch (error) {
      console.error('Database error updating last login:', error);
    }
  }
}

// Initialize database service
const db = new DatabaseService();

// Helper functions
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': FRONTEND_URL,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };
}

function sendResponse(res, status, data) {
  const headers = corsHeaders();
  res.writeHead(status, headers);
  res.end(JSON.stringify(data));
}

function sendError(res, status, message, error = null) {
  const headers = corsHeaders();
  res.writeHead(status, headers);
  res.end(JSON.stringify({
    success: false,
    error: message,
    ...(error && { details: error.message })
  }));
}

async function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function extractBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

async function authenticateToken(req) {
  const token = extractBearerToken(req);
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const payload = JWTHandler.verify(token, JWT_SECRET);
    const user = await db.findUserById(payload.userId);
    
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }
    
    return user;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

function normalizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    subscriptionTier: user.subscriptionTier || 'free',
    subscriptionStatus: user.subscriptionStatus || 'FREE',
    setupComplete: user.setupComplete || false,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt
  };
}

// Route handlers
const routes = {
  // Health check
  'GET /api/health': async (req, res) => {
    sendResponse(res, 200, {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      message: 'OnlyFur PostgreSQL Authentication Backend is running',
      database: db.client ? 'Connected' : 'Disconnected'
    });
  },

  // API info
  'GET /api': async (req, res) => {
    sendResponse(res, 200, {
      message: 'OnlyFur Authentication API',
      version: '1.0.0',      endpoints: {
        auth: {
          login: 'POST /api/auth/login',
          register: 'POST /api/auth/register',
          googleLogin: 'POST /api/auth/google/login',
          googleRegister: 'POST /api/auth/google/register',
          me: 'GET /api/auth/me',
          logout: 'POST /api/auth/logout',
          setupComplete: 'POST /api/auth/setup-complete'
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
      const { email, password } = await getRequestBody(req);
      
      if (!email || !password) {
        return sendError(res, 400, 'Email and password are required');
      }
      
      // Find user by email
      const user = await db.findUserByEmail(email);
      if (!user) {
        return sendError(res, 401, 'Invalid email or password');
      }
      
      // Check if user is active
      if (!user.isActive) {
        return sendError(res, 401, 'Account is disabled');
      }
      
      // Verify password
      const passwordValid = await PasswordHasher.compare(password, user.password);
      if (!passwordValid) {
        return sendError(res, 401, 'Invalid email or password');
      }
      
      // Update last login
      await db.updateUserLastLogin(user.id);
      
      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };
      
      const token = JWTHandler.sign(tokenPayload, JWT_SECRET, JWT_EXPIRES_IN);
      const refreshToken = JWTHandler.sign(tokenPayload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
      
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
      
      // Generate tokens
      const tokenPayload = {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      };
      
      const token = JWTHandler.sign(tokenPayload, JWT_SECRET, JWT_EXPIRES_IN);
      const refreshToken = JWTHandler.sign(tokenPayload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
      
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
      const user = await authenticateToken(req);
      sendResponse(res, 200, {
        success: true,
        data: normalizeUser(user)
      });
    } catch (error) {
      sendError(res, 401, error.message);
    }
  },

  // Setup complete
  'POST /api/auth/setup-complete': async (req, res) => {
    try {
      const user = await authenticateToken(req);
      
      // Update user setup status in database
      await db.client.query(
        'UPDATE users SET "setupComplete" = true WHERE id = $1',
        [user.id]
      );
      
      sendResponse(res, 200, {
        success: true,
        message: 'Setup completed successfully'
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
  },

  // Admin panel access (Admin only)
  'GET /api/admin/panel': async (req, res) => {
    try {
      const user = await authenticateToken(req);
      
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
            'System Settings'
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

  // Google OAuth login
  'POST /api/auth/google': async (req, res) => {
    try {
      const { idToken } = await getRequestBody(req);
      
      if (!idToken) {
        return sendError(res, 400, 'ID token is required');
      }
      
      // Verify Google ID token
      const googleUser = await GoogleOAuth.verifyIdToken(idToken);
      
      // Check if user already exists
      let user = await db.findUserByEmail(googleUser.email);
      
      if (!user) {
        // Create new user
        user = await db.createUser({
          email: googleUser.email,
          username: googleUser.email.split('@')[0],
          displayName: googleUser.name,
          password: crypto.randomUUID(), // Random password for OAuth users
          role: 'SUBSCRIBER'
        });
      }
      
      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };
      
      const token = JWTHandler.sign(tokenPayload, JWT_SECRET, JWT_EXPIRES_IN);
      const refreshToken = JWTHandler.sign(tokenPayload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
      
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
      sendError(res, 500, 'Internal server error', error);
    }
  },

  // Google OAuth Login
  'POST /api/auth/google/login': async (req, res) => {
    try {
      const { credential } = await getRequestBody(req);
      
      if (!credential) {
        return sendError(res, 400, 'Google credential is required');
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
      
      // Update last login
      await db.updateUserLastLogin(user.id);
      
      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };
      
      const token = JWTHandler.sign(tokenPayload, JWT_SECRET, JWT_EXPIRES_IN);
      const refreshToken = JWTHandler.sign(tokenPayload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
      
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

  // Google OAuth Register (same as login for OAuth)
  'POST /api/auth/google/register': async (req, res) => {
    try {
      const { credential } = await getRequestBody(req);
      
      if (!credential) {
        return sendError(res, 400, 'Google credential is required');
      }
      
      // Verify Google token
      const googleUserInfo = await GoogleOAuth.verifyIdToken(credential);
      
      // Check if user already exists by Google ID
      let user = await db.findUserByGoogleId(googleUserInfo.googleId);
      
      if (user) {
        // User already exists, perform login
        if (!user.isActive) {
          return sendError(res, 401, 'Account is disabled');
        }
        
        await db.updateUserLastLogin(user.id);
        
        const tokenPayload = {
          userId: user.id,
          email: user.email,
          role: user.role
        };
        
        const token = JWTHandler.sign(tokenPayload, JWT_SECRET, JWT_EXPIRES_IN);
        const refreshToken = JWTHandler.sign(tokenPayload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
        
        return sendResponse(res, 200, {
          success: true,
          message: 'Google login successful (existing account)',
          data: {
            user: normalizeUser(user),
            token,
            refreshToken
          }
        });
      }
      
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
        
        await db.updateUserLastLogin(user.id);
        
        const tokenPayload = {
          userId: user.id,
          email: user.email,
          role: user.role
        };
        
        const token = JWTHandler.sign(tokenPayload, JWT_SECRET, JWT_EXPIRES_IN);
        const refreshToken = JWTHandler.sign(tokenPayload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
        
        return sendResponse(res, 200, {
          success: true,
          message: 'Account linked with Google successfully',
          data: {
            user: normalizeUser(user),
            token,
            refreshToken
          }
        });
      }
      
      // Create new user with Google
      user = await db.createGoogleUser({
        email: googleUserInfo.email,
        googleId: googleUserInfo.googleId,
        name: googleUserInfo.name,
        picture: googleUserInfo.picture
      });
      
      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };
      
      const token = JWTHandler.sign(tokenPayload, JWT_SECRET, JWT_EXPIRES_IN);
      const refreshToken = JWTHandler.sign(tokenPayload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
      
      sendResponse(res, 201, {
        success: true,
        message: 'Google registration successful',
        data: {
          user: normalizeUser(user),
          token,
          refreshToken
        }
      });
      
    } catch (error) {
      console.error('Google registration error:', error);
      if (error.code === '23505') { // PostgreSQL unique violation
        sendError(res, 409, 'Account already exists');
      } else {
        sendError(res, 500, 'Google registration failed', error);
      }
    }
  },

  // Test Google OAuth (Development only)
  'POST /api/auth/google/test': async (req, res) => {
    try {
      if (false && process.env.NODE_ENV === 'production') { // Temporarily allow testing
        return sendError(res, 403, 'Test endpoint not available in production');
      }
      
      const { email, name } = await getRequestBody(req);
      
      if (!email || !name) {
        return sendError(res, 400, 'Email and name are required for test');
      }
      
      // Simulate Google user info
      const testGoogleId = `test_google_${Date.now()}`;
      
      // Check if user exists by email (for account linking)
      let user = await db.findUserByEmail(email);
      
      if (user) {
        // Link existing email account with Google
        const linked = await db.linkGoogleAccount(user.id, testGoogleId);
        if (!linked) {
          return sendError(res, 500, 'Failed to link Google account');
        }
        
        // Refresh user data
        user = await db.findUserById(user.id);
        
        sendResponse(res, 200, {
          success: true,
          message: 'Account linked with Google successfully (test)',
          data: {
            user: normalizeUser(user),
            action: 'linked'
          }
        });
      } else {
        // Create new user with Google
        user = await db.createGoogleUser({
          email: email,
          googleId: testGoogleId,
          name: name,
          picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        });
        
        sendResponse(res, 201, {
          success: true,
          message: 'Google user created successfully (test)',
          data: {
            user: normalizeUser(user),
            action: 'created'
          }
        });
      }
      
    } catch (error) {
      console.error('Google test error:', error);
      sendError(res, 500, 'Google test failed', error);
    }
  },

  // ...existing code...
};

// Google OAuth token verification
class GoogleOAuth {
  static async verifyIdToken(idToken) {
    try {
      // Verify the Google ID token by calling Google's tokeninfo endpoint
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      const tokenInfo = await response.json();
      
      if (!response.ok) {
        throw new Error(tokenInfo.error || 'Invalid token');
      }
      
      // Verify the token is for our app
      if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
        throw new Error('Token audience mismatch');
      }
      
      // Verify token hasn't expired
      if (tokenInfo.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }
      
      return {
        googleId: tokenInfo.sub,
        email: tokenInfo.email,
        name: tokenInfo.name,
        picture: tokenInfo.picture,
        emailVerified: tokenInfo.email_verified === 'true'
      };
    } catch (error) {
      throw new Error(`Google token verification failed: ${error.message}`);
    }
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;
  const routeKey = `${method} ${pathname}`;
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    const headers = corsHeaders();
    res.writeHead(200, headers);
    res.end();
    return;
  }
  
  try {
    // Find matching route
    const handler = routes[routeKey];
    if (handler) {
      await handler(req, res);
    } else {
      sendError(res, 404, 'Endpoint not found');
    }
  } catch (error) {
    console.error('Server error:', error);
    sendError(res, 500, 'Internal server error', error);
  }
});

// Start server
async function startServer() {
  // Connect to database
  const dbConnected = await db.connect();
  if (!dbConnected) {
    console.error('❌ Failed to connect to database. Server will not start.');
    process.exit(1);
  }
  
  server.listen(PORT, () => {
    console.log('✅ Admin user credentials from environment:');
    console.log(`   - Email: ${ADMIN_EMAIL}`);
    console.log(`   - Username: ${ADMIN_USERNAME}`);
    console.log(`   - Password: ${ADMIN_PASSWORD ? '[Set]' : '[Not Set]'}`);
    console.log('🚀 OnlyFur PostgreSQL Authentication Backend running on port', PORT);
    console.log('🔗 Frontend URL:', FRONTEND_URL);
    console.log('📋 Health check: http://localhost:' + PORT + '/api/health');
    console.log('📋 API info: http://localhost:' + PORT + '/api');
    console.log('🔐 Admin panel: http://localhost:' + PORT + '/api/admin/panel');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('✅ Server ready for authentication requests');
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await db.disconnect();
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await db.disconnect();
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

// Start the server
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
