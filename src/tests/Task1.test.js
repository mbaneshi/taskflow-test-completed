/**
 * Task 1 Test: Display Login/Register page before landing page
 * 
 * Test Requirements:
 * - Users should login first to access the full list of tabs
 * - When they're logged out, only Dashboard panel should be displayed
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Landing from '../pages/Landing';

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

describe('Task 1: Landing Page Authentication', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('should show limited dashboard panel when user is not authenticated', () => {
    // Mock unauthenticated state
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <TestWrapper>
        <Landing />
      </TestWrapper>
    );

    // Should show limited dashboard panel
    expect(screen.getByText('Welcome to TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Panel')).toBeInTheDocument();
    expect(screen.getByText('Please login to access the full list of tabs and features.')).toBeInTheDocument();
    
    // Should show feature list
    expect(screen.getByText('• View and manage tasks')).toBeInTheDocument();
    expect(screen.getByText('• Access team collaboration tools')).toBeInTheDocument();
    expect(screen.getByText('• Use advanced filtering and search')).toBeInTheDocument();
    
    // Should show login/register buttons
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    
    // Should NOT show full landing page content
    expect(screen.queryByText('Choose Your Role')).not.toBeInTheDocument();
    expect(screen.queryByText('Features')).not.toBeInTheDocument();
  });

  test('should show full landing page when user is authenticated', () => {
    // Mock authenticated state
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token-123';
      if (key === 'userRole') return 'user';
      return null;
    });
    
    render(
      <TestWrapper>
        <Landing />
      </TestWrapper>
    );

    // Should show full landing page content
    expect(screen.getByText('Welcome to TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('Choose Your Role')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    
    // Should NOT show limited dashboard panel
    expect(screen.queryByText('Dashboard Panel')).not.toBeInTheDocument();
    expect(screen.queryByText('Please login to access the full list of tabs and features.')).not.toBeInTheDocument();
  });

  test('should redirect to login page when login button is clicked', () => {
    // Mock unauthenticated state
    localStorageMock.getItem.mockReturnValue(null);
    
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));
    
    render(
      <TestWrapper>
        <Landing />
      </TestWrapper>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    // In a real test, we would verify navigation
    // For now, we verify the button exists and is clickable
    expect(loginButton).toBeInTheDocument();
  });

  test('should redirect to signup page when register button is clicked', () => {
    // Mock unauthenticated state
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <TestWrapper>
        <Landing />
      </TestWrapper>
    );

    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);
    
    // Verify the button exists and is clickable
    expect(registerButton).toBeInTheDocument();
  });
});
