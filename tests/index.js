#!/usr/bin/env node
/**
 * Test Index - OnlyFur Platform
 * Quick overview and launcher for all available tests
 */

const fs = require('fs');
const path = require('path');

function getTestFiles() {
  const testsDir = __dirname;
  const files = fs.readdirSync(testsDir, { withFileTypes: true });
  
  const tests = {
    jest: [],
    manual: [],
    html: [],
    utilities: []
  };
  
  files.forEach(file => {
    if (file.isFile() && file.name.endsWith('.js')) {
      if (file.name.includes('.test.js')) {
        tests.jest.push(file.name);
      } else if (file.name.startsWith('test-')) {
        tests.utilities.push(file.name);
      } else if (!file.name.includes('setup') && !file.name.includes('README') && !file.name.includes('index')) {
        tests.manual.push(file.name);
      }
    } else if (file.isFile() && file.name.endsWith('.html')) {
      tests.html.push(file.name);
    }
  });
  
  // Add API tests
  const apiDir = path.join(testsDir, 'api');
  if (fs.existsSync(apiDir)) {
    const apiFiles = fs.readdirSync(apiDir);
    apiFiles.forEach(file => {
      if (file.endsWith('.test.js')) {
        tests.jest.push(`api/${file}`);
      }
    });
  }
  
  return tests;
}

function displayTestIndex() {
  console.log('🧪 OnlyFur Platform - Test Index');
  console.log('=================================\n');
  
  const tests = getTestFiles();
  
  console.log('📋 Available Test Categories:\n');
  
  // Jest Tests
  console.log('🔬 Jest-based Tests (Unit & Integration):');
  if (tests.jest.length > 0) {
    tests.jest.forEach(test => {
      console.log(`   • ${test}`);
    });
    console.log('   Run with: npm test, npm run test:backend:unit, npm run test:api\n');
  } else {
    console.log('   No Jest tests found\n');
  }
  
  // Manual Tests
  console.log('🔧 Manual Tests (Node.js Scripts):');
  if (tests.manual.length > 0) {
    tests.manual.forEach(test => {
      const command = test.replace('.js', '').replace('backend', 'backend:manual');
      console.log(`   • ${test} - Run with: npm run test:${command}`);
    });
    console.log('');
  } else {
    console.log('   No manual tests found\n');
  }
  
  // HTML Tests
  console.log('🌐 HTML Tests (Browser-based):');
  if (tests.html.length > 0) {
    tests.html.forEach(test => {
      console.log(`   • ${test} - Open in browser for manual testing`);
    });
    console.log('');
  } else {
    console.log('   No HTML tests found\n');
  }
  
  // Utility Scripts
  console.log('🛠️ Utility Scripts:');
  if (tests.utilities.length > 0) {
    tests.utilities.forEach(test => {
      console.log(`   • ${test} - Run with: node tests/${test}`);
    });
    console.log('');
  } else {
    console.log('   No utility scripts found\n');
  }
  
  // Quick Commands
  console.log('⚡ Quick Commands:');
  console.log('   • npm run test:all      - Run all tests comprehensively');
  console.log('   • npm test              - Run Jest tests only');
  console.log('   • npm run test:cors     - Test CORS configuration');
  console.log('   • npm run env-check     - Check environment setup');
  console.log('   • npm run health-check  - Run health monitoring');
  
  console.log('\n📚 For detailed documentation, see: tests/README.md');
}

// Run if called directly
if (require.main === module) {
  displayTestIndex();
}

module.exports = { getTestFiles, displayTestIndex };
