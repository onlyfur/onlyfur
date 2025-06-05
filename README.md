# 🐾 OnlyFur - Premium Furry Content Platform

![OnlyFur Platform](https://img.shields.io/badge/OnlyFur-Platform-purple?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-Private-red.svg?style=for-the-badge)

A comprehensive subscription-based platform for furry content creators and their fans, featuring multi-tier subscriptions, content access controls, messaging systems, and creator management tools.

## 🚀 **Live Demo**
**Production URL**: https://kaz5hhu2yx.space.minimax.io

## ✨ **Key Features**

### 🎭 **For Creators**
- **Creator Studio Dashboard** - Complete content management interface
- **Multi-Tier Subscription System** - Basic, Pro, Premium creator tiers
- **Content Access Control** - Set visibility by subscriber tier
- **Messaging Permissions** - Control which subscribers can message you
- **Analytics & Earnings** - Track performance and revenue
- **Content Upload** - Support for images, videos, and text content

### 👥 **For Subscribers**
- **Tiered Subscriptions** - Basic ($9.99), Pro ($29.99), VIP ($59.99)
- **Smart Content Access** - Newest posts visible, other content gated by subscription
- **Creator Messaging** - Communicate with creators based on your tier
- **Exclusive Content** - Access premium content based on subscription level
- **Mobile-Optimized** - Perfect experience on all devices

### 🛡️ **Platform Features**
- **Google OAuth Integration** - Quick signup/login with Google
- **PostgreSQL Database** - Production-ready with Neon integration
- **Vercel Blob Storage** - Efficient file storage and management
- **Role-Based Access** - Different experiences for creators, subscribers, and admins
- **Responsive Design** - Mobile-first approach with PWA capabilities
- **Real-Time Messaging** - Instant communication between users

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **TailwindCSS** + **Radix UI** for modern design
- **React Router** for SPA navigation
- **Zustand** for state management

### **Backend**
- **Node.js** with Express.js
- **PostgreSQL** with Prisma ORM
- **JWT Authentication** with Google OAuth
- **Vercel Blob** for file storage
- **Real-time WebSocket** support

### **Deployment**
- **Vercel** for hosting and deployment
- **Neon** for PostgreSQL database
- **GitHub** for version control
- **CI/CD** with automatic deployments

## 📱 **Mobile Optimization**

The platform is fully optimized for mobile devices with:
- **Touch-friendly interactions** with proper tap targets
- **PWA capabilities** for app-like experience
- **Responsive layout** that adapts to all screen sizes
- **Mobile-specific navigation** with back buttons and drawer menus
- **Optimized performance** for mobile networks
- **Safe area handling** for modern mobile devices

## 🔧 **Environment Setup**

### **Required Environment Variables**

#### **CRITICAL (Must configure for production):**
```bash
# Google OAuth (REQUIRED for login)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Basic Configuration
NODE_ENV=production
VITE_API_URL=https://your-domain.vercel.app/api
JWT_SECRET=your-secure-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

#### **Payment Processing (For subscriptions):**
```bash
# Stripe
STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

#### **Optional Enhancements:**
```bash
# Cloudinary (for image processing)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Email notifications
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_FROM=noreply@your-domain.com
```

### **Quick Setup Guide**

1. **Google OAuth Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Copy Client ID and Secret to environment variables

2. **Database Setup**:
   - Your Neon PostgreSQL is already configured
   - Database variables are automatically set by Neon integration

3. **Deploy to Vercel**:
   ```bash
   npm run build
   vercel --prod
   ```

## 🚀 **Getting Started**

### **Development Setup**
```bash
# Clone the repository
git clone https://github.com/K3NOXOFFICIAL/creatorplattform.git
cd creatorplattform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

### **Production Deployment**
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 📊 **Subscription Tiers**

### **Subscriber Tiers**
| Tier | Price | Features |
|------|-------|----------|
| **Basic** | $9.99/month | Basic content access, limited messaging |
| **Pro** | $29.99/month | Premium content, enhanced messaging, priority support |
| **VIP** | $59.99/month | All content, unlimited messaging, exclusive features |

### **Creator Tiers**
| Tier | Price | Features |
|------|-------|----------|
| **Basic** | Free | Basic tools, limited subscribers |
| **Pro** | $19.99/month | Advanced analytics, unlimited subscribers |
| **Premium** | $49.99/month | All features, priority support, advanced tools |

## 📁 **Project Structure**

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── content/         # Content-related components
│   ├── messaging/       # Messaging system
│   ├── subscription/    # Pricing and subscription
│   └── ui/              # Base UI components
├── pages/               # Main application pages
│   ├── admin/           # Admin dashboard pages
│   └── ...              # Other pages
├── contexts/            # React context providers
├── services/            # API services and utilities
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

## 🔒 **Security Features**

- **JWT Authentication** with secure token handling
- **Role-based access control** (Creator, Subscriber, Admin)
- **Input validation** and sanitization
- **CORS configuration** for secure API access
- **Rate limiting** to prevent abuse
- **Content moderation** capabilities

## 📈 **Performance Optimizations**

- **Code splitting** for optimal bundle sizes
- **Lazy loading** for improved initial load times
- **Image optimization** with responsive loading
- **Caching strategies** for better performance
- **Mobile-first design** for faster mobile experience

## 🤝 **Contributing**

This is a private project. For any questions or issues:
- Contact: [support@onlyfur.com](mailto:support@onlyfur.com)
- Issues: Use the GitHub Issues tab

## 📝 **License**

Private/Commercial License - All rights reserved.

## 🆘 **Support**

For technical support or questions:
- **Email**: support@onlyfur.com
- **Documentation**: Check the `/docs` folder
- **Environment Guide**: See `VERCEL_ENV_SETUP.md`

---

**🎉 Ready to launch your furry content platform!**

Configure your environment variables, deploy to Vercel, and start building your community of creators and fans.
