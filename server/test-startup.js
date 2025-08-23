/**
 * Test Startup Script
 * 
 * Simple script to test if the backend can start without errors.
 * This doesn't actually start the server, just validates the imports.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

console.log('🚀 Testing TaskFlow Backend Startup...\n');

try {
  // Test importing main server file
  console.log('📦 Testing main server import...');
  const app = await import('./src/index.js');
  console.log('✅ Main server import successful');
  
  // Test importing models
  console.log('📊 Testing model imports...');
  await import('./src/models/User.js');
  await import('./src/models/Task.js');
  await import('./src/models/UserLog.js');
  console.log('✅ All models imported successfully');
  
  // Test importing middleware
  console.log('🔒 Testing middleware imports...');
  await import('./src/middleware/auth.js');
  await import('./src/middleware/logging.js');
  console.log('✅ All middleware imported successfully');
  
  // Test importing routes
  console.log('🛣️  Testing route imports...');
  await import('./src/routes/auth.js');
  await import('./src/routes/tasks.js');
  await import('./src/routes/users.js');
  await import('./src/routes/logs.js');
  console.log('✅ All routes imported successfully');
  
  // Test importing config
  console.log('⚙️  Testing configuration imports...');
  await import('./src/config/database.js');
  console.log('✅ Configuration imported successfully');
  
  console.log('\n🎉 All imports successful! Backend is ready to run.');
  console.log('\nTo start the server:');
  console.log('  npm run server');
  console.log('  or');
  console.log('  npm run dev (for frontend + backend)');
  
} catch (error) {
  console.error('\n❌ Import failed:', error.message);
  console.error('\nStack trace:', error.stack);
  process.exit(1);
}
