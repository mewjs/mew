module.exports = {
    ...require('../../jest.config'),
    collectCoverageFrom: [
        'src/**/*.ts',
        '!**/node_modules/**',
        '!**/*/*.spec.ts',
        '!**/*/types.ts',
    ]
};
