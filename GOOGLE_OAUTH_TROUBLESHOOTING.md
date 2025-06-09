# Google OAuth Troubleshooting Guide - OnlyFur Platform v3.9.6

## 🚨 Common Issue: Google Popup Shows But Login Doesn't Complete

### Problem Description
- Google OAuth popup appears and shows Google sign-in
- User completes Google authentication
- Popup redirects back to your site 
- Page reloads but user is not logged in
- No profile is created in the database

### Root Causes & Solutions

---

## 🔧 **Solution 1: Environment Variables Configuration**

### Check Your Environment Variables

1. **Verify .env.local exists with Google OAuth credentials:**
```bash
# Check if file exists
ls -la .env.local

# Check contents (without exposing secrets)
grep "GOOGLE" .env.local
```

2. **Required environment variables:**
```bash
# Backend (for token verification)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Frontend (for Google Sign-In component)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

3. **Quick Setup Command:**
```bash
npm run setup:google-oauth
```

---

## 🔧 **Solution 2: Google Cloud Console Configuration**

### Verify Redirect URIs in Google Console

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Navigate to: APIs & Services → Credentials**
3. **Click your OAuth 2.0 Client ID**
4. **Check Authorized redirect URIs:**

**For Development:**
```
http://localhost:5173
```

**For Production:**
```
https://yourdomain.com
https://your-project.vercel.app
```

**Important:** The `@react-oauth/google` library handles callbacks internally, so you don't need `/auth/callback/google` endpoints for the modern flow.

---

## 🔧 **Solution 3: Database Configuration**

### Ensure Database is Connected

1. **Check database connection:**
```bash
npm run db:studio
```

2. **Verify User table exists:**
```bash
npx prisma db push
```

3. **Check for database errors in server logs**

---

## 🔧 **Solution 4: Browser Console Debugging**

### Check for JavaScript Errors

1. **Open Browser Developer Tools (F12)**
2. **Go to Console tab**
3. **Look for errors during Google sign-in**

**Common Error Messages:**
- `Google OAuth not configured` → Environment variables missing
- `Network error` → Backend server not running or incorrect API URL
- `Invalid Google token` → Token verification failed on backend

---

## 🔧 **Solution 5: Server-Side Debugging**

### Enable Detailed Logging

1. **Check server logs during Google authentication**
2. **Look for these log messages:**
   - `Google OAuth verification successful`
   - `Existing user found` or `Creating new user`
   - `Google OAuth login successful`

3. **If you see errors, check:**
   - Database connection
   - Google Client ID/Secret validity
   - Token verification process

---

## 🧪 **Testing Your Configuration**

### Step-by-Step Test

1. **Start the development server:**
```bash
npm run dev
```

2. **Open browser console (F12)**

3. **Go to login page and click "Sign in with Google"**

4. **Check console for these messages:**
```javascript
// Should see this in console:
console.log('Attempting Google authentication with userType:', userType);

// After successful authentication:
console.log('Google auth successful');
```

5. **Check Network tab for API calls:**
   - Should see POST request to `/api/auth/google`
   - Response should include `success: true` and user data

---

## 🔍 **Advanced Debugging**

### Manual Token Verification

If authentication still fails, you can manually test token verification:

1. **Add this debug code to your browser console after getting Google credential:**
```javascript
// Get the credential from Google
const credential = 'your_google_jwt_token_here';

// Test API call manually
fetch('/api/auth/google', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    credential: credential,
    userType: 'subscriber'
  })
})
.then(response => response.json())
.then(data => console.log('Manual test result:', data))
.catch(error => console.error('Manual test error:', error));
```

---

## 🚀 **Quick Fix Commands**

### Rapid Troubleshooting

```bash
# 1. Restart everything
npm install
npm run db:generate
npm run dev

# 2. Check environment
echo $VITE_GOOGLE_CLIENT_ID
node -e "console.log(process.env.GOOGLE_CLIENT_ID)"

# 3. Reset database (if needed)
npm run db:reset
npm run db:push

# 4. Test backend directly
curl -X POST http://localhost:3001/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"credential":"test","userType":"subscriber"}'
```

---

## 📋 **Configuration Checklist**

### Before Testing Google OAuth

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Web application OAuth client created
- [ ] Authorized JavaScript origins added
- [ ] Environment variables set:
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`  
  - [ ] `VITE_GOOGLE_CLIENT_ID`
- [ ] Database connected and migrated
- [ ] Backend server running on correct port
- [ ] Frontend can reach backend API

### After Authentication Attempt

- [ ] No JavaScript console errors
- [ ] Network request to `/api/auth/google` succeeds
- [ ] Server logs show successful authentication
- [ ] User record created in database
- [ ] JWT tokens generated and stored
- [ ] Redirect to dashboard occurs

---

## 🆘 **Still Having Issues?**

### Debug Information to Collect

If Google OAuth still doesn't work, collect this information:

1. **Browser console errors** (full error messages)
2. **Network tab** (API request/response details)
3. **Server logs** (backend error messages)
4. **Environment check:**
```bash
# Run this and share output (remove actual secrets):
echo "VITE_GOOGLE_CLIENT_ID exists: $([ -n "$VITE_GOOGLE_CLIENT_ID" ] && echo "YES" || echo "NO")"
echo "Backend running: $(curl -s http://localhost:3001/api/health || echo "NO")"
echo "Database accessible: $(npm run db:studio --help > /dev/null && echo "YES" || echo "NO")"
```

5. **Google Console configuration screenshot** (Authorized origins and redirect URIs)

---

## 💡 **Pro Tips**

### Production Deployment

1. **Update Vercel environment variables:**
```bash
vercel env add VITE_GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_ID  
vercel env add GOOGLE_CLIENT_SECRET
```

2. **Update Google Console for production domain:**
   - Add your Vercel domain to authorized origins
   - Test on production URL

3. **Clear browser cache** after environment changes

### Security Best Practices

- Never commit `.env.local` to version control
- Use different Google OAuth clients for dev/staging/production
- Regularly rotate Google OAuth secrets
- Monitor authentication logs for suspicious activity

---

## ✅ **Success Indicators**

You know Google OAuth is working correctly when:

1. ✅ Google popup appears and completes authentication
2. ✅ Browser redirects back without errors
3. ✅ User is automatically logged in 
4. ✅ Profile page shows user information from Google
5. ✅ Database contains new user record with Google ID
6. ✅ User can access protected pages immediately

**🎯 Following this guide should resolve 99% of Google OAuth issues!**
