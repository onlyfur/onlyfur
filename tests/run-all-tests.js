#!/usr/bin/env node
/**
 * Comprehensive Test Runner
 * This script runs all available tests for the OnlyFur platform
 */

const { spawn } = require('child_process');
const path = require('path');

async function runCommand(command, args = [], cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${command} completed successfully`);
        resolve(code);
      } else {
        console.log(`❌ ${command} failed with code ${code}`);
        resolve(code); // Don't reject, continue with other tests
      }
    });
    
    child.on('error', (error) => {
      console.error(`💥 Error running ${command}:`, error.message);
      resolve(1);
    });
  });
}

async function runAllTests() {
  console.log('🧪 OnlyFur Platform - Comprehensive Test Suite');
  console.log('==============================================\n');
  
  const testResults = [];
  
  // 1. Run Jest unit tests
  console.log('📋 Running Jest Unit Tests...');
  const jestResult = await runCommand('npm', ['run', 'test:backend:unit']);
  testResults.push({ name: 'Jest Unit Tests', result: jestResult });
  
  // 2. Run Jest integration tests  
  console.log('\n📋 Running Jest Integration Tests...');
  const integrationResult = await runCommand('npm', ['run', 'test:backend:integration']);
  testResults.push({ name: 'Jest Integration Tests', result: integrationResult });
  
  // 3. Run manual backend test
  console.log('\n📋 Running Manual Backend Test...');
  const backendResult = await runCommand('npm', ['run', 'test:backend:manual']);
  testResults.push({ name: 'Manual Backend Test', result: backendResult });
  
  // 4. Run CORS test
  console.log('\n📋 Running CORS Configuration Test...');
  const corsResult = await runCommand('npm', ['run', 'test:cors']);
  testResults.push({ name: 'CORS Test', result: corsResult });
  
  // 5. Run API tests
  console.log('\n📋 Running API Tests...');
  const apiResult = await runCommand('npm', ['run', 'test:api']);
  testResults.push({ name: 'API Tests', result: apiResult });
  
  // 6. Run environment check
  console.log('\n📋 Running Environment Check...');
  const envResult = await runCommand('npm', ['run', 'env-check']);
  testResults.push({ name: 'Environment Check', result: envResult });
  
  // 7. Run health monitor
  console.log('\n📋 Running Health Monitor...');
  const healthResult = await runCommand('npm', ['run', 'health-check']);
  testResults.push({ name: 'Health Check', result: healthResult });
  
  // Generate summary report
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  
  const passed = testResults.filter(t => t.result === 0).length;
  const failed = testResults.filter(t => t.result !== 0).length;
  
  testResults.forEach(test => {
    const status = test.result === 0 ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${test.name}`);
  });
  
  console.log(`\n📈 Total: ${testResults.length} tests`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Platform is ready for deployment.');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some tests failed. Please review the output above.');
    process.exit(1);
  }
}

// Run all tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };
