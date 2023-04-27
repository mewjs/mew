module.exports = {
    root: true,
    extends: [
        require.resolve('./config/base')
    ],
    env: {
        commonjs: true,
        node: true
    },
    rules: {
        'import/no-commonjs': 0,
        'import/unambiguous': 0,
        'no-magic-numbers': 0,
        'node/global-require': 0,
        'node/no-process-env': 0,
        'node/no-process-exit': 0,
        'import/no-dynamic-require': 0
    }
};
