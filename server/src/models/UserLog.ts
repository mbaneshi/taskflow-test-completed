import mongoose, { Schema, Document } from 'mongoose'

// Define interfaces locally for now
interface IUserLog extends Document {
  userId: mongoose.Types.ObjectId
  action: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

interface UserLogModel extends mongoose.Model<IUserLog> {
  findByUser(userId: string): Promise<IUserLog[]>
  findByAction(action: string): Promise<IUserLog[]>
  findByDateRange(startDate: Date, endDate: Date): Promise<IUserLog[]>
  getUserActivitySummary(userId: string, days?: number): Promise<{ action: string; count: number }[]>
}

const userLogSchema = new Schema<IUserLog, UserLogModel>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true,
    maxlength: [100, 'Action cannot exceed 100 characters']
  },
  details: {
    type: Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    trim: true,
    maxlength: [45, 'IP address cannot exceed 45 characters']
  },
  userAgent: {
    type: String,
    trim: true,
    maxlength: [500, 'User agent cannot exceed 500 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Index for better query performance
userLogSchema.index({ userId: 1, timestamp: -1 })
userLogSchema.index({ action: 1, timestamp: -1 })
userLogSchema.index({ timestamp: -1 })

// Virtual for formatted timestamp
userLogSchema.virtual('formattedTimestamp').get(function(this: IUserLog): string {
  return this.timestamp.toLocaleString()
})

// Virtual for action category
userLogSchema.virtual('actionCategory').get(function(this: IUserLog): string {
  if (this.action.includes('login') || this.action.includes('logout')) {
    return 'authentication'
  } else if (this.action.includes('create') || this.action.includes('update') || this.action.includes('delete')) {
    return 'data_operation'
  } else if (this.action.includes('view') || this.action.includes('read')) {
    return 'data_access'
  } else {
    return 'other'
  }
})

// Static methods
userLogSchema.statics.findByUser = async function(this: UserLogModel, userId: string): Promise<IUserLog[]> {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .populate('userId', 'username email')
}

userLogSchema.statics.findByAction = async function(this: UserLogModel, action: string): Promise<IUserLog[]> {
  return this.find({ action })
    .sort({ timestamp: -1 })
    .populate('userId', 'username email')
}

userLogSchema.statics.findByDateRange = async function(
  this: UserLogModel, 
  startDate: Date, 
  endDate: Date
): Promise<IUserLog[]> {
  return this.find({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  })
    .sort({ timestamp: -1 })
    .populate('userId', 'username email')
}

userLogSchema.statics.getUserActivitySummary = async function(
  this: UserLogModel, 
  userId: string, 
  days: number = 30
): Promise<{ action: string; count: number }[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $project: {
        action: '$_id',
        count: 1,
        _id: 0
      }
    }
  ])
}

export default mongoose.model<IUserLog, UserLogModel>('UserLog', userLogSchema)

