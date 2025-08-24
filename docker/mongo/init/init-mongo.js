// MongoDB Initialization Script for TaskFlow
// This script runs when the MongoDB container starts for the first time

print('🚀 Starting TaskFlow database initialization...');

// Switch to the taskflow database
db = db.getSiblingDB('taskflow');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password"],
      properties: {
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 30
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        password: {
          bsonType: "string",
          minLength: 6
        }
      }
    }
  }
});

db.createCollection('tasks', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "assignedTo", "createdBy"],
      properties: {
        title: {
          bsonType: "string",
          minLength: 3,
          maxLength: 100
        },
        description: {
          bsonType: "string",
          minLength: 10,
          maxLength: 500
        }
      }
    }
  }
});

db.createCollection('userlogs');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.tasks.createIndex({ "assignedTo": 1 });
db.tasks.createIndex({ "status": 1 });
db.tasks.createIndex({ "dueDate": 1 });
db.userlogs.createIndex({ "userId": 1, "timestamp": -1 });

print('✅ Database collections and indexes created successfully');

// Create initial admin user (password: admin123)
// Note: In production, this should be changed immediately
db.users.insertOne({
  username: "admin",
  email: "admin@taskflow.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Q8qKqG", // admin123
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('✅ Initial admin user created (username: admin, password: admin123)');
print('⚠️  IMPORTANT: Change admin password in production!');

print('🎉 TaskFlow database initialization completed successfully!');
