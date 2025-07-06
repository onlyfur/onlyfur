import nodemailer from 'nodemailer';
import { logger } from '../middleware/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private defaultFromEmail: string;

  constructor() {
    // Initialize email configuration from environment variables
    this.defaultFromEmail = process.env.EMAIL_FROM || 'noreply@onlyfur.net';

    // Create nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send an email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: options.from || this.defaultFromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
      });

      return true;
    } catch (error) {
      logger.error('Failed to send email', {
        error: error instanceof Error ? error.message : 'Unknown error',
        to: options.to,
        subject: options.subject,
      });
      return false;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
    username: string
  ): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>Hi ${username},</p>
        <p>We received a request to reset your password. Click the button below to choose a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Reset Your Password',
      html,
    });
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(
    to: string,
    verificationToken: string,
    username: string
  ): Promise<boolean> {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email</h2>
        <p>Hi ${username},</p>
        <p>Welcome to OnlyFur! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </div>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with us, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Verify Your Email',
      html,
    });
  }

  /**
   * Send welcome email after verification
   */
  async sendWelcomeEmail(to: string, username: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to OnlyFur!</h2>
        <p>Hi ${username},</p>
        <p>Thank you for verifying your email address. Your account is now fully activated!</p>
        <p>Here are some things you can do to get started:</p>
        <ul>
          <li>Complete your profile</li>
          <li>Follow your favorite creators</li>
          <li>Explore trending content</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Go to Dashboard
          </a>
        </div>
        <p>If you have any questions, our support team is here to help!</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Welcome to OnlyFur!',
      html,
    });
  }

  /**
   * Send account deletion confirmation
   */
  async sendAccountDeletionEmail(to: string, username: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Account Deletion Confirmation</h2>
        <p>Hi ${username},</p>
        <p>We're sorry to see you go. Your account has been successfully deleted.</p>
        <p>If you change your mind, you can always create a new account.</p>
        <p>We appreciate the time you spent with us and hope to see you again!</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Account Deletion Confirmation',
      html,
    });
  }

  /**
   * Send security alert
   */
  async sendSecurityAlert(
    to: string,
    username: string,
    activity: string,
    location: string,
    deviceInfo: string
  ): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Security Alert</h2>
        <p>Hi ${username},</p>
        <p>We detected the following security-related activity on your account:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Activity:</strong> ${activity}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Device:</strong> ${deviceInfo}</p>
          <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
        </div>
        <p>If this wasn't you, please secure your account immediately:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/settings/security" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Secure Account
          </a>
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated security alert. Please do not reply to this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Security Alert - Action Required',
      html,
    });
  }
}

export const emailService = new EmailService();
export default emailService;
