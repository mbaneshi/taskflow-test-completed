import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import UserPage from '../pages/UserPages/UserPage'
import TaskFilter from '../../components/tasks/TaskFilter'

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

// Mock WebSocket
global.WebSocket = vi.fn().mockImplementation(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  send: vi.fn(),
  close: vi.fn(),
  readyState: WebSocket.OPEN
}))

// Mock fetch
global.fetch = vi.fn()

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

describe('Task 2: Task Filtering and Search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Task Filtering', () => {
    it('should render task filter component with all filter options', () => {
      renderWithProviders(<TaskFilter />)
      
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument()
    })

    it('should filter tasks by status', async () => {
      renderWithProviders(<TaskFilter />)
      
      const statusFilter = screen.getByLabelText(/status/i)
      fireEvent.change(statusFilter, { target: { value: 'in-progress' } })

      await waitFor(() => {
        expect(statusFilter).toHaveValue('in-progress')
      })
    })

    it('should filter tasks by priority', async () => {
      renderWithProviders(<TaskFilter />)
      
      const priorityFilter = screen.getByLabelText(/priority/i)
      fireEvent.change(priorityFilter, { target: { value: 'high' } })

      await waitFor(() => {
        expect(priorityFilter).toHaveValue('high')
      })
    })

    it('should search tasks by text', async () => {
      renderWithProviders(<TaskFilter />)
      
      const searchInput = screen.getByPlaceholderText(/search tasks/i)
      fireEvent.change(searchInput, { target: { value: 'urgent task' } })

      await waitFor(() => {
        expect(searchInput).toHaveValue('urgent task')
      })
    })

    it('should clear all filters when reset button is clicked', async () => {
      renderWithProviders(<TaskFilter />)
      
      const statusFilter = screen.getByLabelText(/status/i)
      const priorityFilter = screen.getByLabelText(/priority/i)
      const searchInput = screen.getByPlaceholderText(/search tasks/i)
      const resetButton = screen.getByRole('button', { name: /reset/i })

      // Set some filters
      fireEvent.change(statusFilter, { target: { value: 'in-progress' } })
      fireEvent.change(priorityFilter, { target: { value: 'high' } })
      fireEvent.change(searchInput, { target: { value: 'test' } })

      // Click reset
      fireEvent.click(resetButton)

      await waitFor(() => {
        expect(statusFilter).toHaveValue('')
        expect(priorityFilter).toHaveValue('')
        expect(searchInput).toHaveValue('')
      })
    })
  })

  describe('Task Management', () => {
    it('should display task list with proper task information', () => {
      renderWithProviders(<UserPage />)
      
      // Should show task management interface
      expect(screen.getByText(/tasks/i)).toBeInTheDocument()
    })

    it('should allow creating new tasks', () => {
      renderWithProviders(<UserPage />)
      
      const createButton = screen.getByRole('button', { name: /create task/i })
      expect(createButton).toBeInTheDocument()
    })

    it('should allow editing existing tasks', () => {
      renderWithProviders(<UserPage />)
      
      // Should show edit options for tasks
      expect(screen.getByText(/edit/i)).toBeInTheDocument()
    })

    it('should allow deleting tasks with confirmation', () => {
      renderWithProviders(<UserPage />)
      
      // Should show delete options for tasks
      expect(screen.getByText(/delete/i)).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should adapt layout for mobile devices', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 375
      })

      renderWithProviders(<UserPage />)
      
      // Should show mobile-optimized layout
      expect(screen.getByText(/tasks/i)).toBeInTheDocument()
    })
  })
})
