import { IUser, ITask } from './models'

// Context types
export interface AuthContextType {
  user: IUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<IUser>
  logout: () => void
  register: (userData: RegisterData) => Promise<IUser>
  isAuthenticated: boolean
}

export interface NotificationContextType {
  notifications: Notification[]
  addNotification: (message: string, type?: NotificationType) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

// Component prop types
export interface TaskListProps {
  tasks: ITask[]
  onTaskUpdate: (taskId: string, updates: Partial<ITask>) => void
  onTaskDelete: (taskId: string) => void
  onTaskCreate: (task: Omit<ITask, '_id' | 'createdAt' | 'updatedAt'>) => void
}

export interface TaskFormProps {
  onSubmit: (task: Omit<ITask, '_id' | 'createdAt' | 'updatedAt'>) => void
  initialData?: Partial<ITask>
  mode: 'create' | 'edit'
}

// Utility types
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  timestamp: Date
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

