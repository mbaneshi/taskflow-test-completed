import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'
import { logLogin, logLogout } from '../middleware/logging.js'

interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface LoginRequest {
  email: string
  password: string
}

const router = Router()

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, confirmPassword } = req.body

    // Validation
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        error: 'Passwords do not match',
        code: 'PASSWORD_MISMATCH'
      })
      return
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
        code: 'PASSWORD_TOO_SHORT'
      })
      return
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken',
        code: existingUser.email === email ? 'EMAIL_EXISTS' : 'USERNAME_EXISTS'
      })
      return
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    })

    await user.save()

    // Generate token
    const token = generateToken((user._id as any).toString())

    // Log the registration
    await logLogin(req, (user._id as any).toString(), 'user_registered')

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      },
      message: 'User registered successfully'
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    })
  }
})

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      })
      return
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      })
      return
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      })
      return
    }

    // Update login information
    await user.updateLoginInfo()

    // Generate token
    const token = generateToken((user._id as any).toString())

    // Log the login
    await logLogin(req, (user._id as any).toString(), 'user_login')

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        },
        token
      },
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Login failed',
      code: 'LOGIN_ERROR'
    })
  }
})

/**
 * POST /api/auth/logout
 * User logout
 */
router.post('/logout', async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
        
        // Update user logout information
        await User.findByIdAndUpdate(decoded.userId, {
          lastLogout: new Date()
        })

        // Log the logout
        await logLogout(req, decoded.userId, 'user_logout')
      } catch (error) {
        // Token is invalid, but we still want to respond successfully
        console.log('Invalid token during logout:', error)
      }
    }

    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      code: 'LOGOUT_ERROR'
    })
  }
})

/**
 * GET /api/auth/profile
 * Get user profile (requires authentication)
 */
router.get('/profile', async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
        code: 'NO_TOKEN'
      })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      })
      return
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount,
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      code: 'PROFILE_FETCH_ERROR'
    })
  }
})

export default router
