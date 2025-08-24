#!/usr/bin/env node

/**
 * MongoDB Connection Test (Container IP)
 */

import mongoose from 'mongoose';

const mongoURI = 'mongodb://admin:taskflow123@192.168.97.2:27017/taskflow?authSource=admin';

console.log('🔍 Testing MongoDB connection (Container IP)...');
console.log(`URI: ${mongoURI}`);

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Database: ${mongoose.connection.name}`);
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:');
    console.log(`Error: ${error.message}`);
    console.log(`Code: ${error.code}`);
    process.exit(1);
  });
