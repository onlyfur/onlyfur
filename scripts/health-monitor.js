#!/usr/bin/env node

/**
 * OnlyFur Platform - Service Health Monitor & Deployment Checker
 * This script ensures all services are running properly during deployment
 */

require('dotenv').config();
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const HEALTH_CHECK_TIMEOUT = 30000; // 30 seconds
const SERVICE_CHECK_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 6; // Maximum retries for health checks

console.log('🔍 OnlyFur Platform - Service Health Monitor');
console.log('============================================');

// Critical environment variables that must be set
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

// Optional but recommended environment variables
const RECOMMENDED_ENV_VARS = [
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'NODE_ENV',
  'FRONTEND_URL'
];

// Service endpoints to check
const SERVICE_ENDPOINTS = [
  { name: 'API Health', url: '/api/health', critical: true },
  { name: 'API Status', url: '/api/status', critical: true },
  { name: 'Auth Login', url: '/api/auth/login', method: 'POST', critical: true, expectError: true },
  { name: 'Platform Stats', url: '/api/real-data/platform-stats', critical: false }
];

class ServiceMonitor {
  constructor() {
    this.baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    this.services = new Map();
    this.healthyServices = 0;
    this.totalServices = 0;
  }

  // Check environment variables
  checkEnvironment() {
    console.log('📋 Checking Environment Variables...');
    
    const missingRequired = REQUIRED_ENV_VARS.filter(varName => !process.env[varName]);
    const missingRecommended = RECOMMENDED_ENV_VARS.filter(varName => !process.env[varName]);

    if (missingRequired.length > 0) {
      console.error('❌ Missing CRITICAL environment variables:');
      missingRequired.forEach(varName => console.error(`   - ${varName}`));
      return false;
    }

    if (missingRecommended.length > 0) {
      console.warn('⚠️ Missing RECOMMENDED environment variables:');
      missingRecommended.forEach(varName => console.warn(`   - ${varName}`));
    }

    console.log(`✅ Required environment variables: ${REQUIRED_ENV_VARS.length - missingRequired.length}/${REQUIRED_ENV_VARS.length}`);
    return true;
  }

  // Check file system dependencies
  checkFiles() {
    console.log('📁 Checking File Dependencies...');
    
    const requiredFiles = [
      'package.json',
      'api/index.js',
      'prisma/schema.prisma'
    ];

    const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, '..', file)));

    if (missingFiles.length > 0) {
      console.error('❌ Missing required files:');
      missingFiles.forEach(file => console.error(`   - ${file}`));
      return false;
    }

    console.log(`✅ Required files: ${requiredFiles.length}/${requiredFiles.length}`);
    return true;
  }

  // Check database connectivity
  async checkDatabase() {
    console.log('🗄️ Checking Database Connectivity...');
    
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      await prisma.$disconnect();
      
      console.log('✅ Database connection: OK');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  // Test individual service endpoint
  async testEndpoint(endpoint, retries = 0) {
    try {
      const url = `${this.baseUrl}${endpoint.url}`;
      const method = endpoint.method || 'GET';
      
      const config = {
        method,
        url,
        timeout: HEALTH_CHECK_TIMEOUT,
        validateStatus: function (status) {
          return endpoint.expectError ? (status >= 400 && status < 500) : (status >= 200 && status < 300);
        }
      };

      if (method === 'POST' && endpoint.expectError) {
        config.data = {}; // Empty body for POST requests that should fail
      }

      const response = await axios(config);
      
      this.services.set(endpoint.name, {
        status: 'healthy',
        statusCode: response.status,
        responseTime: Date.now(),
        critical: endpoint.critical
      });

      return true;
    } catch (error) {
      if (retries < MAX_RETRIES && endpoint.critical) {
        console.log(`⏳ Retrying ${endpoint.name} (${retries + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, SERVICE_CHECK_INTERVAL));
        return this.testEndpoint(endpoint, retries + 1);
      }

      this.services.set(endpoint.name, {
        status: 'unhealthy',
        error: error.message,
        critical: endpoint.critical
      });

      return false;
    }
  }

  // Check all service endpoints
  async checkServices() {
    console.log('🌐 Checking Service Endpoints...');
    
    this.totalServices = SERVICE_ENDPOINTS.length;
    
    const promises = SERVICE_ENDPOINTS.map(endpoint => this.testEndpoint(endpoint));
    await Promise.all(promises);

    // Calculate healthy services
    this.healthyServices = Array.from(this.services.values())
      .filter(service => service.status === 'healthy').length;

    // Report results
    console.log('\n📊 Service Health Report:');
    console.log('========================');
    
    for (const [name, service] of this.services) {
      const icon = service.status === 'healthy' ? '✅' : '❌';
      const criticalFlag = service.critical ? '[CRITICAL]' : '[OPTIONAL]';
      
      if (service.status === 'healthy') {
        console.log(`${icon} ${name} ${criticalFlag}: HTTP ${service.statusCode}`);
      } else {
        console.log(`${icon} ${name} ${criticalFlag}: ${service.error}`);
      }
    }

    console.log('========================');
    console.log(`🏥 Overall Health: ${this.healthyServices}/${this.totalServices} services healthy`);

    // Check critical services
    const unhealthyCritical = Array.from(this.services.entries())
      .filter(([name, service]) => service.critical && service.status !== 'healthy');

    return unhealthyCritical.length === 0;
  }

  // Generate deployment report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '3.9.0',
      status: this.healthyServices === this.totalServices ? 'HEALTHY' : 'DEGRADED',
      services: Object.fromEntries(this.services),
      healthyServices: this.healthyServices,
      totalServices: this.totalServices
    };

    const reportPath = path.join(__dirname, '..', 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Deployment report saved: ${reportPath}`);
    return report;
  }

  // Run complete health check
  async runHealthCheck() {
    console.log('Starting comprehensive health check...\n');

    try {
      // Step 1: Environment check
      if (!this.checkEnvironment()) {
        throw new Error('Environment validation failed');
      }
      console.log('');

      // Step 2: File system check
      if (!this.checkFiles()) {
        throw new Error('File system validation failed');
      }
      console.log('');

      // Step 3: Database check
      if (!await this.checkDatabase()) {
        throw new Error('Database connectivity failed');
      }
      console.log('');

      // Step 4: Service endpoint checks
      const servicesHealthy = await this.checkServices();
      
      // Step 5: Generate report
      console.log('');
      const report = this.generateReport();

      if (servicesHealthy) {
        console.log('\n🎉 All critical services are healthy!');
        console.log('✅ Platform is ready for production');
        return true;
      } else {
        console.log('\n⚠️ Some critical services are unhealthy!');
        console.log('❌ Platform may not function correctly');
        return false;
      }

    } catch (error) {
      console.error('\n💥 Health check failed:', error.message);
      return false;
    }
  }
}

// Main execution
async function main() {
  const monitor = new ServiceMonitor();
  
  try {
    const success = await monitor.runHealthCheck();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Fatal error during health check:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = ServiceMonitor;
