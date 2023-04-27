module.exports = {
    extends: [
        require.resolve('./miniprogram'),
        require.resolve('./typescript')
    ],
    parserOptions: require('./parts/parser-options-typescript')
};
