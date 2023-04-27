module.exports = {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue', '.wxs'],
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    ecmaFeatures: {
        jsx: true,
    }
};
