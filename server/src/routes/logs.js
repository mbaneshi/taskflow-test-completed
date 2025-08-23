/**
 * Logs Routes
 * 
 * Handles user activity log management for administrators.
 * Implements Task 3 requirements: display and delete user logs.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import express from 'express';
import UserLog from '../models/UserLog.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/logs
 * Get user activity logs with filtering and pagination (admin only)
 * Implements Task 3 requirement: Display user logs
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const {
      userId,
      username,
      role,
      action,
      ipAddress,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = 'loginTime',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // User ID filter
    if (userId) {
      filter.userId = userId;
    }
    
    // Username filter
    if (username && username.trim()) {
      const usernameRegex = new RegExp(username.trim(), 'i');
      filter.username = usernameRegex;
    }
    
    // Role filter
    if (role && role !== 'all') {
      filter.role = role;
    }
    
    // Action filter
    if (action && action !== 'all') {
      filter.action = action;
    }
    
    // IP address filter
    if (ipAddress && ipAddress.trim()) {
      const ipRegex = new RegExp(ipAddress.trim(), 'i');
      filter.ipAddress = ipRegex;
    }
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }
    
    // General search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { username: searchRegex },
        { email: searchRegex },
        { ipAddress: searchRegex },
        { 'jwtToken.token': searchRegex }
      ];
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const logs = await UserLog.find(filter)
      .populate('userId', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalLogs = await UserLog.countDocuments(filter);
    
    // Calculate log statistics
    const stats = await UserLog.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          logins: { $sum: { $cond: [{ $eq: ['$action', 'login'] }, 1, 0] } },
          logouts: { $sum: { $cond: [{ $eq: ['$action', 'logout'] }, 1, 0] } },
          admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
          users: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          total: 1,
          logins: 1,
          logouts: 1,
          admins: 1,
          users: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      }
    ]);
    
    const logStats = stats[0] || { total: 0, logins: 0, logouts: 0, admins: 0, users: 0, uniqueUsers: 0 };
    
    // Format logs for response
    const formattedLogs = logs.map(log => ({
      id: log._id,
      userId: log.userId,
      username: log.username,
      email: log.email,
      role: log.role,
      action: log.action,
      loginTime: log.loginTime,
      logoutTime: log.logoutTime,
      sessionDuration: log.sessionDuration,
      jwtToken: log.jwtToken,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      deviceInfo: log.deviceInfo,
      isSuccessful: log.isSuccessful,
      failureReason: log.failureReason,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt
    }));
    
    res.json({
      logs: formattedLogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalLogs,
        pages: Math.ceil(totalLogs / parseInt(limit))
      },
      stats: logStats,
      filters: {
        userId,
        username,
        role,
        action,
        ipAddress,
        search,
        startDate,
        endDate
      }
    });
    
  } catch (error) {
    console.error('Logs fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch logs',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/logs/:id
 * Get a specific log entry by ID (admin only)
 */
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const log = await UserLog.findById(req.params.id)
      .populate('userId', 'username email');
    
    if (!log) {
      return res.status(404).json({
        error: 'Log entry not found'
      });
    }
    
    res.json({ log });
    
  } catch (error) {
    console.error('Log fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch log entry',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * DELETE /api/logs/:id
 * Delete a log entry (admin only)
 * Implements Task 3 requirement: DELETE functionality
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const log = await UserLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({
        error: 'Log entry not found'
      });
    }
    
    // Delete the log entry
    await UserLog.findByIdAndDelete(req.params.id);
    
    res.json({
      message: 'Log entry deleted successfully'
    });
    
  } catch (error) {
    console.error('Log deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete log entry',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * DELETE /api/logs/bulk
 * Delete multiple log entries (admin only)
 */
router.delete('/bulk', requireAdmin, async (req, res) => {
  try {
    const { logIds, filters } = req.body;
    
    if (!logIds && !filters) {
      return res.status(400).json({
        error: 'Either logIds or filters must be provided'
      });
    }
    
    let deleteFilter = {};
    
    if (logIds && Array.isArray(logIds) && logIds.length > 0) {
      // Delete specific log IDs
      deleteFilter = { _id: { $in: logIds } };
    } else if (filters) {
      // Delete based on filters
      deleteFilter = filters;
      
      // Add safety checks for dangerous filters
      if (Object.keys(deleteFilter).length === 0) {
        return res.status(400).json({
          error: 'Filters cannot be empty to prevent accidental deletion of all logs'
        });
      }
    }
    
    const result = await UserLog.deleteMany(deleteFilter);
    
    res.json({
      message: `Successfully deleted ${result.deletedCount} log entries`,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error('Bulk log deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete log entries',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/logs/user/:userId
 * Get logs for a specific user (admin only)
 */
router.get('/user/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      action,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = { userId };
    
    if (action && action !== 'all') {
      filter.action = action;
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const logs = await UserLog.find(filter)
      .populate('userId', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const totalLogs = await UserLog.countDocuments(filter);
    
    // Calculate user-specific statistics
    const userStats = await UserLog.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          logins: { $sum: { $cond: [{ $eq: ['$action', 'login'] }, 1, 0] } },
          logouts: { $sum: { $cond: [{ $eq: ['$action', 'logout'] }, 1, 0] } },
          lastLogin: { $max: '$loginTime' },
          lastLogout: { $max: '$logoutTime' }
        }
      }
    ]);
    
    const stats = userStats[0] || { total: 0, logins: 0, logouts: 0, lastLogin: null, lastLogout: null };
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalLogs,
        pages: Math.ceil(totalLogs / parseInt(limit))
      },
      stats,
      userId
    });
    
  } catch (error) {
    console.error('User logs fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch user logs',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/logs/analytics/summary
 * Get log analytics summary (admin only)
 */
router.get('/analytics/summary', requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }
    
    // Get overall statistics
    const overallStats = await UserLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalLogs: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          totalLogins: { $sum: { $cond: [{ $eq: ['$action', 'login'] }, 1, 0] } },
          totalLogouts: { $sum: { $cond: [{ $eq: ['$action', 'logout'] }, 1, 0] } },
          adminActions: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
          userActions: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } }
        }
      },
      {
        $project: {
          totalLogs: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          totalLogins: 1,
          totalLogouts: 1,
          adminActions: 1,
          userActions: 1
        }
      }
    ]);
    
    // Get daily activity for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyActivity = await UserLog.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          ...dateFilter
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          logins: { $sum: { $cond: [{ $eq: ['$action', 'login'] }, 1, 0] } },
          logouts: { $sum: { $cond: [{ $eq: ['$action', 'logout'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get top IP addresses
    const topIPs = await UserLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$ipAddress',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get top users by activity
    const topUsers = await UserLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$userId',
          username: { $first: '$username' },
          email: { $first: '$email' },
          role: { $first: '$role' },
          actionCount: { $sum: 1 }
        }
      },
      { $sort: { actionCount: -1 } },
      { $limit: 10 }
    ]);
    
    const summary = {
      overall: overallStats[0] || { totalLogs: 0, uniqueUsers: 0, totalLogins: 0, totalLogouts: 0, adminActions: 0, userActions: 0 },
      dailyActivity,
      topIPs,
      topUsers
    };
    
    res.json({ summary });
    
  } catch (error) {
    console.error('Log analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch log analytics',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
