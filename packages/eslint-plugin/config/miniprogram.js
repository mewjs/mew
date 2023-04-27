module.exports = {
    extends: [
        require.resolve('./esnext'),
        'plugin:@mewjs/mini/recommended'
    ],
    parserOptions: require('./parts/parser-options-babel'),
    plugins: ['@mewjs/mini'],
    rules: {
        '@babel/new-cap': [
            2,
            {
                capIsNewExceptions: [
                    'T',
                    'AddToFavoritesBar',
                    'App',
                    'Page',
                    'Component'
                ]
            }
        ],
    }
};
