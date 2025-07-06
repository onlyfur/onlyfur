import { Router, Request, Response } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { logger } from '../middleware/logger';
import { asyncHandler } from '../middleware/errorHandler';
import nodemailer from 'nodemailer';

const router = Router();

// Contact form rate limiting - 5 messages per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    error: 'Too many contact form submissions. Please try again in an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation schema using Zod
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Please provide a valid email address'),
  subject: z.string().max(200, 'Subject must not exceed 200 characters').optional(),
  category: z.enum([
    'General Question',
    'Account Issues',
    'Payment & Billing',
    'Creator Support',
    'Technical Problem',
    'Safety & Security',
    'Business Inquiry',
    'Feature Request',
    'Bug Report',
    'Other'
  ]).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must not exceed 2000 characters'),
});

// Email transporter configuration
const createTransporter = () => {
  const emailProvider = process.env.EMAIL_PROVIDER || 'sendgrid';
  
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

// Generate HTML email template for contact form
const generateContactEmailHTML = (data: {
  name: string;
  email: string;
  subject?: string;
  category?: string;
  message: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Submission</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 20px; 
          text-align: center; 
        }
        .content { 
          padding: 30px; 
        }
        .field {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .field:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #555;
          margin-bottom: 5px;
          display: block;
        }
        .value {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          border-left: 3px solid #667eea;
        }
        .message-content {
          white-space: pre-wrap;
          font-family: inherit;
        }
        .metadata {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
          margin-top: 20px;
        }
        .priority {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .priority.high { background: #fee; color: #c53030; }
        .priority.medium { background: #fef5e7; color: #d69e2e; }
        .priority.low { background: #f0fff4; color: #38a169; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🐾 OnlyFur Support</h1>
          <p>New Contact Form Submission</p>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">From:</span>
            <div class="value">
              <strong>${data.name}</strong><br>
              <a href="mailto:${data.email}">${data.email}</a>
            </div>
          </div>
          
          ${data.category ? `
          <div class="field">
            <span class="label">Category:</span>
            <div class="value">
              <span class="priority ${data.category.includes('Technical') || data.category.includes('Bug') ? 'high' : data.category.includes('Business') || data.category.includes('Creator') ? 'medium' : 'low'}">
                ${data.category}
              </span>
            </div>
          </div>
          ` : ''}
          
          ${data.subject ? `
          <div class="field">
            <span class="label">Subject:</span>
            <div class="value">${data.subject}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <span class="label">Message:</span>
            <div class="value">
              <div class="message-content">${data.message}</div>
            </div>
          </div>
          
          <div class="metadata">
            <strong>Submission Details:</strong><br>
            Time: ${data.timestamp}<br>
            ${data.ip ? `IP: ${data.ip}<br>` : ''}
            ${data.userAgent ? `User Agent: ${data.userAgent}` : ''}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Auto-reply email template
const generateAutoReplyHTML = (name: string, category?: string) => {
  const responseTime = category === 'Creator Support' ? '12 hours' : 
                      category === 'Business Inquiry' ? '48 hours' : '24 hours';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We received your message</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 20px; 
          text-align: center; 
        }
        .content { 
          padding: 30px; 
        }
        .button { 
          display: inline-block; 
          background: #667eea; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 20px 0; 
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          color: #666; 
          font-size: 14px; 
          border-top: 1px solid #eee; 
          padding-top: 20px; 
        }
        .highlight {
          background: #f0f8ff;
          border-left: 3px solid #667eea;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🐾 OnlyFur Support</h1>
          <p>Thank you for contacting us!</p>
        </div>
        <div class="content">
          <h2>Hi ${name}! 👋</h2>
          <p>We've received your message and wanted to let you know that we're on it!</p>
          
          <div class="highlight">
            <strong>⏱️ Expected Response Time:</strong> ${responseTime}<br>
            <strong>📧 Reference:</strong> This email serves as confirmation of your submission.
          </div>
          
          <p>Our support team will review your message and get back to you as soon as possible. In the meantime, you might find these resources helpful:</p>
          
          <ul>
            <li><a href="${process.env.CLIENT_BASE_URL || 'https://onlyfur.com'}/faq">Frequently Asked Questions</a></li>
            <li><a href="${process.env.CLIENT_BASE_URL || 'https://onlyfur.com'}/help">Help Center</a></li>
            <li><a href="${process.env.CLIENT_BASE_URL || 'https://onlyfur.com'}/community">Community Guidelines</a></li>
          </ul>
          
          <p>For urgent matters, please include "URGENT" in your subject line.</p>
          
          <a href="${process.env.CLIENT_BASE_URL || 'https://onlyfur.com'}" class="button">Return to OnlyFur</a>
        </div>
        <div class="footer">
          <p>© 2024 OnlyFur Platform. All rights reserved.</p>
          <p>This is an automated response. Please do not reply to this email.</p>
          <p>If you need immediate assistance, visit our <a href="${process.env.CLIENT_BASE_URL || 'https://onlyfur.com'}/contact">contact page</a>.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * POST /api/contact
 * Submit contact form
 */
router.post('/', contactLimiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    // Validate request body with Zod
    const validatedData = contactSchema.parse(req.body);
    const { name, email, subject, category, message } = validatedData;

    const supportEmail = process.env.SUPPORT_EMAIL || 'info@fur.ninja';
    const fromEmail = process.env.FROM_EMAIL || 'noreply@onlyfur.com';
    const timestamp = new Date().toISOString();
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;

    // Create email transporter
    const transporter = createTransporter();

    // Prepare email data
    const emailData = {
      name,
      email,
      subject,
      category,
      message,
      timestamp,
      userAgent,
      ip
    };

    // Email to support team
    const supportEmailOptions = {
      from: fromEmail,
      to: supportEmail,
      subject: `[OnlyFur Contact] ${category || 'General'}: ${subject || 'New Message'} - from ${name}`,
      html: generateContactEmailHTML(emailData),
      replyTo: email // Allow support team to reply directly to the user
    };

    // Auto-reply to user
    const autoReplyOptions = {
      from: fromEmail,
      to: email,
      subject: '✅ We received your message - OnlyFur Support',
      html: generateAutoReplyHTML(name, category)
    };

    // Send both emails
    const [supportEmailResult, autoReplyResult] = await Promise.allSettled([
      transporter.sendMail(supportEmailOptions),
      transporter.sendMail(autoReplyOptions)
    ]);

    // Log results
    if (supportEmailResult.status === 'fulfilled') {
      logger.info('Contact form email sent to support team', {
        to: supportEmail,
        from: email,
        category,
        subject
      });
    } else {
      logger.error('Failed to send contact form email to support team', {
        error: supportEmailResult.reason,
        to: supportEmail,
        from: email
      });
    }

    if (autoReplyResult.status === 'fulfilled') {
      logger.info('Auto-reply sent to user', {
        to: email,
        name
      });
    } else {
      logger.error('Failed to send auto-reply to user', {
        error: autoReplyResult.reason,
        to: email
      });
    }

    // Return success if at least the support email was sent
    if (supportEmailResult.status === 'fulfilled') {
      res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully. We\'ll get back to you soon!',
        data: {
          timestamp,
          autoReplySent: autoReplyResult.status === 'fulfilled'
        }
      });
    } else {
      // If support email failed, return error
      res.status(500).json({
        success: false,
        message: 'Failed to send your message. Please try again or contact us directly.',
        error: 'Email delivery failed'
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    logger.error('Contact form submission error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}));

export default router;
