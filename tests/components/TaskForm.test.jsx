import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../../src/components/TaskForm';

describe('TaskForm Component', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    initialData: null,
    isEditing: false,
  };

  const sampleTask = {
    title: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-12-31',
    assignee: 'john@example.com',
    tags: ['frontend', 'bug'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with all required fields', () => {
    render(<TaskForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
  });

  test('shows create task title when not editing', () => {
    render(<TaskForm {...defaultProps} />);
    expect(screen.getByText(/create new task/i)).toBeInTheDocument();
  });

  test('shows edit task title when editing', () => {
    render(<TaskForm {...defaultProps} isEditing={true} />);
    expect(screen.getByText(/edit task/i)).toBeInTheDocument();
  });

  test('populates form with initial data when provided', () => {
    render(<TaskForm {...defaultProps} initialData={sampleTask} />);
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('High')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pending')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  test('validates required fields before submission', async () => {
    render(<TaskForm {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
    
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    render(<TaskForm {...defaultProps} />);
    
    // Fill in required fields
    await userEvent.type(screen.getByLabelText(/title/i), 'New Task');
    await userEvent.type(screen.getByLabelText(/description/i), 'New Description');
    
    // Select priority and status
    fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: 'medium' } });
    fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'in-progress' } });
    
    // Set due date (use a future date to pass validation)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: tomorrowString } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        priority: 'medium',
        status: 'in-progress',
        dueDate: tomorrowString,
        assignee: '',
        tags: [],
      });
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<TaskForm {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  test('handles tag input correctly', async () => {
    render(<TaskForm {...defaultProps} />);
    
    const tagsInput = screen.getByLabelText(/tags/i);
    await userEvent.type(tagsInput, 'frontend, backend, testing');
    
    // Tags should be parsed and displayed
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
  });

  test('removes tags when delete button is clicked', async () => {
    render(<TaskForm {...defaultProps} />);
    
    const tagsInput = screen.getByLabelText(/tags/i);
    await userEvent.type(tagsInput, 'frontend, backend');
    
    // Remove first tag
    const deleteButton = screen.getAllByRole('button', { name: /remove tag/i })[0];
    fireEvent.click(deleteButton);
    
    expect(screen.queryByText('frontend')).not.toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();
  });

  test('validates title length', async () => {
    render(<TaskForm {...defaultProps} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.type(titleInput, 'A'.repeat(101)); // Exceeds max length
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText(/title must be less than 100 characters/i)).toBeInTheDocument();
    });
  });

  test('validates description length', async () => {
    render(<TaskForm {...defaultProps} />);
    
    const descriptionInput = screen.getByLabelText(/description/i);
    await userEvent.type(descriptionInput, 'A'.repeat(1001)); // Exceeds max length
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText(/description must be less than 1000 characters/i)).toBeInTheDocument();
    });
  });

  test('validates email format for assignee', async () => {
    render(<TaskForm {...defaultProps} />);
    
    const assigneeInput = screen.getByLabelText(/assignee/i);
    await userEvent.type(assigneeInput, 'invalid-email');
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('validates due date is not in the past', async () => {
    render(<TaskForm {...defaultProps} />);
    
    const dueDateInput = screen.getByLabelText(/due date/i);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    fireEvent.change(dueDateInput, { target: { value: yesterdayString } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText(/due date cannot be in the past/i)).toBeInTheDocument();
    });
  });

  test('handles priority selection correctly', () => {
    render(<TaskForm {...defaultProps} />);
    
    const prioritySelect = screen.getByLabelText(/priority/i);
    const options = prioritySelect.querySelectorAll('option');
    
    expect(options).toHaveLength(4); // low, medium, high, urgent
    expect(options[0].value).toBe('low');
    expect(options[3].value).toBe('urgent');
  });

  test('handles status selection correctly', () => {
    render(<TaskForm {...defaultProps} />);
    
    const statusSelect = screen.getByLabelText(/status/i);
    const options = statusSelect.querySelectorAll('option');
    
    expect(options).toHaveLength(4); // pending, in-progress, completed, cancelled
    expect(options[0].value).toBe('pending');
    expect(options[2].value).toBe('completed');
  });

  test('applies custom styling when provided', () => {
    render(<TaskForm {...defaultProps} className="custom-form" />);
    const form = screen.getByRole('form');
    expect(form).toHaveClass('custom-form');
  });

  test('shows loading state during submission', async () => {
    const slowSubmit = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<TaskForm {...defaultProps} onSubmit={slowSubmit} />);
    
    // Fill required fields
    await userEvent.type(screen.getByLabelText(/title/i), 'Test Task');
    await userEvent.type(screen.getByLabelText(/description/i), 'Test Description');
    
    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/creating/i)).toBeInTheDocument();
  });

  test('handles form reset correctly', () => {
    render(<TaskForm {...defaultProps} initialData={sampleTask} />);
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    // Form should be cleared
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  test('applies responsive design classes', () => {
    render(<TaskForm {...defaultProps} />);
    const form = screen.getByRole('form');
    
    expect(form).toHaveClass('grid', 'gap-4', 'sm:gap-6');
  });

  test('handles keyboard navigation correctly', async () => {
    render(<TaskForm {...defaultProps} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    titleInput.focus();
    
    // Tab to next field
    await userEvent.tab();
    expect(screen.getByLabelText(/description/i)).toHaveFocus();
    
    // Tab to next field
    await userEvent.tab();
    expect(screen.getByLabelText(/priority/i)).toHaveFocus();
  });

  test('shows character count for text fields', async () => {
    render(<TaskForm {...defaultProps} showCharacterCount />);
    
    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.type(titleInput, 'Test');
    
    expect(screen.getByText('4/100')).toBeInTheDocument();
  });

  test('handles file attachments when provided', () => {
    render(<TaskForm {...defaultProps} allowAttachments />);
    
    const fileInput = screen.getByLabelText(/attachments/i);
    expect(fileInput).toBeInTheDocument();
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText('test.txt')).toBeInTheDocument();
  });

  test('validates file size and type', () => {
    render(<TaskForm {...defaultProps} allowAttachments maxFileSize={1024} allowedTypes={['.txt', '.pdf']} />);
    
    const fileInput = screen.getByLabelText(/attachments/i);
    
    // Test file too large (1024 KB = 1 MB, so create a file larger than 1 MB)
    const largeFile = new File(['x'.repeat(1024 * 1024 + 1024)], 'large.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    
    expect(screen.getByText(/file size exceeds limit/i)).toBeInTheDocument();
    
    // Test invalid file type
    const invalidFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    
    expect(screen.getByText(/file type not allowed/i)).toBeInTheDocument();
  });
});
