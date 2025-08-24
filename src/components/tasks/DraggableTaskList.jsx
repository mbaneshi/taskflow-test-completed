import React, { useState, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

// Sortable Task Item
const SortableTaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-l-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-move ${getPriorityColor(task.priority)}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-lg">📋</span>
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
          
          {task.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {task.dueDate && (
              <span className="flex items-center space-x-1">
                <span>📅</span>
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </span>
            )}
            {task.assignedTo && (
              <span className="flex items-center space-x-1">
                <span>👤</span>
                <span>{task.assignedTo}</span>
              </span>
            )}
            {task.estimatedHours && (
              <span className="flex items-center space-x-1">
                <span>⏱️</span>
                <span>{task.estimatedHours}h</span>
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            onClick={() => onEdit(task)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(task._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </Button>
        </div>
      </div>
      
      {/* Drag Handle */}
      <div className="mt-3 flex items-center justify-center">
        <div className="w-8 h-1 bg-gray-300 rounded-full opacity-50 hover:opacity-100 transition-opacity"></div>
      </div>
    </div>
  );
};

// Main Draggable Task List Component
const DraggableTaskList = ({ tasks, onTasksReorder, onEdit, onDelete, onStatusChange }) => {
  const { user } = useAuth();
  const [localTasks, setLocalTasks] = useState(tasks);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setIsDragging(false);

    if (active.id !== over?.id) {
      setLocalTasks((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Call parent callback to persist the new order
        onTasksReorder(newOrder);
        
        return newOrder;
      });
    }
  };

  const handleDragCancel = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {localTasks.length} tasks
          </span>
          {isDragging && (
            <span className="text-sm text-blue-600 animate-pulse">
              🎯 Drop to reorder
            </span>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={localTasks.map(task => task._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {localTasks.map((task) => (
              <SortableTaskItem
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {localTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks yet</h3>
          <p className="text-gray-500">Create your first task to get started!</p>
        </div>
      )}
    </div>
  );
};

export default DraggableTaskList;
