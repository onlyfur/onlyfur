# 🦊 OnlyFur Platform

**The complete creator platform with real-time content, subscriptions, and authentication.**

OnlyFur is a modern creator platform built with React, Node.js, PostgreSQL, and Prisma. It features real authentication, content management, subscription tiers, and a complete admin system.

## 🔧 **RECENT CORS & API FIXES**

**✅ CORS Error Spam RESOLVED!** (July 2025)

We fixed the severe CORS error issue causing thousands of console errors and browser crashes. Here's what was changed:

### **Key Fixes Applied:**
1. **🛡️ Centralized API Utility**: All API calls now use `createProductionApiCall()` from `/utils/productionApi.ts`
2. **🔄 Environment-Aware Requests**: API calls automatically adapt between development and production
3. **⏰ Reduced Polling**: Components now poll less frequently and only when visible
4. **🎯 Smart Rate Limiting**: Built-in debouncing and request throttling
5. **📡 Improved CORS Headers**: Backend allows all Vercel deployments with proper headers
6. **🔕 Error Throttling**: Prevents CORS error spam in console

### **Environment Variables Required:**
```bash
# Production (.env.production)
VITE_API_URL="/api"

# Development (.env.development)  
VITE_API_URL="http://localhost:3001/api"
```

### **Updated Components:**
- ✅ `HomeV3.tsx` - Feed and content loading
- ✅ `ExploreV3.tsx` - Search and discovery
- ✅ `MessagingV3.tsx` - Real-time messaging
- ✅ `CreatorDashboardV3.tsx` - Analytics and stats
- ✅ `ModerationDashboard.tsx` - Admin moderation
- ✅ `ProfileV3.tsx` - User profiles
- ✅ `NotificationCenter.tsx` - Notifications
- ✅ `ErrorBoundary.tsx` - Error reporting
- ✅ `OnlineStatusIndicator.tsx` - Reduced polling
- ✅ `AuthDebugger.tsx` - Development-only polling

### **API Usage Pattern:**
```typescript
// OLD (caused CORS spam):
const response = await fetch('/api/endpoint', options);
const data = await response.json();

// NEW (production-safe):
import { createProductionApiCall } from '@/utils/productionApi';
const apiCall = createProductionApiCall('/api/endpoint', options);
const data = await apiCall();
```

**🌐 CORS errors from Vercel deployments?**
- ✅ **FIXED!** API now automatically allows new development branches and preview URLs
- 🚀 **Auto-Allow System**: New Vercel deployments are automatically recognized and allowed
- 🔧 **Smart Pattern Matching**: 
  - Any `*.vercel.app` domain containing project keywords (`onlyfur`, `k3noxs-projects`, `creatorplattform`)
  - Git branch URLs: `projectname-git-branchname-username.vercel.app`
  - Local development: Any `localhost:*` or `127.0.0.1:*` port
- 📝 **No Manual Updates Needed**: New development branches work immediately without code changes
- 🔇 **Error Throttling**: CORS errors are limited to one per origin per minute to prevent console spam and browser crashes
- 🔍 **Logging**: Console logs show when new origins are auto-allowed for debuggingnagement, subscription tiers, and a complete admin system.

## 🚀 **Quick Start for New Developers**

**New to the project? Start here! 👇**

### **📋 Essential Setup (5 minutes)**

1. **Clone and install:**
   ```bash
   git clone [repository-url]
   cd creatorplattform
   npm install
   ```

2. **One-command setup:**
   ```bash
   npm run dev:backend
   ```
   
   This automatically:
   - 🔍 Detects your OS (Windows/macOS/Linux)
   - 🐘 Installs PostgreSQL (or uses Docker)
   - 🗄️ Sets up database with test users
   - 🔐 Starts authentication backend

3. **Start frontend:**
   ```bash
   npm run dev:frontend
   ```

4. **You're ready!** 🎉
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001
   - Login with: `demo@example.com` / `password123` (Test User)


### **📚 Required Reading for New Developers**

**Read these documents in order:**

1. **[📖 Documentation Overview](docs/README.md)** ⭐ **START HERE**
2. **[🔧 Local Development Setup](docs/development/LOCAL_DEVELOPMENT.md)**
3. **[🌍 Cross-Platform Setup](docs/development/CROSS_PLATFORM_SETUP.md)**

### **📖 Role-Specific Guides**

| Role | Essential Reading |
|------|------------------|
| **Frontend Developer** | [Local Setup](docs/development/LOCAL_DEVELOPMENT.md) → [Cross-Platform](docs/development/CROSS_PLATFORM_SETUP.md) |
| **Backend Developer** | [Local Setup](docs/development/LOCAL_DEVELOPMENT.md) → [Deployment](docs/deployment/) |
| **DevOps** | [Vercel Deployment](docs/deployment/VERCEL_DEPLOYMENT.md) → [Production Fixes](docs/deployment/VERCEL_FIX_COMPLETE.md) |
| **Project Manager** | [Documentation Overview](docs/README.md) → [Release Notes](docs/release-notes/CHANGELOG.md) |

