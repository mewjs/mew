module.exports = {
    preset: 'ts-jest/presets/js-with-ts-esm',
    // 'projects': [
    //     '<rootDir>/packages/*'
    // ],
    collectCoverage: !true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!**/node_modules/**',
        '!**/*/*.spec.ts',
        '!**/*/types.ts',
    ],
    // setupFiles: ['./jest.setup.js'],
    // testMatch: ['**/test/*.spec.ts'],
    testPathIgnorePatterns: ['node_modules', 'dist'],
    modulePathIgnorePatterns: ['node_modules/(?!(strip-json-comments|lodash-es|@xx/.*)/)', 'dist'],
    transformIgnorePatterns: [
        'node_modules/(?!(strip-json-comments|lodash-es|/.*)/)'
    ],
    testEnvironment: 'node',

    moduleFileExtensions: ['ts', 'js', 'json'],
    // extensionsToTreatAsEsm: ['.ts'],
    // u can change this option to a more specific folder for test single component or util when dev
    // for example, ['<rootDir>/packages/input']
    roots: ['<rootDir>'],
};
