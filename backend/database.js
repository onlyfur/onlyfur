const { Client } = require('pg');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Environment loading utility
function loadEnvFile() {
  try {
    // Try .env.local first, then .env
    let envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) {
      envPath = path.join(__dirname, '..', '.env');
    }
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf8');
      console.log(`📁 Loading environment from: ${envPath}`);
      
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
    }
  } catch (error) {
    console.warn('Warning: Could not load .env file:', error.message);
  }
}

// Load environment variables if not in Vercel (where env vars are already loaded)
if (!process.env.VERCEL) {
  loadEnvFile();
}

// Password hashing utilities using Node.js crypto (bcrypt alternative)
class PasswordHasher {
  static async hash(password) {
    return new Promise((resolve, reject) => {
      // Generate a random salt
      const salt = crypto.randomBytes(32).toString('hex');
      const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      
      // Hash password with salt using pbkdf2
      crypto.pbkdf2(password, salt, BCRYPT_ROUNDS * 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        else resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }
  
  static async compare(password, hash) {
    return new Promise((resolve, reject) => {
      if (!hash || !hash.includes(':')) {
        resolve(false);
        return;
      }
      
      const [salt, key] = hash.split(':');
      const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      crypto.pbkdf2(password, salt, BCRYPT_ROUNDS * 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        else resolve(key === derivedKey.toString('hex'));
      });
    });
  }
}

// Database service
class DatabaseService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }
  
  getConfig() {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  }
  
  async connect() {
    if (this.isConnected && this.client) {
      return true;
    }
    
    try {
      this.client = new Client(this.getConfig());
      
      // Add error handler to prevent crashes
      this.client.on('error', (err) => {
        console.error('Database client error:', err);
        this.isConnected = false;
      });
      
      await this.client.connect();
      this.isConnected = true;
      console.log('✅ Connected to PostgreSQL database');
      
      // Initialize admin user
      await this.initializeAdminUser();
      
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      this.isConnected = false;
      return false;
    }
  }
  
  async disconnect() {
    if (this.client) {
      await this.client.end();
      this.client = null;
      this.isConnected = false;
    }
  }

  async initializeAdminUser() {
    try {
      console.log('🔧 Initializing admin user...');
      
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
      const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
      
      if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_USERNAME) {
        console.warn('⚠️ Admin credentials not found in environment variables');
        return;
      }
      
      // Check if admin user exists by email (case-insensitive)
      const existingAdmin = await this.client.query(
        'SELECT id, email, username, role, "isActive" FROM users WHERE LOWER(email) = LOWER($1)',
        [ADMIN_EMAIL]
      );
      
      if (existingAdmin.rows.length === 0) {
        // Create new admin user
        console.log('🆕 Creating new admin user...');
        const hashedPassword = await PasswordHasher.hash(ADMIN_PASSWORD);
        const adminId = crypto.randomUUID();
        
        // Generate unique username
        let username = ADMIN_USERNAME;
        const existingUsername = await this.client.query(
          'SELECT id FROM users WHERE LOWER(username) = LOWER($1)',
          [username]
        );
        
        if (existingUsername.rows.length > 0) {
          username = `${ADMIN_USERNAME}_admin_${Date.now()}`;
          console.log(`🔧 Username collision detected, using: ${username}`);
        }
        
        await this.client.query(`
          INSERT INTO users (
            id, email, username, "displayName", role, password, 
            "isVerified", "isActive", "isEmailVerified", "authProvider",
            "createdAt", "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        `, [
          adminId,
          ADMIN_EMAIL,
          username,
          'System Administrator',
          'ADMIN',
          hashedPassword,
          true,
          true,
          true,
          'EMAIL'
        ]);
        
        console.log(`✅ Admin user created successfully with username: ${username}`);
      } else {
        // Update existing admin user with correct password and role
        console.log('🔄 Updating existing admin user...');
        const existingUser = existingAdmin.rows[0];
        const hashedPassword = await PasswordHasher.hash(ADMIN_PASSWORD);
        
        await this.client.query(`
          UPDATE users SET 
            password = $1, 
            role = $2, 
            "isActive" = true, 
            "isVerified" = true,
            "isEmailVerified" = true,
            "updatedAt" = NOW()
          WHERE LOWER(email) = LOWER($3)
        `, [hashedPassword, 'ADMIN', ADMIN_EMAIL]);
        
        console.log(`✅ Admin user updated: ${existingUser.email} (was active: ${existingUser.isActive})`);
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize admin user:', error.message);
      console.error('Full error:', error);
    }
  }

