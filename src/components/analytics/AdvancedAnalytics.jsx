import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

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
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-900">{data.label}</h3>
          <div className={`w-4 h-4 rounded-full border-2 ${
            isSelected ? `border-${data.color}-500 bg-${data.color}-500` : 'border-gray-300'
          }`}>
            {isSelected && <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>}
          </div>
        </div>
        <div className="mb-1 text-2xl font-bold text-gray-900">{data.value}</div>
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
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="mb-4 font-semibold text-gray-900">
          {metricOptions.find(m => m.value === metric)?.label}
        </h4>
        <div className="flex justify-between items-end space-x-1 h-32">
          {data.map((value, index) => (
            <div key={index} className="flex flex-col flex-1 items-center">
              <div
                className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(value / maxValue) * 100}%` }}
                title={`Day ${index + 1}: ${value}%`}
              ></div>
              <span className="mt-1 text-xs text-gray-500">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-6 mb-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="text-gray-600">Comprehensive insights and custom reporting for your team</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowCustomReport(!showCustomReport)}
              className="px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600"
            >
              🎯 Custom Report
            </Button>
            <Button
              onClick={generateReport}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              📊 Generate Report
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Time Range */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Time Range</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="p-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Report Type */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="p-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
              ))}
            </select>
          </div>

          {/* Export Options */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Export Format</label>
            <div className="flex space-x-2">
              <Button
                onClick={() => exportData('csv')}
                className="px-3 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600"
              >
                CSV
              </Button>
              <Button
                onClick={() => exportData('excel')}
                className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Excel
              </Button>
              <Button
                onClick={() => exportData('pdf')}
                className="px-3 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                PDF
              </Button>
            </div>
          </div>

          {/* Custom Date Range */}
          {selectedTimeRange === 'custom' && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Custom Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  className="flex-1 p-2 text-sm rounded-lg border border-gray-300"
                />
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  className="flex-1 p-2 text-sm rounded-lg border border-gray-300"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Report Builder */}
      {showCustomReport && (
        <div className="p-6 mb-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Custom Report Builder</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metricOptions.map(metric => renderMetricCard(metric.value))}
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <Button
              onClick={() => setShowCustomReport(false)}
              className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={generateReport}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Generate Custom Report
            </Button>
          </div>
        </div>
      )}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Key Metrics */}
        <div className="lg:col-span-2 xl:col-span-1">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.tasks.total}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-lg font-semibold text-green-600">{analyticsData.tasks.completed}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
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

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
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
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Performers</h3>
            <div className="space-y-3">
              {analyticsData.team.topPerformers.map((member, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex justify-center items-center w-8 h-8 text-sm font-bold text-white bg-blue-500 rounded-full">
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
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Time Insights</h3>
            <div className="space-y-4">
              <div className="p-3 text-center bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{analyticsData.timeTracking.totalHours}h</p>
                <p className="text-sm text-gray-600">Total Hours</p>
              </div>
              
              <div className="p-3 text-center bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{analyticsData.timeTracking.averagePerTask}h</p>
                <p className="text-sm text-gray-600">Avg per Task</p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <p className="mb-1 text-sm font-medium text-gray-900">Most Productive</p>
                <p className="text-sm text-green-600">{analyticsData.timeTracking.mostProductiveHours}</p>
              </div>

              <div className="p-3 bg-red-50 rounded-lg">
                <p className="mb-1 text-sm font-medium text-gray-900">Least Productive</p>
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
