import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

const AdvancedAnalytics = () => {
  const { user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedMetrics, setSelectedMetrics] = useState(['completion-rate', 'productivity', 'team-performance']);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [reportType, setReportType] = useState('summary');
  const [showCustomReport, setShowCustomReport] = useState(false);

  // Mock data - in real app, this would come from API
  const [analyticsData, setAnalyticsData] = useState({
    tasks: {
      total: 156,
      completed: 134,
      inProgress: 18,
      pending: 4,
      overdue: 2
    },
    productivity: {
      daily: [85, 92, 78, 96, 88, 94, 89],
      weekly: [87, 89, 91, 88, 93, 90, 92],
      monthly: [89, 91, 88, 93, 90, 92, 89, 91, 88, 93, 90, 92]
    },
    team: {
      members: 8,
      activeUsers: 7,
      topPerformers: [
        { name: 'John Doe', tasks: 23, completion: 96 },
        { name: 'Sarah Smith', tasks: 21, completion: 94 },
        { name: 'Mike Johnson', tasks: 19, completion: 92 }
      ]
    },
    timeTracking: {
      totalHours: 1247,
      averagePerTask: 8.2,
      mostProductiveHours: '9:00 AM - 11:00 AM',
      leastProductiveHours: '2:00 PM - 4:00 PM'
    }
  });

  const timeRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const metricOptions = [
    { value: 'completion-rate', label: 'Task Completion Rate', color: 'blue' },
    { value: 'productivity', label: 'Productivity Trends', color: 'green' },
    { value: 'team-performance', label: 'Team Performance', color: 'purple' },
    { value: 'time-tracking', label: 'Time Tracking', color: 'orange' },
    { value: 'task-distribution', label: 'Task Distribution', color: 'red' },
    { value: 'deadline-compliance', label: 'Deadline Compliance', color: 'indigo' }
  ];

  const reportTypes = [
    { value: 'summary', label: 'Executive Summary', icon: '📊' },
    { value: 'detailed', label: 'Detailed Analysis', icon: '📈' },
    { value: 'comparative', label: 'Comparative Report', icon: '⚖️' },
    { value: 'trend', label: 'Trend Analysis', icon: '📉' },
    { value: 'custom', label: 'Custom Report', icon: '🎯' }
  ];

  const generateReport = () => {
    // In real app, this would generate and download a report
    console.log('Generating report:', { selectedTimeRange, selectedMetrics, reportType });
    
    // Simulate report generation
    setTimeout(() => {
      alert('Report generated successfully! Check your downloads folder.');
    }, 2000);
  };

  const exportData = (format) => {
    // In real app, this would export data in the specified format
    console.log('Exporting data in format:', format);
    
    setTimeout(() => {
      alert(`${format.toUpperCase()} export completed!`);
    }, 1500);
  };

  const renderMetricCard = (metric) => {
    const getMetricData = () => {
      switch (metric) {
        case 'completion-rate':
          return {
            value: `${Math.round((analyticsData.tasks.completed / analyticsData.tasks.total) * 100)}%`,
            label: 'Completion Rate',
            change: '+5.2%',
            trend: 'up',
            color: 'blue'
          };
        case 'productivity':
          return {
            value: '89',
            label: 'Productivity Score',
            change: '+2.1%',
            trend: 'up',
            color: 'green'
          };
        case 'team-performance':
          return {
            value: '92%',
            label: 'Team Performance',
            change: '+3.8%',
            trend: 'up',
            color: 'purple'
          };
        case 'time-tracking':
          return {
            value: `${analyticsData.timeTracking.averagePerTask}h`,
            label: 'Avg Time/Task',
            change: '-0.5h',
            trend: 'down',
            color: 'orange'
          };
        default:
          return { value: '0', label: 'Unknown', change: '0%', trend: 'neutral', color: 'gray' };
      }
    };

    const data = getMetricData();
    const isSelected = selectedMetrics.includes(metric);

    return (
      <div
        key={metric}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
          isSelected
            ? `border-${data.color}-500 bg-${data.color}-50`
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
        onClick={() => {
          if (isSelected) {
            setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
          } else {
            setSelectedMetrics([...selectedMetrics, metric]);
          }
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{data.label}</h3>
          <div className={`w-4 h-4 rounded-full border-2 ${
            isSelected ? `border-${data.color}-500 bg-${data.color}-500` : 'border-gray-300'
          }`}>
            {isSelected && <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>}
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{data.value}</div>
        <div className={`flex items-center text-sm ${
          data.trend === 'up' ? 'text-green-600' : data.trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          <span className="mr-1">
            {data.trend === 'up' ? '↗️' : data.trend === 'down' ? '↘️' : '→'}
          </span>
          {data.change} from last period
        </div>
      </div>
    );
  };

  const renderChart = (metric) => {
    // Simple chart visualization - in real app, use Chart.js or D3.js
    const data = analyticsData.productivity.daily;
    const maxValue = Math.max(...data);
    
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">
          {metricOptions.find(m => m.value === metric)?.label}
        </h4>
        <div className="flex items-end justify-between h-32 space-x-1">
          {data.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(value / maxValue) * 100}%` }}
                title={`Day ${index + 1}: ${value}%`}
              ></div>
              <span className="text-xs text-gray-500 mt-1">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="text-gray-600">Comprehensive insights and custom reporting for your team</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowCustomReport(!showCustomReport)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              🎯 Custom Report
            </Button>
            <Button
              onClick={generateReport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              📊 Generate Report
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
              ))}
            </select>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="flex space-x-2">
              <Button
                onClick={() => exportData('csv')}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
              >
                CSV
              </Button>
              <Button
                onClick={() => exportData('excel')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
              >
                Excel
              </Button>
              <Button
                onClick={() => exportData('pdf')}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
              >
                PDF
              </Button>
            </div>
          </div>

          {/* Custom Date Range */}
          {selectedTimeRange === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Report Builder */}
      {showCustomReport && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Report Builder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricOptions.map(metric => renderMetricCard(metric.value))}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              onClick={() => setShowCustomReport(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={generateReport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Generate Custom Report
            </Button>
          </div>
        </div>
      )}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <div className="lg:col-span-2 xl:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.tasks.total}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-lg font-semibold text-green-600">{analyticsData.tasks.completed}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((analyticsData.tasks.completed / analyticsData.tasks.total) * 100)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-lg font-semibold text-red-600">{analyticsData.tasks.overdue}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-purple-600">{analyticsData.team.members}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-lg font-semibold text-green-600">{analyticsData.team.activeUsers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        {selectedMetrics.map(metric => (
          <div key={metric} className="lg:col-span-2">
            {renderChart(metric)}
          </div>
        ))}

        {/* Team Performance */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-3">
              {analyticsData.team.topPerformers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.tasks} tasks completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{member.completion}%</p>
                    <p className="text-sm text-gray-600">completion rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Tracking Insights */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Insights</h3>
            <div className="space-y-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{analyticsData.timeTracking.totalHours}h</p>
                <p className="text-sm text-gray-600">Total Hours</p>
              </div>
              
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{analyticsData.timeTracking.averagePerTask}h</p>
                <p className="text-sm text-gray-600">Avg per Task</p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-1">Most Productive</p>
                <p className="text-sm text-green-600">{analyticsData.timeTracking.mostProductiveHours}</p>
              </div>

              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-1">Least Productive</p>
                <p className="text-sm text-red-600">{analyticsData.timeTracking.leastProductiveHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
