module.exports = {
  collectCoverageFrom: [
    'src/**/*',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/kunst-cli.js$',
  ],
  mapCoverage: true,
  moduleDirectories: [
    'node_modules',
  ],
  moduleFileExtensions: [
    'js',
    'json',
  ],
  testRegex: '\\.test\\.js$',
  testEnvironment: 'node',
  verbose: true,
};
