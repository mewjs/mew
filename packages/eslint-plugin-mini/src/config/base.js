const globals = require('../globals');

module.exports = {
    plugins: ['@mewjs/mini'],
    parser: require.resolve('@mewjs/mpxml-eslint-parser'),
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    env: {
        browser: true,
        es6: true,
        // 'mini/globals': true
    },
    rules: {
        'import/unambiguous': 0,
        'babel/new-cap': 0,
        'import/no-commonjs': 0,
        '@mewjs/mini/comment-directive': 2,
        '@mewjs/mini/xml-indent': [2, 4, { baseIndent: 1, scriptBaseIndent: 0, alignAttributesVertically: false }],
        '@mewjs/mini/no-parsing-error': 2,
    },
    overrides: [
        {
            files: ['*.wxml', '*.axml', '*.swan'],
            rules: {
                'indent': 0,
                'no-multi-spaces': 0,
                'no-unused-vars': 0,
                '@typescript-eslint/no-unused-vars': 0
            }
        },
        {
            files: ['*.wxs', '*.wxml'],
            rules: {
                'no-redeclare': 0,
                'no-unused-vars': 0,
                '@typescript-eslint/no-unused-vars': 0,
                'no-var': 0,
                'object-shorthand': 0,
                'prefer-template': 0,
                'prefer-destructuring': 0,
                'prefer-spread': 0,
                'prefer-arrow-callback': 0,
                'prefer-const': 0,
                'import/unambiguous': 0,
                'import/no-commonjs': 0,
                'no-magic-numbers': 0
            }
        },
        {
            files: ['*.json'],
            rules: {
                'no-trailing-spaces': 0,
                '@mewjs/mini/comment-directive': 0,
                'eol-last': 0
            }
        }
    ],
    globals
};
