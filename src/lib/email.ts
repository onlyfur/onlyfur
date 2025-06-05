// Email Service for OnlyFur Platform
// Production-ready email functionality with multiple provider support

import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/api';

// Email templates
const EMAIL_TEMPLATES = {
  verification: {
    subject: 'Verify your OnlyFur account',
    html: (token: string, username: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { max-width: 200px; }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #f97316 0%, #9333ea 100%);
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 20px 0;
          }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/branding/onlyfur-logo.png" alt="OnlyFur" class="logo">
          </div>
          
          <h1>Welcome to OnlyFur, ${username}! 🐾</h1>
          
          <p>Thank you for joining the premier furry content platform! To complete your registration and start exploring our community, please verify your email address.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}" class="button">
              Verify Email Address
            </a>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">
            ${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}
          </p>
          
          <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
          
          <hr style="margin: 30px 0; border: none; height: 1px; background: #ddd;">
          
          <h3>What's next?</h3>
          <ul>
            <li>🎨 <strong>Explore Content:</strong> Discover amazing furry creators and their content</li>
            <li>💎 <strong>Subscribe:</strong> Support your favorite creators with subscriptions</li>
            <li>🦊 <strong>Create:</strong> Share your own furry content and build your fanbase</li>
            <li>💬 <strong>Connect:</strong> Join our vibrant furry community</li>
          </ul>
          
          <div class="footer">
            <p>If you didn't create an account with OnlyFur, please ignore this email.</p>
            <p>Need help? Contact us at <a href="mailto:support@onlyfur.com">support@onlyfur.com</a></p>
            <p>&copy; ${new Date().getFullYear()} OnlyFur. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  passwordReset: {
    subject: 'Reset your OnlyFur password',
    html: (token: string, username: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { max-width: 200px; }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #f97316 0%, #9333ea 100%);
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 20px 0;
          }
          .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/branding/onlyfur-logo.png" alt="OnlyFur" class="logo">
          </div>
          
          <h1>Password Reset Request</h1>
          
          <p>Hi ${username},</p>
          
          <p>We received a request to reset your OnlyFur account password. If this was you, click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}" class="button">
              Reset Password
            </a>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">
            ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}
          </p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul>
              <li>This reset link will expire in 1 hour</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password remains unchanged until you create a new one</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>For security questions, contact us at <a href="mailto:security@onlyfur.com">security@onlyfur.com</a></p>
            <p>&copy; ${new Date().getFullYear()} OnlyFur. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  welcome: {
    subject: 'Welcome to the OnlyFur community! 🎉',
    html: (username: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { max-width: 200px; }
          .feature-box { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 15px 0; 
            border-left: 4px solid #f97316;
          }
          .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #f97316 0%, #9333ea 100%);
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/branding/onlyfur-logo.png" alt="OnlyFur" class="logo">
          </div>
          
          <h1>Welcome to OnlyFur, ${username}! 🐾✨</h1>
          
          <p>Your email has been verified and your account is now fully active! Welcome to the premier platform for furry creators and fans.</p>
          
          <div class="feature-box">
            <h3>🎨 For Fans & Supporters</h3>
            <ul>
              <li>Discover amazing furry creators</li>
              <li>Subscribe to exclusive content</li>
              <li>Support your favorite artists</li>
              <li>Join community discussions</li>
            </ul>
          </div>
          
          <div class="feature-box">
            <h3>🦊 For Creators</h3>
            <ul>
              <li>Share your furry art, photography, and content</li>
              <li>Build a loyal fanbase</li>
              <li>Earn from your creative work</li>
              <li>Connect with fellow creators</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">
              Start Exploring
            </a>
          </div>
          
          <h3>Community Guidelines 📋</h3>
          <p>OnlyFur is a safe, inclusive space for the furry community. Please remember to:</p>
          <ul>
            <li>Respect all community members</li>
            <li>Follow our content guidelines</li>
            <li>Report any inappropriate behavior</li>
            <li>Have fun and be creative!</li>
          </ul>
          
          <hr style="margin: 30px 0; border: none; height: 1px; background: #ddd;">
          
          <p>Questions? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help">Help Center</a> or contact us at <a href="mailto:support@onlyfur.com">support@onlyfur.com</a></p>
          
          <p>Welcome to the pack! 🐺🎉</p>
          
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p>&copy; ${new Date().getFullYear()} OnlyFur. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Initialize email transporter
let transporter: nodemailer.Transporter | null = null;

function createTransporter() {
  if (process.env.SENDGRID_API_KEY) {
    // SendGrid configuration
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return null; // SendGrid uses its own method
  } else {
    // SMTP configuration (Gmail, etc.)
    return nodemailer.createTransporter({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // For development only
      }
    });
  }
}

// Send email using SendGrid
async function sendWithSendGrid(to: string, subject: string, html: string): Promise<void> {
  const msg = {
    to,
    from: {
      email: process.env.EMAIL_FROM!,
      name: 'OnlyFur'
    },
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('SendGrid error:', error);
    throw new Error('Failed to send email via SendGrid');
  }
}

// Send email using SMTP
async function sendWithSMTP(to: string, subject: string, html: string): Promise<void> {
  if (!transporter) {
    transporter = createTransporter();
  }

  if (!transporter) {
    throw new Error('Email transporter not configured');
  }

  const mailOptions = {
    from: {
      name: 'OnlyFur',
      address: process.env.EMAIL_FROM!
    },
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('SMTP error:', error);
    throw new Error('Failed to send email via SMTP');
  }
}

// Main email sending function
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    if (process.env.SENDGRID_API_KEY) {
      await sendWithSendGrid(to, subject, html);
    } else {
      await sendWithSMTP(to, subject, html);
    }
    
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

// Send verification email
export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const username = email.split('@')[0]; // Extract username from email
  const template = EMAIL_TEMPLATES.verification;
  
  await sendEmail(
    email,
    template.subject,
    template.html(token, username)
  );
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string, username: string): Promise<void> {
  const template = EMAIL_TEMPLATES.passwordReset;
  
  await sendEmail(
    email,
    template.subject,
    template.html(token, username)
  );
}

// Send welcome email
export async function sendWelcomeEmail(email: string, username: string): Promise<void> {
  const template = EMAIL_TEMPLATES.welcome;
  
  await sendEmail(
    email,
    template.subject,
    template.html(username)
  );
}

// Send notification email
export async function sendNotificationEmail(
  email: string, 
  subject: string, 
  message: string, 
  actionUrl?: string
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { max-width: 200px; }
        .button { 
          display: inline-block; 
          background: linear-gradient(135deg, #f97316 0%, #9333ea 100%);
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 8px; 
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/branding/onlyfur-logo.png" alt="OnlyFur" class="logo">
        </div>
        
        <h1>${subject}</h1>
        <p>${message}</p>
        
        ${actionUrl ? `
          <div style="text-align: center;">
            <a href="${actionUrl}" class="button">Take Action</a>
          </div>
        ` : ''}
        
        <div style="margin-top: 30px; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} OnlyFur. All rights reserved.</p>
          <p>Need help? Contact us at <a href="mailto:support@onlyfur.com">support@onlyfur.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, html);
}

// Validate email configuration
export function validateEmailConfig(): boolean {
  if (process.env.SENDGRID_API_KEY) {
    return !!(process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM);
  } else {
    return !!(
      process.env.EMAIL_SERVER_HOST &&
      process.env.EMAIL_SERVER_PORT &&
      process.env.EMAIL_SERVER_USER &&
      process.env.EMAIL_SERVER_PASSWORD &&
      process.env.EMAIL_FROM
    );
  }
}