## 📁 **Project Structure**

```
creatorplattform/
├── src/                   # Frontend React application
├── server/                # Backend authentication & APIs
├── api/                   # Vercel serverless functions
├── prisma/                # Database schema & migrations
├── scripts/               # Development automation scripts
├── env/                   # 🔐 Environment templates & examples
│   ├── .env.example       # Complete variable reference
│   ├── .env.development   # Development template
│   └── README.md          # Environment guide
├── docs/                  # 📖 All documentation
│   ├── development/       # Local setup guides
│   ├── deployment/        # Production deployment
│   ├── guides/            # Feature-specific guides
│   ├── troubleshooting/   # Problem-solving
│   └── release-notes/     # Version history
└── tests/                 # Test suites
```

## ⚙️ **Technology Stack**

| Component | Technology | Purpose |
|-----------|------------|----------|
| **Frontend** | React 19, Vite, TailwindCSS | Modern responsive UI |
| **Backend** | Node.js, Express | Authentication & API |
| **Database** | PostgreSQL, Prisma ORM | Data persistence |
| **Deployment** | Vercel, Neon Database | Production hosting |
| **Auth** | JWT tokens, bcrypt | Secure authentication |
| **Dev Tools** | ESLint, Jest, TypeScript | Code quality |

## 📈 **Features**

✅ **Authentication System**
- Email/password registration & login
- JWT token-based sessions
- Admin, Creator, and Subscriber roles
- Password reset functionality

✅ **User Management**
- Profile management
- Subscription tiers (Free, Basic, Pro)
- Role-based access control
- Admin panel for user management

✅ **Content System**
- Content creation and management
- Subscription-gated content
- Media upload and storage
- Content analytics

✅ **Development Experience**
- Cross-platform setup (Windows/macOS/Linux)
- Automated PostgreSQL installation
- Hot reloading for development
- Comprehensive testing suite

## 🛠️ **Development Commands**

### **🚀 Essential Commands**
```bash
# Quick start (recommended)
npm run dev:backend          # Setup & start backend
npm run dev:frontend          # Start frontend
npm run dev                   # Start both frontend & backend

# Cross-platform database setup
npm run postgres:setup        # Auto-install PostgreSQL
npm run postgres:docker       # Use Docker PostgreSQL
npm run env:create            # Create .env.development template
```

### **🗄️ Database Commands**
```bash
npm run db:setup              # Setup local database
npm run db:seed               # Seed with test users
npm run db:local              # Complete database setup
npm run prisma:studio         # Open database GUI
```

### **🔨 Build & Production**
```bash
npm run build                 # Build for production
npm run start                 # Start production server
npm run deploy                # Deploy to Vercel
```

### **🧪 Testing**
```bash
npm run test                  # Run all tests
npm run test:api              # Test API endpoints
npm run test:coverage         # Test with coverage
```

## 👥 **Test User Credentials**

**⚠️ IMPORTANT:** The app uses a real PostgreSQL database. Use these working credentials:

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| **Test User** | demo@example.com | password123 | Basic subscriber access |


**🔥 Having login issues?** See [AUTHENTICATION_FIX.md](AUTHENTICATION_FIX.md) for troubleshooting.

## 🌐 **Development URLs**

| Service | URL | Purpose |
|---------|-----|----------|
| **Frontend** | http://localhost:5173 | Main application |
| **Backend API** | http://localhost:3001 | Authentication & API |
| **Health Check** | http://localhost:3001/api/health | Service status |
| **Admin Panel** | http://localhost:3001/api/admin/panel | Admin interface |
| **Database GUI** | http://localhost:5555 | Prisma Studio |

## 📚 **Documentation**

**➡️ All documentation is in the [`docs/`](docs/) folder. Start with the [Documentation Overview](docs/README.md).**

### **📅 Quick Links**
- **[Getting Started](docs/README.md)** - Documentation overview
- **[Local Development](docs/development/LOCAL_DEVELOPMENT.md)** - Complete setup guide
- **[Cross-Platform Setup](docs/development/CROSS_PLATFORM_SETUP.md)** - Windows/macOS/Linux
- **[Deployment Guide](docs/deployment/VERCEL_DEPLOYMENT.md)** - Production deployment
- **[Troubleshooting](docs/troubleshooting/bugs.md)** - Common issues
- **[Release Notes](docs/release-notes/CHANGELOG.md)** - Version history

## 📋 **API Endpoints**

### **🔐 Authentication**
```
POST /api/auth/register      # Register new user
POST /api/auth/login         # Login user
GET  /api/auth/me            # Get current user profile
POST /api/auth/logout        # Logout user
POST /api/auth/reset-password # Password reset
```

### **👥 Users**
```
GET  /api/users              # Get users list (admin only)
GET  /api/users/:id          # Get user by ID
PUT  /api/users/:id          # Update user
GET  /user/:username         # Public user profile
```

