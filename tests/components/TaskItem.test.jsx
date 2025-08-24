import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../../src/components/TaskItem';

describe('TaskItem Component', () => {
  const defaultTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-12-31',
    assignee: 'john@example.com',
    tags: ['frontend', 'bug'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const defaultProps = {
    task: defaultTask,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onStatusChange: jest.fn(),
    onPriorityChange: jest.fn(),
    onAssign: jest.fn(),
    isDragging: false,
    isSelected: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task with all basic information', () => {
    render(<TaskItem {...defaultProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('applies priority-based styling correctly', () => {
    const { rerender } = render(<TaskItem {...defaultProps} />);
    
    // High priority should have red styling
    expect(screen.getByText('high')).toHaveClass('text-red-600', 'bg-red-100');
    
    // Change to medium priority
    rerender(<TaskItem {...defaultProps} task={{ ...defaultTask, priority: 'medium' }} />);
    expect(screen.getByText('medium')).toHaveClass('text-yellow-600', 'bg-yellow-100');
    
    // Change to low priority
    rerender(<TaskItem {...defaultProps} task={{ ...defaultTask, priority: 'low' }} />);
    expect(screen.getByText('low')).toHaveClass('text-green-600', 'bg-green-100');
  });

  test('applies status-based styling correctly', () => {
    const { rerender } = render(<TaskItem {...defaultProps} />);
    
    // Pending status should have gray styling
    expect(screen.getByText('pending')).toHaveClass('text-gray-600', 'bg-gray-100');
    
    // Change to in-progress status
    rerender(<TaskItem {...defaultProps} task={{ ...defaultTask, status: 'in-progress' }} />);
    expect(screen.getByText('in-progress')).toHaveClass('text-blue-600', 'bg-blue-100');
    
    // Change to completed status
    rerender(<TaskItem {...defaultProps} task={{ ...defaultTask, status: 'completed' }} />);
    expect(screen.getByText('completed')).toHaveClass('text-green-600', 'bg-green-100');
  });

  test('displays tags correctly', () => {
    render(<TaskItem {...defaultProps} />);
    
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('bug')).toBeInTheDocument();
  });

  test('displays due date in readable format', () => {
    render(<TaskItem {...defaultProps} />);
    
    expect(screen.getByText(/Dec 31, 2024/i)).toBeInTheDocument();
  });

  test('shows overdue indicator for past due dates', () => {
    const overdueTask = {
      ...defaultTask,
      dueDate: '2023-12-31', // Past date
    };
    
    render(<TaskItem {...defaultProps} task={overdueTask} />);
    
    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
    expect(screen.getByText(/overdue/i)).toHaveClass('text-red-600', 'font-semibold');
  });

  test('shows due soon indicator for tasks due within 3 days', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueSoonTask = {
      ...defaultTask,
      dueDate: tomorrow.toISOString().split('T')[0],
    };
    
    render(<TaskItem {...defaultProps} task={dueSoonTask} />);
    
    expect(screen.getByText(/due soon/i)).toBeInTheDocument();
    expect(screen.getByText(/due soon/i)).toHaveClass('text-orange-600', 'font-semibold');
  });

  test('calls onEdit when edit button is clicked', () => {
    render(<TaskItem {...defaultProps} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith(defaultTask);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(<TaskItem {...defaultProps} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultTask.id);
  });

  test('calls onStatusChange when status is changed', () => {
    render(<TaskItem {...defaultProps} />);
    
    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'completed' } });
    
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith(defaultTask.id, 'completed');
  });

  test('calls onPriorityChange when priority is changed', () => {
    render(<TaskItem {...defaultProps} />);
    
    const prioritySelect = screen.getByLabelText(/priority/i);
    fireEvent.change(prioritySelect, { target: { value: 'medium' } });
    
    expect(defaultProps.onPriorityChange).toHaveBeenCalledWith(defaultTask.id, 'medium');
  });

  test('calls onAssign when assignee is changed', () => {
    render(<TaskItem {...defaultProps} />);
    
    const assigneeInput = screen.getByLabelText(/assignee/i);
    fireEvent.change(assigneeInput, { target: { value: 'jane@example.com' } });
    
    expect(defaultProps.onAssign).toHaveBeenCalledWith(defaultTask.id, 'jane@example.com');
  });

  test('applies dragging styles when isDragging is true', () => {
    render(<TaskItem {...defaultProps} isDragging={true} />);
    
    const taskItem = screen.getByTestId('task-item');
    expect(taskItem).toHaveClass('opacity-50', 'rotate-2', 'shadow-lg');
  });

  test('applies selection styles when isSelected is true', () => {
    render(<TaskItem {...defaultProps} isSelected={true} />);
    
    const taskItem = screen.getByTestId('task-item');
    expect(taskItem).toHaveClass('ring-2', 'ring-blue-500', 'bg-blue-50');
  });

  test('shows assignee avatar when available', () => {
    const taskWithAvatar = {
      ...defaultTask,
      assignee: {
        email: 'john@example.com',
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
      },
    };
    
    render(<TaskItem {...defaultProps} task={taskWithAvatar} />);
    
    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  test('shows assignee initials when no avatar is available', () => {
    const taskWithName = {
      ...defaultTask,
      assignee: {
        email: 'john@example.com',
        name: 'John Doe',
      },
    };
    
    render(<TaskItem {...defaultProps} task={taskWithName} />);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('shows unassigned indicator when no assignee', () => {
    const unassignedTask = {
      ...defaultTask,
      assignee: null,
    };
    
    render(<TaskItem {...defaultProps} task={unassignedTask} />);
    
    expect(screen.getByText(/unassigned/i)).toBeInTheDocument();
    expect(screen.getByText(/unassigned/i)).toHaveClass('text-gray-500', 'italic');
  });

  test('displays creation and update timestamps', () => {
    render(<TaskItem {...defaultProps} showTimestamps />);
    
    expect(screen.getByText(/created: Jan 1, 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/updated: Jan 1, 2024/i)).toBeInTheDocument();
  });

  test('shows progress bar for in-progress tasks', () => {
    const inProgressTask = {
      ...defaultTask,
      status: 'in-progress',
      progress: 75,
    };
    
    render(<TaskItem {...defaultProps} task={inProgressTask} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });

  test('handles long titles gracefully', () => {
    const longTitleTask = {
      ...defaultTask,
      title: 'A'.repeat(100),
    };
    
    render(<TaskItem {...defaultProps} task={longTitleTask} />);
    
    const title = screen.getByText(longTitleTask.title);
    expect(title).toHaveClass('truncate');
  });

  test('handles long descriptions gracefully', () => {
    const longDescriptionTask = {
      ...defaultTask,
      description: 'A'.repeat(200),
    };
    
    render(<TaskItem {...defaultProps} task={longDescriptionTask} />);
    
    const description = screen.getByText(longDescriptionTask.description);
    expect(description).toHaveClass('line-clamp-2');
  });

  test('shows estimated time when provided', () => {
    const taskWithTime = {
      ...defaultTask,
      estimatedTime: 120, // 2 hours in minutes
    };
    
    render(<TaskItem {...defaultProps} task={taskWithTime} />);
    
    expect(screen.getByText(/2h/i)).toBeInTheDocument();
  });

  test('shows actual time when provided', () => {
    const taskWithActualTime = {
      ...defaultTask,
      actualTime: 90, // 1.5 hours in minutes
    };
    
    render(<TaskItem {...defaultProps} task={taskWithActualTime} />);
    
    expect(screen.getByText(/1.5h/i)).toBeInTheDocument();
  });

  test('applies custom styling when provided', () => {
    render(<TaskItem {...defaultProps} className="custom-task-item" />);
    
    const taskItem = screen.getByTestId('task-item');
    expect(taskItem).toHaveClass('custom-task-item');
  });

  test('handles keyboard navigation correctly', () => {
    render(<TaskItem {...defaultProps} />);
    
    const taskItem = screen.getByTestId('task-item');
    taskItem.focus();
    
    // Press Enter to select
    fireEvent.keyDown(taskItem, { key: 'Enter' });
    expect(taskItem).toHaveClass('ring-2', 'ring-blue-500');
    
    // Press Space to toggle selection
    fireEvent.keyDown(taskItem, { key: ' ' });
    expect(taskItem).toHaveClass('ring-2', 'ring-blue-500');
  });

  test('shows subtasks when available', () => {
    const taskWithSubtasks = {
      ...defaultTask,
      subtasks: [
        { id: '1', title: 'Subtask 1', completed: true },
        { id: '2', title: 'Subtask 2', completed: false },
      ],
    };
    
    render(<TaskItem {...defaultProps} task={taskWithSubtasks} />);
    
    expect(screen.getByText('Subtask 1')).toBeInTheDocument();
    expect(screen.getByText('Subtask 2')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument(); // Progress indicator
  });

  test('shows comments count when available', () => {
    const taskWithComments = {
      ...defaultTask,
      comments: [
        { id: '1', text: 'Comment 1' },
        { id: '2', text: 'Comment 2' },
        { id: '3', text: 'Comment 3' },
      ],
    };
    
    render(<TaskItem {...defaultProps} task={taskWithComments} />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByLabelText(/comments/i)).toBeInTheDocument();
  });

  test('handles empty tags gracefully', () => {
    const taskWithoutTags = {
      ...defaultTask,
      tags: [],
    };
    
    render(<TaskItem {...defaultProps} task={taskWithoutTags} />);
    
    expect(screen.queryByTestId('tags-container')).not.toBeInTheDocument();
  });

  test('shows loading state when updating', () => {
    render(<TaskItem {...defaultProps} isUpdating={true} />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText(/updating/i)).toBeInTheDocument();
  });
});
