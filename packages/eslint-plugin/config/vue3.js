const { overrides, rules } = require('./parts/vue-rules');

module.exports = {
    parser: 'vue-eslint-parser',
    parserOptions: require('./parts/parser-options-babel'),
    extends: [
        require.resolve('./esnext'),
        'plugin:vue/vue3-recommended'
    ],
    plugins: ['vue'],
    overrides: [
        {
            files: ['*.vue'],
            globals: {
                defineEmits: true,
                defineExpose: true,
                defineProps: true,
                withDefaults: true,
            },
            rules: {
                ...overrides,
                'import/unambiguous': 0
            }
        }
    ],
    rules: {
        ...rules
    }
};
