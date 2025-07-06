#!/usr/bin/env node

// Local development server for the backend
// This file starts the serverless backend in a local HTTP server environment

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

console.log('🚀 OnlyFur Backend - Local Development Server');
console.log('🔧 Starting serverless backend in local mode...');

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  console.log(`📁 Loading environment from: ${envPath}`);
} else {
  console.log('⚠️  No .env.local found, will use default environment');
}

// Start the API server directly
console.log('🏁 Starting backend server...');
const apiPath = path.join(__dirname, '../api/index.js');
const child = spawn('node', [apiPath], {
  stdio: 'inherit',
  env: { ...process.env }
});

child.on('close', (code) => {
  console.log(`📴 Backend server exited with code ${code}`);
  process.exit(code);
});

child.on('error', (error) => {
  console.error('❌ Backend server error:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('📴 Terminating backend server...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('📴 Terminating backend server...');
  child.kill('SIGTERM');
});
