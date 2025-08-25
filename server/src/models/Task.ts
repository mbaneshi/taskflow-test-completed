import mongoose, { Schema, Document } from 'mongoose'

// Define interfaces locally for now
interface ITask extends Document {
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'complete' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  dueDate: Date
  assignedTo: mongoose.Types.ObjectId
  createdBy: mongoose.Types.ObjectId
  tags: string[]
  attachments: IAttachment[]
  comments: IComment[]
  estimatedHours: number
  actualHours: number
  isCompleted: boolean
  completedAt?: Date
  isOverdue: boolean
  timeSpent: number
  lastActivity: Date
}

interface IAttachment {
  filename: string
  originalName: string
  mimeType: string
  size: number
  uploadDate: Date
}

interface IComment {
  user: mongoose.Types.ObjectId
  content: string
  createdAt: Date
}

interface TaskModel extends mongoose.Model<ITask> {
  findByUser(userId: string): Promise<ITask[]>
  findByStatus(status: string): Promise<ITask[]>
  searchByTitle(title: string): Promise<ITask[]>
}

const taskSchema = new Schema<ITask, TaskModel>({
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
  },
  isOverdue: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number,
    min: [0, 'Time spent cannot be negative'],
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for task completion status
taskSchema.virtual('isOverdue').get(function(this: ITask): boolean {
  if (this.status === 'complete' || this.status === 'cancelled') {
    return false
  }
  return this.dueDate < new Date()
})

// Pre-save middleware to update completion status
taskSchema.pre('save', function(this: ITask, next) {
  if (this.isModified('status') && this.status === 'complete') {
    this.isCompleted = true
    this.completedAt = new Date()
  } else if (this.isModified('status') && this.status !== 'complete') {
    this.isCompleted = false
    this.completedAt = undefined
  }
  
  // Update last activity
  this.lastActivity = new Date()
  
  next()
})

// Static methods
taskSchema.statics.findByUser = async function(this: TaskModel, userId: string): Promise<ITask[]> {
  return this.find({ 
    $or: [{ assignedTo: userId }, { createdBy: userId }] 
  }).populate('assignedTo', 'username email').populate('createdBy', 'username email')
}

taskSchema.statics.findByStatus = async function(this: TaskModel, status: string): Promise<ITask[]> {
  return this.find({ status }).populate('assignedTo', 'username email').populate('createdBy', 'username email')
}

taskSchema.statics.searchByTitle = async function(this: TaskModel, title: string): Promise<ITask[]> {
  const regex = new RegExp(title, 'i')
  return this.find({ 
    $or: [
      { title: regex },
      { description: regex },
      { tags: regex }
    ]
  }).populate('assignedTo', 'username email').populate('createdBy', 'username email')
}

export default mongoose.model<ITask, TaskModel>('Task', taskSchema)

