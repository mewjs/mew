module.exports = {
    extends: [
        require.resolve('./vue3'),
        require.resolve('./typescript')
    ],
    parser: 'vue-eslint-parser',
    parserOptions: require('./parts/parser-options-typescript')
};
