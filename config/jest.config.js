module.exports = {
  testEnvironment: 'node',
  rootDir: '../',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'api/**/*.{js,ts}',
    'backend/**/*.{js,ts}',
    '!api/**/*.d.ts',
    '!backend/**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
