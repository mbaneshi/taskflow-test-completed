import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import AdminPage from '../pages/AdminPages/AdminPage'
import UserLog from '../../components/admin/UserLog'

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
    useLocation: () => ({ pathname: '/admin' })
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

describe('Task 3: Admin Dashboard and User Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Admin Dashboard', () => {
    it('should render admin dashboard with navigation', () => {
      renderWithProviders(<AdminPage />)
      
      expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument()
      expect(screen.getByText(/user management/i)).toBeInTheDocument()
      expect(screen.getByText(/system logs/i)).toBeInTheDocument()
    })

    it('should display user statistics and metrics', () => {
      renderWithProviders(<AdminPage />)
      
      expect(screen.getByText(/total users/i)).toBeInTheDocument()
      expect(screen.getByText(/active users/i)).toBeInTheDocument()
      expect(screen.getByText(/total tasks/i)).toBeInTheDocument()
    })

    it('should show real-time system status', () => {
      renderWithProviders(<AdminPage />)
      
      expect(screen.getByText(/system status/i)).toBeInTheDocument()
      expect(screen.getByText(/database/i)).toBeInTheDocument()
      expect(screen.getByText(/websocket/i)).toBeInTheDocument()
    })
  })

  describe('User Management', () => {
    it('should display user list with management options', () => {
      renderWithProviders(<AdminPage />)
      
      expect(screen.getByText(/user list/i)).toBeInTheDocument()
      expect(screen.getByText(/actions/i)).toBeInTheDocument()
    })

    it('should allow viewing user details', () => {
      renderWithProviders(<AdminPage />)
      
      const viewButton = screen.getByRole('button', { name: /view/i })
      expect(viewButton).toBeInTheDocument()
    })

    it('should allow editing user information', () => {
      renderWithProviders(<AdminPage />)
      
      const editButton = screen.getByRole('button', { name: /edit/i })
      expect(editButton).toBeInTheDocument()
    })

    it('should allow deleting users with confirmation', () => {
      renderWithProviders(<AdminPage />)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      expect(deleteButton).toBeInTheDocument()
    })

    it('should show confirmation dialog before user deletion', async () => {
      renderWithProviders(<AdminPage />)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)

      await waitFor(() => {
        expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument()
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
      })
    })
  })

  describe('User Activity Logs', () => {
    it('should display user activity logs', () => {
      renderWithProviders(<UserLog />)
      
      expect(screen.getByText(/user activity logs/i)).toBeInTheDocument()
      expect(screen.getByText(/timestamp/i)).toBeInTheDocument()
      expect(screen.getByText(/action/i)).toBeInTheDocument()
    })

    it('should filter logs by date range', async () => {
      renderWithProviders(<UserLog />)
      
      const startDateInput = screen.getByLabelText(/start date/i)
      const endDateInput = screen.getByLabelText(/end date/i)
      
      fireEvent.change(startDateInput, { target: { value: '2024-01-01' } })
      fireEvent.change(endDateInput, { target: { value: '2024-12-31' } })

      await waitFor(() => {
        expect(startDateInput).toHaveValue('2024-01-01')
        expect(endDateInput).toHaveValue('2024-12-31')
      })
    })

    it('should filter logs by user', async () => {
      renderWithProviders(<UserLog />)
      
      const userFilter = screen.getByLabelText(/user/i)
      fireEvent.change(userFilter, { target: { value: 'test@example.com' } })

      await waitFor(() => {
        expect(userFilter).toHaveValue('test@example.com')
      })
    })

    it('should export logs to CSV format', () => {
      renderWithProviders(<UserLog />)
      
      const exportButton = screen.getByRole('button', { name: /export csv/i })
      expect(exportButton).toBeInTheDocument()
    })
  })

  describe('System Monitoring', () => {
    it('should display system performance metrics', () => {
      renderWithProviders(<AdminPage />)
      
      expect(screen.getByText(/cpu usage/i)).toBeInTheDocument()
      expect(screen.getByText(/memory usage/i)).toBeInTheDocument()
      expect(screen.getByText(/disk usage/i)).toBeInTheDocument()
    })

    it('should show database connection status', () => {
      renderWithProviders(<AdminPage />)
      
      expect(screen.getByText(/database status/i)).toBeInTheDocument()
      expect(screen.getByText(/connected/i)).toBeInTheDocument()
    })

    it('should display error logs and alerts', () => {
      renderWithProviders(<AdminPage />)
      
      expect(screen.getByText(/error logs/i)).toBeInTheDocument()
      expect(screen.getByText(/alerts/i)).toBeInTheDocument()
    })
  })
})
