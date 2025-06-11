# OnlyFur Platform - Production Backend Setup

This guide will help you set up the production backend for the OnlyFur platform with PostgreSQL database and authentication.

## Prerequisites

Before starting, make sure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v13 or higher) running locally or remotely
- **npm** or **yarn** package manager

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

First, make sure PostgreSQL is running. Then create a database:

```sql
CREATE DATABASE onlyfur_db;
```

### 3. Environment Configuration

The `.env` file has been created with default settings. Update it with your database credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/onlyfur_db"

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"

# Server Configuration
PORT=3002
API_BASE_URL="http://localhost:3002"
CORS_ORIGIN="http://localhost:5173"

# Admin User (will be created automatically)
ADMIN_EMAIL="admin@onlyfur.com"
ADMIN_PASSWORD="admin123"
ADMIN_USERNAME="admin"
```

### 4. Initialize Database

Run the automated setup script:

```bash
npm start
```

This will:
- Generate Prisma client
- Run database migrations
- Seed the database with default data
- Build the application

### 5. Start the Production Server

```bash
npm run server:dev
```

The server will start on `http://localhost:3002`

## Manual Setup (Alternative)

If you prefer to run each step manually:

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed

# Build the application
npm run build

# Start production server
npm run server:prod
```

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server:dev` - Start backend development server
- `npm run server:prod` - Start production backend server
- `npm run build` - Build the application
- `npm start` - Run automated setup
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed the database
- `npm run db:reset` - Reset database (WARNING: Deletes all data)

## Default Users

After setup, these users will be available:

### Admin User
- **Email**: admin@onlyfur.com
- **Password**: admin123
- **Role**: ADMIN

### Test Users
- **Email**: test@example.com
- **Password**: password123
- **Role**: SUBSCRIBER

- **Email**: creator@example.com
- **Password**: password123
- **Role**: CREATOR

## API Endpoints

The backend provides these main endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get users list (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### Content
- `GET /api/content` - Get content list
- `POST /api/content` - Create content
- `GET /api/content/:id` - Get content by ID
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### Subscriptions
- `GET /api/subscriptions/tiers` - Get subscription tiers
- `POST /api/subscriptions/subscribe` - Subscribe to tier

## Database Management

### View Database
```bash
npm run prisma:studio
```

### Reset Database
```bash
npm run db:reset
```

### Create Migration
```bash
npx prisma migrate dev --name your_migration_name
```

## Production Deployment

For production deployment:

1. Set up a PostgreSQL database
2. Update environment variables in `.env`
3. Change JWT secrets to secure random strings
4. Run the setup: `npm start`
5. Start the server: `npm run server:prod`

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists and user has permissions

### Port Already in Use
- Change PORT in `.env` file
- Kill existing processes on port 3002

### Migration Errors
- Reset database: `npm run db:reset`
- Run setup again: `npm start`

### Frontend Connection Issues
- Ensure CORS_ORIGIN matches your frontend URL
- Check VITE_API_BASE_URL in `.env.local`

## Security Notes

⚠️ **Important for Production:**

1. Change all default passwords
2. Use strong, random JWT secrets
3. Use environment variables for sensitive data
4. Enable HTTPS in production
5. Configure proper CORS origins
6. Set up rate limiting
7. Use a secure database connection

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Check that all dependencies are installed

The backend includes comprehensive logging and error handling to help diagnose issues.
