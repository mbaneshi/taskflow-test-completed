import React, { useState } from 'react'
import { FaEdit, FaTrash, FaCheck, FaClock, FaFlag, FaUser, FaCalendarAlt, FaTags } from 'react-icons/fa'

// Define interfaces locally for now
interface Task {
  _id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'complete' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string
  assignedTo?: string
  tags: string[]
  estimatedHours?: number
  actualHours?: number
  createdAt: string
  updatedAt: string
}

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, newStatus: Task['status']) => void
  onPriorityChange: (taskId: string, newPriority: Task['priority']) => void
  className?: string
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: Task['status']): string => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const isOverdue = (): boolean => {
    if (task.status === 'complete' || task.status === 'cancelled') return false
    return new Date(task.dueDate) < new Date()
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const newStatus = event.target.value as Task['status']
    onStatusChange(task._id, newStatus)
  }

  const handlePriorityChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const newPriority = event.target.value as Task['priority']
    onPriorityChange(task._id, newPriority)
  }

  const handleDelete = (): void => {
    setShowDeleteConfirm(false)
    onDelete(task._id)
  }

  const toggleExpanded = (): void => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      {/* Task Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 
                className="text-lg font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600"
                onClick={toggleExpanded}
                title={task.title}
              >
                {task.title}
              </h3>
              
              {/* Priority Badge */}
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                <FaFlag className="inline mr-1" />
                {task.priority}
              </span>
              
              {/* Status Badge */}
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              
              {/* Overdue Indicator */}
              {isOverdue() && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                  <FaClock className="inline mr-1" />
                  Overdue
                </span>
              )}
            </div>
            
            {/* Description Preview */}
            {!isExpanded && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {task.description}
              </p>
            )}
            
            {/* Expanded Description */}
            {isExpanded && (
              <p className="text-gray-600 text-sm mb-3">
                {task.description}
              </p>
            )}
            
            {/* Task Meta Information */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              <div className="flex items-center gap-1">
                <FaCalendarAlt />
                <span>Due: {formatDate(task.dueDate)}</span>
              </div>
              
              {task.assignedTo && (
                <div className="flex items-center gap-1">
                  <FaUser />
                  <span>Assigned to: {task.assignedTo}</span>
                </div>
              )}
              
              {task.estimatedHours && (
                <div className="flex items-center gap-1">
                  <FaClock />
                  <span>Est: {task.estimatedHours}h</span>
                </div>
              )}
            </div>
            
            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <FaTags className="text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit task"
              aria-label="Edit task"
            >
              <FaEdit />
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete task"
              aria-label="Delete task"
            >
              <FaTrash />
            </button>
          </div>
        </div>
        
        {/* Expanded Controls */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Control */}
              <div>
                <label htmlFor={`status-${task._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id={`status-${task._id}`}
                  value={task.status}
                  onChange={handleStatusChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="complete">Complete</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              {/* Priority Control */}
              <div>
                <label htmlFor={`priority-${task._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id={`priority-${task._id}`}
                  value={task.priority}
                  onChange={handlePriorityChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskItem
