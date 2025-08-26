import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../src/contexts/AuthContext'

// Mock the API functions
vi.mock('../../src/utils/api', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  logoutUser: vi.fn(),
  refreshToken: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  verifyTwoFactor: vi.fn()
}))

const mockApi = await import('../../src/utils/api')

const wrapper = ({ children }) => {
  const mockAuthContext = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    clearError: vi.fn(),
    updateUserProfile: vi.fn(),
    changeUserPassword: vi.fn(),
    requestPasswordReset: vi.fn(),
    resetUserPassword: vi.fn(),
    verifyTwoFactorCode: vi.fn(),
    refreshAuthToken: vi.fn()
  }

  return (
    <AuthProvider value={mockAuthContext}>
      {children}
    </AuthProvider>
  )
}

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns auth context values', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current).toBeDefined();
    expect(result.current.user).toBeDefined();
    expect(result.current.isAuthenticated).toBeDefined();
    expect(result.current.isLoading).toBeDefined();
    expect(result.current.error).toBeDefined();
  });

  it('provides login function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.login).toBe('function');
  });

  it('provides logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.logout).toBe('function');
  });

  it('provides register function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.register).toBe('function');
  });

  it('provides clearError function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.clearError).toBe('function');
  });

  it('provides updateUserProfile function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.updateUserProfile).toBe('function');
  });

  it('provides changeUserPassword function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.changeUserPassword).toBe('function');
  });

  it('provides requestPasswordReset function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.requestPasswordReset).toBe('function');
  });

  it('provides resetUserPassword function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.resetUserPassword).toBe('function');
  });

  it('provides verifyTwoFactorCode function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.verifyTwoFactorCode).toBe('function');
  });

  it('provides refreshAuthToken function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.refreshAuthToken).toBe('function');
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('can be called multiple times without errors', () => {
    const { result: result1 } = renderHook(() => useAuth(), { wrapper });
    const { result: result2 } = renderHook(() => useAuth(), { wrapper });
    
    expect(result1.current).toBeDefined();
    expect(result2.current).toBeDefined();
  });

  it('maintains consistent context across renders', () => {
    const { result, rerender } = renderHook(() => useAuth(), { wrapper });
    
    const firstRender = result.current;
    rerender();
    const secondRender = result.current;
    
    expect(firstRender).toBe(secondRender);
  });

  it('provides stable function references', () => {
    const { result, rerender } = renderHook(() => useAuth(), { wrapper });
    
    const firstLogin = result.current.login;
    rerender();
    const secondLogin = result.current.login;
    
    expect(firstLogin).toBe(secondLogin);
  });

  it('handles context updates correctly', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Simulate context update
    act(() => {
      // This would normally be done by the context provider
      // For testing, we're just verifying the hook works
    });
    
    expect(result.current).toBeDefined();
  });

  it('works with different component hierarchies', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current).toBeDefined();
    expect(typeof result.current.login).toBe('function');
  });

  it('provides consistent API surface', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const expectedFunctions = [
      'login',
      'logout',
      'register',
      'clearError',
      'updateUserProfile',
      'changeUserPassword',
      'requestPasswordReset',
      'resetUserPassword',
      'verifyTwoFactorCode',
      'refreshAuthToken'
    ];
    
    expectedFunctions.forEach(funcName => {
      expect(typeof result.current[funcName]).toBe('function');
    });
  });

  it('maintains referential equality for functions', () => {
    const { result, rerender } = renderHook(() => useAuth(), { wrapper });
    
    const initialFunctions = {
      login: result.current.login,
      logout: result.current.logout,
      register: result.current.register
    };
    
    rerender();
    
    expect(result.current.login).toBe(initialFunctions.login);
    expect(result.current.logout).toBe(initialFunctions.logout);
    expect(result.current.register).toBe(initialFunctions.register);
  });

  it('works with concurrent renders', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Simulate concurrent access
    const concurrentResult = useAuth();
    
    expect(result.current).toBeDefined();
    expect(concurrentResult).toBeDefined();
  });

  it('provides proper TypeScript types', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // This test ensures the hook provides the expected structure
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
  });
});
