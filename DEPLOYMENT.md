# OnlyFur Platform - Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Environment variables configured

### Quick Deployment Commands

```bash
# 1. Check if environment is ready
npm run env-check

# 2. Full deployment (recommended)
npm run deploy

# 3. Quick deployment (if already set up)
npm run deploy:quick

# 4. Start production services only
npm run start

# 5. Check service health
npm run health-check
```

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env` file in the project root with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/onlyfur_db"

# JWT Secrets (generate strong random strings)
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# Admin Account
ADMIN_EMAIL="admin@onlyfur.net"
ADMIN_PASSWORD="your-secure-admin-password"

# Environment
NODE_ENV="production"
FRONTEND_URL="https://onlyfur.net"

# Optional: API Configuration
PORT="3001"
```

### Generating Secure JWT Secrets

```bash
# Generate JWT secrets (run these commands)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📋 Deployment Steps

### 1. Environment Check
```bash
npm run env-check
```
This validates all required files and environment variables.

### 2. Full Deployment
```bash
npm run deploy
```
This runs the complete deployment process:
- ✅ Environment validation
- 📦 Dependency installation
- 🗄️ Database setup and migrations
- 🏗️ Application build
- 🚀 Service startup
- 🏥 Health check verification
- 🔍 Final verification

### 3. Service Health Monitoring
```bash
npm run health-check
```
Checks all service endpoints and generates a health report.

## 🌐 Service Architecture

### API Server (`api/index.js`)
- **Port**: 3001 (configurable via PORT env var)
- **Health Check**: `GET /api/health`
- **Status**: `GET /api/status`

### Available API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/user/:username` - Get public user profile
- `GET /api/real-data/platform-stats` - Platform statistics

### Frontend
- **Development**: Port 5173 (Vite dev server)
- **Production**: Served from `dist/` directory

## 🔍 Service Monitoring

### Health Check Endpoints
- `/health` - Basic health check
- `/api/health` - Detailed API health check
- `/api/status` - Service status with uptime

### Monitoring Commands
```bash
# Check all services
npm run monitor

# Check API only
curl http://localhost:3001/api/health

# Check service status
curl http://localhost:3001/api/status
```

## 🛠️ Database Management

### Database Commands
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:deploy

# Seed database
npm run prisma:seed

# Database studio (GUI)
npm run prisma:studio

# Reset database (CAREFUL!)
npm run db:reset
```

### Database Schema
The platform uses PostgreSQL with Prisma ORM. Key models:
- `User` - User accounts and profiles
- `Content` - Creator content
- `Subscription` - User subscriptions
- `Message` - Messaging system
- `Transaction` - Payment records

## 🚀 Production Deployment

### Vercel Deployment
The platform is configured for Vercel deployment:

```bash
# Deploy to Vercel
vercel deploy --prod

# Set environment variables in Vercel
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add JWT_REFRESH_SECRET production
```

### Environment Variables for Vercel
Set these in your Vercel dashboard:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `FRONTEND_URL`

### Manual Server Deployment
```bash
# 1. Clone repository
git clone <repository-url>
cd onlyfur-platform

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your values

# 4. Deploy
npm run deploy

# 5. Use process manager for production
pm2 start api/index.js --name "onlyfur-api"
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Set
```bash
Error: Missing required environment variables
```
**Solution**: Run `npm run env-check` to see which variables are missing.

#### 2. Database Connection Failed
```bash
Error: Can't reach database server
```
**Solutions**:
- Check DATABASE_URL is correct
- Ensure database server is running
- Verify network connectivity
- Check database credentials

#### 3. Port Already in Use
```bash
Error: listen EADDRINUSE: address already in use :::3001
```
**Solutions**:
- Change PORT in .env file
- Kill existing processes: `pkill -f "node api/index.js"`
- Use different port: `PORT=3002 npm run start`

#### 4. Prisma Client Not Generated
```bash
Error: @prisma/client did not initialize yet
```
**Solution**: Run `npm run prisma:generate`

#### 5. Build Failures
```bash
Error: Build failed
```
**Solutions**:
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript errors: `npm run build`
- Verify all dependencies are installed

### Service Health Issues

If health checks fail:

1. **Check logs**: Look at console output for errors
2. **Verify database**: Ensure database is accessible
3. **Check ports**: Ensure no port conflicts
4. **Environment**: Validate all environment variables
5. **Dependencies**: Run `npm install` to ensure all packages are installed

### Debug Mode
```bash
# Run with debug logging
DEBUG=* npm run start

# Check specific service
curl -v http://localhost:3001/api/health
```

## 📊 Performance Monitoring

### Built-in Monitoring
- Health check endpoints report response times
- Database connection monitoring
- Memory usage tracking
- Uptime monitoring

### External Monitoring (Recommended)
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry
- **Performance**: New Relic, DataDog
- **Log aggregation**: LogDNA, Papertrail

## 🔒 Security Considerations

### Environment Security
- Use strong, unique JWT secrets
- Set NODE_ENV=production
- Use HTTPS in production
- Secure database credentials
- Regular security updates

### API Security
- JWT token authentication
- CORS protection
- Rate limiting (ready for implementation)
- Input validation
- SQL injection protection (Prisma ORM)

## 📞 Support

### Getting Help
1. Check this deployment guide
2. Run diagnostic scripts
3. Check logs for error details
4. Review environment configuration

### Deployment Status
Check deployment status with:
```bash
npm run health-check
```

This generates a detailed report showing:
- Service health status
- Database connectivity  
- API endpoint availability
- Environment configuration
- Performance metrics

---

## 🎯 Quick Reference

### Most Common Commands
```bash
npm run env-check     # Check deployment readiness
npm run deploy        # Full deployment
npm run start         # Start production services  
npm run health-check  # Verify service health
npm run monitor       # Monitor services
```

### Service URLs (Local)
- API Health: http://localhost:3001/api/health
- API Status: http://localhost:3001/api/status
- Frontend: http://localhost:5173 (dev)

### Production URLs
- Replace localhost with your domain
- Ensure HTTPS is configured
- Update FRONTEND_URL environment variable

## ✅ Current Deployment Status

**Environment Setup**: ✅ Complete
- Database URL configured
- JWT secrets set 
- Admin credentials ready
- Prisma client generated

**API Services**: ✅ Working
- Health check: `http://localhost:3001/api/health`
- Status endpoint: `http://localhost:3001/api/status`
- Authentication endpoints: Ready for testing

**Backend Services**: ✅ Ready
- Express v4.19.2 (stable)
- Prisma ORM configured
- Database connectivity verified
- CORS properly configured

**Deployment Commands**:
```bash
# Start all services
npm run start

# Health monitoring  
npm run health-check

# Environment validation
npm run env-check

# API only
npm run api:dev
```

## 🔧 Next Steps for Production

1. **Database Migration**: Run `npm run prisma:deploy` in production
2. **Vercel Deployment**: Use `vercel deploy --prod`
3. **Environment Variables**: Ensure all production env vars are set in Vercel
4. **SSL/HTTPS**: Automatic with Vercel
5. **Domain Configuration**: Point domain to Vercel deployment

## 🚨 Important Notes

- Express v4 is used for stability (v5 had compatibility issues)
- Prisma engine type set to "binary" for compatibility
- All critical services are operational
- Authentication system is functional
- Database connectivity verified
