import React, { useState, useEffect } from 'react';
import Button from './Button';

const KeyboardShortcuts = ({ onShortcut }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [shortcuts] = useState([
    {
      key: 'Ctrl/Cmd + N',
      action: 'New Task',
      description: 'Create a new task quickly',
      category: 'Task Management'
    },
    {
      key: 'Ctrl/Cmd + S',
      action: 'Save',
      description: 'Save current changes',
      category: 'General'
    },
    {
      key: 'Ctrl/Cmd + F',
      action: 'Search',
      description: 'Find tasks or content',
      category: 'Navigation'
    },
    {
      key: 'Ctrl/Cmd + D',
      action: 'Dashboard',
      description: 'Go to main dashboard',
      category: 'Navigation'
    },
    {
      key: 'Ctrl/Cmd + T',
      action: 'Toggle Theme',
      description: 'Switch between light/dark mode',
      category: 'Preferences'
    },
    {
      key: 'Ctrl/Cmd + K',
      action: 'Quick Actions',
      description: 'Open command palette',
      category: 'Navigation'
    },
    {
      key: 'Ctrl/Cmd + Shift + A',
      action: 'Add Comment',
      description: 'Add comment to current task',
      category: 'Task Management'
    },
    {
      key: 'Ctrl/Cmd + Shift + C',
      action: 'Complete Task',
      description: 'Mark current task as complete',
      category: 'Task Management'
    },
    {
      key: 'Ctrl/Cmd + Shift + D',
      action: 'Delete Task',
      description: 'Delete current task',
      category: 'Task Management'
    },
    {
      key: 'Ctrl/Cmd + Shift + E',
      action: 'Edit Task',
      description: 'Edit current task',
      category: 'Task Management'
    },
    {
      key: 'Ctrl/Cmd + Shift + P',
      action: 'Profile',
      description: 'Go to user profile',
      category: 'Navigation'
    },
    {
      key: 'Ctrl/Cmd + Shift + S',
      action: 'Settings',
      description: 'Open settings panel',
      category: 'Preferences'
    },
    {
      key: 'Escape',
      action: 'Close/Cancel',
      description: 'Close modal or cancel action',
      category: 'General'
    },
    {
      key: 'Enter',
      action: 'Confirm/Submit',
      description: 'Confirm action or submit form',
      category: 'General'
    },
    {
      key: 'Tab',
      action: 'Next Field',
      description: 'Move to next form field',
      category: 'Navigation'
    },
    {
      key: 'Shift + Tab',
      action: 'Previous Field',
      description: 'Move to previous form field',
      category: 'Navigation'
    }
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent shortcuts when typing in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      // New Task
      if (modifierKey && event.key === 'n') {
        event.preventDefault();
        onShortcut('new-task');
      }
      
      // Save
      if (modifierKey && event.key === 's') {
        event.preventDefault();
        onShortcut('save');
      }
      
      // Search
      if (modifierKey && event.key === 'f') {
        event.preventDefault();
        onShortcut('search');
      }
      
      // Dashboard
      if (modifierKey && event.key === 'd') {
        event.preventDefault();
        onShortcut('dashboard');
      }
      
      // Toggle Theme
      if (modifierKey && event.key === 't') {
        event.preventDefault();
        onShortcut('toggle-theme');
      }
      
      // Quick Actions (Command Palette)
      if (modifierKey && event.key === 'k') {
        event.preventDefault();
        onShortcut('quick-actions');
      }
      
      // Add Comment
      if (modifierKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        onShortcut('add-comment');
      }
      
      // Complete Task
      if (modifierKey && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        onShortcut('complete-task');
      }
      
      // Delete Task
      if (modifierKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        onShortcut('delete-task');
      }
      
      // Edit Task
      if (modifierKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        onShortcut('edit-task');
      }
      
      // Profile
      if (modifierKey && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        onShortcut('profile');
      }
      
      // Settings
      if (modifierKey && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        onShortcut('settings');
      }
      
      // Show help
      if (modifierKey && event.key === '/') {
        event.preventDefault();
        setShowHelp(!showHelp);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onShortcut, showHelp]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Task Management': return 'bg-blue-100 text-blue-800';
      case 'Navigation': return 'bg-green-100 text-green-800';
      case 'Preferences': return 'bg-purple-100 text-purple-800';
      case 'General': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {});

  return (
    <>
      {/* Keyboard Shortcuts Help Button */}
      <Button
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
        title="Keyboard Shortcuts (Ctrl/Cmd + /)"
      >
        ⌨️
      </Button>

      {/* Keyboard Shortcuts Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
                <p className="text-gray-600">Power up your productivity with these keyboard shortcuts</p>
              </div>
              <Button
                onClick={() => setShowHelp(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                ✕ Close
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {categoryShortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{shortcut.action}</div>
                            <div className="text-sm text-gray-600">{shortcut.description}</div>
                          </div>
                          <kbd className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-mono text-gray-700 shadow-sm">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips Section */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Use <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs">Ctrl/Cmd + /</kbd> to show/hide this help</li>
                  <li>• Shortcuts work globally across the application</li>
                  <li>• Customize shortcuts in your profile settings</li>
                  <li>• Practice makes perfect - start with the most common ones!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Notification for Shortcuts */}
      <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-40 transform transition-transform duration-300 opacity-0 pointer-events-none" id="shortcut-notification">
        Shortcut executed!
      </div>
    </>
  );
};

export default KeyboardShortcuts;
