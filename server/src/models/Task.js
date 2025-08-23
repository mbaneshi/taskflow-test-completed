/**
 * Task Model
 * 
 * MongoDB schema for task management with filtering capabilities.
 * Includes status tracking, priority levels, and user assignments.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [3, 'Task title must be at least 3 characters'],
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true,
    minlength: [10, 'Task description must be at least 10 characters'],
    maxlength: [500, 'Task description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'complete', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  progress: {
    type: Number,
    min: [0, 'Progress cannot be negative'],
    max: [100, 'Progress cannot exceed 100%'],
    default: 0
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must be assigned to a user']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task creator is required']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  estimatedHours: {
    type: Number,
    min: [0, 'Estimated hours cannot be negative'],
    default: 0
  },
  actualHours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative'],
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for task completion status
taskSchema.virtual('isOverdue').get(function() {
  if (this.status === 'complete' || this.status === 'cancelled') {
    return false;
  }
  return new Date() > this.dueDate;
});

// Virtual for days remaining
taskSchema.virtual('daysRemaining').get(function() {
  if (this.status === 'complete' || this.status === 'cancelled') {
    return 0;
  }
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for task complexity (based on description length and estimated hours)
taskSchema.virtual('complexity').get(function() {
  const descLength = this.description.length;
  const hours = this.estimatedHours;
  
  if (descLength > 300 || hours > 40) return 'high';
  if (descLength > 150 || hours > 20) return 'medium';
  return 'low';
});

// Method to mark task as complete
taskSchema.methods.complete = function() {
  this.status = 'complete';
  this.isCompleted = true;
  this.completedAt = new Date();
  this.progress = 100;
  return this.save();
};

// Method to update progress
taskSchema.methods.updateProgress = function(newProgress) {
  if (newProgress >= 0 && newProgress <= 100) {
    this.progress = newProgress;
    if (newProgress === 100) {
      this.status = 'complete';
      this.isCompleted = true;
      this.completedAt = new Date();
    }
  }
  return this.save();
};

// Method to add comment
taskSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content
  });
  return this.save();
};

// Static method to find tasks by status
taskSchema.statics.findByStatus = function(status) {
  return this.find({ status: status });
};

// Static method to find overdue tasks
taskSchema.statics.findOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $nin: ['complete', 'cancelled'] }
  });
};

// Static method to find tasks by user
taskSchema.statics.findByUser = function(userId) {
  return this.find({ assignedTo: userId });
};

// Indexes for better query performance
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ isCompleted: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
