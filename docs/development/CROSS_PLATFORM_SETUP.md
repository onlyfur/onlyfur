# 🌍 Cross-Platform Development Setup

This guide helps developers set up OnlyFur for local development across different operating systems with automatic PostgreSQL installation.

## 🚀 **Quick Start (All Platforms)**

### **One Command Setup**
```bash
npm run dev:backend
```

This automatically:
1. 📝 Creates `.env.development` template
2. 🔍 Detects your operating system
3. 🐘 Installs PostgreSQL using the best available method
4. 🗄️ Sets up `onlyfur_dev` database
5. 🌱 Seeds with test users
6. 🔐 Starts authentication backend

## 🎯 **Installation Strategies**

The setup tries multiple strategies in order:

### **1. Native Package Managers**
- **macOS**: Homebrew (`brew install postgresql@15`)
- **Windows**: Chocolatey or Scoop
- **Linux**: APT (Ubuntu/Debian) or YUM (CentOS/RHEL)

### **2. Docker (Recommended for Windows)**
- Uses `postgres:15-alpine` container
- Works on all platforms with Docker installed
- Isolated and consistent environment

### **3. SQLite Fallback**
- Used when PostgreSQL installation fails
- Development-only solution
- Some PostgreSQL-specific features may not work

## 📋 **Available Commands**

### **Cross-Platform Setup**
```bash
# Auto-detect and setup PostgreSQL for your platform
npm run postgres:setup

# Use Docker PostgreSQL (recommended for Windows)
npm run postgres:docker

# Full development setup
npm run dev:backend
```

### **Platform-Specific Setup**
```bash
# Create environment template
npm run env:create

# Setup local database
npm run db:setup

# Seed with test users
npm run db:seed
```

## 🖥️ **Platform-Specific Instructions**

### **🍎 macOS**
**Prerequisites:**
- Xcode Command Line Tools: `xcode-select --install`
- Homebrew (auto-installed if missing)

**Automatic Setup:**
```bash
npm run dev:backend
```

**Manual Setup:**
```bash
brew install postgresql@15
brew services start postgresql@15
npm run db:setup
```

### **🪟 Windows**
**Recommended: Docker Setup**
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Run: `npm run postgres:docker`
3. Run: `npm run db:seed`

**Alternative: Package Managers**
- **Chocolatey**: `choco install postgresql`
- **Scoop**: `scoop install postgresql`
- **Manual**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

**Automatic Setup:**
```bash
npm run dev:backend
```

### **🐧 Linux**
**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
npm run db:setup
```

**CentOS/RHEL:**
```bash
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
npm run db:setup
```

**Automatic Setup:**
```bash
npm run dev:backend
```

## 🐳 **Docker Setup (All Platforms)**

**Prerequisites:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed

**Quick Start:**
```bash
# Start PostgreSQL container
npm run postgres:docker

# Setup database schema and seed data
npm run db:seed

# Start backend
npm run dev:backend
```

**Manual Docker Commands:**
```bash
# Run PostgreSQL container
docker run -d \
  --name onlyfur_postgres_dev \
  -e POSTGRES_DB=onlyfur_dev \
  -e POSTGRES_USER=onlyfur_dev \
  -e POSTGRES_PASSWORD=onlyfur_password \
  -p 5432:5432 \
  postgres:15-alpine

# Stop container
docker stop onlyfur_postgres_dev

# Remove container
docker rm onlyfur_postgres_dev
```

## 💾 **SQLite Fallback**

If PostgreSQL installation fails, the system automatically falls back to SQLite:

**What happens:**
- Installs `better-sqlite3` package
- Creates `dev.db` file in project root
- Uses SQLite-compatible database schema
- Some PostgreSQL-specific features may not work

**Manual SQLite Setup:**
```bash
npm install better-sqlite3
# Edit .env.local to use: DATABASE_URL="file:./dev.db"
npm run dev:backend
```

## 🔧 **Troubleshooting**

### **Windows Issues**

**PowerShell Execution Policy:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Missing Package Managers:**
- Install [Chocolatey](https://chocolatey.org/install)
- Or install [Scoop](https://scoop.sh/)
- Or use Docker (recommended)

### **macOS Issues**

**Homebrew Installation:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**PostgreSQL Port Conflicts:**
```bash
# Check what's using port 5432
lsof -i :5432

# Kill conflicting process
sudo lsof -ti:5432 | xargs kill -9
```

### **Linux Issues**

**Permission Issues:**
```bash
# Add current user to postgres group
sudo usermod -a -G postgres $USER

# Create database with proper permissions
sudo -u postgres createdb onlyfur_dev
sudo -u postgres createuser onlyfur_dev
```

**Service Issues:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Enable auto-start
sudo systemctl enable postgresql
```

### **Docker Issues**

**Docker Not Running:**
- Start Docker Desktop
- Check: `docker --version`
- Restart Docker service

**Port Conflicts:**
```bash
# Check if port 5432 is in use
docker ps | grep 5432

# Stop conflicting containers
docker stop $(docker ps -q --filter "publish=5432")
```

### **Connection Issues**

**Database Connection Test:**
```bash
# PostgreSQL
psql -h localhost -p 5432 -U onlyfur_dev -d onlyfur_dev

# Check environment
cat .env.local
```

**Reset Everything:**
```bash
# Stop all services
docker stop onlyfur_postgres_dev 2>/dev/null
brew services stop postgresql@15 2>/dev/null

# Remove environment
rm .env.local

# Start fresh
npm run dev:backend
```

## 👥 **Default Test Users**

After setup, these accounts are available:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| ADMIN | admin@onlyfur.net | admin123 | Administrative access |
| CREATOR | creator@onlyfur.net | creator123 | Content creator account |
| SUBSCRIBER | subscriber@onlyfur.net | subscriber123 | Regular user account |
| SUBSCRIBER | user@example.com | test123 | Additional test account |

## 🌐 **Development URLs**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Database**: localhost:5432 (PostgreSQL) or file:./dev.db (SQLite)

## 📁 **Generated Files**

```
.env.local           # Local environment configuration
dev.db              # SQLite database file (if using SQLite)
env/
├── .env.example     # Environment variable reference
├── .env.development # Development template (auto-created)
└── README.md        # Environment configuration guide
scripts/
├── setup-postgres-cross-platform.js
├── setup-local-db.js
├── seed-local-db.js
└── start-dev-backend.js
```

## 🎉 **Success Indicators**

✅ **Successful Setup:**
- No error messages in terminal
- Backend starts on port 3001
- Health check responds: http://localhost:3001/api/health
- Can login with test users
- Database contains seeded data

⚠️ **Partial Setup (SQLite Fallback):**
- Warning about SQLite fallback
- Some PostgreSQL features may not work
- Development still possible

❌ **Failed Setup:**
- Error messages in terminal
- Backend doesn't start
- Can't connect to database

## 🤝 **Team Collaboration**

**For New Team Members:**
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev:backend`
4. Start coding!

**Cross-Platform Consistency:**
- Same database user/password across all platforms
- Same test data and user accounts
- Same API endpoints and functionality
- Environment variables automatically configured

## 🚀 **Ready to Code!**

Your cross-platform development environment is now ready! The setup automatically handles:
- Operating system detection
- PostgreSQL installation and configuration
- Database schema deployment
- Test user creation
- Backend service startup

Happy coding across all platforms! 🎯✨
