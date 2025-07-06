const crypto = require('crypto');

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

// Helper functions
function corsHeaders() {
  // Get allowed origins from environment variable or use defaults
  const corsOrigins = process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://onlyfur.net',
    'https://onlyfur.vercel.app',
    'http://onlyfur.net:5173'
  ];
  
  // Use wildcard for development or specific origin in production
  const allowedOrigin = process.env.NODE_ENV === 'production' 
    ? (corsOrigins.includes('https://onlyfur.net') ? 'https://onlyfur.net' : corsOrigins[0])
    : corsOrigins[0];
    
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
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
  // Check if this is a Vercel-style request with body already parsed
  if (req.body !== undefined) {
    return req.body;
  }
  
  // Check if this is a Node.js IncomingMessage with streaming capabilities
  if (typeof req.on === 'function') {
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
  
  // Fallback for other request types
  return {};
}

function extractBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

async function authenticateToken(req, db) {
  const token = extractBearerToken(req);
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
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
      
      const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
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
    const FROM_EMAIL = process.env.FROM_EMAIL;
    const FROM_NAME = process.env.FROM_NAME || process.env.PLATFORM_NAME || 'OnlyFur Platform';
    
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
        }],
        from: {
          email: FROM_EMAIL,
          name: FROM_NAME
        },
        content: [
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
      });

      if (response.ok) {
        console.log(`✅ Email sent successfully to: ${to}`);
        return true;
      } else {
        const errorText = await response.text();
        console.error(`❌ SendGrid error: ${response.status} - ${errorText}`);
        
        // If sender verification error, fall back to mock
        if (response.status === 403 && errorText.includes('verified Sender Identity')) {
          console.log(`📧 [FALLBACK] SendGrid sender not verified. Using mock email instead.`);
          console.log(`📧 [MOCK] Email to ${to}: ${subject}`);
          console.log(`🔧 To fix: Verify sender identity in SendGrid dashboard: ${FROM_EMAIL}`);
          return true;
        }
        
        return false;
      }
    } catch (error) {
      console.error(`❌ Email sending failed: ${error.message}`);
      console.log(`📧 [FALLBACK] Using mock email due to error`);
      console.log(`📧 [MOCK] Email to ${to}: ${subject}`);
      return true; // Return true to not break the authentication flow
    }
  }
  
  static async sendPasswordResetEmail(email, resetToken) {
    const FRONTEND_URL = process.env.CLIENT_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:5174';
    const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;
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
            <h1>🔐 Password Reset Request</h1>
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

  static async sendWelcomeEmail(email, displayName) {
    const FRONTEND_URL = process.env.CLIENT_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:5174';
    const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;
    
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
              <h3>💰 Monetize Your Passion</h3>
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

module.exports = {
  JWTHandler,
  corsHeaders,
  sendResponse,
  sendError,
  getRequestBody,
  extractBearerToken,
  authenticateToken,
  normalizeUser,
  GoogleOAuth,
  EmailService
};
