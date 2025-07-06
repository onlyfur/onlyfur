# 🔐 Environment Configuration

This folder contains all environment configuration templates and examples for different deployment environments.

## 📁 **File Structure**

```
env/
├── README.md              # This documentation
├── .env.example           # Template with all possible variables
├── .env.development       # Development environment template
└── .env.production        # Production environment configuration
```

## 📋 **Environment Files**

### **`.env.example`** - Complete Template
- Contains all possible environment variables
- Used as reference for new environments
- Safe to commit to version control
- **No sensitive data**

### **`.env.development`** - Development Template
- Template for local development
- Auto-created by development scripts if missing
- Contains development-safe defaults
- **No sensitive data**

### **`.env.production`** - Production Configuration
- Real production environment variables
- Contains sensitive data (secrets, API keys)
- **Should be in .gitignore**

## 🔧 **Local Development Files**

These files are created automatically during development and should **NOT** be in version control:

- **`.env`** - Main environment file (created from templates)
- **`.env.local`** - Local overrides (auto-generated)

## 🚀 **Usage**

### **For New Developers:**
```bash
# Environment files are created automatically
npm run dev:backend
```

### **For Manual Setup:**
```bash
# Copy template to create your local environment
cp env/.env.development .env.local

# Edit the file with your local settings
nano .env.local
```

### **Environment Loading Order:**
1. `.env.local` (highest priority - local overrides)
2. `.env` (main environment file)
3. `env/.env.development` (development template)
4. Default values in code

## 🔒 **Security Notes**

### **Safe to Commit:**
- ✅ `env/.env.example`
- ✅ `env/.env.development`

### **Never Commit:**
- ❌ `.env` (may contain secrets)
- ❌ `.env.local` (local configuration)
- ❌ `.env.production` (production secrets)

### **Production Security:**
- Use strong, random secrets
- Never expose API keys
- Use environment-specific database URLs
- Enable HTTPS in production

## 📖 **Environment Variables Reference**

### **Database Configuration**
```bash
DATABASE_URL="postgresql://user:password@host:port/database"
```

### **JWT Authentication**
```bash
JWT_SECRET="your-super-secret-key-minimum-32-characters"
JWT_REFRESH_SECRET="your-refresh-secret-key-minimum-32-characters"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"
```

### **Server Configuration**
```bash
NODE_ENV="development|production"
PORT="3001"
CLIENT_BASE_URL="http://localhost:5173"
CORS_ORIGIN="http://localhost:5173"
```

### **Admin Account**
```bash
ADMIN_EMAIL="admin@onlyfur.net"
ADMIN_PASSWORD="secure-password"
ADMIN_USERNAME="admin"
```

### **Email Configuration**
```bash
FROM_EMAIL="noreply@onlyfur.local"
FROM_NAME="OnlyFur Development"
SUPPORT_EMAIL="support@onlyfur.local"
SENDGRID_API_KEY="optional-for-real-emails"
```

### **OAuth Configuration**
```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:5173/auth/callback/google"
```

### **Platform Settings**
```bash
PLATFORM_NAME="OnlyFur Development"
PLATFORM_COMMISSION_RATE="0.10"
MINIMUM_PAYOUT_AMOUNT="50.00"
```

## 🔄 **Development Workflow**

1. **Clone repository**
2. **Run `npm run dev:backend`** (auto-creates environment files)
3. **Customize `.env.local`** if needed
4. **Start development**

## 🆘 **Troubleshooting**

### **Environment File Missing:**
```bash
# Recreate development environment template
npm run env:create
```

### **Database Connection Issues:**
```bash
# Check your DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL
```

### **Reset Environment:**
```bash
# Remove local files and start fresh
rm .env .env.local
npm run dev:backend
```

## 📚 **Related Documentation**

- [Local Development Setup](../docs/development/LOCAL_DEVELOPMENT.md)
- [Cross-Platform Setup](../docs/development/CROSS_PLATFORM_SETUP.md)
- [Deployment Guide](../docs/deployment/VERCEL_DEPLOYMENT.md)

---

**Keep your secrets secure! 🔐**
