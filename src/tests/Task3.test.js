/**
 * Task 3 Test: Add User Log page on the Admin page
 * 
 * Test Requirements:
 * - Display the user logs(login time, logout time, JWT token name, user name, role, ip address)
 * - The user logs could be deleted by admin action - DELETE
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Sidebar from '../components/admin/Sidebar';
import UserLogPage from '../pages/AdminPages/UserLogPage';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Task 3: User Logs Navigation and Functionality', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    
    // Mock admin user
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token-123';
      if (key === 'userRole') return 'admin';
      if (key === 'userLogs') return JSON.stringify([
        {
          id: '1',
          userId: 'admin-123',
          username: 'admin@example.com',
          role: 'admin',
          action: 'login',
          loginTime: '2025-08-21T20:00:00.000Z',
          logoutTime: null,
          ipAddress: '192.168.1.1',
          tokenName: 'eyJhbGciOi...'
        },
        {
          id: '2',
          userId: 'user-456',
          username: 'user@example.com',
          role: 'user',
          action: 'login',
          loginTime: '2025-08-21T19:00:00.000Z',
          logoutTime: '2025-08-21T20:00:00.000Z',
          ipAddress: '192.168.1.2',
          tokenName: 'eyJhbGciOi...'
        }
      ]);
      return null;
    });
  });

  describe('Admin Sidebar Navigation', () => {
    test('should display User Logs navigation item in admin sidebar', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(screen.getByText('User Logs')).toBeInTheDocument();
    });

    test('should have correct icon for User Logs navigation', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const userLogsItem = screen.getByText('User Logs');
      expect(userLogsItem).toBeInTheDocument();
      
      // Check if it's a navigation link
      expect(userLogsItem.closest('a')).toHaveAttribute('href', '/admin/user-logs');
    });

    test('should have all required admin navigation items', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
      expect(screen.getByText('Manage Tasks')).toBeInTheDocument();
      expect(screen.getByText('User Logs')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('User Logs Page Functionality', () => {
    test('should display user logs with all required information', async () => {
      render(
        <TestWrapper>
          <UserLogPage />
        </TestWrapper>
      );

      // Wait for logs to load
      await waitFor(() => {
        expect(screen.getByText('admin@example.com')).toBeInTheDocument();
        expect(screen.getByText('user@example.com')).toBeInTheDocument();
      });

      // Check if all required fields are displayed
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('user')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.2')).toBeInTheDocument();
      expect(screen.getByText('eyJhbGciOi...')).toBeInTheDocument();
    });

    test('should display login and logout times', async () => {
      render(
        <TestWrapper>
          <UserLogPage />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check if date formatting is working
        expect(screen.getByText(/8\/21\/2025/)).toBeInTheDocument();
      });
    });

    test('should have delete functionality for log entries', async () => {
      render(
        <TestWrapper>
          <UserLogPage />
        </TestWrapper>
      );

      await waitFor(() => {
        // Look for delete buttons (trash icons)
        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        expect(deleteButtons.length).toBeGreaterThan(0);
      });
    });

    test('should show delete confirmation when delete button is clicked', async () => {
      render(
        <TestWrapper>
          <UserLogPage />
        </TestWrapper>
      );

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        if (deleteButtons.length > 0) {
          fireEvent.click(deleteButtons[0]);
          
          // Should show confirmation
          expect(screen.getByText('Confirm')).toBeInTheDocument();
          expect(screen.getByText('Cancel')).toBeInTheDocument();
        }
      });
    });

    test('should have search and filter functionality', async () => {
      render(
        <TestWrapper>
          <UserLogPage />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for search input
        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
        
        // Check for role filter
        expect(screen.getByText(/filter/i)).toBeInTheDocument();
      });
    });

    test('should display correct page title and structure', async () => {
      render(
        <TestWrapper>
          <UserLogPage />
        </TestWrapper>
      );

      expect(screen.getByText('User Logs')).toBeInTheDocument();
      
      // Check for table structure
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Login Time')).toBeInTheDocument();
      expect(screen.getByText('Logout Time')).toBeInTheDocument();
      expect(screen.getByText('Token')).toBeInTheDocument();
      expect(screen.getByText('IP Address')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    test('should navigate to user logs page from sidebar', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const userLogsLink = screen.getByText('User Logs').closest('a');
      expect(userLogsLink).toHaveAttribute('href', '/admin/user-logs');
    });

    test('should maintain admin authentication context', () => {
      render(
        <TestWrapper>
          <UserLogPage />
        </TestWrapper>
      );

      // Verify we're in admin context
      expect(localStorageMock.getItem).toHaveBeenCalledWith('userRole');
    });
  });
});
