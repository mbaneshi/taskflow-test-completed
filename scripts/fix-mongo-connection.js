#!/usr/bin/env node

/**
 * MongoDB Connection Diagnostic & Fix Script
 * 
 * This script helps diagnose and fix MongoDB connection issues
 * commonly caused by Orbstack networking problems.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import { execSync } from 'child_process';
import { spawn } from 'child_process';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const runCommand = (command, options = {}) => {
  try {
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      ...options 
    });
    return { success: true, output: result.trim() };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const checkDockerStatus = () => {
  log('\n🔍 Checking Docker status...', 'blue');
  
  const dockerInfo = runCommand('docker info');
  if (!dockerInfo.success) {
    log('❌ Docker is not running or not accessible', 'red');
    return false;
  }
  
  log('✅ Docker is running', 'green');
  return true;
};

const checkMongoContainer = () => {
  log('\n🔍 Checking MongoDB container...', 'blue');
  
  const containerStatus = runCommand('docker-compose ps mongodb');
  if (!containerStatus.success) {
    log('❌ MongoDB container not found or docker-compose not working', 'red');
    return false;
  }
  
  log('✅ MongoDB container found', 'green');
  console.log(containerStatus.output);
  return true;
};

const checkMongoPort = () => {
  log('\n🔍 Checking MongoDB port binding...', 'blue');
  
  const portCheck = runCommand('netstat -an | grep LISTEN | grep 27017');
  if (!portCheck.success) {
    log('❌ Port 27017 not listening', 'red');
    return false;
  }
  
  log('✅ Port 27017 is listening', 'green');
  console.log(portCheck.output);
  return true;
};

const checkMongoConnectivity = () => {
  log('\n🔍 Testing MongoDB connectivity...', 'blue');
  
  // Test direct connection
  const directTest = runCommand('docker exec taskflow-mongodb mongosh --eval "db.adminCommand(\'ping\')" -u admin -p taskflow123 --authenticationDatabase admin --quiet');
  if (directTest.success) {
    log('✅ Direct container connection works', 'green');
  } else {
    log('❌ Direct container connection failed', 'red');
  }
  
  // Test localhost connection
  const localTest = runCommand('mongosh --eval "db.adminCommand(\'ping\')" mongodb://admin:taskflow123@localhost:27017/taskflow?authSource=admin --quiet');
  if (localTest.success) {
    log('✅ Localhost connection works', 'green');
  } else {
    log('❌ Localhost connection failed', 'red');
  }
  
  return directTest.success && localTest.success;
};

const restartMongoContainer = () => {
  log('\n🔄 Restarting MongoDB container...', 'yellow');
  
  const restart = runCommand('docker-compose restart mongodb');
  if (!restart.success) {
    log('❌ Failed to restart MongoDB container', 'red');
    return false;
  }
  
  log('✅ MongoDB container restarted', 'green');
  
  // Wait for container to be healthy
  log('⏳ Waiting for container to be healthy...', 'yellow');
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    const status = runCommand('docker-compose ps mongodb');
    if (status.success && status.output.includes('healthy')) {
      log('✅ MongoDB container is healthy', 'green');
      return true;
    }
    
    attempts++;
    process.stdout.write(`\r⏳ Waiting... (${attempts}/${maxAttempts})`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  log('\n❌ Container did not become healthy in time', 'red');
  return false;
};

const fixNetworkBinding = () => {
  log('\n🔧 Attempting to fix network binding...', 'yellow');
  
  // Stop all containers
  log('⏹️  Stopping all containers...', 'yellow');
  runCommand('docker-compose down');
  
  // Remove network
  log('🗑️  Removing old network...', 'yellow');
  runCommand('docker network prune -f');
  
  // Start fresh
  log('🚀 Starting containers fresh...', 'yellow');
  const start = runCommand('docker-compose up -d');
  
  if (!start.success) {
    log('❌ Failed to start containers', 'red');
    return false;
  }
  
  log('✅ Containers started fresh', 'green');
  return true;
};

const testConnection = () => {
  log('\n🧪 Testing final connection...', 'blue');
  
  return new Promise((resolve) => {
    const testProcess = spawn('node', ['server/src/index.js'], {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    let output = '';
    let connected = false;
    
    testProcess.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('✅ MongoDB Connected')) {
        connected = true;
        testProcess.kill('SIGTERM');
      }
    });
    
    testProcess.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    testProcess.on('close', () => {
      if (connected) {
        log('✅ Connection test successful!', 'green');
        resolve(true);
      } else {
        log('❌ Connection test failed', 'red');
        console.log('Output:', output);
        resolve(false);
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      testProcess.kill('SIGTERM');
      log('⏰ Connection test timed out', 'yellow');
      resolve(false);
    }, 30000);
  });
};

const main = async () => {
  log('🚀 MongoDB Connection Diagnostic & Fix Tool', 'bright');
  log('============================================', 'bright');
  
  // Step 1: Check Docker
  if (!checkDockerStatus()) {
    log('\n❌ Please start Docker and try again', 'red');
    process.exit(1);
  }
  
  // Step 2: Check MongoDB container
  if (!checkMongoContainer()) {
    log('\n❌ Please run docker-compose up -d first', 'red');
    process.exit(1);
  }
  
  // Step 3: Check port binding
  if (!checkMongoPort()) {
    log('\n⚠️  Port 27017 not accessible, attempting to fix...', 'yellow');
  }
  
  // Step 4: Check connectivity
  if (!checkMongoConnectivity()) {
    log('\n⚠️  Connectivity issues detected, attempting to fix...', 'yellow');
    
    // Try restarting container
    if (!restartMongoContainer()) {
      log('\n⚠️  Container restart failed, trying network fix...', 'yellow');
      
      if (!fixNetworkBinding()) {
        log('\n❌ All fix attempts failed', 'red');
        process.exit(1);
      }
      
      // Wait a bit and test again
      await new Promise(resolve => setTimeout(resolve, 10000));
      if (!checkMongoConnectivity()) {
        log('\n❌ Network fix did not resolve the issue', 'red');
        process.exit(1);
      }
    }
  }
  
  // Step 5: Final connection test
  log('\n🎯 Running final connection test...', 'blue');
  const connectionSuccess = await testConnection();
  
  if (connectionSuccess) {
    log('\n🎉 MongoDB connection issues resolved!', 'green');
    log('\n💡 To prevent future issues:', 'cyan');
    log('   1. Use docker-compose up -d to start services', 'cyan');
    log('   2. Wait for containers to be healthy before starting the app', 'cyan');
    log('   3. If issues persist, run this script again', 'cyan');
  } else {
    log('\n❌ Connection issues persist', 'red');
    log('\n🔧 Additional troubleshooting steps:', 'yellow');
    log('   1. Check Orbstack network settings', 'yellow');
    log('   2. Restart Orbstack completely', 'yellow');
    log('   3. Check firewall settings', 'yellow');
    log('   4. Try using host network mode in docker-compose', 'yellow');
  }
};

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  log(`\n❌ Unhandled Rejection at: ${promise}, reason: ${reason}`, 'red');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`\n❌ Uncaught Exception: ${error.message}`, 'red');
  process.exit(1);
});

// Run the main function
main().catch(error => {
  log(`\n❌ Script failed: ${error.message}`, 'red');
  process.exit(1);
});
