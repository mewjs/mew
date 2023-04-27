module.exports = {
    env: {
        es6: true
    },
    extends: [
        require.resolve('./base')
    ],
    plugins: [
        '@babel',
        'import'
    ],
    settings: {
        'import/ignore': ['\\.(?:styl|less|css|scss|vue|json)$'],
        'import/parsers': {
            '@typescript-eslint/parser': [
                '.ts',
                '.tsx'
            ]
        },
        'import/docstyle': [
            'jsdoc',
            'tomdoc'
        ],
        'import/resolver': {
            node: {
                extensions: [
                    '.js',
                    '.jsx',
                    '.ts',
                    '.tsx',
                    '.vue'
                ]
            }
        }
    },
    rules: {
        'arrow-body-style': [
            1,
            'as-needed'
        ],
        'arrow-parens': [
            2,
            'as-needed'
        ],
        'arrow-spacing': 2,
        'generator-star-spacing': [
            2,
            'after'
        ],
        'no-confusing-arrow': [
            2,
            {
                allowParens: true
            }
        ],
        'no-useless-computed-key': 2,
        'no-useless-constructor': 2,
        'no-useless-rename': 2,
        'no-var': 1,
        'object-shorthand': [
            1,
            'always',
            {
                avoidQuotes: true,
                avoidExplicitReturnArrows: true
            }
        ],
        'prefer-arrow-callback': [
            1,
            {
                allowNamedFunctions: true,
                allowUnboundThis: false
            }
        ],
        'prefer-const': [
            1,
            {
                destructuring: 'all',
                ignoreReadBeforeAssign: true
            }
        ],
        'prefer-destructuring': [
            1,
            {
                object: true,
                array: false
            },
            {
                enforceForRenamedProperties: false
            }
        ],
        'prefer-rest-params': 2,
        'prefer-spread': 1,
        'prefer-template': 1,
        'rest-spread-spacing': [
            2,
            'never'
        ],
        'symbol-description': 1,
        'template-curly-spacing': [
            2,
            'always'
        ],
        'yield-star-spacing': [
            1,
            'after'
        ],
        // rules of eslint-plugin-import
        // Static analysis
        // for ci script disable this rule
        'import/no-unresolved': process.env.CI === 'true' || process.env.GITLAB_CI === 'true'
            ? 0
            : [
                1,
                {
                    amd: true,
                    commonjs: true,
                    caseSensitive: true,
                    ignore: ['^[@~]']
                }
            ],
        'import/named': 2,
        'import/default': 2,
        'import/namespace': [
            2,
            {
                allowComputed: true
            }
        ],
        'import/no-restricted-paths': 0,
        'import/no-absolute-path': 2,
        'import/no-dynamic-require': 1,
        'import/no-internal-modules': 0,
        'import/no-webpack-loader-syntax': 1,
        'import/no-self-import': 2,
        'import/no-cycle': 0,
        'import/no-relative-parent-imports': 0,
        'import/no-useless-path-segments': 2,
        // Helpful warnings
        'import/export': 2,
        'import/no-named-as-default': 2,
        'import/no-named-as-default-member': 2,
        'import/no-deprecated': 2,
        'import/no-extraneous-dependencies': 2,
        'import/no-mutable-exports': 1,
        // Module systems
        'import/unambiguous': 2,
        'import/no-commonjs': 1,
        'import/no-amd': 1,
        'import/no-nodejs-modules': 0,
        // Style guide
        'import/first': 2,
        'import/exports-last': 0,
        'no-duplicate-imports': 0,
        'import/no-duplicates': [
            2,
            {
                considerQueryString: true
            }
        ],
        'import/no-namespace': 0,
        'import/extensions': [
            2,
            {
                js: 'never',
                jsx: 'never',
                es: 'never',
                cjs: 'never',
                ts: 'never',
                tsx: 'never',
                vue: 'ignore',
                css: 'always',
                styl: 'always',
                less: 'always',
                sass: 'always',
                scss: 'always',
                jpg: 'always',
                jpeg: 'always',
                png: 'always',
                svg: 'always',
                gif: 'always',
                webp: 'always',
                ttf: 'always',
                woff: 'always',
                woff2: 'always',
                otf: 'always',
                xml: 'always'
            }
        ],
        'import/order': [
            1,
            {
                'groups': [
                    'builtin',
                    'external',
                    'internal',
                    'unknown',
                    'parent',
                    'sibling',
                    'index'
                ],
                'newlines-between': 'ignore'
            }
        ],
        'import/newline-after-import': 2,
        'import/prefer-default-export': 1,
        'import/max-dependencies': 0,
        'import/no-unassigned-import': 0,
        'import/no-named-default': 2,
        'import/no-default-export': 0,
        'import/no-named-export': 0,
        'import/no-anonymous-default-export': 0,
        'import/group-exports': 0,
        'import/dynamic-import-chunkname': 1,

        // @babel/eslint-plugin
        'new-cap': 0,
        '@babel/new-cap': [
            2,
            {
                capIsNewExceptions: [
                    'T',
                    'AddToFavoritesBar'
                ]
            }
        ],
        'camelcase': [
            2,
            {
                properties: 'always',
                ignoreDestructuring: true
            }
        ],
        'no-invalid-this': 0,
        '@babel/no-invalid-this': 1,
        'object-curly-spacing': 0,
        '@babel/object-curly-spacing': [
            2,
            'always'
        ],
        'semi': 0,
        '@babel/semi': [
            2,
            'always'
        ],
        'no-unused-expressions': 0,
        '@babel/no-unused-expressions': [
            1,
            {
                allowShortCircuit: true,
                allowTernary: true,
                allowTaggedTemplates: true
            }
        ],
        'valid-typeof': 2
    },
    // fix for config js files
    overrides: [
        // d.ts 文件解析变量有问题，会导致不必要的 warning
        {
            files: ['*.d.ts'],
            rules: {
                'import/unambiguous': 0,
                '@typescript-eslint/no-unused-vars': 0
            }
        },
        {
            files: [
                '*.config.js',
                'scripts/*.js',
                'script/*.js',
                '.*rc.js',
                'server.js',
                'webpack.*.js',
                'bin/*.js'
            ],
            rules: {
                'import/unambiguous': 0,
                'import/no-commonjs': 0,
                'import/no-extraneous-dependencies': 0,
                'no-console': 0,
                'prefer-template': 0
            }
        },
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            parserOptions: require('./parts/parser-options-typescript')
        },
        {
            files: ['**/*.{md,markdown,htm,html}/*.{js,ts}'],
            rules: {
                'import/no-commonjs': 0,
                'import/no-extraneous-dependencies': 0,
                'import/unambiguous': 0,
                'import/no-unresolved': 0,
                'no-console': 0,
                'eol-last': 0,
                'unicode-bom': 0,
                'no-undef': 0,
                'no-unused-vars': 0,
            }
        }
    ]
};
