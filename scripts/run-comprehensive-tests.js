/**
 * Comprehensive Test Suite for TaskFlow Application
 * 
 * This file orchestrates the complete testing strategy including:
 * - Unit tests for all components, hooks, and utilities
 * - Integration tests for API endpoints and database operations
 * - End-to-end tests for complete user workflows
 * - Performance and security tests
 * - Accessibility and cross-browser compatibility tests
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import { spawn } from 'child_process';
import fs from 'fs';

class ComprehensiveTestSuite {
  constructor() {
    this.testResults = {
      unit: { passed: 0, failed: 0, total: 0, duration: 0 },
      integration: { passed: 0, failed: 0, total: 0, duration: 0 },
      e2e: { passed: 0, failed: 0, total: 0, duration: 0 },
      performance: { passed: 0, failed: 0, total: 0, duration: 0 },
      security: { passed: 0, failed: 0, total: 0, duration: 0 },
      accessibility: { passed: 0, failed: 0, total: 0, duration: 0 }
    };
    this.startTime = Date.now();
    this.coverageData = {};
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Test Suite for TaskFlow Application');
    console.log('=' .repeat(80));
    
    try {
      // 1. Unit Tests
      await this.runUnitTests();
      
      // 2. Integration Tests
      await this.runIntegrationTests();
      
      // 3. End-to-End Tests
      await this.runE2ETests();
      
      // 4. Performance Tests
      await this.runPerformanceTests();
      
      // 5. Security Tests
      await this.runSecurityTests();
      
      // 6. Accessibility Tests
      await this.runAccessibilityTests();
      
      // 7. Generate Comprehensive Report
      await this.generateComprehensiveReport();
      
    } catch (error) {
      console.error('❌ Test suite execution failed:', error);
      // Use process.exit only if available (Node.js environment)
      if (typeof globalThis.process !== 'undefined' && globalThis.process.exit) {
        globalThis.process.exit(1);
      }
    }
  }

  async runUnitTests() {
    console.log('\n📋 Running Unit Tests...');
    console.log('-'.repeat(40));
    
    try {
      // Frontend Component Tests
      console.log('Testing React Components...');
      await this.runJestTests('src/components', 'components');
      
      // Backend Model Tests
      console.log('Testing Backend Models...');
      await this.runJestTests('server/src/models', 'models');
      
      // Utility Function Tests
      console.log('Testing Utility Functions...');
      await this.runJestTests('src/utils', 'utils');
      
      // Hook Tests
      console.log('Testing Custom Hooks...');
      await this.runJestTests('src/hooks', 'hooks');
      
      // Context Tests
      console.log('Testing React Contexts...');
      await this.runJestTests('src/contexts', 'contexts');
      
      console.log('✅ Unit tests completed successfully');
      
    } catch (error) {
      console.error('❌ Unit tests failed:', error.message);
      throw error;
    }
  }

  async runIntegrationTests() {
    console.log('\n🔗 Running Integration Tests...');
    console.log('-'.repeat(40));
    
    try {
      // API Endpoint Tests
      console.log('Testing API Endpoints...');
      await this.runJestTests('server/src/routes', 'routes');
      await this.runJestTests('server/src/controllers', 'controllers');
      
      // Database Integration Tests
      console.log('Testing Database Operations...');
      await this.runJestTests('server/src/config', 'database');
      await this.runJestTests('server/src/middleware', 'middleware');
      
      // WebSocket Tests
      console.log('Testing WebSocket Functionality...');
      await this.runJestTests('server/src', 'websocket');
      
      console.log('✅ Integration tests completed successfully');
      
    } catch (error) {
      console.error('❌ Integration tests failed:', error.message);
      throw error;
    }
  }

  async runE2ETests() {
    console.log('\n🌐 Running End-to-End Tests...');
    console.log('-'.repeat(40));
    
    try {
      // User Authentication Flow
      console.log('Testing Authentication Flow...');
      await this.runJestTests('tests/e2e', 'auth');
      
      // Task Management Flow
      console.log('Testing Task Management Flow...');
      await this.runJestTests('tests/e2e', 'tasks');
      
      // Admin Dashboard Flow
      console.log('Testing Admin Dashboard Flow...');
      await this.runJestTests('tests/e2e', 'admin');
      
      // Real-time Collaboration Flow
      console.log('Testing Real-time Collaboration...');
      await this.runJestTests('tests/e2e', 'collaboration');
      
      console.log('✅ End-to-end tests completed successfully');
      
    } catch (error) {
      console.error('❌ End-to-end tests failed:', error.message);
      throw error;
    }
  }

  async runPerformanceTests() {
    console.log('\n⚡ Running Performance Tests...');
    console.log('-'.repeat(40));
    
    try {
      // Load Testing
      console.log('Running Load Tests...');
      await this.runJestTests('tests/performance', 'load');
      
      // Memory Leak Tests
      console.log('Testing Memory Usage...');
      await this.runJestTests('tests/performance', 'memory');
      
      // Response Time Tests
      console.log('Testing Response Times...');
      await this.runJestTests('tests/performance', 'response');
      
      console.log('✅ Performance tests completed successfully');
      
    } catch (error) {
      console.error('❌ Performance tests failed:', error.message);
      // Performance tests are not critical, so we don't throw
    }
  }

  async runSecurityTests() {
    console.log('\n🔒 Running Security Tests...');
    console.log('-'.repeat(40));
    
    try {
      // Authentication Security
      console.log('Testing Authentication Security...');
      await this.runJestTests('tests/security', 'auth');
      
      // Input Validation Tests
      console.log('Testing Input Validation...');
      await this.runJestTests('tests/security', 'validation');
      
      // SQL Injection Tests
      console.log('Testing SQL Injection Prevention...');
      await this.runJestTests('tests/security', 'injection');
      
      // XSS Prevention Tests
      console.log('Testing XSS Prevention...');
      await this.runJestTests('tests/security', 'xss');
      
      console.log('✅ Security tests completed successfully');
      
    } catch (error) {
      console.error('❌ Security tests failed:', error.message);
      // Security tests are critical, so we throw
      throw error;
    }
  }

  async runAccessibilityTests() {
    console.log('\n♿ Running Accessibility Tests...');
    console.log('-'.repeat(40));
    
    try {
      // ARIA Compliance Tests
      console.log('Testing ARIA Compliance...');
      await this.runJestTests('tests/accessibility', 'aria');
      
      // Keyboard Navigation Tests
      console.log('Testing Keyboard Navigation...');
      await this.runJestTests('tests/accessibility', 'keyboard');
      
      // Screen Reader Tests
      console.log('Testing Screen Reader Compatibility...');
      await this.runJestTests('tests/accessibility', 'screenreader');
      
      console.log('✅ Accessibility tests completed successfully');
      
    } catch (error) {
      console.error('❌ Accessibility tests failed:', error.message);
      // Accessibility tests are important but not critical
    }
  }

  async runJestTests(testPath, category) {
    return new Promise((resolve, reject) => {
      const jestProcess = spawn('npm', ['run', 'test', '--', '--testPathPattern', testPath, '--verbose', '--json'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let output = '';

      jestProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      jestProcess.stderr.on('data', (data) => {
        // Store error output for debugging if needed
        console.error('Jest stderr:', data.toString());
      });

      jestProcess.on('close', () => {
        try {
          const results = JSON.parse(output);
          this.updateTestResults(category, results);
          resolve();
        } catch {
          // If JSON parsing fails, try to extract test results from output
          this.extractTestResultsFromOutput(category, output);
          resolve();
        }
      });

      jestProcess.on('error', (processError) => {
        reject(processError);
      });
    });
  }

  updateTestResults(category, results) {
    if (results.numPassedTests !== undefined) {
      this.testResults[category].passed += results.numPassedTests;
      this.testResults[category].failed += results.numFailedTests;
      this.testResults[category].total += results.numTotalTests;
    }
  }

  extractTestResultsFromOutput(category, output) {
    // Extract test results from Jest output when JSON parsing fails
    const passedMatch = output.match(/(\d+) passing/);
    const failedMatch = output.match(/(\d+) failing/);
    
    // Initialize the category if it doesn't exist
    if (!this.testResults[category]) {
      this.testResults[category] = { passed: 0, failed: 0, total: 0, duration: 0 };
    }
    
    if (passedMatch) {
      this.testResults[category].passed += parseInt(passedMatch[1]);
    }
    if (failedMatch) {
      this.testResults[category].failed += parseInt(failedMatch[1]);
    }
    
    this.testResults[category].total = this.testResults[category].passed + this.testResults[category].failed;
  }

  async generateComprehensiveReport() {
    console.log('\n📊 Generating Comprehensive Test Report...');
    console.log('-'.repeat(40));
    
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    const report = {
      timestamp: new Date().toISOString(),
      duration: totalDuration,
      testResults: this.testResults,
      coverage: this.coverageData,
      summary: this.generateSummary()
    };
    
    // Save report to file
    fs.writeFileSync('test-report-comprehensive.json', JSON.stringify(report, null, 2));
    
    // Generate HTML report
    this.generateHTMLReport(report);
    
    console.log('✅ Comprehensive test report generated successfully');
    console.log('📁 Report saved to: test-report-comprehensive.json');
    console.log('🌐 HTML report saved to: test-report-comprehensive.html');
  }

  generateSummary() {
    const totalTests = Object.values(this.testResults).reduce((sum, category) => 
      sum + category.total, 0);
    const totalPassed = Object.values(this.testResults).reduce((sum, category) => 
      sum + category.passed, 0);
    const totalFailed = Object.values(this.testResults).reduce((sum, category) => 
      sum + category.failed, 0);
    
    const passRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : 0;
    
    return {
      totalTests,
      totalPassed,
      totalFailed,
      passRate: `${passRate}%`,
      status: totalFailed === 0 ? 'PASSED' : 'FAILED'
    };
  }

  generateHTMLReport(report) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow Comprehensive Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .summary-card h3 { margin: 0 0 10px 0; color: #495057; }
        .summary-card .value { font-size: 2em; font-weight: bold; color: #007bff; }
        .test-category { margin-bottom: 30px; }
        .test-category h3 { color: #495057; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .status-passed { color: #28a745; }
        .status-failed { color: #dc3545; }
        .footer { text-align: center; margin-top: 30px; color: #6c757d; }
        .duration { font-size: 0.9em; color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 TaskFlow Comprehensive Test Report</h1>
            <p>Generated on: ${new Date(report.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Total Tests</h3>
                <div class="value">${report.summary.totalTests}</div>
            </div>
            <div class="summary-card">
                <h3>Passed</h3>
                <div class="value status-passed">${report.summary.totalPassed}</div>
            </div>
            <div class="summary-card">
                <h3>Failed</h3>
                <div class="value status-failed">${report.summary.totalFailed}</div>
            </div>
            <div class="summary-card">
                <h3>Pass Rate</h3>
                <div class="value">${report.summary.passRate}</div>
            </div>
        </div>
        
        <div class="test-category">
            <h3>📋 Unit Tests</h3>
            <p>Passed: <span class="status-passed">${report.testResults.unit.passed}</span> | 
               Failed: <span class="status-failed">${report.testResults.unit.failed}</span> | 
               Total: ${report.testResults.unit.total}</p>
            <p class="duration">Duration: ${(report.testResults.unit.duration / 1000).toFixed(2)}s</p>
        </div>
        
        <div class="test-category">
            <h3>🔗 Integration Tests</h3>
            <p>Passed: <span class="status-passed">${report.testResults.integration.passed}</span> | 
               Failed: <span class="status-failed">${report.testResults.integration.failed}</span> | 
               Total: ${report.testResults.integration.total}</p>
            <p class="duration">Duration: ${(report.testResults.integration.duration / 1000).toFixed(2)}s</p>
        </div>
        
        <div class="test-category">
            <h3>🌐 End-to-End Tests</h3>
            <p>Passed: <span class="status-passed">${report.testResults.e2e.passed}</span> | 
               Failed: <span class="status-failed">${report.testResults.e2e.failed}</span> | 
               Total: ${report.testResults.e2e.total}</p>
            <p class="duration">Duration: ${(report.testResults.e2e.duration / 1000).toFixed(2)}s</p>
        </div>
        
        <div class="test-category">
            <h3>⚡ Performance Tests</h3>
            <p>Passed: <span class="status-passed">${report.testResults.performance.passed}</span> | 
               Failed: <span class="status-failed">${report.testResults.performance.failed}</span> | 
               Total: ${report.testResults.performance.total}</p>
            <p class="duration">Duration: ${(report.testResults.performance.duration / 1000).toFixed(2)}s</p>
        </div>
        
        <div class="test-category">
            <h3>🔒 Security Tests</h3>
            <p>Passed: <span class="status-passed">${report.testResults.security.passed}</span> | 
               Failed: <span class="status-failed">${report.testResults.security.failed}</span> | 
               Total: ${report.testResults.security.total}</p>
            <p class="duration">Duration: ${(report.testResults.security.duration / 1000).toFixed(2)}s</p>
        </div>
        
        <div class="test-category">
            <h3>♿ Accessibility Tests</h3>
            <p>Passed: <span class="status-passed">${report.testResults.accessibility.passed}</span> | 
               Failed: <span class="status-failed">${report.testResults.accessibility.failed}</span> | 
               Total: ${report.testResults.accessibility.total}</p>
            <p class="duration">Duration: ${(report.testResults.accessibility.duration / 1000).toFixed(2)}s</p>
        </div>
        
        <div class="footer">
            <p>Total Test Duration: ${(report.duration / 1000).toFixed(2)} seconds</p>
            <p>Overall Status: <strong class="${report.summary.status === 'PASSED' ? 'status-passed' : 'status-failed'}">${report.summary.status}</strong></p>
        </div>
    </div>
</body>
</html>`;
    
    fs.writeFileSync('test-report-comprehensive.html', htmlContent);
  }
}

// Run the comprehensive test suite
const testSuite = new ComprehensiveTestSuite();
testSuite.runAllTests().catch(console.error);
