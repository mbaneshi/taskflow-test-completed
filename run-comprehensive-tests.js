#!/usr/bin/env node

/**
 * Comprehensive Test Runner Script
 * 
 * Simple script to run the comprehensive test suite.
 * Tests all features from 0 to 100 with detailed scoring.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import ComprehensiveTestRunner from './tests/comprehensive-test-runner.js';

console.log('🚀 TaskFlow Comprehensive Test Suite');
console.log('Testing all features from 0 to 100...\n');

const runner = new ComprehensiveTestRunner();

try {
  await runner.runAllTests();
  console.log('\n🎉 All tests completed successfully!');
} catch (error) {
  console.error('\n❌ Test execution failed:', error);
  process.exit(1);
}
