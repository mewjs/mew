module.exports = {
    extends: [
        require.resolve('./node'),
        require.resolve('./typescript')
    ],
    parserOptions: require('./parts/parser-options-typescript')
};
