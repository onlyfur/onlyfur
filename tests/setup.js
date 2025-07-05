// Jest setup file
// This file runs before each test suite

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-32-characters-long';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-32-characters';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.CLIENT_BASE_URL = 'http://localhost:5174';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';
process.env.ADMIN_EMAIL = 'admin@onlyfur.net';
process.env.ADMIN_PASSWORD = 'admin123';
process.env.ADMIN_USERNAME = 'admin';
process.env.FROM_EMAIL = 'test@example.com';
process.env.SUPPORT_EMAIL = 'support@example.com';
process.env.BCRYPT_ROUNDS = '4'; // Lower rounds for faster tests

// Increase timeout for async operations
jest.setTimeout(10000);

// Console cleanup for cleaner test output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  // You can uncomment these lines to suppress console output during tests
  // console.log = jest.fn();
  // console.error = jest.fn();
});

afterEach(() => {
  // Restore original console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});
