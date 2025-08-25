#!/bin/bash

# TaskFlow Comprehensive Testing Quick Start Script
# This script sets up and runs the complete test suite

echo "🚀 TaskFlow Comprehensive Testing Suite"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if Jest is available
if ! npx jest --version &> /dev/null; then
    echo "❌ Jest is not installed. Installing Jest..."
    npm install --save-dev jest @testing-library/react @testing-library/jest-dom
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Jest"
        exit 1
    fi
    echo "✅ Jest installed successfully"
fi

echo "🧪 Jest version: $(npx jest --version)"

# Create test directories if they don't exist
echo "📁 Setting up test directories..."
mkdir -p tests/components tests/hooks tests/utils tests/e2e tests/performance tests/security tests/accessibility

# Run comprehensive tests
echo "🚀 Starting comprehensive test suite..."
echo "This will run:"
echo "  - Unit tests (components, hooks, utils)"
echo "  - Integration tests (API, database)"
echo "  - End-to-end tests (user workflows)"
echo "  - Performance tests (load, memory)"
echo "  - Security tests (vulnerabilities)"
echo "  - Accessibility tests (WCAG compliance)"
echo ""

# Run the comprehensive test suite
npm run test:comprehensive

# Check if tests passed
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 All tests passed successfully!"
    echo "📊 Check the generated reports:"
    echo "  - test-report-comprehensive.json"
    echo "  - test-report-comprehensive.html"
    echo "  - coverage/ (if coverage tests were run)"
else
    echo ""
    echo "❌ Some tests failed. Please check the output above."
    echo "💡 You can run specific test categories:"
    echo "  - npm run test:unit"
    echo "  - npm run test:integration"
    echo "  - npm run test:e2e"
    echo "  - npm run test:performance"
    echo "  - npm run test:security"
    echo "  - npm run test:accessibility"
    exit 1
fi

echo ""
echo "✨ Testing complete! For more information, see COMPREHENSIVE_TESTING_GUIDE.md"
