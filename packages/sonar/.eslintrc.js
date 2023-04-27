module.exports = {
    extends: ['plugin:@mewjs/esnext'],
    env: {
        commonjs: true,
        node: true
    },
    rules: {
        'import/no-commonjs': 0,
        'import/unambiguous': 0,
        'max-len': 0
    }
};
