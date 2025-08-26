import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import UserLog from '../models/UserLog.js'

// Define interfaces locally for now
interface IUser {
  _id: string
  username: string
  email: string
  role: string
  isActive: boolean
}

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
}

interface AuthenticatedRequest extends Request {
  user: IUser
  token: string
}

interface JwtPayload {
  userId: string
  exp?: number
}

/**
 * Middleware to authenticate JWT tokens
 * Verifies token validity and attaches user to request object
 */
export const authenticateToken = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
    
    if (!token) {
      res.status(401).json({ 
        success: false,
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      })
      return
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload
    
    // Check if user exists and is active
    const user = await User.findById(decoded.userId).select('-password')
    if (!user || !user.isActive) {
      res.status(401).json({ 
        success: false,
        error: 'Invalid token. User not found or inactive.',
        code: 'INVALID_USER'
      })
      return
    }
    
    // Check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      res.status(401).json({ 
        success: false,
        error: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      })
      return
    }
    
    // Attach user to request with proper type conversion
    (req as AuthenticatedRequest).user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    }
    ;(req as AuthenticatedRequest).token = token
    
    next()
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ 
          success: false,
          error: 'Invalid token format.',
          code: 'INVALID_TOKEN_FORMAT'
        })
        return
      }
      
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ 
          success: false,
          error: 'Token expired. Please login again.',
          code: 'TOKEN_EXPIRED'
        })
        return
      }
    }
    
    console.error('Authentication error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Authentication failed.',
      code: 'AUTH_ERROR'
    })
  }
}

/**
 * Middleware to check if user has required role
 * Must be used after authenticateToken
 */
export const requireRole = (requiredRole: string) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    const authenticatedReq = req as AuthenticatedRequest
    
    if (!authenticatedReq.user) {
      res.status(401).json({ 
        success: false,
        error: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      })
      return
    }
    
    if (authenticatedReq.user.role !== requiredRole && authenticatedReq.user.role !== 'admin') {
      res.status(403).json({ 
        success: false,
        error: 'Insufficient permissions.',
        code: 'INSUFFICIENT_PERMISSIONS',
        data: {
          required: requiredRole,
          current: authenticatedReq.user.role
        }
      })
      return
    }
    
    next()
  }
}

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = requireRole('admin')

/**
 * Middleware to check if user owns the resource or is admin
 * Must be used after authenticateToken
 */
export const requireOwnershipOrAdmin = (resourceUserIdField: string = 'userId') => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    const authenticatedReq = req as AuthenticatedRequest
    
    if (!authenticatedReq.user) {
      res.status(401).json({ 
        success: false,
        error: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      })
      return
    }
    
    // Admin can access everything
    if (authenticatedReq.user.role === 'admin') {
      return next()
    }
    
    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField]
    if (resourceUserId && resourceUserId === authenticatedReq.user._id.toString()) {
      return next()
    }
    
    res.status(403).json({ 
      success: false,
      error: 'Access denied. You can only access your own resources.',
      code: 'ACCESS_DENIED'
    })
  }
}

/**
 * Generate JWT token for user
 */
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  )
}

/**
 * Refresh JWT token
 */
export const refreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )
}

