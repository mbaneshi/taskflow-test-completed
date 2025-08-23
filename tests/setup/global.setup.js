/**
 * Global Test Setup
 * 
 * Sets up test environment, database connections, and test data.
 * Runs once before all tests start.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export default async function globalSetup() {
  console.log('🚀 Starting global test setup...');
  
  try {
    // Start in-memory MongoDB server for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Set test database URI
    process.env.MONGODB_URI = mongoUri;
    process.env.TEST_MONGODB_URI = mongoUri;
    
    console.log(`📊 Test MongoDB started: ${mongoUri}`);
    
    // Connect to test database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to test database');
    
    // Create test database indexes
    await createTestIndexes();
    
    // Seed test data
    await seedTestData();
    
    console.log('✅ Global test setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global test setup failed:', error);
    throw error;
  }
}

/**
 * Create test database indexes
 */
async function createTestIndexes() {
  try {
    console.log('📊 Creating test database indexes...');
    
    // Get all models
    const User = (await import('../../server/src/models/User.js')).default;
    const Task = (await import('../../server/src/models/Task.js')).default;
    const UserLog = (await import('../../server/src/models/UserLog.js')).default;
    
    // Create indexes for User model
    await User.createIndexes();
    
    // Create indexes for Task model
    await Task.createIndexes();
    
    // Create indexes for UserLog model
    await UserLog.createIndexes();
    
    console.log('✅ Test database indexes created');
    
  } catch (error) {
    console.error('❌ Failed to create test database indexes:', error);
    throw error;
  }
}

/**
 * Seed test database with initial data
 */
async function seedTestData() {
  try {
    console.log('🌱 Seeding test database...');
    
    // Get all models
    const User = (await import('../../server/src/models/User.js')).default;
    const Task = (await import('../../server/src/models/Task.js')).default;
    const UserLog = (await import('../../server/src/models/UserLog.js')).default;
    
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    await UserLog.deleteMany({});
    
    // Create test users
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword123',
      role: 'user',
      isActive: true
    });
    
    const testAdmin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword123',
      role: 'admin',
      isActive: true
    });
    
    await testUser.save();
    await testAdmin.save();
    
    console.log('✅ Test users created');
    
    // Create test tasks
    const testTasks = [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the TaskFlow project',
        status: 'pending',
        priority: 'high',
        progress: 0,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        assignedTo: testUser._id,
        createdBy: testAdmin._id,
        tags: ['documentation', 'project'],
        estimatedHours: 16
      },
      {
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication system',
        status: 'complete',
        priority: 'high',
        progress: 100,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        assignedTo: testAdmin._id,
        createdBy: testAdmin._id,
        tags: ['authentication', 'security'],
        estimatedHours: 24,
        isCompleted: true,
        completedAt: new Date()
      },
      {
        title: 'Design user interface',
        description: 'Create responsive UI components with TailwindCSS',
        status: 'in-progress',
        priority: 'medium',
        progress: 60,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        assignedTo: testUser._id,
        createdBy: testAdmin._id,
        tags: ['ui', 'design', 'frontend'],
        estimatedHours: 20
      }
    ];
    
    for (const taskData of testTasks) {
      const task = new Task(taskData);
      await task.save();
    }
    
    console.log('✅ Test tasks created');
    
    // Create test user logs
    const testLogs = [
      {
        userId: testUser._id,
        username: testUser.username,
        email: testUser.email,
        role: testUser.role,
        action: 'login',
        loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        logoutTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        sessionDuration: 60 * 60 * 1000, // 1 hour
        jwtToken: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-token-1',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          isRevoked: false
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Test Browser)',
        deviceInfo: {
          browser: 'Test Browser',
          os: 'Test OS',
          platform: 'Test Platform'
        },
        isSuccessful: true
      },
      {
        userId: testAdmin._id,
        username: testAdmin.username,
        email: testAdmin.email,
        role: testAdmin.role,
        action: 'login',
        loginTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        logoutTime: null,
        sessionDuration: 0,
        jwtToken: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-token-2',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          isRevoked: false
        },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Admin Browser)',
        deviceInfo: {
          browser: 'Admin Browser',
          os: 'Admin OS',
          platform: 'Admin Platform'
        },
        isSuccessful: true
      }
    ];
    
    for (const logData of testLogs) {
      const log = new UserLog(logData);
      await log.save();
    }
    
    console.log('✅ Test user logs created');
    
    // Store test data globally for tests to access
    global.testData = {
      users: {
        testUser: testUser,
        testAdmin: testAdmin
      },
      tasks: await Task.find({}),
      logs: await UserLog.find({})
    };
    
    console.log('✅ Test data seeded successfully');
    
  } catch (error) {
    console.error('❌ Failed to seed test data:', error);
    throw error;
  }
}
