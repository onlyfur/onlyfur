#!/usr/bin/env node

/**
 * OnlyFur Platform - Complete Deployment & Service Manager
 * This script ensures all services are running properly during deployment
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const ServiceMonitor = require('./health-monitor.js');

console.log('🚀 OnlyFur Platform - Complete Deployment Manager');
console.log('=================================================');

class DeploymentManager {
  constructor() {
    this.monitor = new ServiceMonitor();
    this.processes = [];
    this.deploymentSteps = [
      { name: 'Environment Setup', fn: this.setupEnvironment.bind(this) },
      { name: 'Dependencies Installation', fn: this.installDependencies.bind(this) },
      { name: 'Database Setup', fn: this.setupDatabase.bind(this) },
      { name: 'Build Application', fn: this.buildApplication.bind(this) },
      { name: 'Start Services', fn: this.startServices.bind(this) },
      { name: 'Health Check', fn: this.runHealthCheck.bind(this) },
      { name: 'Final Verification', fn: this.finalVerification.bind(this) }
    ];
  }

  // Step 1: Environment Setup
  async setupEnvironment() {
    console.log('🔧 Setting up environment...');
    
    // Set NODE_ENV if not already set
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'production';
      console.log('📝 NODE_ENV set to production');
    }

    // Check for environment file
    const envFile = '.env';
    if (!fs.existsSync(envFile)) {
      console.log('⚠️ No .env file found, creating template...');
      const envTemplate = `
# OnlyFur Platform Environment Variables
DATABASE_URL="your_database_url_here"
JWT_SECRET="your_jwt_secret_here"
JWT_REFRESH_SECRET="your_refresh_secret_here"
ADMIN_EMAIL="admin@onlyfur.net"
ADMIN_PASSWORD="your_admin_password_here"
NODE_ENV="production"
FRONTEND_URL="https://onlyfur.net"
`.trim();
      
      fs.writeFileSync(envFile, envTemplate);
      console.log('📄 Environment template created at .env');
      console.log('⚠️ Please update the .env file with your actual values before proceeding');
    }

    console.log('✅ Environment setup complete');
    return true;
  }

  // Step 2: Install Dependencies
  async installDependencies() {
    console.log('📦 Installing dependencies...');
    
    return new Promise((resolve, reject) => {
      const npm = spawn('npm', ['install'], { stdio: 'inherit' });
      
      npm.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Dependencies installed successfully');
          resolve(true);
        } else {
          console.error('❌ Failed to install dependencies');
          reject(new Error('npm install failed'));
        }
      });

      npm.on('error', (error) => {
        console.error('❌ npm install error:', error);
        reject(error);
      });
    });
  }

  // Step 3: Database Setup
  async setupDatabase() {
    console.log('🗄️ Setting up database...');
    
    try {
      // Generate Prisma client
      console.log('🔧 Generating Prisma client...');
      await this.runCommand('npx', ['prisma', 'generate']);
      
      // Run database migrations
      console.log('🏗️ Running database migrations...');
      await this.runCommand('npx', ['prisma', 'migrate', 'deploy']);
      
      console.log('✅ Database setup complete');
      return true;
    } catch (error) {
      console.error('❌ Database setup failed:', error.message);
      return false;
    }
  }

  // Step 4: Build Application
  async buildApplication() {
    console.log('🏗️ Building application...');
    
    try {
      // Generate neural index
      console.log('🧠 Generating neural index...');
      await this.runCommand('node', ['scripts/generateNeuralIndex.js']);
      
      // Build frontend
      console.log('⚡ Building frontend...');
      await this.runCommand('npm', ['run', 'build']);
      
      console.log('✅ Application build complete');
      return true;
    } catch (error) {
      console.error('❌ Application build failed:', error.message);
      return false;
    }
  }

  // Step 5: Start Services
  async startServices() {
    console.log('🚀 Starting services...');
    
    try {
      // Start API server in background
      console.log('🌐 Starting API server...');
      const apiServer = spawn('node', ['api/index.js'], {
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: 'production' }
      });

      this.processes.push(apiServer);

      // Log API server output
      apiServer.stdout.on('data', (data) => {
        console.log(`[API] ${data.toString().trim()}`);
      });

      apiServer.stderr.on('data', (data) => {
        console.error(`[API ERROR] ${data.toString().trim()}`);
      });

      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log('✅ Services started successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to start services:', error.message);
      return false;
    }
  }

  // Step 6: Run Health Check
  async runHealthCheck() {
    console.log('🏥 Running health check...');
    
    try {
      const healthy = await this.monitor.runHealthCheck();
      if (healthy) {
        console.log('✅ All services are healthy');
        return true;
      } else {
        console.log('⚠️ Some services are unhealthy');
        return false;
      }
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      return false;
    }
  }

  // Step 7: Final Verification
  async finalVerification() {
    console.log('🔍 Running final verification...');
    
    try {
      // Check that all critical files exist
      const criticalFiles = [
        'api/index.js',
        'dist/index.html',
        'deployment-report.json'
      ];

      for (const file of criticalFiles) {
        if (!fs.existsSync(file)) {
          throw new Error(`Critical file missing: ${file}`);
        }
      }

      // Verify API is responding
      const axios = require('axios');
      try {
        const response = await axios.get('http://localhost:3001/api/health', { timeout: 10000 });
        if (response.status !== 200) {
          throw new Error('API health check failed');
        }
      } catch (error) {
        throw new Error('API is not responding');
      }

      console.log('✅ Final verification complete');
      return true;
    } catch (error) {
      console.error('❌ Final verification failed:', error.message);
      return false;
    }
  }

  // Helper function to run commands
  runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { stdio: 'inherit' });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  // Cleanup function
  cleanup() {
    console.log('🧹 Cleaning up processes...');
    this.processes.forEach(process => {
      if (!process.killed) {
        process.kill('SIGTERM');
      }
    });
  }

  // Main deployment function
  async deploy() {
    console.log('Starting deployment process...\n');
    
    let allStepsSuccessful = true;
    
    for (const [index, step] of this.deploymentSteps.entries()) {
      const stepNumber = index + 1;
      console.log(`\n📋 Step ${stepNumber}/${this.deploymentSteps.length}: ${step.name}`);
      console.log('='.repeat(50));
      
      try {
        const success = await step.fn();
        if (!success) {
          console.error(`❌ Step ${stepNumber} failed: ${step.name}`);
          allStepsSuccessful = false;
          break;
        }
        console.log(`✅ Step ${stepNumber} completed: ${step.name}`);
      } catch (error) {
        console.error(`❌ Step ${stepNumber} error: ${error.message}`);
        allStepsSuccessful = false;
        break;
      }
    }

    // Generate final report
    console.log('\n📊 Deployment Summary');
    console.log('=====================');
    
    if (allStepsSuccessful) {
      console.log('🎉 Deployment completed successfully!');
      console.log('✅ All services are running and healthy');
      console.log('🌐 Platform is ready for use');
      
      console.log('\n🔗 Service URLs:');
      console.log('   API Health: http://localhost:3001/api/health');
      console.log('   API Status: http://localhost:3001/api/status');
      console.log('   Frontend: http://localhost:5173 (dev) or served files');
      
      console.log('\n📝 Next Steps:');
      console.log('   1. Test the platform functionality');
      console.log('   2. Monitor logs for any issues');
      console.log('   3. Set up production monitoring');
      console.log('   4. Configure SSL/TLS if needed');
      
      return true;
    } else {
      console.log('❌ Deployment failed!');
      console.log('⚠️ Please check the logs above for error details');
      console.log('🔧 Fix the issues and try again');
      
      return false;
    }
  }
}

// Handle process signals for graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Deployment interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Deployment terminated');
  process.exit(1);
});

// Main execution
async function main() {
  const manager = new DeploymentManager();
  
  try {
    const success = await manager.deploy();
    
    if (success) {
      console.log('\n🎯 Deployment successful! Services will continue running...');
      console.log('Press Ctrl+C to stop all services');
      
      // Keep the process alive to maintain services
      process.stdin.resume();
    } else {
      console.log('\n💥 Deployment failed!');
      manager.cleanup();
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Fatal deployment error:', error.message);
    manager.cleanup();
    process.exit(1);
  }
  
  // Cleanup on exit
  process.on('exit', () => {
    manager.cleanup();
  });
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = DeploymentManager;
