#!/usr/bin/env node

/**
 * TaskFlow Connection Test Script
 * Tests backend, frontend, and database connectivity
 */

// Use dynamic import for better compatibility
let fetch;

const config = {
  backend: 'http://localhost:5000',
  frontend: 'http://localhost:3000',
  database: 'mongodb://localhost:27017'
};

console.log('🔍 Testing TaskFlow Connections...\n');

// Test Backend Health
async function testBackend() {
  try {
    console.log('📡 Testing Backend API...');
    const response = await fetch(`${config.backend}/api/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Backend API: OK');
      console.log(`   Status: ${data.status}`);
      console.log(`   Database: ${data.database}`);
      console.log(`   Timestamp: ${data.timestamp}`);
    } else {
      console.log('❌ Backend API: Failed');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Backend API: Connection Error');
    console.log(`   Error: ${error.message}`);
  }
}

// Test Frontend
async function testFrontend() {
  try {
    console.log('\n🌐 Testing Frontend...');
    const response = await fetch(config.frontend);
    
    if (response.ok) {
      console.log('✅ Frontend: OK');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log('❌ Frontend: Failed');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Frontend: Connection Error');
    console.log(`   Error: ${error.message}`);
  }
}

// Test Database Connection
async function testDatabase() {
  try {
    console.log('\n🗄️  Testing Database...');
    const response = await fetch(`${config.backend}/api/health`);
    const data = await response.json();
    
    if (data.database === 'Connected') {
      console.log('✅ Database: Connected');
    } else {
      console.log('❌ Database: Disconnected');
    }
  } catch (error) {
    console.log('❌ Database: Connection Error');
    console.log(`   Error: ${error.message}`);
  }
}

// Test API Endpoints
async function testAPIEndpoints() {
  try {
    console.log('\n🔌 Testing API Endpoints...');
    
    // Test auth endpoint
    const authResponse = await fetch(`${config.backend}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test' })
    });
    
    if (authResponse.status === 400 || authResponse.status === 401) {
      console.log('✅ Auth Endpoint: Accessible (expected auth failure)');
    } else {
      console.log('⚠️  Auth Endpoint: Unexpected response');
    }
    
  } catch (error) {
    console.log('❌ API Endpoints: Connection Error');
    console.log(`   Error: ${error.message}`);
  }
}

// Main test function
async function runTests() {
  await testBackend();
  await testFrontend();
  await testDatabase();
  await testAPIEndpoints();
  
  console.log('\n🎯 Connection Test Summary:');
  console.log('   - Backend should be running on port 5000');
  console.log('   - Frontend should be running on port 3000');
  console.log('   - Database should be accessible via backend');
  console.log('   - Caddy proxy should route traffic correctly');
}

// Initialize fetch and run tests
(async () => {
  try {
    const { default: fetchModule } = await import('node-fetch');
    fetch = fetchModule;
    await runTests();
  } catch (error) {
    console.error('❌ Failed to load fetch module:', error.message);
    console.log('💡 Try installing node-fetch: npm install node-fetch');
  }
})();
