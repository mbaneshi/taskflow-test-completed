import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

const BulkOperations = ({ tasks, onBulkUpdate, onBulkDelete, onBulkAssign }) => {
  const { user } = useAuth();
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const statusOptions = ['pending', 'in-progress', 'completed', 'cancelled'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];
  const assigneeOptions = ['John Doe', 'Sarah Smith', 'Mike Johnson', 'Emily Brown', 'David Wilson'];

  useEffect(() => {
    // Update select all when individual selections change
    if (selectedTasks.length === tasks.length && tasks.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedTasks, tasks]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map(task => task._id));
    }
    setSelectAll(!selectAll);
  };

  const handleTaskSelect = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedTasks.length === 0) {
      alert('Please select at least one task');
      return;
    }

    setBulkAction(action);
    setBulkValue('');
    setShowBulkActions(true);
  };

  const executeBulkAction = () => {
    if (!bulkValue) {
      alert('Please provide a value for the bulk action');
      return;
    }

    const actionData = {
      action: bulkAction,
      value: bulkValue,
      taskIds: selectedTasks
    };

    switch (bulkAction) {
      case 'status':
        onBulkUpdate(actionData);
        break;
      case 'priority':
        onBulkUpdate(actionData);
        break;
      case 'assignee':
        onBulkAssign(actionData);
        break;
      case 'delete':
        setConfirmAction(actionData);
        setShowConfirmModal(true);
        break;
      default:
        break;
    }

    setShowBulkActions(false);
    setBulkAction('');
    setBulkValue('');
  };

  const confirmBulkDelete = () => {
    onBulkDelete(confirmAction);
    setShowConfirmModal(false);
    setConfirmAction(null);
    setSelectedTasks([]);
  };

  const getSelectedTasksInfo = () => {
    const selectedTaskObjects = tasks.filter(task => selectedTasks.includes(task._id));
    const statusCounts = {};
    const priorityCounts = {};

    selectedTaskObjects.forEach(task => {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
      priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
    });

    return { selectedTaskObjects, statusCounts, priorityCounts };
  };

  const { selectedTaskObjects, statusCounts, priorityCounts } = getSelectedTasksInfo();

  return (
    <>
      {/* Bulk Operations Bar */}
      {selectedTasks.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-900">
                  {selectedTasks.length} of {tasks.length} tasks selected
                </span>
              </div>
              
              {/* Selection Summary */}
              <div className="flex items-center space-x-4 text-sm text-blue-700">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <span key={status} className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>{status}: {count}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setSelectedTasks([])}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
              >
                Clear Selection
              </Button>
            </div>
          </div>

          {/* Bulk Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => handleBulkAction('status')}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              📊 Change Status
            </Button>
            
            <Button
              onClick={() => handleBulkAction('priority')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
            >
              ⚡ Change Priority
            </Button>
            
            <Button
              onClick={() => handleBulkAction('assignee')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              👤 Reassign
            </Button>
            
            <Button
              onClick={() => handleBulkAction('delete')}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              🗑️ Delete Tasks
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Action Modal */}
      {showBulkActions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Bulk Action</h2>
                <p className="text-sm text-gray-600">
                  {selectedTasks.length} tasks selected
                </p>
              </div>
              <Button
                onClick={() => setShowBulkActions(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
              >
                ✕
              </Button>
            </div>

            {/* Action Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Type
                </label>
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  {bulkAction === 'status' && 'Change Status'}
                  {bulkAction === 'priority' && 'Change Priority'}
                  {bulkAction === 'assignee' && 'Reassign Tasks'}
                  {bulkAction === 'delete' && 'Delete Tasks'}
                </div>
              </div>

              {bulkAction !== 'delete' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {bulkAction === 'status' && 'New Status'}
                    {bulkAction === 'priority' && 'New Priority'}
                    {bulkAction === 'assignee' && 'New Assignee'}
                  </label>
                  
                  {bulkAction === 'status' && (
                    <select
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select status...</option>
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}

                  {bulkAction === 'priority' && (
                    <select
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select priority...</option>
                      {priorityOptions.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}

                  {bulkAction === 'assignee' && (
                    <select
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select assignee...</option>
                      {assigneeOptions.map(assignee => (
                        <option key={assignee} value={assignee}>{assignee}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {bulkAction === 'delete' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-red-600">⚠️</span>
                    <span className="font-medium text-red-800">Warning</span>
                  </div>
                  <p className="text-sm text-red-700">
                    You are about to delete {selectedTasks.length} task(s). This action cannot be undone.
                  </p>
                </div>
              )}

              {/* Preview of Selected Tasks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Tasks Preview
                </label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedTaskObjects.slice(0, 5).map(task => (
                    <div key={task._id} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                      {task.title}
                    </div>
                  ))}
                  {selectedTaskObjects.length > 5 && (
                    <div className="text-sm text-gray-500 italic">
                      ... and {selectedTaskObjects.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <Button
                onClick={() => setShowBulkActions(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={executeBulkAction}
                className={`px-4 py-2 rounded-lg ${
                  bulkAction === 'delete'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {bulkAction === 'delete' ? 'Delete Tasks' : 'Apply Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">🗑️</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Confirm Deletion</h2>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete {confirmAction.taskIds.length} task(s)?
                  </p>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm text-red-700">
                  <strong>This action cannot be undone.</strong> All selected tasks will be permanently removed.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmBulkDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete Permanently
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Selection Checkboxes */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Select All ({tasks.length})
          </span>
        </div>
      </div>

      {/* Individual Task Selection */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task._id} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              checked={selectedTasks.includes(task._id)}
              onChange={() => handleTaskSelect(task._id)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{task.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
                {task.assignedTo && (
                  <span className="text-gray-600">👤 {task.assignedTo}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BulkOperations;
