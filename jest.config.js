module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFiles: ['dotenv/config'],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};
