import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Email transporter configuration
const createTransporter = () => {
  const emailProvider = process.env.EMAIL_PROVIDER || 'console';
  
  if (emailProvider === 'sendgrid') {
    return nodemailer.createTransporter({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }
  
  if (emailProvider === 'smtp') {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  // Console transport for development
  return nodemailer.createTransporter({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
};

const transporter = createTransporter();

// Email templates
const getEmailTemplate = (type: string, data: any) => {
  const baseTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .features { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .feature-list { list-style: none; padding: 0; }
        .feature-list li { padding: 8px 0; border-bottom: 1px solid #eee; }
        .feature-list li:before { content: "✓"; color: #667eea; font-weight: bold; margin-right: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🐾 OnlyFur</h1>
        <p>${data.headerText}</p>
      </div>
      <div class="content">
        ${data.content}
      </div>
      <div class="footer">
        <p>© 2024 OnlyFur Platform. All rights reserved.</p>
        <p>You're receiving this email because you have an account with OnlyFur.</p>
        <p>If you need help, contact us at ${process.env.SUPPORT_EMAIL || 'support@onlyfur.net'}</p>
      </div>
    </body>
    </html>
  `;

  const templates = {
    welcome: {
      subject: 'Welcome to OnlyFur! 🎉',
      headerText: 'Welcome to the Community!',
      content: `
        <h2>Hi ${data.displayName}! 👋</h2>
        <p>Welcome to OnlyFur, the premier platform for furry content creators and enthusiasts!</p>
        <p>Your account has been successfully created with the <strong>${data.subscriptionTier}</strong> tier.</p>
        
        <div class="features">
          <h3>What you can do now:</h3>
          <ul class="feature-list">
            <li>Explore content from amazing creators</li>
            <li>Connect with the community</li>
            <li>Customize your profile</li>
            <li>Start following your favorite creators</li>
          </ul>
        </div>
        
        <p>Ready to explore? Click the button below to get started!</p>
        <a href="${process.env.CLIENT_BASE_URL}" class="button">Explore OnlyFur</a>
        
        <p>If you have any questions, our community guidelines and help center are here to assist you.</p>
      `
    },

    subscriptionConfirmation: {
      subject: `🚀 ${data.tierName} Subscription Activated!`,
      headerText: 'Subscription Activated Successfully!',
      content: `
        <h2>Congratulations, ${data.displayName}!</h2>
        <p>Your <strong>${data.tierName}</strong> subscription has been successfully activated.</p>
        
        <div class="features">
          <h3>Your new benefits include:</h3>
          <ul class="feature-list">
            ${data.features?.map(feature => `<li>${feature}</li>`).join('') || ''}
          </ul>
        </div>
        
        <p><strong>Subscription Details:</strong></p>
        <ul>
          <li>Plan: ${data.tierName}</li>
          <li>Price: $${(data.price / 100).toFixed(2)} / ${data.billingPeriod?.toLowerCase()}</li>
          <li>Status: Active</li>
          <li>Next billing: ${data.nextBilling || 'N/A'}</li>
        </ul>
        
        <a href="${process.env.CLIENT_BASE_URL}/dashboard" class="button">Access Your Benefits</a>
        
        <p>Thank you for supporting our creator community! 💜</p>
      `
    },

    messageNotification: {
      subject: `💬 New message from ${data.senderUsername}`,
      headerText: 'You have a new message!',
      content: `
        <h2>Hi ${data.recipientName}!</h2>
        <p>You have received a new message from <strong>${data.senderUsername}</strong>:</p>
        
        <div class="features" style="background: #e8f4fd; border-left: 4px solid #667eea;">
          <p><em>"${data.messagePreview}"</em></p>
        </div>
        
        <a href="${process.env.CLIENT_BASE_URL}/messages" class="button">Reply Now</a>
        
        <p>Keep the conversation going and connect with your community!</p>
      `
    },

    passwordReset: {
      subject: '🔐 Reset Your OnlyFur Password',
      headerText: 'Password Reset Request',
      content: `
        <h2>Hi ${data.displayName}!</h2>
        <p>We received a request to reset your password for your OnlyFur account.</p>
        
        <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
        
        <a href="${data.resetLink}" class="button">Reset Password</a>
        
        <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        
        <p><strong>Security reminder:</strong> OnlyFur will never ask for your password via email.</p>
      `
    },

    contentApproved: {
      subject: '✅ Your content has been approved!',
      headerText: 'Content Approved',
      content: `
        <h2>Great news, ${data.creatorName}!</h2>
        <p>Your content "<strong>${data.contentTitle}</strong>" has been approved and is now live on OnlyFur!</p>
        
        <div class="features">
          <p>Your content is now visible to:</p>
          <ul class="feature-list">
            <li>${data.requiredTier} tier subscribers and above</li>
            <li>Followers who meet the access requirements</li>
          </ul>
        </div>
        
        <a href="${process.env.CLIENT_BASE_URL}/content/${data.contentId}" class="button">View Your Content</a>
        
        <p>Keep creating amazing content for your community! 🎨</p>
      `
    },

    paymentFailed: {
      subject: '❌ Payment Issue - Action Required',
      headerText: 'Payment Failed',
      content: `
        <h2>Hi ${data.displayName},</h2>
        <p>We had trouble processing your payment for your ${data.tierName} subscription.</p>
        
        <div class="features" style="background: #fef2f2; border-left: 4px solid #ef4444;">
          <p><strong>What happened:</strong> ${data.failureReason || 'Payment could not be processed'}</p>
          <p><strong>Next attempt:</strong> ${data.nextAttempt || 'In 3 days'}</p>
        </div>
        
        <p>To avoid any interruption to your subscription, please update your payment method:</p>
        
        <a href="${process.env.CLIENT_BASE_URL}/billing" class="button">Update Payment Method</a>
        
        <p>If you need assistance, please contact our support team.</p>
      `
    }
  };

  return baseTemplate.replace('${data.content}', templates[type]?.content || data.content)
                   .replace('${data.subject}', templates[type]?.subject || data.subject)
                   .replace('${data.headerText}', templates[type]?.headerText || data.headerText);
};

// Send welcome email
export const sendWelcomeEmail = async (user: any) => {
  try {
    const emailData = {
      displayName: user.displayName || user.username,
      subscriptionTier: user.subscriptionTier || 'Free',
    };

    const html = getEmailTemplate('welcome', emailData);

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'OnlyFur Platform'}" <${process.env.FROM_EMAIL || 'noreply@onlyfur.net'}>`,
      to: user.email,
      subject: 'Welcome to OnlyFur! 🎉',
      html,
    });

    console.log('✅ Welcome email sent to:', user.email);
  } catch (error) {
    console.error('❌ Welcome email error:', error);
  }
};

// Send subscription confirmation email
export const sendSubscriptionConfirmationEmail = async (user: any, tier: any) => {
  try {
    const emailData = {
      displayName: user.displayName || user.username,
      tierName: tier.name,
      price: tier.price,
      billingPeriod: tier.billingPeriod,
      features: Array.isArray(tier.features) ? tier.features : 
               typeof tier.features === 'string' ? JSON.parse(tier.features) : [],
      nextBilling: user.subscriptionValidUntil ? 
                  new Date(user.subscriptionValidUntil).toLocaleDateString() : null,
    };

    const html = getEmailTemplate('subscriptionConfirmation', emailData);

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'OnlyFur Platform'}" <${process.env.FROM_EMAIL || 'noreply@onlyfur.net'}>`,
      to: user.email,
      subject: `🚀 ${tier.name} Subscription Activated!`,
      html,
    });

    console.log('✅ Subscription confirmation email sent to:', user.email);
  } catch (error) {
    console.error('❌ Subscription email error:', error);
  }
};

// Send message notification email
export const sendMessageNotificationEmail = async (recipient: any, sender: any, messagePreview: string) => {
  try {
    const emailData = {
      recipientName: recipient.displayName || recipient.username,
      senderUsername: sender.username,
      messagePreview: messagePreview.substring(0, 150) + (messagePreview.length > 150 ? '...' : ''),
    };

    const html = getEmailTemplate('messageNotification', emailData);

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'OnlyFur Platform'}" <${process.env.FROM_EMAIL || 'noreply@onlyfur.net'}>`,
      to: recipient.email,
      subject: `💬 New message from ${sender.username}`,
      html,
    });

    console.log('✅ Message notification email sent to:', recipient.email);
  } catch (error) {
    console.error('❌ Message notification email error:', error);
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (user: any, resetToken: string) => {
  try {
    const resetLink = `${process.env.CLIENT_BASE_URL}/reset-password?token=${resetToken}`;
    
    const emailData = {
      displayName: user.displayName || user.username,
      resetLink,
    };

    const html = getEmailTemplate('passwordReset', emailData);

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'OnlyFur Platform'}" <${process.env.FROM_EMAIL || 'noreply@onlyfur.net'}>`,
      to: user.email,
      subject: '🔐 Reset Your OnlyFur Password',
      html,
    });

    console.log('✅ Password reset email sent to:', user.email);
  } catch (error) {
    console.error('❌ Password reset email error:', error);
  }
};

