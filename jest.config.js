/**
 * Jest Configuration for TaskFlow Application
 * 
 * Comprehensive testing configuration for MERN stack application.
 * Covers frontend React components, backend API endpoints, and database operations.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

export default {
  // Test environment
  testEnvironment: 'jsdom',
  
  // File extensions to test
  testMatch: [
    '<rootDir>/tests/**/*.{test,spec}.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
    '<rootDir>/server/**/*.{test,spec}.{js,jsx}'
  ],
  
  // Test file patterns to ignore
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/coverage/'
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.js'
  ],
  
  // Coverage configuration
  collectCoverage: false, // Disable coverage for now to avoid Babel issues
  
  // Test timeout
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Reset modules between tests
  resetModules: false, // Changed to false to fix "module is already linked" error
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  },
  
  // Module file extensions
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'node'
  ],
  
  // Module name mapping for file imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/mocks/fileMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/mocks/fileMock.js'
  },
  
  // Transform configuration for JSX
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }]
  },
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ]
};
