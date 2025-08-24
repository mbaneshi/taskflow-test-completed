#!/usr/bin/env node

/**
 * TaskFlow Simple Connection Test Script
 * Tests backend, frontend, and database connectivity without external dependencies
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Try to use built-in modules first
let http;
try {
  http = await import('http');
} catch (error) {
  console.log('❌ HTTP module not available');
  process.exit(1);
}

const config = {
  backend: 'http://localhost:5001',
  frontend: 'http://localhost:3000'
};

console.log('🔍 Testing TaskFlow Connections (Simple Version)...\n');

// Test Backend Health
async function testBackend() {
  return new Promise((resolve) => {
    console.log('📡 Testing Backend API...');
    
    const url = new URL('/api/health', config.backend);
    const req = http.request(url, { method: 'GET' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log('✅ Backend API: OK');
            console.log(`   Status: ${jsonData.status}`);
            console.log(`   Database: ${jsonData.database}`);
            console.log(`   Timestamp: ${jsonData.timestamp}`);
          } else {
            console.log('❌ Backend API: Failed');
            console.log(`   Status: ${res.statusCode}`);
          }
        } catch (error) {
          console.log('❌ Backend API: Invalid response');
        }
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Backend API: Connection Error');
      console.log(`   Error: ${error.message}`);
      resolve();
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Backend API: Timeout');
      req.destroy();
      resolve();
    });
    
    req.end();
  });
}

// Test Frontend
async function testFrontend() {
  return new Promise((resolve) => {
    console.log('\n🌐 Testing Frontend...');
    
    const url = new URL('/', config.frontend);
    const req = http.request(url, { method: 'GET' }, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Frontend: OK');
        console.log(`   Status: ${res.statusCode}`);
      } else {
        console.log('❌ Frontend: Failed');
        console.log(`   Status: ${res.statusCode}`);
      }
      resolve();
    });
    
    req.on('error', (error) => {
      console.log('❌ Frontend: Connection Error');
      console.log(`   Error: ${error.message}`);
      resolve();
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Frontend: Timeout');
      req.destroy();
      resolve();
    });
    
    req.end();
  });
}

// Test Database Connection via Backend
async function testDatabase() {
  return new Promise((resolve) => {
    console.log('\n🗄️  Testing Database...');
    
    const url = new URL('/api/health', config.backend);
    const req = http.request(url, { method: 'GET' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.database === 'Connected') {
            console.log('✅ Database: Connected');
          } else {
            console.log('❌ Database: Disconnected');
          }
        } catch (error) {
          console.log('❌ Database: Cannot check status');
        }
        resolve();
      });
    });
    
    req.on('error', () => {
      console.log('❌ Database: Cannot check status');
      resolve();
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Database: Timeout');
      req.destroy();
      resolve();
    });
    
    req.end();
  });
}

// Main test function
async function runTests() {
  await testBackend();
  await testFrontend();
  await testDatabase();
  
  console.log('\n🎯 Connection Test Summary:');
  console.log('   - Backend should be running on port 5001');
  console.log('   - Frontend should be running on port 3000');
  console.log('   - Database should be accessible via backend');
  console.log('   - Caddy proxy should route traffic correctly');
  
  console.log('\n💡 If services are not running:');
  console.log('   - Start with Docker: npm run docker:up');
  console.log('   - Or start locally: npm run dev');
}

// Run tests
runTests().catch(console.error);
