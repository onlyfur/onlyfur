# Authentication Setup Guide - OnlyFur Platform v2.8.0

This guide walks you through setting up the complete authentication system for the OnlyFur platform.

## Prerequisites

- PostgreSQL database
- Google Cloud Console project (for OAuth)
- SMTP email service
- Node.js 18+ and npm/yarn
- Vercel account (for Blob storage)

## 1. Database Setup

### PostgreSQL Configuration

1. Create a PostgreSQL database:
```sql
CREATE DATABASE onlyfur_platform;
CREATE USER onlyfur_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE onlyfur_platform TO onlyfur_user;
```

2. Set your `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql://onlyfur_user:your_secure_password@localhost:5432/onlyfur_platform"
```

3. Run database migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

## 2. Google OAuth Setup

### Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Set authorized origins:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`
6. Set authorized redirect URIs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### Environment Variables

Add to your `.env` file:
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:5173/auth/callback"
```

Frontend `.env.local`:
```env
VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
VITE_GOOGLE_REDIRECT_URI="http://localhost:5173/auth/callback"
```

## 3. JWT Configuration

Generate secure JWT secrets:
```bash
# Generate 64-character random strings
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add to `.env`:
```env
JWT_SECRET="your-64-character-random-string"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="another-64-character-random-string"
JWT_REFRESH_EXPIRES_IN="30d"
```

## 4. Email Configuration

### SMTP Setup

Configure your SMTP service (Gmail, SendGrid, etc.):
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="OnlyFur <noreply@yourdomain.com>"
```

### Gmail App Password Setup

1. Enable 2-factor authentication on your Gmail account
2. Go to Account Settings > Security > App passwords
3. Generate an app password for "Mail"
4. Use this password in `SMTP_PASS`

## 5. Vercel Blob Storage

### Setup Blob Storage

1. Go to your Vercel dashboard
2. Create a new Blob store or use existing
3. Copy the read/write token

Add to `.env`:
```env
VERCEL_BLOB_READ_WRITE_TOKEN="your-blob-token"
```

## 6. Admin Account

Set up the initial admin account:
```env
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="secure-admin-password"
ADMIN_USERNAME="admin"
```

## 7. Security Configuration

### Production Security

Add these security settings:
```env
NODE_ENV="production"
CORS_ORIGIN="https://yourdomain.com"
RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes
RATE_LIMIT_MAX="100"  # 100 requests per window
BCRYPT_ROUNDS="12"
SESSION_SECRET="another-secure-random-string"
```

## 8. Frontend Configuration

### Frontend Environment Variables

Create `.env.local` in your frontend:
```env
VITE_API_URL="http://localhost:3001/api"
VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
VITE_APP_URL="http://localhost:5173"
```

For production:
```env
VITE_API_URL="https://your-api-domain.com/api"
VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
VITE_APP_URL="https://yourdomain.com"
```

## 9. Development Setup

### Start Development Servers

1. Install dependencies:
```bash
npm install
```

2. Start the backend:
```bash
npm run dev:server
```

3. Start the frontend:
```bash
npm run dev
```

4. The app will be available at:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3001`

## 10. Testing Authentication

### Test Flows

1. **Email Registration**:
   - Register with email/password
   - Check email for verification link
   - Verify email address

2. **Google OAuth**:
   - Click "Sign in with Google"
   - Complete OAuth flow
   - Verify user creation

3. **Password Reset**:
   - Use "Forgot Password" link
   - Check email for reset link
   - Reset password successfully

## 11. Production Deployment

### Environment Setup

1. Copy `.env.production.example` to `.env.production`
2. Update all values with production credentials
3. Ensure database migrations are run
4. Set up proper HTTPS for OAuth callbacks

### Security Checklist

- [ ] Database uses SSL connection
- [ ] JWT secrets are 64+ characters
- [ ] CORS origins are restricted
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Environment variables are secure
- [ ] Admin credentials are changed
- [ ] Google OAuth domains are verified

## Troubleshooting

### Common Issues

1. **Google OAuth "400 Bad Request"**:
   - Check redirect URI matches exactly
   - Ensure client ID is correct
   - Verify domain is authorized

2. **Database Connection Errors**:
   - Check DATABASE_URL format
   - Verify database is running
   - Ensure user has proper permissions

3. **Email Not Sending**:
   - Verify SMTP credentials
   - Check spam folder
   - Ensure 2FA and app passwords are set up

4. **JWT Token Issues**:
   - Verify JWT_SECRET is set
   - Check token expiration times
   - Ensure secrets match between services

## Support

For additional help:
- Check the application logs
- Review environment variable configuration
- Ensure all services are running
- Verify network connectivity

---

**Version**: 2.8.0  
**Last Updated**: December 19, 2024
