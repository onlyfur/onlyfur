# OnlyFur Backend - Serverless Architecture

This backend is designed to work both with **Vercel's serverless functions** and **local development** environments.

## Architecture Overview

The backend has been refactored into modular components:

### Core Modules

- **`database.js`** - Database service with PostgreSQL connection and user management
- **`utils.js`** - JWT handling, email services, CORS, and utility functions
- **`routes.js`** - Route handlers factory for authentication and user management
- **`server.js`** - Local development server wrapper

### Entry Points

- **`api/index.js`** - Main serverless handler for Vercel deployment
- **`backend/server.js`** - Local development server

## Features

✅ **Authentication System**
- User registration and login
- Password reset functionality
- Google OAuth integration
- JWT token management
- Admin panel access

✅ **Database Integration**
- PostgreSQL with connection pooling
- Environment-based configuration
- Automatic admin user initialization
- User profile management

✅ **Email Services**
- SendGrid integration with fallback to mock emails
- Welcome emails
- Password reset emails
- HTML and text content

✅ **Development & Production**
- Works locally with `npm run dev:backend`
- Deploys to Vercel as serverless functions
- Environment variable support
- CORS handling for frontend

## Usage

### Local Development

```bash
# Start backend server locally
npm run dev:backend

# Or start both frontend and backend
npm run dev

# Test backend functionality
node backend/test-backend.js
```

The local server runs on `http://localhost:3001` with endpoints:
- Health check: `GET /api/health`
- API info: `GET /api`
- Authentication: `POST /api/auth/login`, `POST /api/auth/register`
- Admin panel: `GET /api/admin/panel`

### Vercel Deployment

The backend automatically works as serverless functions when deployed to Vercel:

1. **Environment Variables**: Set these in Vercel dashboard:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secret for JWT tokens
   - `JWT_REFRESH_SECRET` - Secret for refresh tokens
   - `ADMIN_EMAIL` - Admin user email
   - `ADMIN_PASSWORD` - Admin user password
   - `ADMIN_USERNAME` - Admin username
   - `CLIENT_BASE_URL` - Frontend URL
   - `SENDGRID_API_KEY` - (Optional) SendGrid for emails
   - `FROM_EMAIL` - Email sender address
   - `SUPPORT_EMAIL` - Support contact email

2. **Deployment**: Deploy using `vercel` CLI or GitHub integration

### Database Setup

The backend automatically:
- Connects to PostgreSQL using `DATABASE_URL`
- Initializes admin user on first connection
- Handles connection pooling for serverless functions

### Authentication Flow

1. **Registration**: `POST /api/auth/register`
   ```json
   {
     "email": "user@example.com",
     "username": "username",
     "displayName": "Display Name",
     "password": "password123"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **Google OAuth**: `POST /api/auth/google/login`
   ```json
   {
     "credential": "google_jwt_token"
   }
   ```

4. **Protected Routes**: Include `Authorization: Bearer <token>` header

## Configuration

### Environment Variables

Required:
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password
ADMIN_USERNAME=admin
```

Optional:
```env
CLIENT_BASE_URL=http://localhost:5174
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### CORS Configuration

CORS is automatically configured to allow:
- Frontend origin (`CLIENT_BASE_URL`)
- Common HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- Authorization headers
- Credentials for authentication

## Testing

```bash
# Test backend structure
node backend/test-backend.js

# Run all tests
npm test

# Test specific API endpoints
curl http://localhost:3001/api/health
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@onlyfur.net","password":"your-password"}'
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` environment variable
   - Ensure PostgreSQL is running and accessible
   - Verify network connectivity

2. **Admin User Issues**
   - Backend automatically creates/updates admin user
   - Check `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_USERNAME` env vars
   - Admin user is reactivated automatically if found inactive

3. **CORS Errors**
   - Verify `CLIENT_BASE_URL` matches frontend URL
   - Check browser developer tools for specific CORS issues

4. **Email Issues**
   - Without `SENDGRID_API_KEY`, emails are mocked (logged to console)
   - Verify sender email is verified in SendGrid dashboard

### Logs

- Local development: Console output shows detailed logs
- Vercel deployment: Check Vercel function logs in dashboard

## Migration from Old Backend

The new serverless backend replaces `backend/complete-auth-backend.js`. Key improvements:

- **Serverless Compatible**: Works with Vercel functions
- **Modular Architecture**: Separated concerns into focused modules
- **Environment Flexibility**: Same code works locally and on Vercel
- **Better Error Handling**: Improved error reporting and recovery
- **Connection Management**: Optimized for serverless cold starts

To switch to the new backend:
1. Update `package.json` scripts (already done)
2. Set environment variables on Vercel
3. Deploy to Vercel
4. The old `complete-auth-backend.js` can be archived

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/google/login` - Google OAuth login
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Admin
- `GET /api/admin/panel` - Admin panel access (requires admin role)

### System
- `GET /api/health` - Health check
- `GET /api` - API information and endpoints list

All endpoints support CORS and return JSON responses with appropriate HTTP status codes.