// Send content approval notification
export const sendContentApprovedEmail = async (creator: any, content: any) => {
  try {
    const emailData = {
      creatorName: creator.displayName || creator.username,
      contentTitle: content.title,
      contentId: content.id,
      requiredTier: content.requiredTier || 'Free',
    };

    const html = getEmailTemplate('contentApproved', emailData);

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'OnlyFur Platform'}" <${process.env.FROM_EMAIL || 'noreply@onlyfur.net'}>`,
      to: creator.email,
      subject: '✅ Your content has been approved!',
      html,
    });

    console.log('✅ Content approval email sent to:', creator.email);
  } catch (error) {
    console.error('❌ Content approval email error:', error);
  }
};

// Send payment failed notification
export const sendPaymentFailedEmail = async (user: any, tier: any, failureReason?: string) => {
  try {
    const emailData = {
      displayName: user.displayName || user.username,
      tierName: tier.name,
      failureReason,
      nextAttempt: 'In 3 days',
    };

    const html = getEmailTemplate('paymentFailed', emailData);

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'OnlyFur Platform'}" <${process.env.FROM_EMAIL || 'noreply@onlyfur.net'}>`,
      to: user.email,
      subject: '❌ Payment Issue - Action Required',
      html,
    });

    console.log('✅ Payment failed email sent to:', user.email);
  } catch (error) {
    console.error('❌ Payment failed email error:', error);
  }
};

// Bulk email functionality for newsletters/announcements
export const sendBulkEmail = async (users: any[], subject: string, content: string) => {
  try {
    const sendPromises = users.map(user => {
      const emailData = {
        subject,
        headerText: subject,
        content: content.replace(/\{\{name\}\}/g, user.displayName || user.username),
      };

      const html = getEmailTemplate('custom', emailData);

      return transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'OnlyFur Platform'}" <${process.env.FROM_EMAIL || 'noreply@onlyfur.net'}>`,
        to: user.email,
        subject,
        html,
      });
    });

    await Promise.all(sendPromises);
    console.log(`✅ Bulk email sent to ${users.length} users`);
  } catch (error) {
    console.error('❌ Bulk email error:', error);
  }
};

export default {
  sendWelcomeEmail,
  sendSubscriptionConfirmationEmail,
  sendMessageNotificationEmail,
  sendPasswordResetEmail,
  sendContentApprovedEmail,
  sendPaymentFailedEmail,
  sendBulkEmail,
};
