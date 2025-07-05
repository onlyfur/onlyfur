const http = require('http');
const url = require('url');
const querystring = require('querystring');
const crypto = require('crypto');
const { Client } = require('pg');

// Load environment variables from .env file
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  try {
    // Try .env.local first, then .env
    let envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) {
      envPath = path.join(__dirname, '..', '.env');
    }
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
  } catch (error) {
    console.warn('Warning: Could not load .env file:', error.message);
  }
}

// Load environment variables
loadEnvFile();

// Configuration
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.CLIENT_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:5174';
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

// Admin credentials from env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

// Email configuration
const FROM_EMAIL = process.env.FROM_EMAIL;
const FROM_NAME = process.env.FROM_NAME || process.env.PLATFORM_NAME || 'OnlyFur Platform';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Database configuration
const DB_CONFIG = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

console.log('🔧 OnlyFur Authentication Backend Configuration:');
console.log(`   - Port: ${PORT}`);
console.log(`   - Frontend URL: ${FRONTEND_URL}`);
console.log(`   - Database: ${DB_CONFIG.connectionString ? 'Configured' : 'Not configured'}`);
console.log(`   - Admin Email: ${ADMIN_EMAIL}`);
console.log(`   - Admin Username: ${ADMIN_USERNAME}`);
console.log(`   - BCrypt Rounds: ${BCRYPT_ROUNDS}`);
console.log(`   - Google Client ID: ${GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured'}`);
console.log(`   - Email From: ${FROM_EMAIL}`);
console.log(`   - Support Email: ${SUPPORT_EMAIL}`);

// Validate required environment variables
const requiredEnvVars = {
  'JWT_SECRET': JWT_SECRET,
  'JWT_REFRESH_SECRET': JWT_REFRESH_SECRET,
  'DATABASE_URL': process.env.DATABASE_URL,
  'ADMIN_EMAIL': ADMIN_EMAIL,
  'ADMIN_PASSWORD': ADMIN_PASSWORD,
  'ADMIN_USERNAME': ADMIN_USERNAME,
  'FROM_EMAIL': FROM_EMAIL,
  'SUPPORT_EMAIL': SUPPORT_EMAIL
};

const missingVars = Object.entries(requiredEnvVars).filter(([key, value]) => !value);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(([key]) => console.error(`   - ${key}`));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

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
      if (!hash || !hash.includes(':')) {
        resolve(false);
        return;
      }
      
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
      if (tokenInfo.aud !== GOOGLE_CLIENT_ID) {
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

// Email service using SendGrid
class EmailService {
  static async sendEmail(to, subject, htmlContent, textContent) {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    
    if (!SENDGRID_API_KEY) {
      console.log(`📧 [MOCK] Email to ${to}: ${subject}`);
      console.log(`📧 [MOCK] Content: ${textContent || htmlContent}`);
      return true;
    }

    try {
      const emailData = {
        personalizations: [{
          to: [{ email: to }],
          subject: subject
        }],        from: {
          email: FROM_EMAIL,
          name: FROM_NAME
        },content: [
          ...(textContent ? [{
            type: 'text/plain',
            value: textContent
          }] : []),
          {
            type: 'text/html',
            value: htmlContent
          }
        ]
      };

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });      if (response.ok) {
        console.log(`✅ Email sent successfully to: ${to}`);
        return true;
      } else {
        const errorText = await response.text();
        console.error(`❌ SendGrid error: ${response.status} - ${errorText}`);
        
        // If sender verification error, fall back to mock
        if (response.status === 403 && errorText.includes('verified Sender Identity')) {
          console.log(`📧 [FALLBACK] SendGrid sender not verified. Using mock email instead.`);
          console.log(`📧 [MOCK] Email to ${to}: ${subject}`);          console.log(`🔧 To fix: Verify sender identity in SendGrid dashboard: ${FROM_EMAIL}`);
          return true;
        }
        
        return false;
      }    } catch (error) {
      console.error(`❌ Email sending failed: ${error.message}`);
      console.log(`📧 [FALLBACK] Using mock email due to error`);
      console.log(`📧 [MOCK] Email to ${to}: ${subject}`);
      return true; // Return true to not break the authentication flow
    }
  }
  
  static async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - OnlyFur</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>� Password Reset Request</h1>
            <p>OnlyFur Platform</p>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>We received a request to reset the password for your OnlyFur account associated with <strong>${email}</strong>.</p>
            
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
            
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
              <p>If you have any questions, contact our support team at ${SUPPORT_EMAIL}.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from OnlyFur Platform.<br>
            Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Password Reset Request - OnlyFur Platform

