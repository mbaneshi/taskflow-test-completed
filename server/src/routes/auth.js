/**
 * Authentication Routes
 * 
 * Handles user registration, login, logout, and JWT token management.
 * Implements secure authentication with password hashing and token generation.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticateToken, generateToken } from '../middleware/auth.js';
import { logLogin, logLogout } from '../middleware/logging.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          username: !username ? 'Username is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });
    
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        details: {
          email: existingUser.email === email.toLowerCase() ? 'Email already registered' : null,
          username: existingUser.username === username ? 'Username already taken' : null
        }
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
      role: role === 'admin' ? 'user' // Prevent admin registration through API
    });
    
    await user.save();
    
    // Generate JWT token
    const tokenData = {
      token: generateToken(user._id, user.role),
      expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 hours
    };
    
    // Log the registration
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    // Update user login info and log activity
    await user.updateLoginInfo();
    await logLogin(user, tokenData, ipAddress, userAgent);
    
    // Return user data (without password) and token
    res.status(201).json({
      message: 'User registered successfully',
      user: user.profile,
      token: tokenData.token,
      expiresAt: tokenData.expiresAt
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }
    
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Generate JWT token
    const tokenData = {
      token: generateToken(user._id, user.role),
      expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 hours
    };
    
    // Update user login info
    await user.updateLoginInfo();
    
    // Log the login
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    await logLogin(user, tokenData, ipAddress, userAgent);
    
    // Return user data and token
    res.json({
      message: 'Login successful',
      user: user.profile,
      token: tokenData.token,
      expiresAt: tokenData.expiresAt
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user and invalidate token
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { user, token } = req;
    
    // Update user logout info
    await user.updateLogoutInfo();
    
    // Log the logout
    const ipAddress = req.ip || req.connection.remoteAddress;
    await logLogout(user._id, token, ipAddress);
    
    res.json({
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/auth/profile
 * Get current user profile
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user.profile
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update current user profile
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = req.user;
    
    // Check if new email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(409).json({
          error: 'Email already taken by another user'
        });
      }
    }
    
    // Check if new username is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(409).json({
          error: 'Username already taken by another user'
        });
      }
    }
    
    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email.toLowerCase();
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: user.profile
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    
    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          currentPassword: !currentPassword ? 'Current password is required' : null,
          newPassword: !newPassword ? 'New password is required' : null
        }
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      error: 'Password change failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/auth/refresh-token
 * Refresh JWT token
 */
router.post('/refresh-token', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Generate new token
    const tokenData = {
      token: generateToken(user._id, user.role),
      expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 hours
    };
    
    res.json({
      message: 'Token refreshed successfully',
      token: tokenData.token,
      expiresAt: tokenData.expiresAt
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
