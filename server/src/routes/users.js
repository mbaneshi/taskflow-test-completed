/**
 * User Routes
 * 
 * Handles user management operations for administrators.
 * Provides user CRUD operations and role management.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import express from 'express';
import User from '../models/User.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users
 * Get all users (admin only)
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const {
      role,
      search,
      isActive,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Role filter
    if (role && role !== 'all') {
      filter.role = role;
    }
    
    // Search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { username: searchRegex },
        { email: searchRegex }
      ];
    }
    
    // Active status filter
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    
    // Calculate user statistics
    const stats = await User.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          inactive: { $sum: { $cond: ['$isActive', 0, 1] } },
          admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
          regularUsers: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } }
        }
      }
    ]);
    
    const userStats = stats[0] || { total: 0, active: 0, inactive: 0, admins: 0, regularUsers: 0 };
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalUsers,
        pages: Math.ceil(totalUsers / parseInt(limit))
      },
      stats: userStats,
      filters: {
        role,
        search,
        isActive
      }
    });
    
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/users/:id
 * Get a specific user by ID (admin only)
 */
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.json({ user });
    
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * PUT /api/users/:id
 * Update a user (admin only)
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    const {
      username,
      email,
      role,
      isActive
    } = req.body;
    
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
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email.toLowerCase();
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    
    await user.save();
    
    res.json({
      message: 'User updated successfully',
      user: user.profile
    });
    
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * DELETE /api/users/:id
 * Delete a user (admin only)
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        error: 'You cannot delete your own account'
      });
    }
    
    // Prevent deletion of the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          error: 'Cannot delete the last admin user'
        });
      }
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/users/:id/activate
 * Activate a user account (admin only)
 */
router.post('/:id/activate', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    user.isActive = true;
    await user.save();
    
    res.json({
      message: 'User account activated successfully',
      user: user.profile
    });
    
  } catch (error) {
    console.error('User activation error:', error);
    res.status(500).json({
      error: 'Failed to activate user account',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/users/:id/deactivate
 * Deactivate a user account (admin only)
 */
router.post('/:id/deactivate', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        error: 'You cannot deactivate your own account'
      });
    }
    
    // Prevent deactivation of the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({
          error: 'Cannot deactivate the last active admin user'
        });
      }
    }
    
    user.isActive = false;
    await user.save();
    
    res.json({
      message: 'User account deactivated successfully',
      user: user.profile
    });
    
  } catch (error) {
    console.error('User deactivation error:', error);
    res.status(500).json({
      error: 'Failed to deactivate user account',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/users/:id/change-role
 * Change user role (admin only)
 */
router.post('/:id/change-role', requireAdmin, async (req, res) => {
  try {
    const { newRole } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    if (!newRole || !['user', 'admin'].includes(newRole)) {
      return res.status(400).json({
        error: 'Invalid role. Must be "user" or "admin"'
      });
    }
    
    // Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        error: 'You cannot change your own role'
      });
    }
    
    // Prevent changing role of the last admin
    if (user.role === 'admin' && newRole === 'user') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          error: 'Cannot change role of the last admin user'
        });
      }
    }
    
    user.role = newRole;
    await user.save();
    
    res.json({
      message: 'User role changed successfully',
      user: user.profile
    });
    
  } catch (error) {
    console.error('User role change error:', error);
    res.status(500).json({
      error: 'Failed to change user role',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/users/:id/activity
 * Get user activity summary (admin only)
 */
router.get('/:id/activity', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    const activitySummary = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      lastLogout: user.lastLogout,
      loginCount: user.loginCount,
      createdAt: user.createdAt,
      lastActivity: user.lastLogin || user.createdAt
    };
    
    res.json({ activitySummary });
    
  } catch (error) {
    console.error('User activity fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch user activity',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
