import React, { createContext, useState, useContext, ReactNode } from 'react'

// Define interfaces locally for now
type NotificationType = 'info' | 'success' | 'warning' | 'error'

interface Notification {
  id: string
  message: string
  type: NotificationType
  timestamp: Date
  read: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (message: string, type?: NotificationType) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  markAsRead: (id: string) => void
}

// Create the notification context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

/**
 * Custom hook to use the notification context
 */
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

/**
 * Notification Provider Component
 */
interface NotificationProviderProps {
  children: ReactNode
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (message: string, type: NotificationType = 'info'): void => {
    const id = Math.random().toString(36).substring(2, 9)
    const newNotification: Notification = {
      id,
      message,
      type,
      timestamp: new Date(),
      read: false
    }
    
    setNotifications((prev) => [...prev, newNotification])

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    }, 5000)
  }

  const removeNotification = (id: string): void => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const clearNotifications = (): void => {
    setNotifications([])
  }

  const markAsRead = (id: string): void => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    markAsRead
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
