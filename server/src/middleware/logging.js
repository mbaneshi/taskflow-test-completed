/**
 * Logging Middleware
 * 
 * Tracks user activity and API requests for audit purposes.
 * Implements user activity logging as required by Task 3.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import UserLog from '../models/UserLog.js';

/**
 * Middleware to log user activity
 * Tracks all API requests and user actions
 */
export const logUserActivity = async (req, res, next) => {
  // Store original send method
  const originalSend = res.send;
  
  // Override send method to capture response
  res.send = function(data) {
    // Restore original send method
    res.send = originalSend;
    
    // Log the request after response is sent
    logRequest(req, res, data);
    
    // Call original send method
    return originalSend.call(this, data);
  };
  
  next();
};

/**
 * Log the request details
 */
const logRequest = async (req, res, responseData) => {
  try {
    // Skip logging for certain endpoints
    if (shouldSkipLogging(req.path)) {
      return;
    }
    
    // Extract user information if authenticated
    let userData = null;
    if (req.user) {
      userData = {
        userId: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      };
    }
    
    // Get IP address
    const ipAddress = getClientIP(req);
    
    // Get user agent
    const userAgent = req.get('User-Agent');
    
    // Determine action type based on request
    const action = determineAction(req);
    
    // Create log entry
    const logEntry = {
      userId: userData?.userId || null,
      username: userData?.username || 'anonymous',
      email: userData?.email || 'anonymous@example.com',
      role: userData?.role || 'guest',
      action: action,
      ipAddress: ipAddress,
      userAgent: userAgent,
      requestPath: req.path,
      requestMethod: req.method,
      requestBody: sanitizeRequestBody(req.body),
      responseStatus: res.statusCode,
      responseSize: JSON.stringify(responseData).length,
      timestamp: new Date(),
      metadata: {
        query: req.query,
        params: req.params,
        headers: sanitizeHeaders(req.headers)
      }
    };
    
    // Save to database if user is authenticated
    if (userData?.userId) {
      await UserLog.create(logEntry);
    }
    
    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📝 Activity Log: ${action} - ${req.method} ${req.path} - ${userData?.username || 'anonymous'} - ${ipAddress}`);
    }
    
  } catch (error) {
    // Don't let logging errors break the application
    console.error('Logging error:', error);
  }
};

/**
 * Determine if request should be skipped for logging
 */
const shouldSkipLogging = (path) => {
  const skipPaths = [
    '/api/health',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ];
  
  return skipPaths.some(skipPath => path.startsWith(skipPath));
};

/**
 * Get client IP address
 */
const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket?.remoteAddress || 
         'unknown';
};

/**
 * Determine action type based on request
 */
const determineAction = (req) => {
  const { method, path } = req;
  
  // Authentication actions
  if (path.includes('/auth/login')) return 'login';
  if (path.includes('/auth/logout')) return 'logout';
  if (path.includes('/auth/register')) return 'register';
  if (path.includes('/auth/password-reset')) return 'password_reset';
  
  // Task actions
  if (path.includes('/tasks')) {
    if (method === 'POST') return 'task_create';
    if (method === 'PUT' || method === 'PATCH') return 'task_update';
    if (method === 'DELETE') return 'task_delete';
    return 'task_view';
  }
  
  // User actions
  if (path.includes('/users')) {
    if (method === 'POST') return 'user_create';
    if (method === 'PUT' || method === 'PATCH') return 'user_update';
    if (method === 'DELETE') return 'user_delete';
    return 'user_view';
  }
  
  // Log actions
  if (path.includes('/logs')) {
    if (method === 'DELETE') return 'log_delete';
    return 'log_view';
  }
  
  // Generic actions
  if (method === 'GET') return 'view';
  if (method === 'POST') return 'create';
  if (method === 'PUT' || method === 'PATCH') return 'update';
  if (method === 'DELETE') return 'delete';
  
  return 'other';
};

/**
 * Sanitize request body for logging
 * Removes sensitive information like passwords
 */
const sanitizeRequestBody = (body) => {
  if (!body) return {};
  
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

/**
 * Sanitize headers for logging
 * Removes sensitive header information
 */
const sanitizeHeaders = (headers) => {
  const sanitized = { ...headers };
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
  
  sensitiveHeaders.forEach(header => {
    if (sanitized[header]) {
      sanitized[header] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

/**
 * Log specific user action
 * Used for explicit logging of important actions
 */
export const logUserAction = async (userId, action, details = {}) => {
  try {
    if (!userId) return;
    
    const logEntry = {
      userId,
      action,
      timestamp: new Date(),
      metadata: details
    };
    
    await UserLog.create(logEntry);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📝 User Action: ${action} - User: ${userId}`);
    }
    
  } catch (error) {
    console.error('User action logging error:', error);
  }
};

/**
 * Log login activity
 * Used specifically for login events
 */
export const logLogin = async (userData, tokenData, ipAddress, userAgent) => {
  try {
    await UserLog.logLogin(userData, tokenData, ipAddress, userAgent);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Login: ${userData.username} (${userData.role}) from ${ipAddress}`);
    }
    
  } catch (error) {
    console.error('Login logging error:', error);
  }
};

/**
 * Log logout activity
 * Used specifically for logout events
 */
export const logLogout = async (userId, token, ipAddress) => {
  try {
    await UserLog.logLogout(userId, token, ipAddress);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚪 Logout: User ${userId} from ${ipAddress}`);
    }
    
  } catch (error) {
    console.error('Logout logging error:', error);
  }
};

export default {
  logUserActivity,
  logUserAction,
  logLogin,
  logLogout
};
