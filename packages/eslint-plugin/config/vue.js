const { overrides, rules } = require('./parts/vue-rules');

module.exports = {
    parser: 'vue-eslint-parser',
    parserOptions: require('./parts/parser-options-babel'),
    extends: [
        require.resolve('./esnext'),
        'plugin:vue/recommended'
    ],
    plugins: ['vue'],
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                ...overrides
            }
        }
    ],
    rules: {
        ...rules
    }
};
