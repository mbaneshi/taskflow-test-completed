/**
 * UserLog Model
 * 
 * MongoDB schema for tracking user activity logs.
 * Implements all requirements from Task 3: login time, logout time,
 * JWT token name, user name, role, and IP address.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import mongoose from 'mongoose';

const userLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: [true, 'User role is required']
  },
  action: {
    type: String,
    enum: ['login', 'logout', 'register', 'password_reset', 'profile_update'],
    required: [true, 'Action type is required']
  },
  loginTime: {
    type: Date,
    default: null
  },
  logoutTime: {
    type: Date,
    default: null
  },
  sessionDuration: {
    type: Number, // Duration in milliseconds
    default: 0
  },
  jwtToken: {
    token: {
      type: String,
      required: [true, 'JWT token is required']
    },
    expiresAt: {
      type: Date,
      required: [true, 'Token expiration is required']
    },
    isRevoked: {
      type: Boolean,
      default: false
    }
  },
  ipAddress: {
    type: String,
    required: [true, 'IP address is required'],
    trim: true
  },
  userAgent: {
    type: String,
    trim: true,
    default: null
  },
  location: {
    country: String,
    city: String,
    timezone: String
  },
  deviceInfo: {
    browser: String,
    version: String,
    os: String,
    platform: String
  },
  isSuccessful: {
    type: Boolean,
    default: true
  },
  failureReason: {
    type: String,
    trim: true,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for session duration in human-readable format
userLogSchema.virtual('sessionDurationFormatted').get(function() {
  if (!this.sessionDuration) return 'N/A';
  
  const seconds = Math.floor(this.sessionDuration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
});

// Virtual for token status
userLogSchema.virtual('tokenStatus').get(function() {
  if (this.jwtToken.isRevoked) return 'revoked';
  if (new Date() > this.jwtToken.expiresAt) return 'expired';
  return 'active';
});

// Virtual for is online status
userLogSchema.virtual('isOnline').get(function() {
  return this.action === 'login' && !this.logoutTime;
});

// Method to log login
userLogSchema.statics.logLogin = function(userData, tokenData, ipAddress, userAgent) {
  return this.create({
    userId: userData._id,
    username: userData.username,
    email: userData.email,
    role: userData.role,
    action: 'login',
    loginTime: new Date(),
    jwtToken: {
      token: tokenData.token,
      expiresAt: tokenData.expiresAt
    },
    ipAddress: ipAddress,
    userAgent: userAgent,
    deviceInfo: this.parseUserAgent(userAgent)
  });
};

// Method to log logout
userLogSchema.statics.logLogout = function(userId, token, ipAddress) {
  return this.findOneAndUpdate(
    {
      userId: userId,
      'jwtToken.token': token,
      action: 'login',
      logoutTime: null
    },
    {
      action: 'logout',
      logoutTime: new Date(),
      sessionDuration: new Date() - this.loginTime
    },
    { new: true }
  );
};

// Method to revoke token
userLogSchema.statics.revokeToken = function(token) {
  return this.findOneAndUpdate(
    { 'jwtToken.token': token },
    { 'jwtToken.isRevoked': true },
    { new: true }
  );
};

// Method to get active sessions for a user
userLogSchema.statics.getActiveSessions = function(userId) {
  return this.find({
    userId: userId,
    action: 'login',
    logoutTime: null,
    'jwtToken.isRevoked': false,
    'jwtToken.expiresAt': { $gt: new Date() }
  });
};

// Method to get user login history
userLogSchema.statics.getUserLoginHistory = function(userId, limit = 50) {
  return this.find({ userId: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Method to get failed login attempts
userLogSchema.statics.getFailedLogins = function(userId, hours = 24) {
  const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
  return this.find({
    userId: userId,
    isSuccessful: false,
    createdAt: { $gte: cutoffTime }
  });
};

// Static method to parse user agent string
userLogSchema.statics.parseUserAgent = function(userAgent) {
  if (!userAgent) return {};
  
  // Simple parsing - in production, use a library like ua-parser-js
  const browser = userAgent.includes('Chrome') ? 'Chrome' :
                  userAgent.includes('Firefox') ? 'Firefox' :
                  userAgent.includes('Safari') ? 'Safari' :
                  userAgent.includes('Edge') ? 'Edge' : 'Unknown';
  
  const os = userAgent.includes('Windows') ? 'Windows' :
             userAgent.includes('Mac') ? 'macOS' :
             userAgent.includes('Linux') ? 'Linux' :
             userAgent.includes('Android') ? 'Android' :
             userAgent.includes('iOS') ? 'iOS' : 'Unknown';
  
  return { browser, os, platform: os };
};

// Indexes for better query performance
userLogSchema.index({ userId: 1, createdAt: -1 });
userLogSchema.index({ action: 1 });
userLogSchema.index({ role: 1 });
userLogSchema.index({ ipAddress: 1 });
userLogSchema.index({ 'jwtToken.token': 1 });
userLogSchema.index({ loginTime: -1 });
userLogSchema.index({ logoutTime: -1 });
userLogSchema.index({ createdAt: -1 });

const UserLog = mongoose.model('UserLog', userLogSchema);

export default UserLog;
