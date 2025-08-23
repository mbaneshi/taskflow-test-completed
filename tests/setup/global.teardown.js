/**
 * Global Test Teardown
 * 
 * Cleans up test environment, database connections, and test data.
 * Runs once after all tests complete.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import mongoose from 'mongoose';

export default async function globalTeardown() {
  console.log('🧹 Starting global test teardown...');
  
  try {
    // Disconnect from test database
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('✅ Disconnected from test database');
    }
    
    // Clear global test data
    if (global.testData) {
      delete global.testData;
      console.log('✅ Cleared global test data');
    }
    
    // Clear any remaining timers
    jest.clearAllTimers();
    
    // Clear any remaining mocks
    jest.clearAllMocks();
    
    console.log('✅ Global test teardown completed successfully');
    
  } catch (error) {
    console.error('❌ Global test teardown failed:', error);
    throw error;
  }
}
