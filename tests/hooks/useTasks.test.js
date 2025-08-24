import { renderHook, act, waitFor } from '@testing-library/react';
import { useTasks } from '../../src/hooks/useTasks';

// Mock the API functions
jest.mock('../../src/utils/api', () => ({
  fetchTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  assignTask: jest.fn(),
  changeTaskStatus: jest.fn(),
  changeTaskPriority: jest.fn(),
  addTaskComment: jest.fn(),
  addTaskAttachment: jest.fn(),
  getTaskAnalytics: jest.fn(),
}));

import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  changeTaskStatus,
  changeTaskPriority,
  addTaskComment,
  addTaskAttachment,
  getTaskAnalytics,
} from '../../src/utils/api';

describe('useTasks Hook', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      priority: 'high',
      status: 'pending',
      assignee: 'john@example.com',
      dueDate: '2024-12-31',
      tags: ['frontend'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      priority: 'medium',
      status: 'in-progress',
      assignee: 'jane@example.com',
      dueDate: '2024-12-30',
      tags: ['backend'],
      createdAt: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default state', () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.filters).toEqual({
      status: 'all',
      priority: 'all',
      assignee: 'all',
      tags: [],
      dueDate: null,
    });
    expect(result.current.sortBy).toBe('createdAt');
    expect(result.current.sortOrder).toBe('desc');
  });

  test('loads tasks successfully', async () => {
    fetchTasks.mockResolvedValue(mockTasks);
    
    const { result } = renderHook(() => useTasks());
    
    await act(async () => {
      await result.current.loadTasks();
    });
    
    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(fetchTasks).toHaveBeenCalledTimes(1);
  });

  test('handles task loading error', async () => {
    const errorMessage = 'Failed to fetch tasks';
    fetchTasks.mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useTasks());
    
    await act(async () => {
      await result.current.loadTasks();
    });
    
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isLoading).toBe(false);
    expect(fetchTasks).toHaveBeenCalledTimes(1);
  });

  test('creates task successfully', async () => {
    const newTask = {
      title: 'New Task',
      description: 'New Description',
      priority: 'high',
      status: 'pending',
      assignee: 'john@example.com',
      dueDate: '2024-12-31',
      tags: ['frontend'],
    };
    
    const createdTask = { ...newTask, id: '3', createdAt: '2024-01-01T00:00:00Z' };
    createTask.mockResolvedValue(createdTask);
    
    const { result } = renderHook(() => useTasks());
    
    await act(async () => {
      await result.current.createTask(newTask);
    });
    
    expect(result.current.tasks).toContainEqual(createdTask);
    expect(createTask).toHaveBeenCalledWith(newTask);
  });

  test('updates task successfully', async () => {
    const updatedTask = { ...mockTasks[0], title: 'Updated Task' };
    updateTask.mockResolvedValue(updatedTask);
    
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    await act(async () => {
      await result.current.updateTask('1', { title: 'Updated Task' });
    });
    
    expect(result.current.tasks[0].title).toBe('Updated Task');
    expect(updateTask).toHaveBeenCalledWith('1', { title: 'Updated Task' });
  });

  test('deletes task successfully', async () => {
    deleteTask.mockResolvedValue({ success: true });
    
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    await act(async () => {
      await result.current.deleteTask('1');
    });
    
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe('2');
    expect(deleteTask).toHaveBeenCalledWith('1');
  });

  test('assigns task successfully', async () => {
    assignTask.mockResolvedValue({ success: true });
    
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    await act(async () => {
      await result.current.assignTask('1', 'jane@example.com');
    });
    
    expect(result.current.tasks[0].assignee).toBe('jane@example.com');
    expect(assignTask).toHaveBeenCalledWith('1', 'jane@example.com');
  });

  test('changes task status successfully', async () => {
    changeTaskStatus.mockResolvedValue({ success: true });
    
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    await act(async () => {
      await result.current.changeTaskStatus('1', 'completed');
    });
    
    expect(result.current.tasks[0].status).toBe('completed');
    expect(changeTaskStatus).toHaveBeenCalledWith('1', 'completed');
  });

  test('changes task priority successfully', async () => {
    changeTaskPriority.mockResolvedValue({ success: true });
    
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    await act(async () => {
      await result.current.changeTaskPriority('1', 'low');
    });
    
    expect(result.current.tasks[0].priority).toBe('low');
    expect(changeTaskPriority).toHaveBeenCalledWith('1', 'low');
  });

  test('adds task comment successfully', async () => {
    const comment = { text: 'New comment', author: 'john@example.com' };
    addTaskComment.mockResolvedValue({ ...comment, id: '1', createdAt: '2024-01-01T00:00:00Z' });
    
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    await act(async () => {
      await result.current.addTaskComment('1', comment);
    });
    
    expect(addTaskComment).toHaveBeenCalledWith('1', comment);
  });

  test('adds task attachment successfully', async () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    addTaskAttachment.mockResolvedValue({ 
      filename: 'test.txt', 
      size: 7, 
      url: 'https://example.com/test.txt' 
    });
    
    const { result } = renderHook(() => useTasks());
    
    await act(async () => {
      await result.current.addTaskAttachment('1', file);
    });
    
    expect(addTaskAttachment).toHaveBeenCalledWith('1', file);
  });

  test('filters tasks by status', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    act(() => {
      result.current.setFilters({ ...result.current.filters, status: 'pending' });
    });
    
    const filteredTasks = result.current.getFilteredTasks();
    expect(filteredTasks).toHaveLength(1);
    expect(filteredTasks[0].status).toBe('pending');
  });

  test('filters tasks by priority', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    act(() => {
      result.current.setFilters({ ...result.current.filters, priority: 'high' });
    });
    
    const filteredTasks = result.current.getFilteredTasks();
    expect(filteredTasks).toHaveLength(1);
    expect(filteredTasks[0].priority).toBe('high');
  });

  test('filters tasks by assignee', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    act(() => {
      result.current.setFilters({ ...result.current.filters, assignee: 'john@example.com' });
    });
    
    const filteredTasks = result.current.getFilteredTasks();
    expect(filteredTasks).toHaveLength(1);
    expect(filteredTasks[0].assignee).toBe('john@example.com');
  });

  test('filters tasks by tags', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    act(() => {
      result.current.setFilters({ ...result.current.filters, tags: ['frontend'] });
    });
    
    const filteredTasks = result.current.getFilteredTasks();
    expect(filteredTasks).toHaveLength(1);
    expect(filteredTasks[0].tags).toContain('frontend');
  });

  test('filters tasks by due date', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    const dueDate = '2024-12-31';
    act(() => {
      result.current.setFilters({ ...result.current.filters, dueDate });
    });
    
    const filteredTasks = result.current.getFilteredTasks();
    expect(filteredTasks).toHaveLength(1);
    expect(filteredTasks[0].dueDate).toBe(dueDate);
  });

  test('sorts tasks by title', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    act(() => {
      result.current.setSortBy('title');
    });
    
    const sortedTasks = result.current.getSortedTasks();
    expect(sortedTasks[0].title).toBe('Task 1');
    expect(sortedTasks[1].title).toBe('Task 2');
  });

  test('sorts tasks by due date', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    act(() => {
      result.current.setSortBy('dueDate');
    });
    
    const sortedTasks = result.current.getSortedTasks();
    expect(sortedTasks[0].dueDate).toBe('2024-12-30');
    expect(sortedTasks[1].dueDate).toBe('2024-12-31');
  });

  test('toggles sort order', () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.sortOrder).toBe('desc');
    
    act(() => {
      result.current.toggleSortOrder();
    });
    
    expect(result.current.sortOrder).toBe('asc');
    
    act(() => {
      result.current.toggleSortOrder();
    });
    
    expect(result.current.sortOrder).toBe('desc');
  });

  test('searches tasks by text', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    act(() => {
      result.current.setSearchTerm('frontend');
    });
    
    const searchResults = result.current.getSearchResults();
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].tags).toContain('frontend');
  });

  test('gets task statistics', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    const stats = result.current.getTaskStatistics();
    
    expect(stats.total).toBe(2);
    expect(stats.pending).toBe(1);
    expect(stats.inProgress).toBe(1);
    expect(stats.completed).toBe(0);
    expect(stats.overdue).toBe(0);
  });

  test('gets tasks by status', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    const pendingTasks = result.current.getTasksByStatus('pending');
    const inProgressTasks = result.current.getTasksByStatus('in-progress');
    
    expect(pendingTasks).toHaveLength(1);
    expect(inProgressTasks).toHaveLength(1);
  });

  test('gets tasks by priority', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    const highPriorityTasks = result.current.getTasksByPriority('high');
    const mediumPriorityTasks = result.current.getTasksByPriority('medium');
    
    expect(highPriorityTasks).toHaveLength(1);
    expect(mediumPriorityTasks).toHaveLength(1);
  });

  test('gets overdue tasks', () => {
    const { result } = renderHook(() => useTasks());
    
    const overdueTask = {
      ...mockTasks[0],
      dueDate: '2023-12-31', // Past date
    };
    
    // Set tasks with overdue task
    act(() => {
      result.current.tasks = [overdueTask, mockTasks[1]];
    });
    
    const overdueTasks = result.current.getOverdueTasks();
    expect(overdueTasks).toHaveLength(1);
    expect(overdueTasks[0].id).toBe('1');
  });

  test('gets tasks due soon', () => {
    const { result } = renderHook(() => useTasks());
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueSoonTask = {
      ...mockTasks[0],
      dueDate: tomorrow.toISOString().split('T')[0],
    };
    
    // Set tasks with due soon task
    act(() => {
      result.current.tasks = [dueSoonTask, mockTasks[1]];
    });
    
    const dueSoonTasks = result.current.getTasksDueSoon();
    expect(dueSoonTasks).toHaveLength(1);
    expect(dueSoonTasks[0].id).toBe('1');
  });

  test('clears filters', () => {
    const { result } = renderHook(() => useTasks());
    
    // Set some filters
    act(() => {
      result.current.setFilters({
        status: 'pending',
        priority: 'high',
        assignee: 'john@example.com',
        tags: ['frontend'],
        dueDate: '2024-12-31',
      });
    });
    
    // Clear filters
    act(() => {
      result.current.clearFilters();
    });
    
    expect(result.current.filters).toEqual({
      status: 'all',
      priority: 'all',
      assignee: 'all',
      tags: [],
      dueDate: null,
    });
  });

  test('resets to default state', () => {
    const { result } = renderHook(() => useTasks());
    
    // Modify state
    act(() => {
      result.current.tasks = mockTasks;
      result.current.setFilters({ status: 'pending' });
      result.current.setSortBy('title');
      result.current.setSearchTerm('test');
    });
    
    // Reset
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.filters).toEqual({
      status: 'all',
      priority: 'all',
      assignee: 'all',
      tags: [],
      dueDate: null,
    });
    expect(result.current.sortBy).toBe('createdAt');
    expect(result.current.sortOrder).toBe('desc');
    expect(result.current.searchTerm).toBe('');
  });

  test('handles bulk operations', async () => {
    const { result } = renderHook(() => useTasks());
    
    // Set initial tasks
    act(() => {
      result.current.tasks = mockTasks;
    });
    
    const taskIds = ['1', '2'];
    
    await act(async () => {
      await result.current.bulkUpdateStatus(taskIds, 'completed');
    });
    
    expect(result.current.tasks[0].status).toBe('completed');
    expect(result.current.tasks[1].status).toBe('completed');
  });

  test('gets task analytics', async () => {
    const mockAnalytics = {
      totalTasks: 100,
      completedTasks: 75,
      overdueTasks: 5,
      averageCompletionTime: 2.5,
      tasksByPriority: { high: 20, medium: 50, low: 30 },
      tasksByStatus: { pending: 15, 'in-progress': 10, completed: 75 },
    };
    
    getTaskAnalytics.mockResolvedValue(mockAnalytics);
    
    const { result } = renderHook(() => useTasks());
    
    await act(async () => {
      const analytics = await result.current.getAnalytics();
      expect(analytics).toEqual(mockAnalytics);
    });
    
    expect(getTaskAnalytics).toHaveBeenCalledTimes(1);
  });
});
