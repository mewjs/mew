module.exports = {
    extends: [
        require.resolve('./react'),
        require.resolve('./typescript')
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: require('./parts/parser-options-typescript'),
};
