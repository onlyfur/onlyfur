#!/usr/bin/env node

/**
 * OnlyFur Platform - Pre-deployment Environment Check
 * Quick check to ensure environment is ready for deployment
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🔍 OnlyFur Platform - Environment Check');
console.log('=======================================');

let allChecks = true;

// Check 1: Required files
console.log('📁 Checking required files...');
const requiredFiles = [
  'package.json',
  'api/index.js',
  'prisma/schema.prisma',
  'scripts/health-monitor.js',
  'scripts/deploy-complete.js',
  'scripts/start-production.js'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allChecks = false;
  }
});

// Check 2: Environment variables
console.log('\n🔧 Checking environment variables...');
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET', 
  'JWT_REFRESH_SECRET'
];

const optionalEnvVars = [
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'NODE_ENV',
  'FRONTEND_URL'
];

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName} - Set`);
  } else {
    console.log(`❌ ${varName} - MISSING (REQUIRED)`);
    allChecks = false;
  }
});

optionalEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName} - Set`);
  } else {
    console.log(`⚠️ ${varName} - Not set (recommended)`);
  }
});

// Check 3: Node modules
console.log('\n📦 Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules - Exists');
} else {
  console.log('❌ node_modules - Run "npm install" first');
  allChecks = false;
}

// Check 4: Package.json scripts
console.log('\n⚙️ Checking package.json scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['start', 'build', 'deploy', 'health-check'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ ${script} script - Available`);
    } else {
      console.log(`❌ ${script} script - MISSING`);
      allChecks = false;
    }
  });
} catch (error) {
  console.log('❌ Cannot read package.json');
  allChecks = false;
}

// Final summary
console.log('\n📊 Environment Check Summary');
console.log('============================');

if (allChecks) {
  console.log('🎉 All checks passed!');
  console.log('✅ Environment is ready for deployment');
  console.log('\n🚀 Next steps:');
  console.log('   npm run deploy     - Full deployment with all services');
  console.log('   npm run start      - Start production services');
  console.log('   npm run health-check - Check service health');
  process.exit(0);
} else {
  console.log('❌ Some checks failed!');
  console.log('⚠️ Please fix the issues above before deploying');
  console.log('\n🔧 Common fixes:');
  console.log('   npm install        - Install dependencies');
  console.log('   cp .env.example .env - Create environment file');
  console.log('   Update .env with your actual values');
  process.exit(1);
}
