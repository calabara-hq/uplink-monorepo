const jestConfig = {
  testMatch: ['<rootDir>/test/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.[jt]sx?$': 'ts-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.[jt]s$': '$1',
  },
  // ...
}

module.exports = jestConfig;
