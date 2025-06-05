import nodemailer from 'nodemailer';
import { logger } from '../middleware/logger';

// Email service interface
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Email service class
class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter(): Promise<void> {
    try {
      // Check if SendGrid is configured
      if (process.env.SENDGRID_API_KEY) {
        // SendGrid configuration (requires @sendgrid/mail package)
        logger.info('Email service: SendGrid not implemented yet, falling back to SMTP');
      }

      // SMTP configuration
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        // Verify SMTP connection
        await this.transporter.verify();
        this.isConfigured = true;
        logger.info('Email service initialized with SMTP');
      } else {
        logger.warn('Email service not configured - missing SMTP settings');
      }
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      logger.warn('Email service not configured, skipping email send');
      return false;
    }

    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME || 'OnlyFur Platform'} <${process.env.FROM_EMAIL || 'noreply@onlyfur.com'}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
        messageId: result.messageId
      });
      return true;
    } catch (error) {
      logger.error('Failed to send email:', {
        error: error instanceof Error ? error.message : error,
        to: options.to,
        subject: options.subject
      });
      return false;
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}

// Create email service instance
const emailService = new EmailService();

// Email templates
const getEmailTemplate = (title: string, content: string, actionButton?: { text: string; url: string }): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px; background: #f8f9fa; }
        .logo { font-size: 24px; font-weight: bold; color: #e11d48; }
        .content { padding: 20px; background: white; }
        .button { display: inline-block; padding: 12px 24px; background: #e11d48; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🐾 OnlyFur</div>
        </div>
        <div class="content">
          <h2>${title}</h2>
          ${content}
          ${actionButton ? `<div style="text-align: center;"><a href="${actionButton.url}" class="button">${actionButton.text}</a></div>` : ''}
        </div>
        <div class="footer">
          <p>© 2024 OnlyFur Platform. All rights reserved.</p>
          <p>If you didn't request this email, you can safely ignore it.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email functions
export async function sendVerificationEmail(email: string, displayName: string, userId: string): Promise<boolean> {
  const verificationUrl = `${process.env.CLIENT_BASE_URL}/verify-email?token=${userId}&email=${email}`;
  
  const content = `
    <p>Hello ${displayName},</p>
    <p>Welcome to OnlyFur! Please verify your email address to complete your registration.</p>
    <p>Click the button below to verify your account:</p>
  `;

  const html = getEmailTemplate(
    'Verify Your Email Address',
    content,
    { text: 'Verify Email', url: verificationUrl }
  );

  return emailService.sendEmail({
    to: email,
    subject: 'Verify Your OnlyFur Account',
    html
  });
}

export async function sendPasswordResetEmail(email: string, displayName: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.CLIENT_BASE_URL}/reset-password?token=${resetToken}`;
  
  const content = `
    <p>Hello ${displayName},</p>
    <p>You requested a password reset for your OnlyFur account.</p>
    <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
    <p>If you didn't request this reset, please ignore this email.</p>
  `;

  const html = getEmailTemplate(
    'Reset Your Password',
    content,
    { text: 'Reset Password', url: resetUrl }
  );

  return emailService.sendEmail({
    to: email,
    subject: 'Reset Your OnlyFur Password',
    html
  });
}

export async function sendWelcomeEmail(email: string, displayName: string, role: string): Promise<boolean> {
  const dashboardUrl = role === 'CREATOR' 
    ? `${process.env.CLIENT_BASE_URL}/creator-dashboard`
    : `${process.env.CLIENT_BASE_URL}/dashboard`;
  
  const content = `
    <p>Hello ${displayName},</p>
    <p>Welcome to OnlyFur! Your account has been successfully created.</p>
    <p>You're now part of our amazing furry community. Here's what you can do next:</p>
    <ul>
      <li>Complete your profile</li>
      <li>${role === 'CREATOR' ? 'Start creating and sharing content' : 'Explore amazing content from creators'}</li>
      <li>Connect with other community members</li>
      <li>Customize your experience</li>
    </ul>
  `;

  const html = getEmailTemplate(
    'Welcome to OnlyFur!',
    content,
    { text: 'Get Started', url: dashboardUrl }
  );

  return emailService.sendEmail({
    to: email,
    subject: 'Welcome to OnlyFur - Let\'s Get Started!',
    html
  });
}

export async function sendSubscriptionConfirmationEmail(
  email: string, 
  displayName: string, 
  tierName: string, 
  amount: number
): Promise<boolean> {
  const content = `
    <p>Hello ${displayName},</p>
    <p>Thank you for subscribing to the <strong>${tierName}</strong> tier!</p>
    <p><strong>Subscription Details:</strong></p>
    <ul>
      <li>Tier: ${tierName}</li>
      <li>Amount: $${amount.toFixed(2)}/month</li>
      <li>Status: Active</li>
    </ul>
    <p>You now have access to all the features included in your subscription tier.</p>
  `;

  const html = getEmailTemplate(
    'Subscription Confirmed',
    content,
    { text: 'Manage Subscription', url: `${process.env.CLIENT_BASE_URL}/subscription-settings` }
  );

  return emailService.sendEmail({
    to: email,
    subject: 'OnlyFur Subscription Confirmed',
    html
  });
}

export async function sendPaymentReceiptEmail(
  email: string,
  displayName: string,
  transactionDetails: {
    amount: number;
    description: string;
    transactionId: string;
    date: Date;
  }
): Promise<boolean> {
  const content = `
    <p>Hello ${displayName},</p>
    <p>Thank you for your payment! Here are your transaction details:</p>
    <p><strong>Payment Details:</strong></p>
    <ul>
      <li>Amount: $${transactionDetails.amount.toFixed(2)}</li>
      <li>Description: ${transactionDetails.description}</li>
      <li>Transaction ID: ${transactionDetails.transactionId}</li>
      <li>Date: ${transactionDetails.date.toLocaleDateString()}</li>
    </ul>
    <p>Keep this email for your records.</p>
  `;

  const html = getEmailTemplate(
    'Payment Receipt',
    content,
    { text: 'View Billing History', url: `${process.env.CLIENT_BASE_URL}/billing` }
  );

  return emailService.sendEmail({
    to: email,
    subject: 'OnlyFur Payment Receipt',
    html
  });
}

export async function sendCreatorPayoutNotification(
  email: string,
  displayName: string,
  payoutDetails: {
    amount: number;
    period: string;
    totalEarnings: number;
  }
): Promise<boolean> {
  const content = `
    <p>Hello ${displayName},</p>
    <p>Great news! Your creator payout has been processed.</p>
    <p><strong>Payout Details:</strong></p>
    <ul>
      <li>Payout Amount: $${payoutDetails.amount.toFixed(2)}</li>
      <li>Period: ${payoutDetails.period}</li>
      <li>Total Earnings: $${payoutDetails.totalEarnings.toFixed(2)}</li>
    </ul>
    <p>The payment should appear in your account within 3-5 business days.</p>
  `;

  const html = getEmailTemplate(
    'Creator Payout Processed',
    content,
    { text: 'View Earnings', url: `${process.env.CLIENT_BASE_URL}/earnings` }
  );

  return emailService.sendEmail({
    to: email,
    subject: 'OnlyFur Creator Payout Processed',
    html
  });
}

// Initialize email service
export async function initializeEmailService(): Promise<void> {
  // Email service is initialized in constructor
  logger.info('Email service initialization completed');
}

export default emailService;
