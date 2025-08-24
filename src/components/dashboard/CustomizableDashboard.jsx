import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

const CustomizableDashboard = () => {
  const { user } = useAuth();
  const [dashboardConfig, setDashboardConfig] = useState({
    layout: 'grid',
    widgets: [
      { id: 'quick-actions', title: 'Quick Actions', enabled: true, size: 'medium' },
      { id: 'recent-tasks', title: 'Recent Tasks', enabled: true, size: 'large' },
      { id: 'team-activity', title: 'Team Activity', enabled: true, size: 'medium' },
      { id: 'upcoming-deadlines', title: 'Upcoming Deadlines', enabled: true, size: 'small' },
      { id: 'productivity-stats', title: 'Productivity Stats', enabled: true, size: 'medium' },
      { id: 'quick-notes', title: 'Quick Notes', enabled: true, size: 'small' }
    ],
    theme: 'light',
    compactMode: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem(`dashboard-${user?.id}`);
    if (savedConfig) {
      setDashboardConfig(JSON.parse(savedConfig));
    }
  }, [user?.id]);

  // Save configuration to localStorage
  const saveConfiguration = (newConfig) => {
    setDashboardConfig(newConfig);
    localStorage.setItem(`dashboard-${user?.id}`, JSON.stringify(newConfig));
  };

  const toggleWidget = (widgetId) => {
    const newConfig = {
      ...dashboardConfig,
      widgets: dashboardConfig.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
      )
    };
    saveConfiguration(newConfig);
  };

  const changeWidgetSize = (widgetId, newSize) => {
    const newConfig = {
      ...dashboardConfig,
      widgets: dashboardConfig.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, size: newSize } : widget
      )
    };
    saveConfiguration(newConfig);
  };

  const toggleLayout = () => {
    const newLayout = dashboardConfig.layout === 'grid' ? 'list' : 'grid';
    saveConfiguration({ ...dashboardConfig, layout: newLayout });
  };

  const toggleTheme = () => {
    const newTheme = dashboardConfig.theme === 'light' ? 'dark' : 'light';
    saveConfiguration({ ...dashboardConfig, theme: newTheme });
  };

  const toggleCompactMode = () => {
    saveConfiguration({ ...dashboardConfig, compactMode: !dashboardConfig.compactMode });
  };

  const resetToDefault = () => {
    const defaultConfig = {
      layout: 'grid',
      widgets: [
        { id: 'quick-actions', title: 'Quick Actions', enabled: true, size: 'medium' },
        { id: 'recent-tasks', title: 'Recent Tasks', enabled: true, size: 'large' },
        { id: 'team-activity', title: 'Team Activity', enabled: true, size: 'medium' },
        { id: 'upcoming-deadlines', title: 'Upcoming Deadlines', enabled: true, size: 'small' },
        { id: 'productivity-stats', title: 'Productivity Stats', enabled: true, size: 'medium' },
        { id: 'quick-notes', title: 'Quick Notes', enabled: true, size: 'small' }
      ],
      theme: 'light',
      compactMode: false
    };
    saveConfiguration(defaultConfig);
  };

  const getWidgetSizeClass = (size) => {
    switch (size) {
      case 'small': return 'col-span-1 row-span-1';
      case 'medium': return 'col-span-2 row-span-1';
      case 'large': return 'col-span-3 row-span-2';
      default: return 'col-span-2 row-span-1';
    }
  };

  const renderWidget = (widget) => {
    if (!widget.enabled) return null;

    const sizeClass = getWidgetSizeClass(widget.size);
    const compactClass = dashboardConfig.compactMode ? 'p-3' : 'p-6';

    switch (widget.id) {
      case 'quick-actions':
        return (
          <div key={widget.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 ${sizeClass} ${compactClass}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{widget.title}</h3>
              {isEditing && (
                <select
                  value={widget.size}
                  onChange={(e) => changeWidgetSize(widget.id, e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg text-sm">
                ➕ New Task
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg text-sm">
                📊 View Reports
              </Button>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg text-sm">
                👥 Team Chat
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg text-sm">
                ⚙️ Settings
              </Button>
            </div>
          </div>
        );

      case 'recent-tasks':
        return (
          <div key={widget.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 ${sizeClass} ${compactClass}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{widget.title}</h3>
              {isEditing && (
                <select
                  value={widget.size}
                  onChange={(e) => changeWidgetSize(widget.id, e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              )}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Sample Task {i}</p>
                    <p className="text-xs text-gray-500">Due in {i} day{i > 1 ? 's' : ''}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'team-activity':
        return (
          <div key={widget.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 ${sizeClass} ${compactClass}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{widget.title}</h3>
              {isEditing && (
                <select
                  value={widget.size}
                  onChange={(e) => changeWidgetSize(widget.id, e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">J</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Completed "Design Review" task</p>
                </div>
                <span className="text-xs text-gray-400">2m ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">S</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Sarah Smith</p>
                  <p className="text-xs text-gray-500">Started "API Development" task</p>
                </div>
                <span className="text-xs text-gray-400">5m ago</span>
              </div>
            </div>
          </div>
        );

      case 'upcoming-deadlines':
        return (
          <div key={widget.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 ${sizeClass} ${compactClass}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{widget.title}</h3>
              {isEditing && (
                <select
                  value={widget.size}
                  onChange={(e) => changeWidgetSize(widget.id, e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                <span className="text-sm text-red-800">Project Launch</span>
                <span className="text-xs text-red-600">Today</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm text-yellow-800">Code Review</span>
                <span className="text-xs text-yellow-600">Tomorrow</span>
              </div>
            </div>
          </div>
        );

      case 'productivity-stats':
        return (
          <div key={widget.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 ${sizeClass} ${compactClass}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{widget.title}</h3>
              {isEditing && (
                <select
                  value={widget.size}
                  onChange={(e) => changeWidgetSize(widget.id, e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">87%</div>
                <div className="text-xs text-gray-500">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-xs text-gray-500">Tasks Completed</div>
              </div>
            </div>
          </div>
        );

      case 'quick-notes':
        return (
          <div key={widget.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 ${sizeClass} ${compactClass}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{widget.title}</h3>
              {isEditing && (
                <select
                  value={widget.size}
                  onChange={(e) => changeWidgetSize(widget.id, e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              )}
            </div>
            <textarea
              placeholder="Write a quick note..."
              className="w-full h-20 p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${dashboardConfig.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Dashboard Header */}
      <div className={`p-6 border-b ${dashboardConfig.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.username}!</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Layout Toggle */}
            <Button
              onClick={toggleLayout}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {dashboardConfig.layout === 'grid' ? '📋 List View' : '🔲 Grid View'}
            </Button>

            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              {dashboardConfig.theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </Button>

            {/* Compact Mode Toggle */}
            <Button
              onClick={toggleCompactMode}
              className={`px-4 py-2 rounded-lg ${
                dashboardConfig.compactMode
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
              }`}
            >
              {dashboardConfig.compactMode ? '📏 Normal' : '📏 Compact'}
            </Button>

            {/* Edit Mode Toggle */}
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg ${
                isEditing
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isEditing ? '✅ Done' : '⚙️ Customize'}
            </Button>

            {/* Reset to Default */}
            {isEditing && (
              <Button
                onClick={resetToDefault}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
              >
                🔄 Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Widget Selector (when editing) */}
      {isEditing && showWidgetSelector && (
        <div className={`p-4 border-b ${dashboardConfig.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="font-semibold mb-3">Available Widgets</h3>
          <div className="grid grid-cols-3 gap-3">
            {dashboardConfig.widgets.map((widget) => (
              <div key={widget.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={widget.enabled}
                  onChange={() => toggleWidget(widget.id)}
                  className="rounded"
                />
                <span className="text-sm font-medium">{widget.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="p-6">
        <div className={`grid gap-6 ${
          dashboardConfig.layout === 'grid' 
            ? 'grid-cols-3 auto-rows-max' 
            : 'grid-cols-1'
        }`}>
          {dashboardConfig.widgets.map(renderWidget)}
        </div>
      </div>
    </div>
  );
};

export default CustomizableDashboard;
