# OnlyFur Platform - Vercel Production Deployment Guide 🚀

## Overview
This guide provides step-by-step instructions for deploying the OnlyFur platform to Vercel with all production services configured.

## 🔧 Prerequisites

### Required Services
1. **Neon PostgreSQL Database** - For production database
2. **Stripe Account** - For payment processing
3. **Vercel Blob Storage** - For file uploads
4. **SendGrid Account** - For email notifications
5. **Vercel Account** - For hosting

## 📋 Step-by-Step Deployment

### Step 1: Prepare Environment Variables

Create these environment variables in your Vercel project settings:

#### Database Configuration
```env
POSTGRES_URL="postgresql://neondb_owner:your_password@your_endpoint.neon.tech/neondb?sslmode=require"
POSTGRES_PRISMA_URL="postgresql://neondb_owner:your_password@your_endpoint.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15"
POSTGRES_HOST="your_endpoint.neon.tech"
DATABASE_URL="${POSTGRES_PRISMA_URL}"
```

#### Platform Configuration
```env
NODE_ENV="production"
PLATFORM_NAME="OnlyFur"
SUPPORT_EMAIL="support@onlyfur.com"
VITE_API_URL="https://your-app.vercel.app"
```

#### Security Configuration
```env
JWT_SECRET="your_super_secure_jwt_secret_256_bits_minimum"
NEXTAUTH_SECRET="your_super_secure_nextauth_secret_256_bits_minimum"
NEXTAUTH_URL="https://your-app.vercel.app"
CORS_ORIGIN="https://your-app.vercel.app"
CORS_CREDENTIALS="true"
RATE_LIMIT_MAX="100"
BCRYPT_ROUNDS="12"
```

#### Payment Configuration
```env
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
STRIPE_PUBLIC_KEY="pk_live_your_stripe_public_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

#### File Storage Configuration
```env
BLOB_READ_WRITE_TOKEN="vercel_blob_your_token"
```

#### Email Configuration
```env
EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY="SG.your_sendgrid_api_key"
FROM_EMAIL="noreply@onlyfur.com"
FROM_NAME="OnlyFur Platform"
```

#### Admin Configuration
```env
ADMIN_EMAIL="admin@onlyfur.net"
ADMIN_PASSWORD="your_secure_admin_password"
ADMIN_USERNAME="admin"
```

### Step 2: Configure Vercel Project

1. **Create Vercel Project**
   ```bash
   npx vercel
   ```

2. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all the environment variables from Step 1

3. **Configure Build Settings**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm ci",
     "devCommand": "npm run dev"
   }
   ```

### Step 3: Database Setup

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

3. **Seed Initial Data** (Optional)
   ```bash
   npm run db:seed
   ```

### Step 4: Configure Stripe Webhooks

1. **Go to Stripe Dashboard**
   - Navigate to Developers > Webhooks
   - Click "Add endpoint"

2. **Set Webhook URL**
   ```
   https://your-app.vercel.app/api/stripe/webhook
   ```

3. **Select Events**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. **Copy Webhook Secret**
   - Use this as your `STRIPE_WEBHOOK_SECRET` environment variable

### Step 5: Configure Vercel Blob

1. **Enable Vercel Blob**
   - Go to your Vercel project dashboard
   - Navigate to Storage tab
   - Click "Create Database" > "Blob"

2. **Get Access Token**
   - Copy the read/write token
   - Use this as your `BLOB_READ_WRITE_TOKEN` environment variable

### Step 6: Configure SendGrid

1. **Create SendGrid API Key**
   - Go to SendGrid Dashboard
   - Navigate to Settings > API Keys
   - Create new API key with full access

2. **Verify Sender Domain**
   - Go to Marketing > Sender Authentication
   - Verify your sending domain

3. **Set API Key**
   - Use the API key as your `SENDGRID_API_KEY` environment variable

### Step 7: Configure Neon Database

1. **Create Neon Project**
   - Go to Neon Dashboard
   - Create new project
   - Select PostgreSQL 15

2. **Get Connection String**
   - Copy the connection string
   - Use for `POSTGRES_URL` and `POSTGRES_PRISMA_URL`

3. **Configure Connection Pooling**
   - Enable connection pooling in Neon dashboard
   - Use pooled connection string for `POSTGRES_PRISMA_URL`

## 🗂 Vercel Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "functions": {
    "server/production-server.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### package.json Scripts
```json
{
  "scripts": {
    "build": "vite build",
    "build:vercel": "npm run build",
    "start": "npm run backend:prod",
    "backend:prod": "npx tsx server/production-server.ts",
    "db:migrate:prod": "npx prisma migrate deploy",
    "db:generate": "npx prisma generate"
  }
}
```

## 🚀 Deployment Commands

### Initial Deployment
```bash
# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build

# Deploy to Vercel
npx vercel --prod
```

### Subsequent Deployments
```bash
# Simply push to your connected Git repository
git push origin main
```

## 🔍 Post-Deployment Verification

### Health Check
1. Visit `https://your-app.vercel.app/health`
2. Should return status: "ok"

### API Endpoints
Test these endpoints:
- `GET /api/subscriptions/tiers` - Should return subscription tiers
- `GET /api/health` - Should return health status
- `POST /api/auth/register` - Should allow user registration

### Database Connection
1. Check Vercel function logs
2. Look for "Database connected successfully" message

### Stripe Integration
1. Test payment flow
2. Check Stripe webhook delivery in dashboard

### File Uploads
1. Test avatar upload
2. Check Vercel Blob storage

### Email Notifications
1. Register new user
2. Check for welcome email delivery

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check Neon database is running
   - Verify connection string format
   - Ensure IP allowlist includes Vercel IPs

2. **Stripe Webhook Not Working**
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Check Vercel function logs

3. **File Upload Errors**
   - Verify Blob storage is enabled
   - Check access token permissions
   - Ensure file size limits are configured

4. **Email Not Sending**
   - Verify SendGrid API key
   - Check sender domain verification
   - Review SendGrid activity logs

### Debug Commands
```bash
# Check database connection
npx prisma db push

# View Vercel logs
npx vercel logs

# Test API endpoints locally
npm run backend:prod
```

## 📊 Monitoring & Analytics

### Vercel Dashboard
- Monitor function execution times
- Check error rates
- Review bandwidth usage

### Stripe Dashboard
- Monitor payment success rates
- Review webhook delivery status
- Track revenue metrics

### Database Monitoring
- Check Neon dashboard for query performance
- Monitor connection usage
- Review storage usage

## 🎯 Success Criteria

Deployment is successful when:
- ✅ Application loads without errors
- ✅ User registration/login works
- ✅ Payment processing functions
- ✅ File uploads work
- ✅ Email notifications send
- ✅ Database operations succeed
- ✅ All API endpoints respond correctly

## 🔒 Security Checklist

- ✅ All environment variables are secure
- ✅ JWT secrets are randomly generated
- ✅ Stripe keys are production keys
- ✅ Database access is properly restricted
- ✅ CORS is configured correctly
- ✅ Rate limiting is enabled
- ✅ Security headers are configured

## 🎉 Deployment Complete!

Your OnlyFur platform is now live and ready for production use! 

**Live URL**: `https://your-app.vercel.app`

The platform includes:
- Real payment processing
- File storage and uploads
- Email notifications  
- User management
- Content creation
- Subscription management
- Admin dashboard
- Mobile-responsive design

**Ready for real users and revenue generation! 🚀**
