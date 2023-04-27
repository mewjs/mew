module.exports = {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    babelOptions: {
        babelrc: false,
        configFile: false,
        envName: 'development',
        plugins: ['@babel/plugin-syntax-jsx']
    },
    sourceType: 'module'
};
