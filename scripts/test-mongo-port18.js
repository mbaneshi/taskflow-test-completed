#!/usr/bin/env node

/**
 * Simple MongoDB Connection Test (Port 27018)
 */

import mongoose from 'mongoose';

const mongoURI = 'mongodb://admin:taskflow123@localhost:27018/taskflow?authSource=admin';

console.log('🔍 Testing MongoDB connection (port 27018)...');
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