### **📝 Content**
```
GET  /api/content            # Get content list
POST /api/content            # Create content
GET  /api/content/:id        # Get content by ID
PUT  /api/content/:id        # Update content
DELETE /api/content/:id      # Delete content
```

### **💳 Subscriptions**
```
GET  /api/subscriptions/tiers  # Get subscription tiers
POST /api/subscriptions/subscribe # Subscribe to tier
```

## 🛡️ **Security & Production**

⚠️ **Important for Production:**

1. **Change all default passwords**
2. **Use strong, random JWT secrets**
3. **Configure environment variables**
4. **Enable HTTPS**
5. **Set up rate limiting**
6. **Use secure database connections**

See [Deployment Guide](docs/deployment/VERCEL_DEPLOYMENT.md) for detailed production setup.

## 🔧 **Troubleshooting**

### **🐛 Common Issues**

**🖤 Black page on protected routes?**
- ✅ **FIXED!** Use real credentials: `demo@example.com` / `password123`
- ❌ Don't use mock credentials like `test@example.com` 
- 📋 See [AUTHENTICATION_FIX.md](AUTHENTICATION_FIX.md) for full details

**🌐 CORS errors from Vercel deployments?**
- ✅ **FIXED!** API now automatically allows new development branches and preview URLs
- 🚀 **Auto-Allow System**: New Vercel deployments are automatically recognized and allowed
- 🔧 **Smart Pattern Matching**: 
  - Any `*.vercel.app` domain containing project keywords (`onlyfur`, `k3noxs-projects`, `creatorplattform`)
  - Git branch URLs: `projectname-git-branchname-username.vercel.app`
  - Local development: Any `localhost:*` or `127.0.0.1:*` port
- 📝 **No Manual Updates Needed**: New development branches work immediately without code changes
- 🔇 **Error Throttling**: CORS errors are limited to one per origin per minute to prevent console spam and browser crashes
- 🔍 **Logging**: Console logs show when new origins are auto-allowed for debugging

**Other issues:**
- **Database connection failed**: Check PostgreSQL is running
- **Port already in use**: Change PORT in environment file
- **NPM install errors**: Delete `node_modules` and reinstall
- **Cross-platform issues**: See [Cross-Platform Setup](docs/development/CROSS_PLATFORM_SETUP.md)

### **🆘 Need Help?**
1. Check [troubleshooting docs](docs/troubleshooting/bugs.md)
2. Review [known issues](docs/troubleshooting/bugs.md)
3. Contact the development team

## 💯 **Contributing**

When contributing to the project:

1. **Read the [documentation](docs/README.md) first**
2. **Follow the development setup guide**
3. **Write tests for new features**
4. **Update documentation as needed**
5. **Follow the existing code style**

## 📋 **License & Support**

For support and questions:
- 📖 **Documentation**: [docs/](docs/)
- 🐛 **Issues**: Check [troubleshooting](docs/troubleshooting/bugs.md)
- 📝 **Release Notes**: [changelog](docs/release-notes/CHANGELOG.md)

---

**Happy coding! 🎉** Built with ❤️ by the OnlyFur team.

## ⚡ **BUNDLE OPTIMIZATION IMPROVEMENTS**

**✅ Bundle Size OPTIMIZED!** (July 2025)

We've significantly improved build performance and reduced bundle sizes through advanced code splitting and lazy loading.

### **Key Optimizations Applied:**
1. **📦 Smart Code Splitting**: Components are now split into logical chunks by feature area
2. **🔄 Lazy Loading**: All pages use React.lazy() for on-demand loading
3. **📊 Intelligent Chunking**: Related components are grouped (admin, help articles, platform pages)
4. **🗂️ Service Modularization**: Large services like `onlineStatusAPI` are split into smaller modules
5. **⏰ Dynamic Imports**: Heavy components load only when needed

### **Bundle Size Improvements:**
- **Main bundle**: Reduced from 1,384kB to 165kB (87% reduction!)
- **Total chunks**: Increased from 14 to 61 for better caching
- **Logical grouping**: 
  - Help articles: 410kB (lazy loaded)
  - Admin pages: 172kB (admin-only)
  - Platform pages: 43kB (public pages)
  - Creator tools: 53kB (creator-only)

### **Performance Benefits:**
- 🚀 **Faster initial load**: Only core components load immediately
- 📱 **Better mobile performance**: Smaller chunks load faster on slower connections  
- 🔄 **Improved caching**: Individual features can be cached separately
- 💾 **Reduced memory usage**: Unused features don't consume memory

### **Technical Details:**
```typescript
// Before: All imports loaded immediately
import Dashboard from '@/pages/Dashboard';
import CreatorDashboard from '@/pages/CreatorDashboard';
// ... 50+ imports

// After: Lazy loading with code splitting
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const CreatorDashboard = React.lazy(() => import('@/pages/CreatorDashboard'));
```

**🔧 Vite Configuration:**
- Manual chunk splitting by feature area
- 1.5MB chunk size warning limit
- Automatic vendor library grouping
- Route-based splitting for better UX
