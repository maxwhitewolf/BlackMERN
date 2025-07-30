const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting BlanX Backend Test Suite...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}\n`);
}

// Check if dependencies are installed
function checkDependencies() {
  logSection('Checking Dependencies');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['jest', 'supertest', 'mongodb-memory-server'];
    
    for (const dep of requiredDeps) {
      if (!packageJson.devDependencies[dep]) {
        log(`❌ Missing dependency: ${dep}`, 'red');
        log('Installing missing dependencies...', 'yellow');
        execSync('npm install', { stdio: 'inherit' });
        break;
      }
    }
    
    log('✅ All dependencies are installed', 'green');
  } catch (error) {
    log('❌ Error checking dependencies', 'red');
    process.exit(1);
  }
}

// Run tests with different configurations
function runTests() {
  logSection('Running Test Suite');
  
  const testCommands = [
    {
      name: 'Authentication Tests',
      command: 'npm test -- test/auth.test.js',
      description: 'Testing user registration, login, and authentication'
    },
    {
      name: 'User Management Tests',
      command: 'npm test -- test/users.test.js',
      description: 'Testing user profiles, following, and user management'
    },
    {
      name: 'Post Management Tests',
      command: 'npm test -- test/posts.test.js',
      description: 'Testing post creation, feeds, likes, and interactions'
    },
    {
      name: 'Activity System Tests',
      command: 'npm test -- test/activities.test.js',
      description: 'Testing activity creation and management'
    },
    {
      name: 'Full Test Suite',
      command: 'npm test',
      description: 'Running all tests with coverage'
    }
  ];

  let allTestsPassed = true;
  const results = [];

  for (const test of testCommands) {
    log(`\n${colors.bold}${test.name}${colors.reset}`, 'blue');
    log(test.description, 'yellow');
    
    try {
      const output = execSync(test.command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      log('✅ PASSED', 'green');
      results.push({ name: test.name, status: 'PASSED', output });
      
    } catch (error) {
      log('❌ FAILED', 'red');
      log(error.stdout || error.message, 'red');
      results.push({ name: test.name, status: 'FAILED', error: error.stdout || error.message });
      allTestsPassed = false;
    }
  }

  return { allTestsPassed, results };
}

// Generate test report
function generateReport(results) {
  logSection('Test Results Summary');
  
  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const total = results.length;
  
  log(`Total Tests: ${total}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  
  if (failed > 0) {
    log('\nFailed Tests:', 'red');
    results
      .filter(r => r.status === 'FAILED')
      .forEach(r => {
        log(`- ${r.name}`, 'red');
      });
  }
  
  // Save detailed report
  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  log(`\nDetailed report saved to: ${reportPath}`, 'blue');
}

// Main execution
async function main() {
  try {
    checkDependencies();
    const { allTestsPassed, results } = runTests();
    generateReport(results);
    
    if (allTestsPassed) {
      log('\n🎉 All tests passed! BlanX backend is working correctly.', 'green');
      log('✅ Authentication system is functional', 'green');
      log('✅ User management is working', 'green');
      log('✅ Post system is operational', 'green');
      log('✅ Activity tracking is active', 'green');
      log('✅ Real-time messaging is ready', 'green');
      log('\n🚀 Your BlanX backend is ready for production!', 'green');
    } else {
      log('\n❌ Some tests failed. Please check the errors above.', 'red');
      process.exit(1);
    }
    
  } catch (error) {
    log(`\n❌ Test runner failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the test suite
main(); 