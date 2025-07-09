#!/usr/bin/env node
/**
 * CORS Test Script
 * This script tests the CORS configuration for the OnlyFur platform
 */

const axios = require('axios');

async function testCORS() {
  console.log('🔍 Testing CORS Configuration...\n');
  
  const testOrigins = [
    'https://onlyfur.net',
    'https://onlyfur.vercel.app',
    'https://creatorplattform.vercel.app',
    'http://localhost:5173'
  ];
  
  const testEndpoints = [
    '/api/health',
    '/api/real-data/platform-stats',
    '/api/real-data/creators'
  ];
  
  for (const origin of testOrigins) {
    console.log(`\n📍 Testing with origin: ${origin}`);
    
    for (const endpoint of testEndpoints) {
      const url = `https://creatorplattform.vercel.app${endpoint}`;
      
      try {
        const response = await axios.get(url, {
          headers: {
            'Origin': origin,
            'User-Agent': 'OnlyFur-CORS-Test/1.0'
          },
          timeout: 5000
        });
        
        console.log(`  ✅ ${endpoint} - Status: ${response.status}`);
        
        // Check CORS headers
        const corsHeader = response.headers['access-control-allow-origin'];
        if (corsHeader) {
          console.log(`     🎯 CORS Origin: ${corsHeader}`);
        } else {
          console.log(`     ⚠️ No CORS header found`);
        }
        
      } catch (error) {
        if (error.response) {
          console.log(`  ❌ ${endpoint} - Status: ${error.response.status}`);
        } else if (error.code === 'ECONNABORTED') {
          console.log(`  ⏰ ${endpoint} - Timeout`);
        } else {
          console.log(`  💥 ${endpoint} - Error: ${error.message}`);
        }
      }
    }
  }
  
  console.log('\n🎉 CORS test completed!');
  
  // Test specific problematic endpoint
  console.log('\n🔍 Testing specific endpoint that was failing...');
  try {
    const response = await axios.get('https://creatorplattform.vercel.app/api/real-data/platform-stats', {
      headers: {
        'Origin': 'https://onlyfur.net',
        'User-Agent': 'OnlyFur-CORS-Test/1.0'
      }
    });
    
    console.log('✅ Platform stats endpoint working!');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Platform stats endpoint still failing:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

// Run the test
if (require.main === module) {
  testCORS().catch(console.error);
}

module.exports = { testCORS };
