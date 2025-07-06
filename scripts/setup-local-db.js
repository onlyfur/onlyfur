#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { setupPostgreSQL: setupCrossPlatform } = require('./setup-postgres-cross-platform.js');

// Configuration - will be determined dynamically
let DB_CONFIG = {
  name: 'onlyfur_dev',
  user: 'onlyfur_dev',
  password: 'onlyfur_password',
  port: '5432',  // Default, will be detected
  host: 'localhost'
};

const DATABASE_URL = `postgresql://${DB_CONFIG.user}:${DB_CONFIG.password}@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.name}`;

console.log('🐘 Setting up Local PostgreSQL Development Database...');
console.log('===============================================');

// Check for running PostgreSQL instances
function detectPostgreSQL() {
  return new Promise((resolve, reject) => {
    console.log('🔍 Detecting PostgreSQL instances...');
    
    // Check if PostgreSQL is running on common ports
    const commonPorts = ['5432', '5433', '5434'];
    let foundInstance = null;
    
    const checkPort = (port) => {
      return new Promise((portResolve) => {
        exec(`lsof -i :${port}`, (error, stdout, stderr) => {
          if (!error && stdout.includes('postgres')) {
            console.log(`✅ Found PostgreSQL running on port ${port}`);
            portResolve({ port, running: true });
          } else {
            portResolve({ port, running: false });
          }
        });
      });
    };
    
    Promise.all(commonPorts.map(checkPort)).then(results => {
      const runningInstance = results.find(result => result.running);
      
      if (runningInstance) {
        DB_CONFIG.port = runningInstance.port;
        console.log(`🎯 Using existing PostgreSQL on port ${runningInstance.port}`);
        resolve({ hasPostgreSQL: true, running: true, port: runningInstance.port });
      } else {
        // Check if PostgreSQL is installed but not running
        exec('which postgres', (error, stdout, stderr) => {
          if (error) {
            console.log('📦 PostgreSQL not installed, will install it');
            resolve({ hasPostgreSQL: false, running: false, port: '5432' });
          } else {
            console.log('✅ PostgreSQL installed at:', stdout.trim());
            console.log('🚀 PostgreSQL not running, will start it');
            DB_CONFIG.port = '5432';
            resolve({ hasPostgreSQL: true, running: false, port: '5432' });
          }
        });
      }
    });
  });
}

// Install PostgreSQL via Homebrew
function installPostgreSQL() {
  return new Promise((resolve, reject) => {
    console.log('📦 Installing PostgreSQL via Homebrew...');
    
    // Try to detect which version to install
    exec('brew search postgresql', (error, stdout, stderr) => {
      let version = 'postgresql@15'; // Default
      if (stdout.includes('postgresql@14')) {
        version = 'postgresql@14';
      }
      
      console.log(`📦 Installing ${version}...`);
      const install = spawn('brew', ['install', version], { stdio: 'inherit' });
      
      install.on('close', (code) => {
        if (code === 0) {
          console.log('✅ PostgreSQL installed successfully');
          resolve();
        } else {
          console.error('❌ Failed to install PostgreSQL');
          reject(new Error('PostgreSQL installation failed'));
        }
      });
    });
  });
}

// Start PostgreSQL service
function startPostgreSQL() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting PostgreSQL service...');
    
    // Try different PostgreSQL versions
    const versions = ['postgresql@14', 'postgresql@15', 'postgresql'];
    
    const tryStartVersion = (versionIndex) => {
      if (versionIndex >= versions.length) {
        console.log('✅ PostgreSQL service management completed');
        resolve();
        return;
      }
      
      const version = versions[versionIndex];
      exec(`brew services start ${version}`, (error, stdout, stderr) => {
        if (error) {
          console.log(`⚠️  ${version} not available or already running`);
          tryStartVersion(versionIndex + 1);
        } else {
          console.log(`✅ ${version} service started`);
          resolve();
        }
      });
    };
    
    tryStartVersion(0);
  });
}

