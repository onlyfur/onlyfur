# OnlyFur Platform - Production Deployment Guide

This guide covers the complete deployment process for the OnlyFur furry content platform to Vercel with real backend integration.

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd creator-platform
   pnpm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## 📋 Prerequisites

### Required Services
- **Vercel Account** - For hosting and serverless functions
- **PostgreSQL Database** - Primary database (Supabase/Neon/PlanetScale recommended)
- **Email Service** - SendGrid or SMTP provider
- **File Storage** - Cloudinary account for media uploads
- **Payment Processing** - Stripe account (live keys for production)

### Optional Services
- **MongoDB** - For caching and analytics
- **Redis** - For session storage and rate limiting
- **PayPal** - Alternative payment processor
- **Sentry** - Error monitoring
- **Google Analytics** - Website analytics

## 🔧 Environment Configuration

### Database Setup

#### PostgreSQL (Primary Database)
```sql
-- Create database schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  avatar TEXT,
  banner_image TEXT,
  bio TEXT,
  location VARCHAR(100),
  species VARCHAR(50),
  fursona VARCHAR(100),
  interests JSONB DEFAULT '[]',
  subscription_tier VARCHAR(20) DEFAULT 'free',
  subscription_status VARCHAR(20) DEFAULT 'active',
  subscription_expires_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  lockout_until TIMESTAMP
);

CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(20) NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}',
  tags JSONB DEFAULT '[]',
  species JSONB DEFAULT '[]',
  pricing JSONB DEFAULT '{"isFree": true}',
  is_adult BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(20) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_content_creator ON content(creator_id);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_creator ON subscriptions(creator_id);
```

### Environment Variables

Create `.env.local` with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/onlyfur_db"
POSTGRES_PRISMA_URL="postgresql://username:password@host:5432/onlyfur_db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
NEXTAUTH_SECRET="your-nextauth-secret-32-characters-plus"
NEXTAUTH_URL="https://your-domain.vercel.app"
BCRYPT_ROUNDS=12

# Email (SendGrid recommended)
SENDGRID_API_KEY="SG.your-sendgrid-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Payments (Stripe)
STRIPE_PUBLIC_KEY="pk_live_your_stripe_public_key"
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_public_key"

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
NODE_ENV="production"
CORS_ORIGIN="https://your-domain.vercel.app"

# Optional: PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
SENTRY_DSN="https://your-sentry-dsn"

# Feature Flags
ENABLE_EMAIL_VERIFICATION=true
REQUIRE_EMAIL_VERIFICATION=true
ENABLE_CONTENT_MODERATION=true
PLATFORM_FEE_PERCENTAGE=20
```

## 🏗️ Vercel Deployment

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
# For production deployment
vercel --prod

# Or link to existing project
vercel link
vercel --prod
```

### 4. Configure Environment Variables in Vercel
```bash
# Add environment variables via CLI
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add SENDGRID_API_KEY production
# ... add all environment variables
```

Or use the Vercel dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add all variables from `.env.example`

### 5. Custom Domain (Optional)
1. Add your domain in Vercel dashboard
2. Configure DNS records
3. Update `NEXT_PUBLIC_APP_URL` and `CORS_ORIGIN`

## 🔐 Security Configuration

### SSL/TLS
- Vercel provides automatic HTTPS
- Configure HSTS headers (already in vercel.json)
- Update CSP headers for your domain

### Authentication Security
- Use strong JWT secrets (32+ characters)
- Enable rate limiting on auth endpoints
- Implement account lockout after failed attempts
- Use secure HTTP-only cookies for tokens

### Content Security Policy
Update CSP in `vercel.json` for your domain:
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob: https://res.cloudinary.com; connect-src 'self' https://api.stripe.com https://api.cloudinary.com;"
}
```

## 📊 Database Migrations

### Initial Setup
```bash
# Connect to your PostgreSQL database
psql $DATABASE_URL

