#!/usr/bin/env node

/**
 * Simple MongoDB Connection Test (No Auth)
 */

import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/taskflow';

console.log('🔍 Testing MongoDB connection (no auth)...');
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
