/**
 * Jest Setup Configuration
 * 
 * Main setup file for Jest testing environment.
 * Configures testing library, mocks, and global test utilities.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock fetch
global.fetch = jest.fn();

// Mock console methods in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress console errors and warnings in tests
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };
  
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  // Restore console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.testUtils = {
  // Mock user data
  mockUser: {
    _id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  
  // Mock admin user data
  mockAdmin: {
    _id: 'admin-123',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  
  // Mock task data
  mockTask: {
    _id: 'task-123',
    title: 'Test Task',
    description: 'Test task description',
    status: 'pending',
    priority: 'medium',
    progress: 0,
    dueDate: new Date('2025-12-31'),
    assignedTo: 'user-123',
    createdBy: 'user-123',
    tags: ['test', 'example'],
    estimatedHours: 8,
    actualHours: 0,
    isCompleted: false,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  
  // Mock user log data
  mockUserLog: {
    _id: 'log-123',
    userId: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    action: 'login',
    loginTime: new Date('2025-01-01T10:00:00Z'),
    logoutTime: null,
    sessionDuration: 0,
    jwtToken: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      expiresAt: new Date('2025-01-02T10:00:00Z'),
      isRevoked: false
    },
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Test Browser)',
    deviceInfo: {
      browser: 'Test Browser',
      os: 'Test OS',
      platform: 'Test Platform'
    },
    isSuccessful: true,
    failureReason: null,
    createdAt: new Date('2025-01-01T10:00:00Z'),
    updatedAt: new Date('2025-01-01T10:00:00Z')
  },
  
  // Mock JWT token
  mockJWTToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM1NzE2ODAwLCJleHAiOjE3MzU4MDMyMDB9.test-signature',
  
  // Mock API response
  mockApiResponse: (data, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: async () => data,
    text: async () => JSON.stringify(data)
  }),
  
  // Mock fetch response
  mockFetchResponse: (data, status = 200) => {
    global.fetch.mockResolvedValueOnce(
      global.testUtils.mockApiResponse(data, status)
    );
  },
  
  // Mock fetch error
  mockFetchError: (error = 'Network error') => {
    global.fetch.mockRejectedValueOnce(new Error(error));
  },
  
  // Reset all mocks
  resetMocks: () => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    
    sessionStorageMock.getItem.mockClear();
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.removeItem.mockClear();
    sessionStorageMock.clear.mockClear();
    
    global.fetch.mockClear();
  }
};

// Setup before each test
beforeEach(() => {
  global.testUtils.resetMocks();
  
  // Reset DOM
  document.body.innerHTML = '';
  
  // Clear all timers
  jest.clearAllTimers();
  
  // Reset all mocks
  jest.clearAllMocks();
});

// Cleanup after each test
afterEach(() => {
  // Cleanup any remaining timers
  jest.clearAllTimers();
  
  // Cleanup any remaining mocks
  jest.clearAllMocks();
});

// Global test matchers
expect.extend({
  // Custom matcher for checking if component renders without crashing
  toRenderWithoutCrashing(received) {
    const pass = received !== null && received !== undefined;
    if (pass) {
      return {
        message: () => `Expected component not to render, but it did`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected component to render, but it crashed`,
        pass: false,
      };
    }
  },
  
  // Custom matcher for checking if function throws specific error
  toThrowWithMessage(received, errorType, message) {
    try {
      received();
      return {
        message: () => `Expected function to throw ${errorType.name}`,
        pass: false,
      };
    } catch (error) {
      if (error instanceof errorType && error.message.includes(message)) {
        return {
          message: () => `Expected function not to throw ${errorType.name} with message containing "${message}"`,
          pass: true,
        };
      } else {
        return {
          message: () => `Expected function to throw ${errorType.name} with message containing "${message}", but got ${error.constructor.name}: "${error.message}"`,
          pass: false,
        };
      }
    }
  }
});

// Export test utilities for use in test files
export { global.testUtils as testUtils };