  async findUserByEmail(email) {
    try {
      // First try exact case match for active users
      let result = await this.client.query(
        'SELECT * FROM users WHERE email = $1 AND "isActive" = true',
        [email]
      );
      
      if (result.rows.length > 0) {
        return result.rows[0];
      }
      
      // If no exact match found, try case-insensitive search for active users
      result = await this.client.query(
        'SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND "isActive" = true',
        [email]
      );
      
      if (result.rows.length > 0) {
        return result.rows[0];
      }
      
      // For admin emails, also check inactive users (in case admin was deactivated)
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
      if (ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        result = await this.client.query(
          'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
          [email]
        );
        
        if (result.rows.length > 0) {
          console.log('🔧 Found admin user, ensuring it is activated...');
          // Reactivate admin user if found but inactive
          await this.client.query(
            'UPDATE users SET "isActive" = true, "updatedAt" = NOW() WHERE LOWER(email) = LOWER($1)',
            [email]
          );
          return result.rows[0];
        }
      }
      
      return null;
    } catch (error) {
      console.error('Database error finding user by email:', error);
      return null;
    }
  }
  
  async findUserByUsername(username) {
    try {
      const result = await this.client.query(
        'SELECT * FROM users WHERE username = $1 AND "isActive" = true',
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
        'SELECT * FROM users WHERE "googleId" = $1 AND "isActive" = true',
        [googleId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error finding user by Google ID:', error);
      return null;
    }
  }
  
  async findUserByResetToken(token) {
    try {
      const result = await this.client.query(
        'SELECT * FROM users WHERE "passwordResetToken" = $1 AND "passwordResetExpires" > NOW() AND "isActive" = true',
        [token]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error finding user by reset token:', error);
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

  async updateUserPassword(userId, newPassword) {
    try {
      const hashedPassword = await PasswordHasher.hash(newPassword);
      await this.client.query(
        'UPDATE users SET password = $1, "passwordResetToken" = NULL, "passwordResetExpires" = NULL, "updatedAt" = NOW() WHERE id = $2',
        [hashedPassword, userId]
      );
      return true;
    } catch (error) {
      console.error('Database error updating password:', error);
      return false;
    }
  }

  async setPasswordResetToken(email, token, expiresAt) {
    try {
      await this.client.query(
        'UPDATE users SET "passwordResetToken" = $1, "passwordResetExpires" = $2, "updatedAt" = NOW() WHERE email = $3',
        [token, expiresAt, email]
      );
      return true;
    } catch (error) {
      console.error('Database error setting reset token:', error);
      return false;
    }
  }

  async linkGoogleAccount(userId, googleId) {
    try {
      await this.client.query(
        'UPDATE users SET "googleId" = $1, "authProvider" = $2, "updatedAt" = NOW() WHERE id = $3',
        [googleId, 'GOOGLE', userId]
      );
      return true;
    } catch (error) {
      console.error('Database error linking Google account:', error);
      return false;
    }
  }

  // Additional methods can be added here as needed
  async updateUserProfile(userId, updates) {
    try {
      const allowedFields = [
        'displayName', 'bio', 'avatar', 'coverImage', 'website',
        'twitter', 'instagram', 'customUrl', 'isPrivate', 'allowMessages'
      ];
      
      const updateFields = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updates).forEach(field => {
        if (allowedFields.includes(field) && updates[field] !== undefined) {
          updateFields.push(`"${field}" = $${paramIndex}`);
          values.push(updates[field]);
          paramIndex++;
        }
      });

      if (updateFields.length === 0) {
        return false;
      }

      updateFields.push(`"updatedAt" = NOW()`);
      
      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`;
      values.push(userId);

      await this.client.query(query, values);
      return true;
    } catch (error) {
      console.error('Database error updating user profile:', error);
      return false;
    }
  }

  async generateUniqueCustomUrl(baseUsername) {
    let customUrl = baseUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
    let counter = 0;
    
    while (true) {
      const testUrl = counter === 0 ? customUrl : `${customUrl}${counter}`;
      const isAvailable = await this.checkCustomUrlAvailability(testUrl);
      
      if (isAvailable) {
        return testUrl;
      }
      
      counter++;
      if (counter > 1000) { // Prevent infinite loop
        return `${customUrl}_${Date.now()}`;
      }
    }
  }

  async findUserByCustomUrl(customUrl) {
    try {
      const result = await this.client.query(
        'SELECT * FROM users WHERE "customUrl" = $1 AND "isActive" = true',
        [customUrl]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error finding user by custom URL:', error);
      return null;
    }
  }

  async checkCustomUrlAvailability(customUrl, excludeUserId = null) {
    try {
      let query = 'SELECT id FROM users WHERE "customUrl" = $1';
      let params = [customUrl];
      
      if (excludeUserId) {
        query += ' AND id != $2';
        params.push(excludeUserId);
      }
      
      const result = await this.client.query(query, params);
      return result.rows.length === 0;
    } catch (error) {
      console.error('Database error checking custom URL availability:', error);
      return false;
    }
  }
}

// Singleton instance
let dbInstance = null;

// Get shared database instance
function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseService();
  }
  return dbInstance;
}

module.exports = {
  DatabaseService,
  PasswordHasher,
  getDatabase
};
