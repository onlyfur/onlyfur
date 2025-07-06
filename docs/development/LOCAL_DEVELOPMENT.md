# 🚀 Local Development Setup

This document explains how to set up OnlyFur for local development with an automatically configured PostgreSQL database.

## ✨ **Quick Start**

The easiest way to start local development:

```bash
npm run dev
```

This single command will:
1. 📝 **Auto-create .env.development** (if missing)
2. 🐘 **Auto-install PostgreSQL** (if not installed)
3. 🗄️ **Create local database** (`onlyfur_dev` on port 5432)
4. 🌱 **Seed with default users**
5. 🔐 **Start authentication backend**
6. 🌐 **Start frontend**

## 📋 **Available Scripts**

### **Main Development Commands**
- `npm run dev` - Start both frontend and backend with auto-setup
- `npm run dev:frontend` - Start only the frontend (Vite)
- `npm run dev:backend` - Start only the backend with auto-setup

### **Database Management**
- `npm run db:setup` - Set up local PostgreSQL database
- `npm run db:seed` - Seed database with default users
- `npm run db:local` - Complete local database setup (setup + seed)
- `npm run env:create` - Create .env.development template for new developers

### **Manual Control**
- `npm run dev:backend:simple` - Start backend without auto-setup
- `npm run prisma:studio` - Open Prisma Studio for database management

## 🗄️ **Local Database Configuration**

### **Automatic Setup**
- **Database Name**: `onlyfur_dev`
- **User**: `onlyfur_dev`
- **Password**: `onlyfur_password`
- **Port**: `5432` (standard PostgreSQL port)
- **Host**: `localhost`

### **Connection String**
```
postgresql://onlyfur_dev:onlyfur_password@localhost:5432/onlyfur_dev
```

## 👥 **Default Test Users**

After running `npm run dev`, these users are automatically created:

### **Admin Account**
- **Email**: `admin@onlyfur.net`
- **Password**: `admin123`
- **Role**: ADMIN

### **Creator Account**
- **Email**: `creator@onlyfur.net`
- **Password**: `creator123`
- **Role**: CREATOR

### **Subscriber Accounts**
- **Email**: `subscriber@onlyfur.net`
- **Password**: `subscriber123`
- **Role**: SUBSCRIBER

- **Email**: `user@example.com`
- **Password**: `test123`
- **Role**: SUBSCRIBER

## 🌐 **Development URLs**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Prisma Studio**: http://localhost:5555 (when running)

## 🔧 **Manual Setup (If Needed)**

If automatic setup fails, you can set up manually:

### **1. Install PostgreSQL**
```bash
brew install postgresql@15
brew services start postgresql@15
```

### **2. Create Database**
```bash
createuser -s onlyfur_dev
createdb -U onlyfur_dev onlyfur_dev
psql -U onlyfur_dev -c "ALTER USER onlyfur_dev PASSWORD 'onlyfur_password';"
```

### **3. Set Up Environment**
```bash
npm run db:setup
npm run db:seed
```

### **4. Start Development**
```bash
npm run dev
```

## 🐞 **Troubleshooting**

### **PostgreSQL Issues**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if not running
brew services start postgresql@15

# Check database connection
psql -h localhost -p 5432 -U onlyfur_dev -d onlyfur_dev
```

### **Reset Everything**
```bash
# Stop PostgreSQL
brew services stop postgresql@15

# Remove local database files (careful!)
rm -rf /usr/local/var/postgresql@15

# Restart setup
brew services start postgresql@15
npm run db:setup
```

### **Environment Issues**
```bash
# Check environment variables
cat .env.local

# Regenerate environment
rm .env.local
npm run db:setup
```

## 📁 **File Structure**

```
scripts/
├── setup-local-db.js      # PostgreSQL setup automation
├── seed-local-db.js       # Database seeding with default users
├── start-dev-backend.js   # Enhanced backend startup
└── create-env-template.js # Auto-create environment templates

env/
├── .env.example           # Complete environment variable reference
├── .env.development       # Development template (auto-created)
└── README.md              # Environment configuration guide

.env.local                 # Auto-generated local environment
LOCAL_DEVELOPMENT.md       # This file
```

## 🔄 **Development Workflow**

### **Starting Development**
1. `npm run dev` - One command setup
2. Open http://localhost:5173
3. Login with any test user
4. Start coding!

### **Database Changes**
1. Modify `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Restart backend if needed

### **Adding New Test Users**
1. Edit `scripts/seed-local-db.js`
2. Run `npm run db:seed`

## 🌟 **Benefits of This Setup**

- ✅ **Zero manual configuration** required
- ✅ **Auto-creates .env.development template** for new developers
- ✅ **Automatic PostgreSQL installation** via Homebrew
- ✅ **Team-standard database setup** (onlyfur_dev user/database)
- ✅ **Pre-seeded with test users**
- ✅ **Real database authentication** (no mocks)
- ✅ **Easy reset and regeneration**
- ✅ **Compatible with all team members**

## 🚀 **Ready to Code!**

Your local development environment is now fully configured with:
- Real PostgreSQL database
- Complete authentication system
- Test users ready to use
- Hot reloading frontend
- Automatic database management

Happy coding! 🎉
