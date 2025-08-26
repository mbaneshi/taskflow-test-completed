import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../src/contexts/AuthContext'
import NotificationProvider from '../../src/contexts/NotificationContext'
import TaskForm from '../../src/components/TaskForm'

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  },
  ToastContainer: () => null
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' })
  }
})

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          {component}
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('TaskForm Component', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form with all required fields', () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument()
  })

  it('shows create task title when not editing', () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    expect(screen.getByText(/create task/i)).toBeInTheDocument()
  })

  it('shows edit task title when editing', () => {
    const initialData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-12-31',
      assignee: 'test@example.com'
    }

    renderWithProviders(
      <TaskForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        initialData={initialData}
        mode="edit"
      />
    )

    expect(screen.getByText(/edit task/i)).toBeInTheDocument()
  })

  it('populates form with initial data when provided', () => {
    const initialData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high' as const,
      status: 'in-progress' as const,
      dueDate: '2024-12-31',
      assignee: 'test@example.com'
    }

    renderWithProviders(
      <TaskForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        initialData={initialData}
      />
    )

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
    expect(screen.getByDisplayValue('high')).toBeInTheDocument()
    expect(screen.getByDisplayValue('in-progress')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument()
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
  })

  it('validates required fields before submission', async () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const submitButton = screen.getByRole('button', { name: /create task/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  it('submits form with valid data', async () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const prioritySelect = screen.getByLabelText(/priority/i)
    const statusSelect = screen.getByLabelText(/status/i)
    const dueDateInput = screen.getByLabelText(/due date/i)
    const assigneeInput = screen.getByLabelText(/assignee/i)
    const submitButton = screen.getByRole('button', { name: /create task/i })

    fireEvent.change(titleInput, { target: { value: 'New Task' } })
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } })
    fireEvent.change(prioritySelect, { target: { value: 'high' } })
    fireEvent.change(statusSelect, { target: { value: 'pending' } })
    fireEvent.change(dueDateInput, { target: { value: '2024-12-31' } })
    fireEvent.change(assigneeInput, { target: { value: 'user@example.com' } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        priority: 'high' as const,
        status: 'pending' as const,
        dueDate: '2024-12-31',
        assignee: 'user@example.com',
        tags: [],
        attachments: []
      })
    })
  })

  it('calls onCancel when cancel button is clicked', () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('handles tag input correctly', async () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const tagInput = screen.getByPlaceholderText(/add tag/i)
    fireEvent.change(tagInput, { target: { value: 'urgent' } })
    fireEvent.keyDown(tagInput, { key: 'Enter' })

    await waitFor(() => {
      expect(screen.getByText('urgent')).toBeInTheDocument()
    })
  })

  it('removes tags when delete button is clicked', async () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const tagInput = screen.getByPlaceholderText(/add tag/i)
    fireEvent.change(tagInput, { target: { value: 'urgent' } })
    fireEvent.keyDown(tagInput, { key: 'Enter' })

    await waitFor(() => {
      const tag = screen.getByText('urgent')
      const deleteButton = tag.parentElement?.querySelector('button')
      if (deleteButton) {
        fireEvent.click(deleteButton)
      }
    })

    await waitFor(() => {
      expect(screen.queryByText('urgent')).not.toBeInTheDocument()
    })
  })

  it('validates title length', async () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const titleInput = screen.getByLabelText(/title/i)
    const longTitle = 'a'.repeat(101)
    fireEvent.change(titleInput, { target: { value: longTitle } })

    await waitFor(() => {
      expect(screen.getByText(/title must be 100 characters or less/i)).toBeInTheDocument()
    })
  })

  it('validates description length', async () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const descriptionInput = screen.getByLabelText(/description/i)
    const longDescription = 'a'.repeat(1001)
    fireEvent.change(descriptionInput, { target: { value: longDescription } })

    await waitFor(() => {
      expect(screen.getByText(/description must be 1000 characters or less/i)).toBeInTheDocument()
    })
  })

  it('validates email format for assignee', async () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const assigneeInput = screen.getByLabelText(/assignee/i)
    fireEvent.change(assigneeInput, { target: { value: 'invalid-email' } })

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('validates due date is not in the past', async () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const dueDateInput = screen.getByLabelText(/due date/i)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toISOString().split('T')[0]

    fireEvent.change(dueDateInput, { target: { value: yesterdayString } })

    await waitFor(() => {
      expect(screen.getByText(/due date cannot be in the past/i)).toBeInTheDocument()
    })
  })

  it('handles priority selection correctly', () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const prioritySelect = screen.getByLabelText(/priority/i)
    fireEvent.change(prioritySelect, { target: { value: 'high' } })

    expect(prioritySelect).toHaveValue('high')
  })

  it('handles status selection correctly', () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const statusSelect = screen.getByLabelText(/status/i)
    fireEvent.change(statusSelect, { target: { value: 'completed' } })

    expect(statusSelect).toHaveValue('completed')
  })

  it('applies custom styling when provided', () => {
    const customClass = 'custom-task-form'
    renderWithProviders(
      <TaskForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        className={customClass}
      />
    )

    const form = screen.getByRole('form')
    expect(form).toHaveClass(customClass)
  })

  it('shows loading state during submission', async () => {
    const slowSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderWithProviders(
      <TaskForm onSubmit={slowSubmit} onCancel={mockOnCancel} />
    )

    const titleInput = screen.getByLabelText(/title/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    fireEvent.change(titleInput, { target: { value: 'Test Task' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(screen.getByText(/submitting/i)).toBeInTheDocument()
    })
  })

  it('handles form reset correctly', () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)

    fireEvent.change(titleInput, { target: { value: 'Test Task' } })
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } })

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(titleInput).toHaveValue('')
    expect(descriptionInput).toHaveValue('')
  })

  it('applies responsive design classes', () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const form = screen.getByRole('form')
    expect(form).toHaveClass('grid', 'gap-4', 'md:grid-cols-2')
  })

  it('handles keyboard navigation correctly', () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)

    titleInput.focus()
    expect(titleInput).toHaveFocus()

    fireEvent.keyDown(titleInput, { key: 'Tab' })
    expect(descriptionInput).toHaveFocus()
  })

  it('shows character count for text fields', () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const titleInput = screen.getByLabelText(/title/i)
    fireEvent.change(titleInput, { target: { value: 'Test Task' } })

    expect(screen.getByText(/10\/100/i)).toBeInTheDocument()
  })

  it('handles file attachments when provided', () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const fileInput = screen.getByLabelText(/attachments/i)
    expect(fileInput).toBeInTheDocument()
  })

  it('validates file size and type', async () => {
    renderWithProviders(
      <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    const fileInput = screen.getByLabelText(/attachments/i)
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.txt', { type: 'text/plain' })

    fireEvent.change(fileInput, { target: { files: [largeFile] } })

    await waitFor(() => {
      expect(screen.getByText(/file size must be 10MB or less/i)).toBeInTheDocument()
    })
  })
})
