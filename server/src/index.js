/**
 * TaskFlow Backend Server
 * 
 * Express server with MongoDB connection, JWT authentication,
 * and comprehensive API endpoints for the TaskFlow application.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import WebSocketServer from './websocket.js';

// Import routes
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import userRoutes from './routes/users.js';
import logRoutes from './routes/logs.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { logUserActivity } from './middleware/logging.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for production)
app.use(express.static(join(__dirname, '../../dist')));

// Import database configuration
import connectDB from './config/database.js';

// Database connection
connectDB();

// Logging middleware for all requests
app.use(logUserActivity);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/logs', authenticateToken, logRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Serve React app for production
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize WebSocket server
const wss = new WebSocketServer(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 TaskFlow server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
  console.log(`🔌 WebSocket server initialized`);
});

export default app;
