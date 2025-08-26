import { Router, Request, Response } from 'express'
import Task from '../models/Task.js'
import { requireOwnershipOrAdmin } from '../middleware/auth.js'

interface AuthenticatedRequest extends Request {
  user: {
    _id: string
    role: string
  }
}

interface TaskQueryParams {
  status?: string
  priority?: string
  search?: string
  assignedTo?: string
  createdBy?: string
  dueDate?: string
  tags?: string
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: string
}

const router = Router()

/**
 * GET /api/tasks
 * Get tasks with filtering and search capabilities
 */
router.get('/', async (
  req: Request<{}, {}, {}, TaskQueryParams>,
  res: Response
): Promise<void> => {
  try {
    const {
      status,
      priority,
      search,
      assignedTo,
      createdBy,
      dueDate,
      tags,
      page = '1',
      limit = '20',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query
    
    // Build filter object
    const filter: Record<string, any> = {}
    
    // Status filter
    if (status && status !== 'all') {
      if (status === 'complete') {
        filter.status = 'complete'
      } else if (status === 'incomplete') {
        filter.status = { $in: ['pending', 'in-progress'] }
      } else {
        filter.status = status
      }
    }
    
    // Priority filter
    if (priority && priority !== 'all') {
      filter.priority = priority
    }
    
    // Search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i')
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    }
    
    // User filter
    if (assignedTo) {
      filter.assignedTo = assignedTo
    }
    
    if (createdBy) {
      filter.createdBy = createdBy
    }
    
    // Due date filter
    if (dueDate) {
      if (dueDate === 'overdue') {
        filter.dueDate = { $lt: new Date() }
        filter.status = { $nin: ['complete', 'cancelled'] }
      } else if (dueDate === 'today') {
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        filter.dueDate = { $gte: startOfDay, $lt: endOfDay }
      } else if (dueDate === 'week') {
        const today = new Date()
        const endOfWeek = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
        filter.dueDate = { $gte: today, $lte: endOfWeek }
      }
    }
    
    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim())
      filter.tags = { $in: tagArray }
    }
    
    // Build sort object
    const sort: Record<string, 1 | -1> = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1
    
    // Pagination
    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    const skip = (pageNum - 1) * limitNum
    
    // Execute query
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('assignedTo', 'username email')
        .populate('createdBy', 'username email')
        .lean(),
      Task.countDocuments(filter)
    ])
    
    const totalPages = Math.ceil(total / limitNum)
    
    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks',
      code: 'FETCH_ERROR'
    })
  }
})

/**
 * POST /api/tasks
 * Create a new task
 */
router.post('/', async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest
    const taskData = {
      ...req.body,
      createdBy: authenticatedReq.user._id
    }
    
    const task = new Task(taskData)
    await task.save()
    
    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    })
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create task',
      code: 'CREATE_ERROR'
    })
  }
})

/**
 * GET /api/tasks/:id
 * Get a specific task by ID
 */
router.get('/:id', async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
    
    if (!task) {
      res.status(404).json({
        success: false,
        error: 'Task not found',
        code: 'TASK_NOT_FOUND'
      })
      return
    }
    
    res.json({
      success: true,
      data: task
    })
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task',
      code: 'FETCH_ERROR'
    })
  }
})

/**
 * PUT /api/tasks/:id
 * Update a task
 */
router.put('/:id', requireOwnershipOrAdmin('assignedTo'), async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'username email').populate('createdBy', 'username email')
    
    if (!task) {
      res.status(404).json({
        success: false,
        error: 'Task not found',
        code: 'TASK_NOT_FOUND'
      })
      return
    }
    
    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    })
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update task',
      code: 'UPDATE_ERROR'
    })
  }
})

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete('/:id', requireOwnershipOrAdmin('assignedTo'), async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    
    if (!task) {
      res.status(404).json({
        success: false,
        error: 'Task not found',
        code: 'TASK_NOT_FOUND'
      })
      return
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete task',
      code: 'DELETE_ERROR'
    })
  }
})

export default router