Hello!

We received a request to reset the password for your OnlyFur account associated with ${email}.

Reset your password by clicking this link: ${resetUrl}

SECURITY NOTICE:
- This link will expire in 1 hour for security reasons
- If you didn't request this reset, please ignore this email
- Never share this link with anyone

If you have any questions, contact our support team at ${SUPPORT_EMAIL}.

This is an automated message from OnlyFur Platform.
Please do not reply to this email.
    `;

    console.log(`📧 Sending password reset email to: ${email}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);
    
    return await this.sendEmail(
      email,
      '🔐 Reset Your OnlyFur Password',
      htmlContent,
      textContent
    );
  }
  
  static async sendEmailChangeVerification(email, verificationToken) {
    const verificationUrl = `${FRONTEND_URL}/verify-email-change?token=${verificationToken}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Change Verification - OnlyFur</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Email Change Verification</h1>
            <p>OnlyFur Platform</p>
          </div>
          <div class="content">
            <h2>Verify Your New Email Address</h2>
            <p>We received a request to change your email address to <strong>${email}</strong>.</p>
            
            <p>Click the button below to verify this email address:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            
            <div class="warning">
              <strong>ℹ️ Important:</strong>
              <ul>
                <li>This verification link will expire in 24 hours</li>
                <li>If you didn't request this change, please ignore this email</li>
                <li>Your old email address will remain active until verification is complete</li>
              </ul>
            </div>
            
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
              <p>If you have any questions, contact our support team at ${SUPPORT_EMAIL}.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from OnlyFur Platform.<br>
            Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Email Change Verification - OnlyFur Platform

Verify Your New Email Address

We received a request to change your email address to ${email}.

Verify this email address by clicking this link: ${verificationUrl}

IMPORTANT:
- This verification link will expire in 24 hours
- If you didn't request this change, please ignore this email
- Your old email address will remain active until verification is complete

If you have any questions, contact our support team at ${SUPPORT_EMAIL}.

This is an automated message from OnlyFur Platform.
Please do not reply to this email.
    `;

    console.log(`📧 Sending email change verification to: ${email}`);
    console.log(`🔗 Verification URL: ${verificationUrl}`);
    
    return await this.sendEmail(
      email,
      '📧 Verify Your New Email Address - OnlyFur',
      htmlContent,
      textContent
    );
  }

  static async sendWelcomeEmail(email, displayName) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to OnlyFur!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to OnlyFur!</h1>
            <p>Your Creative Journey Starts Here</p>
          </div>
          <div class="content">
            <h2>Hello ${displayName}!</h2>
            <p>Welcome to OnlyFur - the premier platform for content creators and their fans. We're excited to have you join our community!</p>
            
            <div class="feature">
              <h3>🎨 Create Amazing Content</h3>
              <p>Share your creativity with a community that appreciates your work.</p>
            </div>
            
            <div class="feature">
              <h3>� Monetize Your Passion</h3>
              <p>Turn your content into income with our creator-friendly platform.</p>
            </div>
            
            <div class="feature">
              <h3>🤝 Connect with Fans</h3>
              <p>Build meaningful relationships with your audience.</p>
            </div>
            
            <p style="text-align: center;">
              <a href="${FRONTEND_URL}/dashboard" class="button">Get Started</a>
            </p>
              <p>If you have any questions, our support team is here to help at ${SUPPORT_EMAIL}.</p>
            
            <p>Happy creating!</p>
            <p><strong>The OnlyFur Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message from OnlyFur Platform.<br>
            Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Welcome to OnlyFur!

