# 🚨 Google OAuth Error Solution: "redirect_uri_mismatch"

## ❌ **Your Current Error**
```
Access blocked: This app's request is invalid
Error 400: redirect_uri_mismatch
```

## ✅ **IMMEDIATE SOLUTION**

### **Step 1: Find Your Exact Domain**
Go to your deployment URL. If it's:
- **Local development**: `http://localhost:5173`  
- **Vercel deployment**: `https://your-project-name.vercel.app`

### **Step 2: Configure Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID
3. Click the edit button (pencil icon)
4. Add these **EXACT** URIs:

#### **Authorized JavaScript Origins:**
```
http://localhost:5173
https://your-project-name.vercel.app
```

#### **Authorized Redirect URIs:**
```
http://localhost:5173/auth/callback/google
https://your-project-name.vercel.app/auth/callback/google
```

**⚠️ CRITICAL**: Replace `your-project-name.vercel.app` with your actual Vercel domain!

### **Step 3: Set Environment Variables**
In your Vercel dashboard, add:
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## 🛠️ **USE OUR DEBUGGING TOOL**

Visit `/auth/debug` on your site to get:
- ✅ Real-time configuration check
- ✅ Exact URIs to copy/paste
- ✅ Environment variable validation
- ✅ Direct links to Google Console

**Example**: `https://your-site.vercel.app/auth/debug`

---

## 🔍 **Common Mistakes**

### ❌ **Wrong Redirect URI**
```
❌ https://your-site.com/auth/google/callback
❌ https://your-site.com/oauth/callback
❌ https://your-site.com/callback
```

### ✅ **Correct Redirect URI**
```
✅ https://your-site.com/auth/callback/google
```

### ❌ **Missing Protocol**
```
❌ your-site.vercel.app
```

### ✅ **With Protocol**
```
✅ https://your-site.vercel.app
```

---

## 📋 **Quick Checklist**

- [ ] Added JavaScript origins to Google Console
- [ ] Added redirect URIs with `/auth/callback/google`
- [ ] Set `VITE_GOOGLE_CLIENT_ID` in Vercel environment
- [ ] Used exact domain (including `https://`)
- [ ] Redeployed after environment variable changes

---

## 🚀 **Test Your Fix**

1. Save changes in Google Console
2. Wait 5-10 minutes for propagation
3. Try Google login again
4. Should redirect to Google successfully
5. After approval, should redirect back to your site

---

## 💡 **Still Having Issues?**

### **Option 1: Use Our Debugger**
Visit `/auth/debug` on your site for detailed diagnosis

### **Option 2: Check Browser Console**
1. Open browser Developer Tools
2. Go to Network tab
3. Try Google login
4. Look for the OAuth request
5. Check if `redirect_uri` parameter matches your Google Console

### **Option 3: Verify Environment Variables**
Run in browser console:
```javascript
console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
```

---

## 🎯 **TL;DR Quick Fix**

1. **Get your domain**: Copy from browser address bar
2. **Open Google Console**: [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
3. **Edit OAuth client**: Add your domain + `/auth/callback/google`
4. **Set environment variables**: Add Google Client ID to Vercel
5. **Wait 5 minutes**: For changes to take effect
6. **Test**: Try Google login again

**Example configuration for `https://mysite.vercel.app`:**
```
JavaScript Origins: https://mysite.vercel.app
Redirect URIs: https://mysite.vercel.app/auth/callback/google
```

---

**🎉 Following these exact steps will fix your OAuth error!**
