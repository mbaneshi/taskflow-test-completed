/**
 * Task 2 Test: Task Filter Integration
 * 
 * Test Requirements:
 * - Allow users to filter tasks based on their completion status
 * - Optional: Add a search feature to filter tasks by title
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import UserPage from '../pages/UserPages/UserPage';

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

describe('Task 2: Task Filter Integration', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    
    // Mock authenticated user
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token-123';
      if (key === 'userRole') return 'user';
      if (key === 'loggedInUser') return JSON.stringify({ name: 'Test User' });
      if (key === 'tasks') return JSON.stringify([
        { id: '1', title: 'Complete project', description: 'Finish the project', progress: 0, status: 'incomplete' },
        { id: '2', title: 'Review code', description: 'Code review', progress: 100, status: 'complete' },
        { id: '3', title: 'Write tests', description: 'Unit tests', progress: 50, status: 'incomplete' }
      ]);
      return null;
    });
  });

  test('should display task filter toggle button', () => {
    render(
      <TestWrapper>
        <UserPage />
      </TestWrapper>
    );

    expect(screen.getByText('Show Task Filter')).toBeInTheDocument();
  });

  test('should show task filter when toggle button is clicked', async () => {
    render(
      <TestWrapper>
        <UserPage />
      </TestWrapper>
    );

    const toggleButton = screen.getByText('Show Task Filter');
    fireEvent.click(toggleButton);

    // Should show task filter component
    await waitFor(() => {
      expect(screen.getByText('Hide Task Filter')).toBeInTheDocument();
    });
  });

  test('should hide task filter when toggle button is clicked again', async () => {
    render(
      <TestWrapper>
        <UserPage />
      </TestWrapper>
    );

    const toggleButton = screen.getByText('Show Task Filter');
    
    // First click - show filter
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.getByText('Hide Task Filter')).toBeInTheDocument();
    });
    
    // Second click - hide filter
    fireEvent.click(screen.getByText('Hide Task Filter'));
    await waitFor(() => {
      expect(screen.getByText('Show Task Filter')).toBeInTheDocument();
    });
  });

  test('should display task management interface', () => {
    render(
      <TestWrapper>
        <UserPage />
      </TestWrapper>
    );

    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByText('Task Creation Box')).toBeInTheDocument();
  });

  test('should allow task creation', () => {
    render(
      <TestWrapper>
        <UserPage />
      </TestWrapper>
    );

    // Check if task creation form elements exist
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  test('should display existing tasks', () => {
    render(
      <TestWrapper>
        <UserPage />
      </TestWrapper>
    );

    // Check if mock tasks are displayed
    expect(screen.getByText('Complete project')).toBeInTheDocument();
    expect(screen.getByText('Review code')).toBeInTheDocument();
    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });
});
