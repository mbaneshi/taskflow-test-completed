import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import TaskItem from '../../src/components/tasks/TaskItem'

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('TaskItem Component', () => {
  const defaultTask = {
    _id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-12-31',
    assignee: 'test@example.com',
    tags: ['frontend', 'bug'],
    estimatedHours: 4,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }

  const defaultProps = {
    task: defaultTask,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onStatusChange: vi.fn(),
    onPriorityChange: vi.fn(),
    onAssign: vi.fn(),
    showActions: true
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task information correctly', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('displays priority badge with correct styling', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    const priorityBadge = screen.getByText('high');
    expect(priorityBadge).toHaveClass('bg-red-100 text-red-800');
  });

  it('displays status badge with correct styling', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    const statusBadge = screen.getByText('pending');
    expect(statusBadge).toHaveClass('bg-yellow-100 text-yellow-800');
  });

  it('displays tags correctly', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('bug')).toBeInTheDocument();
  });

  it('displays due date in correct format', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument();
  });

  it('displays estimated hours when provided', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    expect(screen.getByText('4h')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith(defaultTask._id);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultTask._id);
  });

  it('calls onStatusChange when status is changed', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    const statusSelect = screen.getByDisplayValue('pending');
    fireEvent.change(statusSelect, { target: { value: 'in-progress' } });
    
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith(defaultTask._id, 'in-progress');
  });

  it('calls onPriorityChange when priority is changed', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    const prioritySelect = screen.getByDisplayValue('high');
    fireEvent.change(prioritySelect, { target: { value: 'medium' } });
    
    expect(defaultProps.onPriorityChange).toHaveBeenCalledWith(defaultTask._id, 'medium');
  });

  it('calls onAssign when assignee is changed', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    const assigneeInput = screen.getByDisplayValue('test@example.com');
    fireEvent.change(assigneeInput, { target: { value: 'new@example.com' } });
    fireEvent.blur(assigneeInput);
    
    expect(defaultProps.onAssign).toHaveBeenCalledWith(defaultTask._id, 'new@example.com');
  });

  it('hides action buttons when showActions is false', () => {
    renderWithRouter(<TaskItem {...defaultProps} showActions={false} />);
    
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('applies correct priority colors', () => {
    const { rerender } = render(
      <BrowserRouter>
        <TaskItem {...defaultProps} task={{ ...defaultTask, priority: 'low' }} />
      </BrowserRouter>
    );
    expect(screen.getByText('low')).toHaveClass('bg-green-100 text-green-800');

    rerender(
      <BrowserRouter>
        <TaskItem {...defaultProps} task={{ ...defaultTask, priority: 'medium' }} />
      </BrowserRouter>
    );
    expect(screen.getByText('medium')).toHaveClass('bg-yellow-100 text-yellow-800');

    rerender(
      <BrowserRouter>
        <TaskItem {...defaultProps} task={{ ...defaultTask, priority: 'urgent' }} />
      </BrowserRouter>
    );
    expect(screen.getByText('urgent')).toHaveClass('bg-purple-100 text-purple-800');
  });

  it('applies correct status colors', () => {
    const { rerender } = render(
      <BrowserRouter>
        <TaskItem {...defaultProps} task={{ ...defaultTask, status: 'in-progress' }} />
      </BrowserRouter>
    );
    expect(screen.getByText('in-progress')).toHaveClass('bg-blue-100 text-blue-800');

    rerender(
      <BrowserRouter>
        <TaskItem {...defaultProps} task={{ ...defaultTask, status: 'complete' }} />
      </BrowserRouter>
    );
    expect(screen.getByText('complete')).toHaveClass('bg-green-100 text-green-800');

    rerender(
      <BrowserRouter>
        <TaskItem {...defaultProps} task={{ ...defaultTask, status: 'cancelled' }} />
      </BrowserRouter>
    );
    expect(screen.getByText('cancelled')).toHaveClass('bg-gray-100 text-gray-800');
  });

  it('handles missing optional fields gracefully', () => {
    const taskWithoutOptional = {
      _id: '1',
      title: 'Test Task',
      description: 'Test Description',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      assignee: '',
      tags: [],
      estimatedHours: null,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };

    renderWithRouter(<TaskItem {...defaultProps} task={taskWithoutOptional} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.queryByText('h')).not.toBeInTheDocument();
  });

  it('displays overdue warning for past due dates', () => {
    const overdueTask = {
      ...defaultTask,
      dueDate: '2023-01-01'
    };

    renderWithRouter(<TaskItem {...defaultProps} task={overdueTask} />);
    
    const dueDateElement = screen.getByText('Jan 1, 2023');
    expect(dueDateElement).toHaveClass('text-red-600 font-semibold');
  });

  it('displays due today indicator', () => {
    const today = new Date().toISOString().split('T')[0];
    const dueTodayTask = {
      ...defaultTask,
      dueDate: today
    };

    renderWithRouter(<TaskItem {...defaultProps} task={dueTodayTask} />);
    
    const dueDateElement = screen.getByText(new RegExp(today.split('-')[1] + ' ' + today.split('-')[2] + ', ' + today.split('-')[0]));
    expect(dueDateElement).toHaveClass('text-orange-600 font-semibold');
  });

  it('handles long titles gracefully', () => {
    const longTitleTask = {
      ...defaultTask,
      title: 'A'.repeat(100)
    };

    renderWithRouter(<TaskItem {...defaultProps} task={longTitleTask} />);
    
    expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
  });

  it('handles long descriptions gracefully', () => {
    const longDescTask = {
      ...defaultTask,
      description: 'A'.repeat(200)
    };

    renderWithRouter(<TaskItem {...defaultProps} task={longDescTask} />);
    
    expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-task-item';
    renderWithRouter(<TaskItem {...defaultProps} className={customClass} />);
    
    expect(screen.getByTestId('task-item')).toHaveClass(customClass);
  });

  it('displays creation and update timestamps', () => {
    renderWithRouter(<TaskItem {...defaultProps} />);
    
    expect(screen.getByText(/Created: Jan 1, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Updated: Jan 1, 2024/)).toBeInTheDocument();
  });

  it('handles empty tags array', () => {
    const taskWithoutTags = {
      ...defaultTask,
      tags: []
    };

    renderWithRouter(<TaskItem {...defaultProps} task={taskWithoutTags} />);
    
    expect(screen.queryByTestId('task-tags')).not.toBeInTheDocument();
  });

  it('handles null estimated hours', () => {
    const taskWithoutHours = {
      ...defaultTask,
      estimatedHours: null
    };

    renderWithRouter(<TaskItem {...defaultProps} task={taskWithoutHours} />);
    
    expect(screen.queryByText(/h/)).not.toBeInTheDocument();
  });
});