# Run the schema creation script (see Database Setup section)
\i schema.sql
```

### Data Seeding (Optional)
```sql
-- Create admin user
INSERT INTO users (email, username, display_name, password_hash, role, email_verified, status)
VALUES (
  'admin@yourdomain.com',
  'admin',
  'Platform Administrator',
  '$2a$12$hashed_password_here',
  'admin',
  true,
  'active'
);
```

## 📧 Email Configuration

### SendGrid Setup (Recommended)
1. Create SendGrid account
2. Verify your domain
3. Generate API key
4. Add to environment variables

### SMTP Alternative
```bash
# Gmail example
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
```

## 💳 Payment Integration

### Stripe Setup
1. Create Stripe account
2. Complete business verification
3. Get live API keys
4. Configure webhooks:
   - Endpoint: `https://your-domain.vercel.app/api/payments/stripe-webhook`
   - Events: `invoice.payment_succeeded`, `customer.subscription.deleted`, etc.

### PayPal Setup (Optional)
1. Create PayPal business account
2. Get client credentials
3. Configure webhooks

## 📁 File Storage Setup

### Cloudinary Configuration
1. Create Cloudinary account
2. Get cloud name and API credentials
3. Configure upload presets:
   - Folder: `onlyfur/`
   - Transformations: Auto-optimization
   - Access mode: Public

### AWS S3 Alternative
```bash
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="onlyfur-content"
```

## 🔍 Monitoring & Analytics

### Error Monitoring (Sentry)
1. Create Sentry project
2. Get DSN
3. Add to environment variables

### Analytics (Google Analytics)
1. Create GA4 property
2. Get measurement ID
3. Add to environment variables

### Performance Monitoring
- Use Vercel Analytics (built-in)
- Monitor Core Web Vitals
- Set up uptime monitoring

## 🧪 Testing

### Local Development
```bash
# Start development server
pnpm dev

# Build and test production bundle
pnpm build
pnpm preview
```

### Staging Environment
```bash
# Deploy to staging
vercel --target staging

# Test with staging environment variables
```

### Production Testing
- Test all authentication flows
- Verify payment processing
- Test file uploads
- Check email delivery
- Validate API endpoints

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database permissions
   - Test connection from local environment

2. **Email Delivery Issues**
   - Verify SendGrid API key
   - Check domain verification
   - Test with different email providers

3. **File Upload Failures**
   - Check Cloudinary credentials
   - Verify upload limits
   - Test with different file types

4. **Payment Errors**
   - Verify Stripe keys (test vs live)
   - Check webhook configuration
   - Test with Stripe test cards

### Debug Commands
```bash
# Check environment variables
vercel env ls

# View function logs
vercel logs

# Test API endpoints
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Post-Deployment Checklist

- [ ] Database schema created and migrated
- [ ] All environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Email delivery tested
- [ ] Payment processing tested
- [ ] File uploads working
- [ ] Admin account created
- [ ] Content moderation enabled
- [ ] Analytics tracking active
- [ ] Error monitoring configured
- [ ] Backup strategy implemented

## 🔄 Maintenance

### Regular Tasks
- Monitor error rates and performance
- Update dependencies monthly
- Review and rotate API keys quarterly
- Backup database regularly
- Monitor storage usage
- Review security headers

### Scaling Considerations
- Database connection pooling
- CDN configuration for static assets
- Redis for caching (when needed)
- Database read replicas
- Content delivery optimization

## 📞 Support

For deployment issues:
1. Check Vercel documentation
2. Review error logs in Vercel dashboard
3. Test API endpoints independently
4. Verify third-party service configurations

## 🔒 Security Best Practices

- Enable 2FA on all service accounts
- Use strong, unique passwords
- Rotate API keys regularly
- Monitor for security vulnerabilities
- Keep dependencies updated
- Implement proper logging and monitoring
- Regular security audits

---

**Important**: This is an adult content platform. Ensure compliance with:
- Age verification requirements
- Content moderation policies
- Payment processor terms
- Regional legal requirements
- Data protection regulations (GDPR, CCPA)
