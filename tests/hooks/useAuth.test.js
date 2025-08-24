import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../src/hooks/useAuth';
import { AuthContext } from '../../src/contexts/AuthContext';

// Mock the API functions
jest.mock('../../src/utils/api', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  logoutUser: jest.fn(),
  refreshToken: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  verifyTwoFactor: jest.fn(),
}));

import {
  loginUser,
  registerUser,
  logoutUser,
  refreshToken,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyTwoFactor,
} from '../../src/utils/api';

describe('useAuth Hook', () => {
  const mockAuthContext = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    clearError: jest.fn(),
    updateUserProfile: jest.fn(),
    changeUserPassword: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetUserPassword: jest.fn(),
    verifyTwoFactorCode: jest.fn(),
    refreshAuthToken: jest.fn(),
  };

  const wrapper = ({ children }) => (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns auth context values', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBe(mockAuthContext.user);
    expect(result.current.isAuthenticated).toBe(mockAuthContext.isAuthenticated);
    expect(result.current.isLoading).toBe(mockAuthContext.isLoading);
    expect(result.current.error).toBe(mockAuthContext.error);
  });

  test('returns login function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.login).toBe('function');
    expect(result.current.login).toBe(mockAuthContext.login);
  });

  test('returns logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.logout).toBe('function');
    expect(result.current.logout).toBe(mockAuthContext.logout);
  });

  test('returns register function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.register).toBe('function');
    expect(result.current.register).toBe(mockAuthContext.register);
  });

  test('returns clearError function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.clearError).toBe('function');
    expect(result.current.clearError).toBe(mockAuthContext.clearError);
  });

  test('returns updateUserProfile function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.updateUserProfile).toBe('function');
    expect(result.current.updateUserProfile).toBe(mockAuthContext.updateUserProfile);
  });

  test('returns changeUserPassword function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.changeUserPassword).toBe('function');
    expect(result.current.changeUserPassword).toBe(mockAuthContext.changeUserPassword);
  });

  test('returns requestPasswordReset function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.requestPasswordReset).toBe('function');
    expect(result.current.requestPasswordReset).toBe(mockAuthContext.requestPasswordReset);
  });

  test('returns resetUserPassword function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.resetUserPassword).toBe('function');
    expect(result.current.resetUserPassword).toBe(mockAuthContext.resetUserPassword);
  });

  test('returns verifyTwoFactorCode function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.verifyTwoFactorCode).toBe('function');
    expect(result.current.verifyTwoFactorCode).toBe(mockAuthContext.verifyTwoFactorCode);
  });

  test('returns refreshAuthToken function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.refreshAuthToken).toBe('function');
    expect(result.current.refreshAuthToken).toBe(mockAuthContext.refreshAuthToken);
  });

  test('throws error when used outside AuthContext', () => {
    // Render hook without wrapper to test error case
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });

  test('provides user information when authenticated', () => {
    const authenticatedContext = {
      ...mockAuthContext,
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        avatar: 'https://example.com/avatar.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '2024-01-01T12:00:00Z',
      },
      isAuthenticated: true,
    };

    const authenticatedWrapper = ({ children }) => (
      <AuthContext.Provider value={authenticatedContext}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: authenticatedWrapper });
    
    expect(result.current.user).toEqual(authenticatedContext.user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('provides loading state', () => {
    const loadingContext = {
      ...mockAuthContext,
      isLoading: true,
    };

    const loadingWrapper = ({ children }) => (
      <AuthContext.Provider value={loadingContext}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: loadingWrapper });
    
    expect(result.current.isLoading).toBe(true);
  });

  test('provides error state', () => {
    const errorContext = {
      ...mockAuthContext,
      error: 'Authentication failed',
    };

    const errorWrapper = ({ children }) => (
      <AuthContext.Provider value={errorContext}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: errorWrapper });
    
    expect(result.current.error).toBe('Authentication failed');
  });

  test('provides admin user information', () => {
    const adminContext = {
      ...mockAuthContext,
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'admin'],
      },
      isAuthenticated: true,
    };

    const adminWrapper = ({ children }) => (
      <AuthContext.Provider value={adminContext}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: adminWrapper });
    
    expect(result.current.user.role).toBe('admin');
    expect(result.current.user.permissions).toContain('admin');
  });

  test('provides user preferences', () => {
    const userWithPreferences = {
      ...mockAuthContext,
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true,
          timezone: 'UTC',
        },
      },
      isAuthenticated: true,
    };

    const preferencesWrapper = ({ children }) => (
      <AuthContext.Provider value={userWithPreferences}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: preferencesWrapper });
    
    expect(result.current.user.preferences.theme).toBe('dark');
    expect(result.current.user.preferences.language).toBe('en');
    expect(result.current.user.preferences.notifications).toBe(true);
  });

  test('provides user statistics', () => {
    const userWithStats = {
      ...mockAuthContext,
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        statistics: {
          totalTasks: 150,
          completedTasks: 120,
          overdueTasks: 5,
          averageCompletionTime: 2.5, // days
        },
      },
      isAuthenticated: true,
    };

    const statsWrapper = ({ children }) => (
      <AuthContext.Provider value={userWithStats}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: statsWrapper });
    
    expect(result.current.user.statistics.totalTasks).toBe(150);
    expect(result.current.user.statistics.completedTasks).toBe(120);
    expect(result.current.user.statistics.overdueTasks).toBe(5);
  });

  test('provides session information', () => {
    const userWithSession = {
      ...mockAuthContext,
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        session: {
          token: 'jwt-token-here',
          expiresAt: '2024-01-02T00:00:00Z',
          refreshToken: 'refresh-token-here',
          lastActivity: '2024-01-01T12:00:00Z',
        },
      },
      isAuthenticated: true,
    };

    const sessionWrapper = ({ children }) => (
      <AuthContext.Provider value={userWithSession}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: sessionWrapper });
    
    expect(result.current.user.session.token).toBe('jwt-token-here');
    expect(result.current.user.session.expiresAt).toBe('2024-01-02T00:00:00Z');
  });

  test('handles missing user gracefully', () => {
    const noUserContext = {
      ...mockAuthContext,
      user: null,
      isAuthenticated: false,
    };

    const noUserWrapper = ({ children }) => (
      <AuthContext.Provider value={noUserContext}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: noUserWrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('provides consistent function references', () => {
    const { result, rerender } = renderHook(() => useAuth(), { wrapper });
    
    const initialLogin = result.current.login;
    const initialLogout = result.current.logout;
    
    rerender();
    
    expect(result.current.login).toBe(initialLogin);
    expect(result.current.logout).toBe(initialLogout);
  });

  test('handles context updates correctly', () => {
    const { result, rerender } = renderHook(() => useAuth(), { wrapper });
    
    // Initial state
    expect(result.current.user).toBeNull();
    
    // Update context
    const updatedContext = {
      ...mockAuthContext,
      user: { id: '1', name: 'Updated User' },
      isAuthenticated: true,
    };
    
    const updatedWrapper = ({ children }) => (
      <AuthContext.Provider value={updatedContext}>
        {children}
      </AuthContext.Provider>
    );
    
    rerender();
    
    // Hook should reflect updated context
    expect(result.current.user).toEqual({ id: '1', name: 'Updated User' });
    expect(result.current.isAuthenticated).toBe(true);
  });
});