// Check if database exists
function checkDatabase() {
  return new Promise((resolve, reject) => {
    exec(`psql -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -U ${DB_CONFIG.user} -d ${DB_CONFIG.name} -c "SELECT 1;"`, (error, stdout, stderr) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// Create database user
function createUser() {
  return new Promise((resolve, reject) => {
    console.log(`👤 Creating database user: ${DB_CONFIG.user}...`);
    exec(`createuser -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -s ${DB_CONFIG.user} 2>/dev/null || echo "User might already exist"`, (error, stdout, stderr) => {
      // Set password for user
      exec(`psql -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -c "ALTER USER ${DB_CONFIG.user} PASSWORD '${DB_CONFIG.password}';"`, (error2, stdout2, stderr2) => {
        if (error2) {
          console.log('⚠️  User password setting failed (user might already exist)');
        } else {
          console.log('✅ User password set successfully');
        }
        resolve();
      });
    });
  });
}

// Create database
function createDatabase() {
  return new Promise((resolve, reject) => {
    console.log(`🗄️  Creating database: ${DB_CONFIG.name}...`);
    exec(`createdb -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -U ${DB_CONFIG.user} ${DB_CONFIG.name}`, (error, stdout, stderr) => {
      if (error) {
        if (error.message.includes('already exists')) {
          console.log('✅ Database already exists');
        } else {
          console.log('⚠️  Database creation failed (might already exist)');
        }
      } else {
        console.log('✅ Database created successfully');
      }
      resolve();
    });
  });
}

// Create .env.local file for development
function createEnvFile(databaseUrl) {
  const envContent = `# Auto-generated Local Development Environment
# This file is created automatically by setup-local-db.js

# Database Configuration - Local PostgreSQL
DATABASE_URL="${databaseUrl}"

# JWT Configuration
JWT_SECRET="dev-jwt-secret-key-must-be-at-least-32-characters-long-for-security"
JWT_REFRESH_SECRET="dev-jwt-refresh-secret-key-must-be-at-least-32-characters-long"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# Server Configuration
NODE_ENV="development"
PORT="3001"
CLIENT_BASE_URL="http://localhost:5173"
CORS_ORIGIN="http://localhost:5173"

# Admin Account
ADMIN_EMAIL="admin@onlyfur.net"
ADMIN_PASSWORD="admin123"
ADMIN_USERNAME="admin"

# Email Configuration
FROM_EMAIL="noreply@onlyfur.local"
FROM_NAME="OnlyFur Development"
SUPPORT_EMAIL="support@onlyfur.local"

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI="http://localhost:5173/auth/callback/google"

# Prisma Configuration
PRISMA_CLIENT_ENGINE_TYPE="binary"
PRISMA_CLI_QUERY_ENGINE_TYPE="binary"

# Platform Settings
PLATFORM_NAME="OnlyFur Development"
PLATFORM_COMMISSION_RATE="0.10"
MINIMUM_PAYOUT_AMOUNT="50.00"

# Vite Frontend Environment Variables
VITE_API_URL="http://localhost:3001"
VITE_ADMIN_EMAIL="admin@onlyfur.net"
VITE_ADMIN_USERNAME="admin"
VITE_ADMIN_PASSWORD="admin123"
VITE_ADMIN_DISPLAY_NAME="Admin"
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local file with local database configuration');
}

// Run Prisma operations
function runPrismaOperations() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Running Prisma operations...');
    
    // Generate Prisma client
    exec('npx prisma generate', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Prisma generate failed:', error.message);
        reject(error);
        return;
      }
      console.log('✅ Prisma client generated');
      
      // Run database migrations
      exec('npx prisma db push', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Prisma db push failed:', error.message);
          reject(error);
          return;
        }
        console.log('✅ Database schema synchronized');
        resolve();
      });
    });
  });
}

// Main setup function
async function setupLocalDatabase() {
  try {
    console.log('🌍 Using cross-platform PostgreSQL setup...');
    
    // Try cross-platform setup first
    try {
      await setupCrossPlatform();
      console.log('✅ Cross-platform PostgreSQL setup successful');
    } catch (error) {
      console.log('⚠️ Cross-platform setup failed, trying legacy setup...');
      
      // Fallback to original logic for macOS
      const pgStatus = await detectPostgreSQL();
      
      if (!pgStatus.hasPostgreSQL) {
        await installPostgreSQL();
      }
      
      if (!pgStatus.running) {
        await startPostgreSQL();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      await createUser();
      await createDatabase();
    }    
    // Check if we need to create .env.local (might be created by cross-platform setup)
    if (!fs.existsSync('.env.local')) {
      const DATABASE_URL = `postgresql://${DB_CONFIG.user}:${DB_CONFIG.password}@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.name}`;
      createEnvFile(DATABASE_URL);
    } else {
      console.log('✅ .env.local already exists from cross-platform setup');
    }
    
    // Run Prisma operations if we have a PostgreSQL setup
    const envContent = fs.readFileSync('.env.local', 'utf8');
    if (!envContent.includes('sqlite')) {
      await runPrismaOperations();
    } else {
      console.log('⚠️ SQLite detected, skipping Prisma PostgreSQL operations');
    }
    
    console.log('');
    const dbUrl = envContent.match(/DATABASE_URL="([^"]+)"/)?.[1] || 'configured';
    
    console.log('🎉 Local Development Environment Setup Complete!');
    console.log('===============================================');
    console.log(`📊 Database: ${DB_CONFIG.name}`);
    console.log(`👤 User: ${DB_CONFIG.user}`);
    console.log(`🔌 Port: ${DB_CONFIG.port}`);
    console.log(`🔗 Connection: ${dbUrl}`);
    console.log('');
    console.log('✅ You can now run: npm run dev:backend');
    console.log('✅ Database is ready for local development');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('');
    console.log('💡 Manual setup alternatives:');
    console.log('   1. Install PostgreSQL: brew install postgresql@15');
    console.log('   2. Start service: brew services start postgresql@15');
    console.log('   3. Create user: createuser -s onlyfur_dev');
    console.log('   4. Create database: createdb -U onlyfur_dev onlyfur_dev');
    console.log('   5. Run: npx prisma db push');
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupLocalDatabase();
}

module.exports = { setupLocalDatabase, DB_CONFIG, DATABASE_URL };
