import React, { useState } from 'react';
import { format, isAfter, isBefore, addDays } from 'date-fns';

const TaskItem = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  onPriorityChange, 
  onAssign, 
  isDragging = false, 
  isSelected = false,
  className = '',
  isUpdating = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isKeyboardSelected, setIsKeyboardSelected] = useState(false);

  // Priority styling
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Status styling
  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Format due date
  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    try {
      return format(new Date(dueDate), 'MMM dd, yyyy');
    } catch {
      return dueDate;
    }
  };

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    try {
      return isBefore(new Date(dueDate), new Date());
    } catch {
      return false;
    }
  };

  // Check if task is due soon (within 3 days)
  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    try {
      const due = new Date(dueDate);
      const threeDaysFromNow = addDays(new Date(), 3);
      return isAfter(due, new Date()) && isBefore(due, threeDaysFromNow);
    } catch {
      return false;
    }
  };

  // Format time in hours
  const formatTime = (minutes) => {
    if (!minutes) return null;
    const hours = minutes / 60;
    return hours === Math.floor(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
  };

  // Get assignee display
  const getAssigneeDisplay = (assignee) => {
    if (typeof assignee === 'string') {
      return assignee;
    }
    if (assignee?.name) {
      return assignee.name;
    }
    if (assignee?.email) {
      return assignee.email;
    }
    return 'Unassigned';
  };

  // Check if task is unassigned
  const isUnassigned = (assignee) => {
    return !assignee || (typeof assignee === 'object' && !assignee.name && !assignee.email);
  };

  // Get assignee avatar or initials
  const getAssigneeAvatar = (assignee) => {
    if (typeof assignee === 'string') {
      return <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
        {assignee.charAt(0).toUpperCase()}
      </div>;
    }
    
    if (assignee?.avatar) {
      return <img 
        src={assignee.avatar} 
        alt={assignee.name || assignee.email} 
        className="w-8 h-8 rounded-full"
      />;
    }
    
    if (assignee?.name) {
      const initials = assignee.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
      return <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
        {initials}
      </div>;
    }
    
    if (assignee?.email) {
      return <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
        {assignee.email.charAt(0).toUpperCase()}
      </div>;
    }
    
    return <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm">
      ?
    </div>;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
      // Both Enter and Space should select the item
      setIsKeyboardSelected(true);
    }
  };

  return (
    <div
      data-testid="task-item"
      className={`
        bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-200
        ${isDragging ? 'opacity-50 rotate-2 shadow-lg' : ''}
        ${isSelected || isKeyboardSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
        ${className}
      `}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {isUpdating && (
        <div className="flex items-center space-x-2 mb-3 text-blue-600">
          <div data-testid="loading-spinner" className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span>Updating...</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold text-gray-900 mb-1 ${task.title && task.title.length > 50 ? 'truncate' : ''}`}>
            {task.title}
          </h3>
          <p className={`text-gray-600 ${task.description && task.description.length > 100 ? 'line-clamp-2' : ''}`}>
            {task.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="text-blue-600 hover:text-blue-800 p-1"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-red-600 hover:text-red-800 p-1"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Priority and Status */}
      <div className="flex items-center space-x-3 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyles(task.priority)}`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(task.status)}`}>
          {task.status}
        </span>
      </div>

      {/* Progress Bar for In-Progress Tasks */}
      {task.status === 'in-progress' && task.progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
              role="progressbar"
              aria-valuenow={task.progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className="mb-3">
          <span className="text-sm text-gray-600">
            Due: {formatDueDate(task.dueDate)}
          </span>
          {isOverdue(task.dueDate) && (
            <span className="ml-2 text-red-600 font-semibold text-sm">overdue</span>
          )}
          {isDueSoon(task.dueDate) && !isOverdue(task.dueDate) && (
            <span className="ml-2 text-orange-600 font-semibold text-sm">due soon</span>
          )}
        </div>
      )}

      {/* Assignee */}
      <div className="flex items-center space-x-2 mb-3">
        {getAssigneeAvatar(task.assignee)}
        <div>
          {isUnassigned(task.assignee) ? (
            <span className="text-sm text-gray-500 italic">unassigned</span>
          ) : (
            <span className="text-sm text-gray-700">
              {getAssigneeDisplay(task.assignee)}
            </span>
          )}
          <label htmlFor={`assignee-${task.id}`} className="sr-only">Assignee</label>
          <input
            id={`assignee-${task.id}`}
            type="email"
            value={getAssigneeDisplay(task.assignee)}
            onChange={(e) => onAssign(task.id, e.target.value)}
            className="text-sm text-gray-700 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 ml-2"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div data-testid="tags-container" className="flex flex-wrap gap-2 mb-3">
          {task.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Time Tracking */}
      {(task.estimatedTime || task.actualTime) && (
        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
          {task.estimatedTime && (
            <span>Est: {formatTime(task.estimatedTime)}</span>
          )}
          {task.actualTime && (
            <span>Actual: {formatTime(task.actualTime)}</span>
          )}
        </div>
      )}

      {/* Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-3">
          <div className="text-sm text-gray-600 mb-2">
            <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span> subtasks
          </div>
          <div className="space-y-1">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center space-x-2 text-sm">
                <span className={subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      {task.comments && task.comments.length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span aria-label="comments">💬</span>
          <span>{task.comments.length}</span>
        </div>
      )}

      {/* Timestamps */}
      {task.createdAt && (
        <div className="text-xs text-gray-500 mt-2">
          <span>created: {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
          {task.updatedAt && (
            <span className="ml-4">updated: {format(new Date(task.updatedAt), 'MMM d, yyyy')}</span>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <label htmlFor={`status-${task.id}`} className="sr-only">Status</label>
          <select
            id={`status-${task.id}`}
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor={`priority-${task.id}`} className="sr-only">Priority</label>
          <select
            id={`priority-${task.id}`}
            value={task.priority}
            onChange={(e) => onPriorityChange(task.id, e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;