/**
 * TaskFlow Backend Server
 * 
 * Express server with MongoDB connection, JWT authentication,
 * and comprehensive API endpoints for the TaskFlow application.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createServer, Server } from 'http'
import WebSocketServer from './websocket.js'

// Import routes
import authRoutes from './routes/auth.js'
import taskRoutes from './routes/tasks.js'
import userRoutes from './routes/users.js'
import logRoutes from './routes/logs.js'

// Import middleware
import { authenticateToken } from './middleware/auth.js'
import { logUserActivity } from './middleware/logging.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(import.meta.url)

const app: Application = express()
const server: Server = createServer(app)
const PORT: string | number = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files (for production)
app.use(express.static(join(__dirname, '../../dist')))

// Import database configuration
import connectDB from '../config/database.js'

// Database connection with error handling
connectDB().catch(err => {
  console.error('❌ Failed to connect to database:', err.message)
  console.log('⚠️  Server will continue running without database connection')
  console.log('💡 Check MongoDB container and connection settings')
})

// Logging middleware for all requests
app.use(logUserActivity)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', authenticateToken, taskRoutes)
app.use('/api/users', authenticateToken, userRoutes)
app.use('/api/logs', authenticateToken, logRoutes)

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState
  const dbStatus = dbState === 1 ? 'Connected' : 
                   dbState === 2 ? 'Connecting' : 
                   dbState === 3 ? 'Disconnecting' : 'Disconnected'
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    databaseCode: dbState,
    message: dbState === 1 ? 'Database connection established' : 'Database connection issues detected'
  })
})

// Serve React app for production
app.get('*', (req: Request, res: Response) => {
  res.sendFile(join(__dirname, '../../dist/index.html'))
})

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Initialize WebSocket server
const wss = new WebSocketServer(server)

// Start server
server.listen(PORT, () => {
  console.log(`🚀 TaskFlow server running on port ${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`)
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('✅ Server closed')
    mongoose.connection.close().then(() => {
      console.log('✅ Database connection closed')
      process.exit(0)
    })
  })
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('✅ Server closed')
    mongoose.connection.close().then(() => {
      console.log('✅ Database connection closed')
      process.exit(0)
    })
  })
})

export default app
