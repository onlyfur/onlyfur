# Login Issues - Troubleshooting Guide

## Current Issues and Solutions

### 1. CORS Errors (FIXED)
**Problem:** `Access to fetch at 'https://creatorplattform.vercel.app/api/...' from origin 'https://onlyfur.net' has been blocked by CORS policy`

**Solution:** Updated CORS configuration in `api/index.ts` to include:
- `https://onlyfur.net`
- `https://www.onlyfur.net`
- `https://creatorplattform.vercel.app`

### 2. Double API Prefix Issue (FIXED)
**Problem:** URLs showing `/api/api/health` instead of `/api/health`

**Solution:** Fixed routing in `api/index.ts` by removing the `/api` prefix from route definitions since Vercel already handles the `/api` prefix.

### 3. Connection Refused Errors (FIXED)
**Problem:** `GET http://localhost:3001/api/auth/profile net::ERR_CONNECTION_REFUSED`

**Root Cause:** The frontend was trying to connect to `localhost:3001` in production, but since `onlyfur.net` and `creatorplattform.vercel.app` are the same Vercel project, the API should be accessed via relative paths.

**Solution:** Updated API client to use relative paths (`/api`) when running on the production domain, eliminating the need for cross-domain requests.

#### For Production (Vercel):
Set these environment variables in your Vercel dashboard:
```
VITE_API_BASE_URL=/api
FRONTEND_URL=https://onlyfur.net
CORS_ORIGIN=https://onlyfur.net
NODE_ENV=production
```

#### For Development:
Create a `.env.local` file with:
```
VITE_API_BASE_URL=http://localhost:3001/api
NODE_ENV=development
```

### 4. Browser Extension Conflicts (IGNORE - NOT CRITICAL)
**Problem:** Multiple errors from `background.js` related to FIDO2 and password managers

**Solution:** These are browser extension conflicts and don't affect the core functionality. Users can:
- Disable password manager extensions temporarily
- Use incognito mode
- Ignore these errors (they don't break login)

### 5. Stripe Errors (EXPECTED - BLOCKED BY AD BLOCKERS)
**Problem:** `POST https://r.stripe.com/b net::ERR_BLOCKED_BY_CLIENT`

**Solution:** This is expected behavior when ad blockers block Stripe telemetry. It doesn't affect payment functionality.

## Deployment Steps

### 1. Update Vercel Environment Variables
Go to your Vercel dashboard and add these environment variables:

```
VITE_API_BASE_URL=/api
FRONTEND_URL=https://onlyfur.net
CORS_ORIGIN=https://onlyfur.net
NODE_ENV=production
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Redeploy the Application
After updating environment variables, trigger a new deployment in Vercel.

### 3. Test the Login Flow
1. Visit https://onlyfur.net
2. Try to log in
3. Check browser console for any remaining errors

## Local Development Setup

### 1. Copy Environment File
```bash
cp .env.development .env.local
```

### 2. Update Database Configuration
Edit `.env.local` with your local database settings.

### 3. Start Development Servers
```bash
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Testing the Fixes

### 1. API Health Check
Visit: https://onlyfur.net/api/health
Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

### 2. CORS Test (No longer needed)
Since frontend and backend are on the same domain, CORS is not an issue.

### 3. Login Test
Try logging in with test credentials or Google OAuth.

## Common Issues and Quick Fixes

### Issue: "Unable to connect to server"
- Check if environment variables are set correctly
- Verify the API URL is accessible
- Check Vercel deployment logs

### Issue: Still getting CORS errors
- Clear browser cache
- Check if all environment variables are set in Vercel
- Redeploy the application

### Issue: Authentication not working
- Check if JWT secrets are set
- Verify Google OAuth configuration
- Check database connectivity

## Files Modified

1. `api/index.ts` - Fixed CORS and routing
2. `src/services/apiClient.ts` - Improved URL detection and error handling
3. `src/services/authService.ts` - Added backend availability checks
4. `vite.config.ts` - Added development proxy
5. `.env.production` - Production environment template
6. `.env.development` - Development environment template

## 🎯 **Key Discovery:**

Since `onlyfur.net` and `creatorplattform.vercel.app` are the **same Vercel project**, the solution is much simpler:
- No cross-domain requests needed
- Use relative API paths (`/api`) instead of absolute URLs
- Eliminates CORS complexity entirely

## ✅ **Updated Solution:**
1. Set the environment variables in Vercel
2. Redeploy the application
3. Test the login functionality
4. Monitor for any remaining issues

The main fixes are now in place, and the login should work correctly once the environment variables are properly configured in your deployment.
