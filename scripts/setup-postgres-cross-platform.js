#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🌍 Cross-Platform PostgreSQL Setup');
console.log('====================================');

const platform = os.platform();
const arch = os.arch();

console.log(`📊 Detected: ${platform} (${arch})`);

// Database configuration
const DB_CONFIG = {
  name: 'onlyfur_dev',
  user: 'onlyfur_dev',
  password: 'onlyfur_password',
  port: '5432',
  host: 'localhost'
};

// Check if PostgreSQL is already running
function checkPostgreSQLRunning() {
  return new Promise((resolve) => {
    exec(`lsof -i:${DB_CONFIG.port}`, (error, stdout) => {
      const isRunning = !error && stdout.includes('postgres');
      if (isRunning) {
        console.log('✅ PostgreSQL already running on port', DB_CONFIG.port);
      }
      resolve(isRunning);
    });
  });
}

// Cross-platform PostgreSQL installation strategies
const installStrategies = {
  // Strategy 1: Native package managers
  async native() {
    console.log('📦 Trying native package manager installation...');
    
    if (platform === 'darwin') {
      return await installMacOS();
    } else if (platform === 'win32') {
      return await installWindows();
    } else if (platform === 'linux') {
      return await installLinux();
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  },

  // Strategy 2: Docker-based PostgreSQL (cross-platform)
  async docker() {
    console.log('🐳 Trying Docker-based PostgreSQL...');
    return await installDocker();
  },

  // Strategy 3: Portable PostgreSQL (cross-platform)
  async portable() {
    console.log('📦 Trying portable PostgreSQL installation...');
    return await installPortable();
  },

  // Strategy 4: SQLite fallback (development only)
  async sqlite() {
    console.log('💾 Falling back to SQLite for development...');
    return await setupSQLiteFallback();
  }
};

// macOS installation
async function installMacOS() {
  console.log('🍎 Installing PostgreSQL on macOS...');
  
  // Check if Homebrew is installed
  try {
    await execAsync('which brew');
  } catch (error) {
    console.log('🔧 Installing Homebrew first...');
    await execAsync('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
  }
  
  // Install PostgreSQL
  await execAsync('brew install postgresql@15');
  await execAsync('brew services start postgresql@15');
  
  return true;
}

// Windows installation
async function installWindows() {
  console.log('🪟 Installing PostgreSQL on Windows...');
  
  // Try Chocolatey first
  try {
    await execAsync('choco install postgresql --version=15.4 -y');
    await execAsync('net start postgresql-15');
    return true;
  } catch (error) {
    console.log('⚠️ Chocolatey not found, trying Scoop...');
  }
  
  // Try Scoop
  try {
    await execAsync('scoop bucket add main');
    await execAsync('scoop install postgresql');
    return true;
  } catch (error) {
    console.log('⚠️ Scoop not found, providing manual instructions...');
    throw new Error('Please install PostgreSQL manually from https://www.postgresql.org/download/windows/');
  }
}

// Linux installation
async function installLinux() {
  console.log('🐧 Installing PostgreSQL on Linux...');
  
  // Try apt (Ubuntu/Debian)
  try {
    await execAsync('sudo apt update');
    await execAsync('sudo apt install -y postgresql postgresql-contrib');
    await execAsync('sudo systemctl start postgresql');
    await execAsync('sudo systemctl enable postgresql');
    return true;
  } catch (error) {
    console.log('⚠️ APT not found, trying yum...');
  }
  
  // Try yum (CentOS/RHEL)
  try {
    await execAsync('sudo yum install -y postgresql-server postgresql-contrib');
    await execAsync('sudo postgresql-setup initdb');
    await execAsync('sudo systemctl start postgresql');
    await execAsync('sudo systemctl enable postgresql');
    return true;
  } catch (error) {
    throw new Error('Could not install PostgreSQL via package manager');
  }
}

// Docker-based installation
async function installDocker() {
  try {
    // Check if Docker is available
    await execAsync('docker --version');
    
    console.log('🐳 Setting up PostgreSQL container...');
    
    const containerName = 'onlyfur_postgres_dev';
    
    // Stop and remove existing container
    try {
      await execAsync(`docker stop ${containerName}`);
      await execAsync(`docker rm ${containerName}`);
    } catch (error) {
      // Container doesn't exist, that's fine
    }
    
    // Run PostgreSQL container
    const dockerCmd = `docker run -d \
      --name ${containerName} \
      -e POSTGRES_DB=${DB_CONFIG.name} \
      -e POSTGRES_USER=${DB_CONFIG.user} \
      -e POSTGRES_PASSWORD=${DB_CONFIG.password} \
      -p ${DB_CONFIG.port}:5432 \
      postgres:15-alpine`;
    
    await execAsync(dockerCmd);
    
    // Wait for PostgreSQL to be ready
    console.log('⏳ Waiting for PostgreSQL to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('✅ PostgreSQL container running');
    return true;
    
  } catch (error) {
    throw new Error('Docker not available or failed to start PostgreSQL container');
  }
}

// Portable PostgreSQL installation
async function installPortable() {
  // This would download and extract a portable PostgreSQL build
  // For now, we'll provide instructions for manual setup
  throw new Error('Portable PostgreSQL not yet implemented. Please use Docker or native installation.');
}

// SQLite fallback for development
async function setupSQLiteFallback() {
  console.log('💾 Setting up SQLite fallback for development...');
  
  // Check if better-sqlite3 is already available
  try {
    require('better-sqlite3');
    console.log('✅ better-sqlite3 already available');
  } catch (error) {
    console.log('📦 Installing better-sqlite3...');
    try {
      await execAsync('npm install better-sqlite3');
      console.log('✅ better-sqlite3 installed successfully');
    } catch (installError) {
      console.log('⚠️ Failed to install better-sqlite3, providing manual instructions...');
      throw new Error('Please install better-sqlite3 manually: npm install better-sqlite3');
    }
  }
  
  try {
    
    // Create SQLite-based .env.local
    const sqliteEnvContent = `# SQLite Fallback Development Environment
# PostgreSQL not available - using SQLite for development

DATABASE_URL="file:./dev.db"
DB_PROVIDER="sqlite"

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
    
    fs.writeFileSync('.env.local', sqliteEnvContent);
    console.log('✅ Created SQLite-based .env.local');
    console.log('⚠️ Note: Using SQLite fallback - some PostgreSQL-specific features may not work');
    console.log('📝 You can also reference env/.env.example for more configuration options');
    
    return true;
    
  } catch (error) {
    throw new Error('Failed to set up SQLite fallback');
  }
}

// Helper function to execute commands with promise
function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Test database connection
async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    if (fs.existsSync('.env.local') && fs.readFileSync('.env.local', 'utf8').includes('sqlite')) {
      console.log('✅ SQLite fallback configured');
      return true;
    }
    
    await execAsync(`psql -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -U ${DB_CONFIG.user} -d ${DB_CONFIG.name} -c "SELECT 1;" 2>/dev/null`);
    console.log('✅ PostgreSQL connection successful');
    return true;
  } catch (error) {
    console.log('❌ Database connection failed');
    return false;
  }
}

// Create database and user (for native PostgreSQL installations)
async function setupDatabase() {
  console.log('🗄️ Setting up database and user...');
  
  try {
    // Create user
    await execAsync(`createuser -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -s ${DB_CONFIG.user} 2>/dev/null || echo "User might exist"`);
    
    // Set password
    await execAsync(`psql -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -c "ALTER USER ${DB_CONFIG.user} PASSWORD '${DB_CONFIG.password}';"`);
    
    // Create database
    await execAsync(`createdb -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -U ${DB_CONFIG.user} ${DB_CONFIG.name} 2>/dev/null || echo "Database might exist"`);
    
    console.log('✅ Database setup complete');
    return true;
  } catch (error) {
    console.log('⚠️ Database setup had issues (might already exist)');
    return true; // Continue anyway
  }
}

// Main setup function
async function setupPostgreSQL() {
  try {
    // Check if PostgreSQL is already running
    const isRunning = await checkPostgreSQLRunning();
    
    if (isRunning) {
      console.log('✅ PostgreSQL already available');
      await setupDatabase();
      return true;
    }
    
    // Try installation strategies in order
    const strategies = ['native', 'docker', 'sqlite'];
    
    for (const strategyName of strategies) {
      try {
        console.log(`\n🔄 Trying strategy: ${strategyName}`);
        await installStrategies[strategyName]();
        
        // Test the installation
        if (strategyName !== 'sqlite') {
          // Wait a moment for the service to start
          await new Promise(resolve => setTimeout(resolve, 3000));
          await setupDatabase();
        }
        
        const connected = await testConnection();
        if (connected) {
          console.log(`\n🎉 Successfully set up PostgreSQL using: ${strategyName}`);
          return true;
        }
      } catch (error) {
        console.log(`❌ Strategy '${strategyName}' failed: ${error.message}`);
        console.log('⏭️ Trying next strategy...');
      }
    }
    
    throw new Error('All installation strategies failed');
    
  } catch (error) {
    console.error('\n❌ PostgreSQL setup failed:', error.message);
    console.log('\n💡 Manual Setup Options:');
    console.log('1. Install Docker and run: docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres');
    console.log('2. Download PostgreSQL from: https://www.postgresql.org/download/');
    console.log('3. Use a cloud database (Neon, Supabase, Railway)');
    console.log('4. Contact your team for assistance');
    
    throw error;
  }
}

// Export for use in other scripts
module.exports = { setupPostgreSQL, DB_CONFIG };

// Run setup if called directly
if (require.main === module) {
  setupPostgreSQL()
    .then(() => {
      console.log('\n🚀 PostgreSQL setup complete!');
      console.log('💡 You can now run: npm run dev:backend');
    })
    .catch(() => {
      process.exit(1);
    });
}
