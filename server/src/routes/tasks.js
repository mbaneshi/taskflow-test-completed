/**
 * Task Routes
 * 
 * Handles task CRUD operations and filtering capabilities.
 * Implements Task 2 requirements: filtering by completion status and search by title.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import express from 'express';
import Task from '../models/Task.js';
import { requireOwnershipOrAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/tasks
 * Get tasks with filtering and search capabilities
 * Implements Task 2 requirements
 */
router.get('/', async (req, res) => {
  try {
    const {
      status,
      priority,
      search,
      assignedTo,
      createdBy,
      dueDate,
      tags,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Status filter (Task 2 requirement)
    if (status && status !== 'all') {
      if (status === 'complete') {
        filter.status = 'complete';
      } else if (status === 'incomplete') {
        filter.status = { $in: ['pending', 'in-progress'] };
      } else {
        filter.status = status;
      }
    }
    
    // Priority filter
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    // Search filter (Task 2 requirement - search by title and description)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }
    
    // User filter
    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }
    
    if (createdBy) {
      filter.createdBy = createdBy;
    }
    
    // Due date filter
    if (dueDate) {
      if (dueDate === 'overdue') {
        filter.dueDate = { $lt: new Date() };
        filter.status = { $nin: ['complete', 'cancelled'] };
      } else if (dueDate === 'today') {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        filter.dueDate = { $gte: startOfDay, $lt: endOfDay };
      } else if (dueDate === 'week') {
        const today = new Date();
        const endOfWeek = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
        filter.dueDate = { $gte: today, $lte: endOfWeek };
      }
    }
    
    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalTasks = await Task.countDocuments(filter);
    
    // Calculate task statistics
    const stats = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          complete: { $sum: { $cond: [{ $eq: ['$status', 'complete'] }, 1, 0] } },
          incomplete: { $sum: { $cond: [{ $in: ['$status', ['pending', 'in-progress']] }, 1, 0] } },
          overdue: { $sum: { $cond: [{ $and: [{ $lt: ['$dueDate', new Date()] }, { $nin: ['$status', ['complete', 'cancelled']] }] }, 1, 0] } }
        }
      }
    ]);
    
    const taskStats = stats[0] || { total: 0, complete: 0, incomplete: 0, overdue: 0 };
    
    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalTasks,
        pages: Math.ceil(totalTasks / parseInt(limit))
      },
      stats: taskStats,
      filters: {
        status,
        priority,
        search,
        assignedTo,
        createdBy,
        dueDate,
        tags
      }
    });
    
  } catch (error) {
    console.error('Task fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch tasks',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/tasks/:id
 * Get a specific task by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .populate('comments.user', 'username email');
    
    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }
    
    res.json({ task });
    
  } catch (error) {
    console.error('Task fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch task',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 */
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      priority = 'medium',
      dueDate,
      assignedTo,
      tags = [],
      estimatedHours = 0
    } = req.body;
    
    // Validation
    if (!title || !description || !dueDate || !assignedTo) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          title: !title ? 'Title is required' : null,
          description: !description ? 'Description is required' : null,
          dueDate: !dueDate ? 'Due date is required' : null,
          assignedTo: !assignedTo ? 'Assignee is required' : null
        }
      });
    }
    
    // Create new task
    const task = new Task({
      title,
      description,
      priority,
      dueDate: new Date(dueDate),
      assignedTo,
      createdBy: req.user._id,
      tags: Array.isArray(tags) ? tags : [tags],
      estimatedHours: parseFloat(estimatedHours) || 0
    });
    
    await task.save();
    
    // Populate user references
    await task.populate('assignedTo', 'username email');
    await task.populate('createdBy', 'username email');
    
    res.status(201).json({
      message: 'Task created successfully',
      task
    });
    
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(500).json({
      error: 'Failed to create task',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * PUT /api/tasks/:id
 * Update a task
 */
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }
    
    // Check ownership or admin access
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied. You can only update tasks you created.'
      });
    }
    
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      tags,
      estimatedHours,
      actualHours
    } = req.body;
    
    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (tags !== undefined) task.tags = Array.isArray(tags) ? tags : [tags];
    if (estimatedHours !== undefined) task.estimatedHours = parseFloat(estimatedHours) || 0;
    if (actualHours !== undefined) task.actualHours = parseFloat(actualHours) || 0;
    
    // Update completion status if status is complete
    if (status === 'complete') {
      task.isCompleted = true;
      task.completedAt = new Date();
      task.progress = 100;
    }
    
    await task.save();
    
    // Populate user references
    await task.populate('assignedTo', 'username email');
    await task.populate('createdBy', 'username email');
    
    res.json({
      message: 'Task updated successfully',
      task
    });
    
  } catch (error) {
    console.error('Task update error:', error);
    res.status(500).json({
      error: 'Failed to update task',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }
    
    // Check ownership or admin access
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied. You can only delete tasks you created.'
      });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    res.json({
      message: 'Task deleted successfully'
    });
    
  } catch (error) {
    console.error('Task deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete task',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/tasks/:id/complete
 * Mark task as complete
 */
router.post('/:id/complete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }
    
    // Check if user can complete the task
    if (req.user.role !== 'admin' && 
        task.assignedTo.toString() !== req.user._id.toString() && 
        task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied. You can only complete tasks assigned to you or created by you.'
      });
    }
    
    await task.complete();
    
    res.json({
      message: 'Task marked as complete',
      task
    });
    
  } catch (error) {
    console.error('Task completion error:', error);
    res.status(500).json({
      error: 'Failed to complete task',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/tasks/:id/progress
 * Update task progress
 */
router.post('/:id/progress', async (req, res) => {
  try {
    const { progress } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }
    
    // Check if user can update progress
    if (req.user.role !== 'admin' && 
        task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied. You can only update progress of tasks assigned to you.'
      });
    }
    
    await task.updateProgress(parseInt(progress));
    
    res.json({
      message: 'Task progress updated',
      task
    });
    
  } catch (error) {
    console.error('Task progress update error:', error);
    res.status(500).json({
      error: 'Failed to update task progress',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/tasks/:id/comments
 * Add comment to task
 */
router.post('/:id/comments', async (req, res) => {
  try {
    const { content } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Comment content is required'
      });
    }
    
    await task.addComment(req.user._id, content.trim());
    
    // Populate the new comment
    await task.populate('comments.user', 'username email');
    
    res.json({
      message: 'Comment added successfully',
      task
    });
    
  } catch (error) {
    console.error('Comment addition error:', error);
    res.status(500).json({
      error: 'Failed to add comment',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
