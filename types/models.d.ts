import { Document, Types } from 'mongoose'

// Base interfaces
export interface BaseDocument extends Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

// User interfaces
export interface IUser extends BaseDocument {
  username: string
  email: string
  password: string
  role: 'user' | 'admin'
  isActive: boolean
  lastLogin?: Date
  lastLogout?: Date
  loginCount: number
  comparePassword(candidatePassword: string): Promise<boolean>
  updateLoginInfo(): Promise<IUser>
}

export interface IUserProfile {
  id: string
  username: string
  email: string
  role: string
  isActive: boolean
  lastLogin?: Date
  loginCount: number
  createdAt: Date
}

// Task interfaces
export interface ITask extends BaseDocument {
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'complete' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  dueDate: Date
  assignedTo: Types.ObjectId | IUser
  createdBy: Types.ObjectId | IUser
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

export interface IAttachment {
  filename: string
  originalName: string
  mimeType: string
  size: number
  uploadDate: Date
}

export interface IComment {
  user: Types.ObjectId | IUser
  content: string
  createdAt: Date
}

// UserLog interfaces
export interface IUserLog extends BaseDocument {
  userId: Types.ObjectId | IUser
  action: string
  details: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

// API Response interfaces
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
