// Global test setup
process.env.NODE_ENV = 'test';
process.env.TOKEN_KEY = 'test_secret_key';

// Increase timeout for all tests
jest.setTimeout(30000);

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 