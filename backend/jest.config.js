// ==============================================================================
// Jest Configuration for GoDevOps Backend API
// ==============================================================================

module.exports = {
  // Use Node.js runtime environment for backend testing
  testEnvironment: 'node',

  // Where to look for test files
  testMatch: [
    '**/tests/**/*.test.js'
  ],

  // Collect code coverage metrics on test execution
  collectCoverage: true,
  coverageDirectory: 'coverage',

  // Formats to output code coverage report.
  // 'lcov' produces 'coverage/lcov.info' required by SonarCloud Quality Gate!
  coverageReporters: ['text', 'lcov', 'clover'],

  // Files to include in coverage calculation
  collectCoverageFrom: [
    'routes/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**'
  ],

  // Set timeout for asynchronous operations (10 seconds)
  testTimeout: 10000,

  // Automatically clear mock calls and instances between every test
  clearMocks: true
};
