/**
 * Database Configuration
 * 
 * MongoDB connection configuration and setup.
 * Handles connection pooling, error handling, and reconnection logic.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import mongoose from 'mongoose';

const connectDB = async (retries = 5, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Use environment variable or fallback to localhost with proper authentication
      const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:taskflow123@localhost:27017/taskflow?authSource=admin';
      
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        retryReads: true,
        connectTimeoutMS: 15000
      };
      
      console.log(`🔄 Attempting MongoDB connection (${attempt}/${retries})...`);
      const conn = await mongoose.connect(mongoURI, options);
      
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB disconnected');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });
      
      // Graceful shutdown
      process.on('SIGINT', async () => {
        try {
          await mongoose.connection.close();
          console.log('🛑 MongoDB connection closed through app termination');
          process.exit(0);
        } catch (err) {
          console.error('Error during MongoDB shutdown:', err);
          process.exit(1);
        }
      });
      
      return conn;
      
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
        console.error('❌ All connection attempts failed. Server will continue without database.');
        throw error;
      }
      
      console.log(`⏳ Retrying in ${delay}ms... (${retries - attempt} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff
      delay = Math.min(delay * 1.5, 10000);
    }
  }
};

export default connectDB;
