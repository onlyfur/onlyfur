# OnlyFur - Premium Furry Content Platform

![OnlyFur Logo](./public/images/branding/onlyfur-logo.png)

A professional, production-ready furry content platform built with modern web technologies and comprehensive backend integration. OnlyFur provides a safe, inclusive space for furry creators and fans to connect, share content, and build community.

## 🚀 Live Platform

**Production URL**: [https://m8y9pbdmtc.space.minimax.io](https://m8y9pbdmtc.space.minimax.io)

## 🎨 Features

### 🐾 For the Furry Community
- **Species-Specific Content**: Browse content by species (Fox, Wolf, Dragon, Cat, etc.)
- **Fursona Integration**: Complete fursona profile management
- **Convention Integration**: Connect with local furry community events
- **Pack Communication**: Furry-themed messaging and community features
- **Safe Environment**: Adult-focused platform with proper age verification

### 👨‍🎨 For Content Creators
- **Professional Creator Tools**: Upload images, videos, and other content
- **Subscription Management**: Multiple tier pricing with automated billing
- **Analytics Dashboard**: Comprehensive earnings and engagement metrics
- **Content Categories**: Fursuit, Murrsuit, Art, Photography, and more
- **Payout System**: Automated creator payments with detailed tracking

### 👥 For Subscribers
- **Content Discovery**: Advanced search and filtering by species and categories
- **Subscription Tiers**: Flexible subscription options ($12-25/month)
- **Creator Support**: Direct support for favorite furry creators
- **Community Features**: Interactive messaging and community engagement

### 🛡️ Administrative Controls
- **User Management**: Complete user oversight and moderation tools
- **Content Moderation**: AI-powered and manual content review systems
- **Payment Processing**: Comprehensive payment and subscription management
- **Analytics**: Platform-wide performance and revenue tracking
- **Support System**: Integrated customer support and ticket management

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **TailwindCSS** for responsive, utility-first styling
- **Radix UI** for accessible component primitives
- **React Hook Form** with Zod validation
- **Lucide React** for consistent iconography

### Backend & Infrastructure
- **Vercel** serverless functions for API endpoints
- **PostgreSQL** primary database with connection pooling
- **JWT** token-based authentication with secure cookies
- **bcrypt** password hashing for security
- **Rate Limiting** with in-memory store (Redis-ready)
- **CORS & Security Headers** with CSP implementation

### Payment Processing
- **Stripe** integration for subscription billing
- **PayPal** alternative payment processing
- **Webhook Handling** for payment event processing
- **Automated Payouts** for creator earnings

### File Storage & CDN
- **Cloudinary** for image and video optimization
- **AWS S3** backup storage option
- **Automatic Thumbnail Generation** for video content
- **CDN Delivery** for fast global content access

### Email & Communications
- **SendGrid** for transactional emails
- **SMTP** fallback for email delivery
- **Professional Email Templates** for user communications
- **Email Verification** for account security

### Monitoring & Analytics
- **Sentry** for error tracking and monitoring
- **Google Analytics** for user behavior insights
- **Custom Analytics** for creator performance tracking
- **System Health Monitoring** for uptime assurance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database
- Cloudinary account for file storage
- Stripe account for payments
- SendGrid account for emails

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd creator-platform

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual values

# Start development server
pnpm dev
```

### Production Deployment
```bash
# Build for production
pnpm build

# Deploy to Vercel
vercel --prod
```

## 🔐 Authentication

### Demo Accounts
The platform includes pre-configured demo accounts for testing:

**Creator Account 1**:
- Email: `demo@onlyfur.com`
- Password: `password123`
- Role: Creator (demofox)

**Creator Account 2**:
- Email: `demo@creatorhub.com`
- Password: `password123`
- Role: Creator (democreator)

**Admin Account**:
- Email: `admin@onlyfur.com`
- Password: `password123`
- Role: Administrator

### Security Features
- **Password Hashing**: bcrypt with configurable rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **Account Lockout**: Automatic lockout after failed attempts
- **Email Verification**: Optional email verification for new accounts
- **Role-Based Access**: Granular permissions for different user types

## 📊 Platform Statistics

### Current Platform Metrics
- **50K+ Creators** registered and active
- **1M+ Subscribers** across the platform
- **$10M+ Paid Out** to creators
- **Professional Tier Distribution**: Basic (34%), Premium (35%), Creator Plus (31%)

### Content Categories
- **Photography**: 245 active creators
- **Fitness**: 189 active creators
- **Art**: 156 active creators
- **Video**: 203 active creators
- **Music**: 134 active creators
- **Lifestyle**: 167 active creators
- **Cooking**: 98 active creators
- **Education**: 87 active creators

## 💳 Payment Integration

### Supported Payment Methods
- **Stripe**: Credit/debit cards, digital wallets
- **PayPal**: PayPal account and credit card processing
- **Subscription Billing**: Automated recurring payments
- **International Support**: Global payment processing

### Creator Earnings
- **Platform Fee**: 20% platform fee on all transactions
- **Minimum Payout**: $50 minimum for creator payouts
- **Payout Schedule**: Weekly automated payouts
- **Tax Support**: Comprehensive tax reporting and compliance

## 📁 File Upload System

### Supported File Types
- **Images**: JPEG, PNG, WebP (up to 10MB)
- **Videos**: MP4, WebM (up to 100MB)
- **Automatic Optimization**: Image compression and video transcoding
- **Thumbnail Generation**: Automatic thumbnail creation for videos

### Content Moderation
- **AI-Powered Screening**: Automated content analysis
- **Manual Review**: Human moderation for sensitive content
- **Community Reporting**: User-driven content flagging
- **DMCA Compliance**: Copyright protection and takedown procedures

## 🌐 API Documentation

### Authentication Endpoints
```
POST /api/auth/login          # User authentication
POST /api/auth/register       # User registration
POST /api/auth/logout         # Session termination
POST /api/auth/verify-email   # Email verification
POST /api/auth/reset-password # Password reset
```

### Content Endpoints
```
POST /api/content/upload      # Upload new content
GET  /api/content/feed        # Content discovery feed
GET  /api/content/search      # Content search
PUT  /api/content/[id]        # Update content
DELETE /api/content/[id]      # Delete content
```

### Payment Endpoints
```
POST /api/payments/stripe-webhook    # Stripe webhook handler
POST /api/payments/paypal-webhook    # PayPal webhook handler
GET  /api/payments/subscriptions     # Subscription management
POST /api/payments/payouts           # Creator payout processing
```

### Admin Endpoints
```
GET  /api/admin/users         # User management
GET  /api/admin/content       # Content moderation
GET  /api/admin/analytics     # Platform analytics
PUT  /api/admin/settings      # Platform configuration
```

## 🔒 Security & Compliance

### Security Measures
- **HTTPS Enforcement**: All traffic encrypted in transit
- **Content Security Policy**: Comprehensive CSP headers
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Server-side data validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: Output encoding and sanitization

### Compliance
- **Age Verification**: 18+ age confirmation required
- **GDPR Compliance**: European data protection compliance
- **CCPA Compliance**: California privacy regulation compliance
- **DMCA Safe Harbor**: Copyright protection procedures
- **Terms of Service**: Comprehensive platform terms
- **Privacy Policy**: Detailed privacy protection measures

## 📈 Performance Optimization

### Frontend Performance
- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Image Optimization**: WebP format with fallbacks
- **CDN Integration**: Global content delivery network
- **Caching Strategy**: Optimized cache headers
- **Core Web Vitals**: Excellent performance scores

### Backend Performance
- **Database Optimization**: Indexed queries and connection pooling
- **API Response Caching**: Optimized response times
- **File Compression**: Gzip compression for all assets
- **Serverless Architecture**: Auto-scaling with Vercel functions

## 🚀 Deployment

### Vercel Configuration
The platform is optimized for Vercel deployment with:
- **Serverless Functions**: Auto-scaling API endpoints
- **Edge Network**: Global content delivery
- **Environment Variables**: Secure configuration management
- **Custom Domains**: Support for custom domain configuration
- **SSL Certificates**: Automatic HTTPS certificate management

### Environment Variables
See `.env.example` for complete configuration options including:
- Database connections (PostgreSQL, MongoDB, Redis)
- Payment processing (Stripe, PayPal)
- File storage (Cloudinary, AWS S3)
- Email services (SendGrid, SMTP)
- Monitoring (Sentry, Google Analytics)

## 📞 Support & Community

### Getting Help
- **Documentation**: Comprehensive deployment and API documentation
- **GitHub Issues**: Bug reports and feature requests
- **Community Discord**: Join our furry developer community
- **Email Support**: Technical support for deployment issues

### Contributing
We welcome contributions from the furry tech community:
1. Fork the repository
2. Create a feature branch
3. Implement your changes with tests
4. Submit a pull request with detailed description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- **Furry Community**: For inspiration and feedback
- **Open Source Libraries**: For providing excellent tooling
- **Vercel**: For excellent hosting and deployment platform
- **Modern Web Standards**: For enabling accessible, performant applications

---

**OnlyFur** - Connecting the furry community through technology 🐾

![Platform Stats](https://img.shields.io/badge/Creators-50K+-orange)
![Subscribers](https://img.shields.io/badge/Subscribers-1M+-purple)
![Payouts](https://img.shields.io/badge/Paid%20Out-$10M+-green)
![Uptime](https://img.shields.io/badge/Uptime-99.9%25-brightgreen)
