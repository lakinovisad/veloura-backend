// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Allow console output during tests for debugging
// const originalConsoleLog = console.log;
// const originalConsoleError = console.error;

// beforeAll(() => {
//   console.log = jest.fn();
//   console.error = jest.fn();
// });

// afterAll(() => {
//   console.log = originalConsoleLog;
//   console.error = originalConsoleError;
// });

// Global test timeout
jest.setTimeout(10000); 