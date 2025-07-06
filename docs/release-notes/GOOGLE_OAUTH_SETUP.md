# Google OAuth Setup Guide - Fix "redirect_uri_mismatch" Error

## 🚨 **Error Resolution: redirect_uri_mismatch**

The error you're experiencing occurs because the redirect URI in your Google Cloud Console doesn't match what your app is sending. Here's how to fix it:

---

## 📋 **EXACT REDIRECT URI NEEDED**

Your OnlyFur platform expects this **EXACT** redirect URI:

### **For Development (localhost)**
```
http://localhost:5173/auth/callback/google
```

### **For Production (your domain)**
```
https://yourdomain.com/auth/callback/google
```

**⚠️ IMPORTANT**: Replace `yourdomain.com` with your actual Vercel domain.

---

## 🔧 **Step-by-Step Google Cloud Console Setup**

### **Step 1: Access Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Enable the **Google+ API** if not already enabled

### **Step 2: Configure OAuth Consent Screen**
1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in required information:
   - **App name**: OnlyFur Platform
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue

### **Step 3: Create OAuth 2.0 Credentials**
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Configure as follows:

#### **Authorized JavaScript Origins**
```
http://localhost:5173
https://yourdomain.com
```

#### **Authorized Redirect URIs** (CRITICAL!)
```
http://localhost:5173/auth/callback/google
https://yourdomain.com/auth/callback/google
```

5. Click **CREATE**
6. Copy the **Client ID** and **Client Secret**

---

## 🔑 **Environment Variables Setup**

### **Add to Vercel Environment Variables:**

```bash
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Make sure these are also set for frontend access
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### **For Local Development (.env.local):**
```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## 🔍 **Troubleshooting Common Issues**

### **Issue 1: "redirect_uri_mismatch"**
- **Cause**: Redirect URI in Google Console doesn't match app
- **Solution**: Ensure EXACT match including `/auth/callback/google`

### **Issue 2: "access_denied"**
- **Cause**: App not verified or in testing mode
- **Solution**: Publish app or add test users in OAuth consent screen

### **Issue 3: "invalid_client"**
- **Cause**: Wrong Client ID or missing environment variables
- **Solution**: Double-check Client ID in environment variables

### **Issue 4: "unauthorized_client"**
- **Cause**: JavaScript origins not configured
- **Solution**: Add your domain to Authorized JavaScript origins

---

## 🧪 **Testing Your Configuration**

### **Step 1: Verify Environment Variables**
```bash
# Check if variables are loaded (run in browser console)
console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
```

### **Step 2: Test OAuth Flow**
1. Go to your login page
2. Click "Sign in with Google"
3. Should redirect to Google OAuth
4. After authorization, should redirect back to `/auth/callback/google`

### **Step 3: Check Network Tab**
- Open browser Developer Tools → Network tab
- Look for the OAuth request URL
- Verify `redirect_uri` parameter matches your Google Console configuration

---

## 📝 **Quick Checklist**

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Web application OAuth client created
- [ ] Authorized JavaScript origins added:
  - [ ] `http://localhost:5173`
  - [ ] `https://yourdomain.com`
- [ ] Authorized redirect URIs added:
  - [ ] `http://localhost:5173/auth/callback/google`
  - [ ] `https://yourdomain.com/auth/callback/google`
- [ ] Environment variables set in Vercel
- [ ] Environment variables set locally (if testing locally)

---

## 🔄 **Update Your Domain**

When you deploy to Vercel, your domain will be something like:
```
https://your-project-name.vercel.app
```

**You MUST update your Google Console redirect URIs to:**
```
https://your-project-name.vercel.app/auth/callback/google
```

---

## 💡 **Pro Tips**

### **Multiple Environments**
Add redirect URIs for all environments:
```
# Development
http://localhost:5173/auth/callback/google
http://localhost:3000/auth/callback/google

# Staging
https://staging-your-project.vercel.app/auth/callback/google

# Production
https://your-project.vercel.app/auth/callback/google
https://yourdomain.com/auth/callback/google
```

### **Debugging OAuth**
1. Enable detailed error logging in Google Console
2. Check browser network requests
3. Verify state parameter is being passed correctly
4. Test with Google OAuth Playground first

---

## 🚀 **Quick Fix Commands**

### **For Vercel Deployment:**
```bash
# Set environment variables via Vercel CLI
vercel env add VITE_GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Then redeploy
vercel --prod
```

---

## ✅ **Verification Steps**

After completing setup:

1. **Test locally** with `http://localhost:5173/auth/callback/google`
2. **Deploy to Vercel** and test with your Vercel domain
3. **Check OAuth flow** completes without errors
4. **Verify user is logged in** after callback

---

**🎯 Following this guide exactly should resolve your `redirect_uri_mismatch` error!**
