import { Request, Response, NextFunction } from 'express'
import UserLog from '../models/UserLog.js'

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string
    username: string
    role: string
  }
}

/**
 * Middleware to log user activity
 */
export const logUserActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest
    
    // Skip logging for certain endpoints
    if (req.path === '/api/health' || req.path.startsWith('/api/logs')) {
      return next()
    }

    // Extract user information if available
    const userId = authenticatedReq.user?._id
    const action = `${req.method} ${req.path}`
    
    // Extract IP address
    const ipAddress = req.ip || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress

    // Extract user agent
    const userAgent = req.get('User-Agent')

    // Create log entry
    if (userId) {
      const logData = {
        userId,
        action,
        details: {
          method: req.method,
          path: req.path,
          query: req.query,
          body: req.method !== 'GET' ? req.body : undefined,
          ipAddress,
          userAgent
        },
        ipAddress,
        userAgent
      }

      // Log asynchronously (don't wait for it)
      UserLog.create(logData).catch(err => {
        console.error('Error logging user activity:', err)
      })
    }

    next()
  } catch (error) {
    console.error('Error in logging middleware:', error)
    next()
  }
}

/**
 * Log user login activity
 */
export const logLogin = async (
  req: Request,
  userId: string,
  action: string = 'user_login'
): Promise<void> => {
  try {
    const ipAddress = req.ip || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress

    const userAgent = req.get('User-Agent')

    await UserLog.create({
      userId,
      action,
      details: {
        method: req.method,
        path: req.path,
        ipAddress,
        userAgent,
        timestamp: new Date()
      },
      ipAddress,
      userAgent
    })
  } catch (error) {
    console.error('Error logging login:', error)
  }
}

/**
 * Log user logout activity
 */
export const logLogout = async (
  req: Request,
  userId: string,
  action: string = 'user_logout'
): Promise<void> => {
  try {
    const ipAddress = req.ip || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress

    const userAgent = req.get('User-Agent')

    await UserLog.create({
      userId,
      action,
      details: {
        method: req.method,
        path: req.path,
        ipAddress,
        userAgent,
        timestamp: new Date()
      },
      ipAddress,
      userAgent
    })
  } catch (error) {
    console.error('Error logging logout:', error)
  }
}

/**
 * Log specific user action
 */
export const logUserAction = async (
  req: Request,
  userId: string,
  action: string,
  details: Record<string, unknown> = {}
): Promise<void> => {
  try {
    const ipAddress = req.ip || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress

    const userAgent = req.get('User-Agent')

    await UserLog.create({
      userId,
      action,
      details: {
        ...details,
        method: req.method,
        path: req.path,
        ipAddress,
        userAgent,
        timestamp: new Date()
      },
      ipAddress,
      userAgent
    })
  } catch (error) {
    console.error('Error logging user action:', error)
  }
}

/**
 * Log system activity (no user associated)
 */
export const logSystemActivity = async (
  req: Request,
  action: string,
  details: Record<string, unknown> = {}
): Promise<void> => {
  try {
    const ipAddress = req.ip || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress

    const userAgent = req.get('User-Agent')

    await UserLog.create({
      userId: null, // System activity has no user
      action,
      details: {
        ...details,
        method: req.method,
        path: req.path,
        ipAddress,
        userAgent,
        timestamp: new Date(),
        type: 'system'
      },
      ipAddress,
      userAgent
    })
  } catch (error) {
    console.error('Error logging system activity:', error)
  }
}
