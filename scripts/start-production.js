#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting OnlyFur Platform Production Services');
console.log('================================================');

// Check if required files exist
const requiredFiles = [
  'api/index.ts',
  'package.json',
  'prisma/schema.prisma'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(__dirname, '..', file))) {
    console.error(`❌ Required file missing: ${file}`);
    process.exit(1);
  }
}

// Environment validation
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('Please set these environment variables before starting the server.');
  process.exit(1);
}

console.log('✅ Environment validation passed');

// Set production environment
process.env.NODE_ENV = 'production';

// Health check endpoint
function startHealthCheck() {
  const express = require('express');
  const healthApp = express();
  
  healthApp.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      version: require('../package.json').version,
      environment: process.env.NODE_ENV
    });
  });
  
  const healthPort = process.env.HEALTH_PORT || 3001;
  healthApp.listen(healthPort, () => {
    console.log(`💚 Health check server running on port ${healthPort}`);
  });
}

// Start services
async function startServices() {
  try {
    console.log('🔧 Generating Prisma client...');
    
    // Generate Prisma client
    const prismaGenerate = spawn('npx', ['prisma', 'generate'], {
      stdio: 'inherit',
      shell: true
    });
    
    await new Promise((resolve, reject) => {
      prismaGenerate.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Prisma client generated successfully');
          resolve();
        } else {
          reject(new Error(`Prisma generate failed with code ${code}`));
        }
      });
    });

    // Start health check server
    startHealthCheck();

    console.log('🚀 Starting main application server...');
    
    // Start the main application
    const mainServer = spawn('node', ['api/index.js'], {
      stdio: 'inherit',
      shell: true,
      env: { 
        ...process.env,
        NODE_ENV: 'production'
      }
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 Received SIGTERM, shutting down gracefully...');
      mainServer.kill('SIGTERM');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('🛑 Received SIGINT, shutting down gracefully...');
      mainServer.kill('SIGINT');
      process.exit(0);
    });

    mainServer.on('close', (code) => {
      console.log(`🏁 Main server process exited with code ${code}`);
      process.exit(code);
    });

  } catch (error) {
    console.error('❌ Failed to start services:', error.message);
    process.exit(1);
  }
}

// Start everything
startServices().catch(error => {
  console.error('❌ Startup error:', error);
  process.exit(1);
});
