import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        // Mock data for demonstration
        setAnalytics(generateMockAnalytics());
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock data
      setAnalytics(generateMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      overview: {
        totalTasks: 1247,
        completedTasks: 892,
        pendingTasks: 355,
        completionRate: 71.5,
        totalUsers: 45,
        activeUsers: 38,
        productivityScore: 8.7
      },
      productivity: {
        daily: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(lastWeek.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tasksCompleted: Math.floor(Math.random() * 20) + 10,
          hoursWorked: Math.floor(Math.random() * 8) + 4,
          efficiency: Math.floor(Math.random() * 30) + 70
        })),
        weekly: Array.from({ length: 4 }, (_, i) => ({
          week: `Week ${i + 1}`,
          tasksCompleted: Math.floor(Math.random() * 100) + 50,
          averageEfficiency: Math.floor(Math.random() * 20) + 75
        }))
      },
      teamPerformance: {
        topPerformers: [
          { username: 'john.doe', tasksCompleted: 45, efficiency: 94, hoursWorked: 38 },
          { username: 'jane.smith', tasksCompleted: 42, efficiency: 91, hoursWorked: 36 },
          { username: 'mike.johnson', tasksCompleted: 38, efficiency: 88, hoursWorked: 40 }
        ],
        departmentStats: [
          { department: 'Engineering', avgEfficiency: 87, tasksCompleted: 234 },
          { department: 'Design', avgEfficiency: 82, tasksCompleted: 156 },
          { department: 'Marketing', avgEfficiency: 79, tasksCompleted: 198 }
        ]
      },
      taskAnalytics: {
        byPriority: [
          { priority: 'High', count: 156, percentage: 12.5 },
          { priority: 'Medium', count: 623, percentage: 50.0 },
          { priority: 'Low', count: 468, percentage: 37.5 }
        ],
        byStatus: [
          { status: 'Completed', count: 892, percentage: 71.5 },
          { status: 'In Progress', count: 234, percentage: 18.8 },
          { status: 'Pending', count: 121, percentage: 9.7 }
        ],
        byCategory: [
          { category: 'Development', count: 456, percentage: 36.6 },
          { category: 'Design', count: 234, percentage: 18.8 },
          { category: 'Testing', count: 198, percentage: 15.9 },
          { category: 'Documentation', count: 156, percentage: 12.5 },
          { category: 'Other', count: 203, percentage: 16.3 }
        ]
      },
      timeTracking: {
        totalHours: 2847,
        averageDaily: 8.2,
        overtimeHours: 156,
        projectBreakdown: [
          { project: 'TaskFlow App', hours: 1247, percentage: 43.8 },
          { project: 'Website Redesign', hours: 892, percentage: 31.3 },
          { project: 'Mobile App', hours: 708, percentage: 24.9 }
        ]
      }
    };
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num) => {
    return `${num.toFixed(1)}%`;
  };

  const getMetricColor = (metric, value) => {
    if (metric === 'efficiency' || metric === 'completionRate') {
      if (value >= 90) return 'text-green-600';
      if (value >= 75) return 'text-yellow-600';
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights into team productivity and task performance</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Time Range:</span>
        <div className="flex space-x-2">
          {['1d', '7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {range === '1d' ? 'Today' : range === '7d' ? 'Week' : range === '30d' ? 'Month' : 'Quarter'}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalTasks)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className={`text-2xl font-bold ${getMetricColor('completionRate', analytics.overview.completionRate)}`}>
                {formatPercentage(analytics.overview.completionRate)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.activeUsers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-purple-600 text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productivity Score</p>
              <p className={`text-2xl font-bold ${getMetricColor('efficiency', analytics.overview.productivityScore * 10)}`}>
                {analytics.overview.productivityScore}/10
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 text-xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productivity Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Trends</h3>
          <div className="space-y-4">
            {analytics.productivity.daily.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{day.date}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{day.tasksCompleted} tasks</span>
                  <span className="text-sm text-gray-600">{day.hoursWorked}h</span>
                  <span className={`text-sm font-medium ${getMetricColor('efficiency', day.efficiency)}`}>
                    {day.efficiency}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {analytics.teamPerformance.topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{performer.username}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{performer.tasksCompleted} tasks</span>
                  <span className={`text-sm font-medium ${getMetricColor('efficiency', performer.efficiency)}`}>
                    {performer.efficiency}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h3>
          <div className="space-y-4">
            {analytics.taskAnalytics.byPriority.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.priority}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {formatPercentage(item.percentage)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Tracking */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{analytics.timeTracking.totalHours}h</p>
              <p className="text-sm text-blue-600">Total Hours</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-lg font-semibold text-green-600">{analytics.timeTracking.averageDaily}h</p>
                <p className="text-xs text-green-600">Daily Average</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-lg font-semibold text-yellow-600">{analytics.timeTracking.overtimeHours}h</p>
                <p className="text-xs text-yellow-600">Overtime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export and Actions */}
      <div className="mt-8 flex justify-between items-center">
        <div className="flex space-x-4">
          <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
            📊 Export Report
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
            📧 Schedule Report
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
