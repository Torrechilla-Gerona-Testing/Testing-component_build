module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'], 
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: ['<rootDir>/tests/setup.ts'],
 
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  // verbose: true,
  clearMocks: true
};