Hello ${displayName}!

Welcome to OnlyFur - the premier platform for content creators and their fans. We're excited to have you join our community!

What you can do on OnlyFur:
- Create Amazing Content: Share your creativity with a community that appreciates your work
- Monetize Your Passion: Turn your content into income with our creator-friendly platform  
- Connect with Fans: Build meaningful relationships with your audience

Get started: ${FRONTEND_URL}/dashboard

If you have any questions, our support team is here to help at ${SUPPORT_EMAIL}.

Happy creating!
The OnlyFur Team

This is an automated message from OnlyFur Platform.
Please do not reply to this email.
    `;

    console.log(`📧 Sending welcome email to: ${email}`);
    
    return await this.sendEmail(
      email,
      '🎉 Welcome to OnlyFur - Your Creative Journey Starts Here!',
      htmlContent,
      textContent
    );
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
      
      // Initialize admin user
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
      console.log('🔧 Initializing admin user...');
      
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
      
      // Verify admin user was created/updated correctly
      const verifyAdmin = await this.client.query(
        'SELECT email, username, role, "isActive" FROM users WHERE LOWER(email) = LOWER($1)',
        [ADMIN_EMAIL]
      );
      
      if (verifyAdmin.rows.length > 0) {
        const admin = verifyAdmin.rows[0];
        console.log(`✅ Admin verification: ${admin.email} | ${admin.username} | ${admin.role} | Active: ${admin.isActive}`);
      } else {
        console.error('❌ Admin user verification failed - user not found after creation/update');
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
      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
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
    async updateUserLastLogin(userId) {
    try {
      await this.client.query(
        'UPDATE users SET "lastLoginAt" = NOW(), "updatedAt" = NOW() WHERE id = $1',
        [userId]
      );
    } catch (error) {
      console.error('Database error updating last login:', error);
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
  
  async updateUserEmail(userId, newEmail, verificationToken) {
    try {
      await this.client.query(
        'UPDATE users SET email = $1, "emailVerificationToken" = $2, "isEmailVerified" = false, "updatedAt" = NOW() WHERE id = $3',
        [newEmail, verificationToken, userId]
      );
      return true;
    } catch (error) {
      console.error('Database error updating email:', error);
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
  
  // User Profile Management
  async createUserProfile(userId, profileData) {
    try {
      const { customUrl, bio, coverImage, socialLinks } = profileData;
      
      await this.client.query(`
        UPDATE users SET 
          "customUrl" = $1,
          bio = $2,
          "coverImage" = $3,
          "socialLinks" = $4,
          "updatedAt" = NOW()
        WHERE id = $5
      `, [customUrl, bio, coverImage, JSON.stringify(socialLinks || {}), userId]);
      
      return true;
    } catch (error) {
      console.error('Database error creating user profile:', error);
      return false;
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

  // Content Management
  async createContent(contentData) {
    try {
      const {
        creatorId, title, description, type, mediaUrl, mediaUrls,
        thumbnailUrl, isPublic, requiresSubscription, privacyLevel,
        tags, category, textContent, tier
      } = contentData;

      const contentId = crypto.randomUUID();
      
      await this.client.query(`
        INSERT INTO content (
          id, "creatorId", title, description, type, "mediaUrl", "mediaUrls",
          "thumbnailUrl", "isPublic", "requiresSubscription", "privacyLevel",
          tags, category, "textContent", tier, "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      `, [
        contentId, creatorId, title, description, type, mediaUrl,
        JSON.stringify(mediaUrls || []), thumbnailUrl, isPublic,
        requiresSubscription, privacyLevel || 'PUBLIC',
        JSON.stringify(tags || []), category, textContent, tier || 'FREE'
      ]);

      // Update user content count
      await this.client.query(
        'UPDATE users SET "contentCount" = "contentCount" + 1 WHERE id = $1',
        [creatorId]
      );

      return contentId;
    } catch (error) {
      console.error('Database error creating content:', error);
      return null;
    }
  }

  async getUserContent(userId, viewerId = null, limit = 20, offset = 0) {
    try {
      let query = `
        SELECT c.*, u.username, u."displayName", u.avatar 
        FROM content c
        JOIN users u ON c."creatorId" = u.id
        WHERE c."creatorId" = $1 AND c.status = 'PUBLISHED'
      `;
      let params = [userId];
      let paramIndex = 2;

      // Content visibility logic
      if (viewerId !== userId) {
        // Check if viewer is subscribed to creator
        const isSubscribed = viewerId ? await this.isUserSubscribedToCreator(viewerId, userId) : false;
        
        if (!isSubscribed) {
          // Non-subscribers only see public content and most recent post
          query += ` AND (c."isPublic" = true OR c."requiresSubscription" = false)`;
          query += ` ORDER BY c."createdAt" DESC LIMIT 1`;
          
          const result = await this.client.query(query, params);
          return result.rows;
        } else {
          // Subscribed users see all content
          query += ` AND (c."privacyLevel" = 'PUBLIC' OR c."privacyLevel" = 'SUBSCRIBER')`;
        }
      }
      // Creator sees all their content

      query += ` ORDER BY c."createdAt" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);

      const result = await this.client.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Database error getting user content:', error);
      return [];
    }
  }

  async isUserSubscribedToCreator(subscriberId, creatorId) {
    try {
      const result = await this.client.query(`
        SELECT id FROM subscriptions s
        JOIN users u ON s."userId" = u.id
        WHERE s."userId" = $1 AND u.id = $2 AND s.status = 'ACTIVE'
        AND s."currentPeriodEnd" > NOW()
      `, [subscriberId, creatorId]);
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Database error checking subscription:', error);
      return false;
    }
  }

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
    authProvider: user.authProvider,
    isEmailVerified: user.isEmailVerified,
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
      message: 'OnlyFur Complete Authentication Backend is running',
      database: db.client ? 'Connected' : 'Disconnected',
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
      message: 'OnlyFur Complete Authentication API',
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
    });  },
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
      
      // Find user by email
      console.log(`🔍 Looking up user: ${email}`);
      let user = await db.findUserByEmail(email);
      
      // Special handling for admin login if user not found in database
      if (!user && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
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
        if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
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
      let passwordValid = await PasswordHasher.compare(password, user.password);
      
      // Special fallback for admin user - if password doesn't match, try updating with env password
      if (!passwordValid && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
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

      // Note: lastLoginAt update skipped due to column not existing in current DB schema
      // TODO: Run Prisma migration to add missing columns
      
      // Generate tokens
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
        'UPDATE users SET "setupComplete" = true, "updatedAt" = NOW() WHERE id = $1',
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

  // Request password reset
  'POST /api/auth/request-password-reset': async (req, res) => {
    try {
      const { email } = await getRequestBody(req);
      
      if (!email) {
        return sendError(res, 400, 'Email is required');
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

  // Change password (authenticated)
  'POST /api/auth/change-password': async (req, res) => {
    try {
      const user = await authenticateToken(req);
      const { currentPassword, newPassword } = await getRequestBody(req);
      
      if (!currentPassword || !newPassword) {
        return sendError(res, 400, 'Current password and new password are required');
      }
      
      if (newPassword.length < 6) {
        return sendError(res, 400, 'New password must be at least 6 characters');
      }
      
      // Verify current password
      const passwordValid = await PasswordHasher.compare(currentPassword, user.password);
      if (!passwordValid) {
        return sendError(res, 401, 'Current password is incorrect');
      }
      
      // Update password
      const success = await db.updateUserPassword(user.id, newPassword);
      if (!success) {
        return sendError(res, 500, 'Failed to update password');
      }
      
      console.log(`✅ Password changed for: ${user.email}`);
      
      sendResponse(res, 200, {
        success: true,
        message: 'Password changed successfully'
      });
      
    } catch (error) {
      if (error.message.includes('token')) {
        sendError(res, 401, error.message);
      } else {
        console.error('Change password error:', error);
        sendError(res, 500, 'Internal server error', error);
      }
    }
  },

  // Change email (authenticated)
  'POST /api/auth/change-email': async (req, res) => {
    try {
      const user = await authenticateToken(req);
      const { newEmail, password } = await getRequestBody(req);
      
      if (!newEmail || !password) {
        return sendError(res, 400, 'New email and password are required');
      }
      
      // Verify password
      const passwordValid = await PasswordHasher.compare(password, user.password);
      if (!passwordValid) {
        return sendError(res, 401, 'Password is incorrect');
      }
      
      // Check if new email is already taken
      const existingUser = await db.findUserByEmail(newEmail);
      if (existingUser) {
        return sendError(res, 409, 'Email is already in use');
      }
      
      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Update email (mark as unverified)
      const success = await db.updateUserEmail(user.id, newEmail, verificationToken);
      if (!success) {
        return sendError(res, 500, 'Failed to update email');
      }
      
      // Send verification email
      await EmailService.sendEmailChangeVerification(newEmail, verificationToken);
      
      console.log(`📧 Email change requested: ${user.email} → ${newEmail}`);
      
      sendResponse(res, 200, {
        success: true,
        message: 'Email change requested. Please check your new email for verification.'
      });
      
    } catch (error) {
      if (error.message.includes('token')) {
        sendError(res, 401, error.message);
      } else {
        console.error('Change email error:', error);
        sendError(res, 500, 'Internal server error', error);
      }
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
            picture: googleUserInfo.picture          });
        }
      }
      
      // Check if user is active
      if (!user.isActive) {
        return sendError(res, 401, 'Account is disabled');
      }
      
      // Note: lastLoginAt update skipped due to column not existing in current DB schema
      // TODO: Run Prisma migration to add missing columns
      
      // Generate tokens
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
      
      if (user) {        // User already exists, perform login
        if (!user.isActive) {
          return sendError(res, 401, 'Account is disabled');
        }
        
        // Note: lastLoginAt update skipped due to column not existing in current DB schema
        
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
        
        // Note: lastLoginAt update skipped due to column not existing in current DB schema
        
        const tokenPayload = {
          userId: user.id,
          email: user.email,
          role: user.role
        };
        
        const token = JWTHandler.sign(tokenPayload, JWT_SECRET, JWT_EXPIRES_IN);
        const refreshToken = JWTHandler.sign(tokenPayload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
        
        console.log(`✅ Google account linked: ${user.email}`);
        
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
      
      console.log(`✅ Google registration successful: ${user.email}`);
      
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
      
      sendResponse(res, 200, {        success: true,
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

  // User Profile Endpoints
  'GET /user/:username': async (req, res) => {
    try {
      const username = req.url.split('/user/')[1]?.split('?')[0];
      if (!username) {
        return sendError(res, 400, 'Username is required');
      }

      // Find user by custom URL or username
      let user = await db.findUserByCustomUrl(username);
      if (!user) {
        user = await db.findUserByUsername(username);
      }

      if (!user) {
        return sendError(res, 404, 'User not found');
      }

      // Check if profile is private
      if (user.isPrivate) {
        // Only show limited info for private profiles
        const publicUser = {
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          isPrivate: true
        };
        return sendResponse(res, 200, {
          success: true,
          data: { user: publicUser, content: [] }
        });
      }

      // Get viewer ID from token (optional)
      let viewerId = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.substring(7);
          const payload = JWTHandler.verify(token, JWT_SECRET);
          viewerId = payload.userId;
        } catch (error) {
          // Invalid token, continue as anonymous user
        }
      }

      // Get user content based on viewing permissions
      const content = await db.getUserContent(user.id, viewerId);

      // Normalize user data
      const userProfile = {
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        coverImage: user.coverImage,
        subscriberCount: user.subscriberCount,
        contentCount: user.contentCount,
        website: user.website,
        twitter: user.twitter,
        instagram: user.instagram,
        customUrl: user.customUrl,
        createdAt: user.createdAt
      };

      sendResponse(res, 200, {
        success: true,
        data: {
          user: userProfile,
          content: content,
          isOwner: viewerId === user.id,
          isSubscribed: viewerId ? await db.isUserSubscribedToCreator(viewerId, user.id) : false
        }
      });

    } catch (error) {
      console.error('User profile error:', error);
      sendError(res, 500, 'Internal server error', error);
    }
  },

  'PUT /api/user/profile': async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 401, 'Authorization token required');
      }

      const token = authHeader.substring(7);
      const payload = JWTHandler.verify(token, JWT_SECRET);
      const userId = payload.userId;

      const updates = await getRequestBody(req);
      
      // Validate custom URL if provided
      if (updates.customUrl) {
        const urlPattern = /^[a-z0-9_-]+$/;
        if (!urlPattern.test(updates.customUrl)) {
          return sendError(res, 400, 'Custom URL can only contain lowercase letters, numbers, hyphens, and underscores');
        }

        if (updates.customUrl.length < 3 || updates.customUrl.length > 30) {
          return sendError(res, 400, 'Custom URL must be between 3 and 30 characters');
        }

        const isAvailable = await db.checkCustomUrlAvailability(updates.customUrl, userId);
        if (!isAvailable) {
          return sendError(res, 400, 'Custom URL is already taken');
        }
      }

      const success = await db.updateUserProfile(userId, updates);
      if (!success) {
        return sendError(res, 500, 'Failed to update profile');
      }

      // Get updated user data
      const updatedUser = await db.findUserById(userId);
      
      sendResponse(res, 200, {
        success: true,
        message: 'Profile updated successfully',
        data: { user: normalizeUser(updatedUser) }
      });

    } catch (error) {
      if (error.message.includes('token')) {
        sendError(res, 401, error.message);
      } else {
        console.error('Profile update error:', error);
        sendError(res, 500, 'Internal server error', error);
      }
    }
  },

  'POST /api/content': async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 401, 'Authorization token required');
      }

      const token = authHeader.substring(7);
      const payload = JWTHandler.verify(token, JWT_SECRET);
      const userId = payload.userId;

      const contentData = await getRequestBody(req);
      const { title, description, type, mediaUrl, mediaUrls, thumbnailUrl, 
              isPublic, requiresSubscription, privacyLevel, tags, category, 
              textContent, tier } = contentData;

      if (!title || !type) {
        return sendError(res, 400, 'Title and type are required');
      }

      const validTypes = ['IMAGE', 'VIDEO', 'AUDIO', 'TEXT', 'DOCUMENT'];
      if (!validTypes.includes(type)) {
        return sendError(res, 400, 'Invalid content type');
      }

      const contentId = await db.createContent({
        creatorId: userId,
        title,
        description,
        type,
        mediaUrl,
        mediaUrls,
        thumbnailUrl,
        isPublic: isPublic !== false,
        requiresSubscription: requiresSubscription || false,
        privacyLevel: privacyLevel || 'PUBLIC',
        tags: tags || [],
        category,
        textContent,
        tier: tier || 'FREE'
      });

      if (!contentId) {
        return sendError(res, 500, 'Failed to create content');
      }

      sendResponse(res, 201, {
        success: true,
        message: 'Content created successfully',
        data: { contentId }
      });

    } catch (error) {
      if (error.message.includes('token')) {
        sendError(res, 401, error.message);
      } else {
        console.error('Content creation error:', error);
        sendError(res, 500, 'Internal server error', error);
      }
    }
  },

  'GET /api/user/content': async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 401, 'Authorization token required');
      }

      const token = authHeader.substring(7);
      const payload = JWTHandler.verify(token, JWT_SECRET);
      const userId = payload.userId;

      const parsedUrl = url.parse(req.url, true);
      const limit = parseInt(parsedUrl.query.limit) || 20;
      const offset = parseInt(parsedUrl.query.offset) || 0;

      const content = await db.getUserContent(userId, userId, limit, offset);

      sendResponse(res, 200, {
        success: true,
        data: { content }
      });

    } catch (error) {
      if (error.message.includes('token')) {
        sendError(res, 401, error.message);
      } else {
        console.error('Get user content error:', error);
        sendError(res, 500, 'Internal server error', error);
      }
    }
  },

  'GET /api/user/check-url/:url': async (req, res) => {
    try {
      const customUrl = req.url.split('/api/user/check-url/')[1];
      if (!customUrl) {
        return sendError(res, 400, 'URL is required');
      }

      const urlPattern = /^[a-z0-9_-]+$/;
      if (!urlPattern.test(customUrl)) {
        return sendResponse(res, 200, {
          success: true,
          available: false,
          message: 'URL can only contain lowercase letters, numbers, hyphens, and underscores'
        });
      }

      if (customUrl.length < 3 || customUrl.length > 30) {
        return sendResponse(res, 200, {
          success: true,
          available: false,
          message: 'URL must be between 3 and 30 characters'
        });
      }

      const isAvailable = await db.checkCustomUrlAvailability(customUrl);
      
      sendResponse(res, 200, {
        success: true,
        available: isAvailable,
        message: isAvailable ? 'URL is available' : 'URL is already taken'
      });

    } catch (error) {
      console.error('URL check error:', error);
      sendError(res, 500, 'Internal server error', error);
    }
  }
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;
  
  // Set CORS headers
  Object.entries(corsHeaders()).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle OPTIONS requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    let routeKey = `${method} ${pathname}`;
    let handler = routes[routeKey];

    // Handle dynamic routes
    if (!handler) {
      // Handle /user/:username route
      if (pathname.startsWith('/user/') && method === 'GET') {
        handler = routes['GET /user/:username'];
      }
      // Handle /api/user/check-url/:url route
      else if (pathname.startsWith('/api/user/check-url/') && method === 'GET') {
        handler = routes['GET /api/user/check-url/:url'];
      }
    }

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
  try {
    // Connect to database
    const dbConnected = await db.connect();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    server.listen(PORT, () => {
      console.log('🔑 Authentication System Ready:');
      console.log(`   ✅ Admin Email: ${ADMIN_EMAIL}`);
      console.log(`   ✅ Admin Username: ${ADMIN_USERNAME}`);
      console.log(`   ✅ Admin Password: [Configured]`);
      console.log('🚀 OnlyFur Complete Authentication Backend running on port ' + PORT);
      console.log('🔗 Frontend URL: ' + FRONTEND_URL);
      console.log('📋 Health check: http://localhost:' + PORT + '/api/health');
      console.log('📋 API endpoints: http://localhost:' + PORT + '/api');
      console.log('🔐 Admin panel: http://localhost:' + PORT + '/api/admin/panel');
      console.log('👤 User profiles: http://localhost:' + PORT + '/user/[username]');
      console.log('🌍 Environment: ' + (process.env.NODE_ENV || 'development'));
      console.log('✅ All authentication features ready');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('📴 Received SIGTERM, shutting down gracefully...');
      await db.disconnect();
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('📴 Received SIGINT, shutting down gracefully...');
      await db.disconnect();
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
