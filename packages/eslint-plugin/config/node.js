module.exports = {
    env: {
        node: true
    },
    extends: [
        require.resolve('./esnext')
    ],
    plugins: [
        'node'
    ],
    settings: {
        node: {
            convertPath: {
                'src/bin/**/*.js': [
                    '^src/bin/(.+)$',
                    'bin/$1'
                ]
            },
            tryExtensions: ['.js', '.json', '.node']
        }
    },
    rules: {
        // Possible Errors
        'node/handle-callback-err': [
            2,
            '^.*(?:e|E)rr(?:or)?$'
        ],
        'node/no-callback-literal': 1,
        'node/no-exports-assign': 2,
        'node/no-extraneous-import': 1,
        'node/no-extraneous-require': 1,
        'node/no-missing-import': 2,
        'node/no-missing-require': 2,
        'node/no-new-require': 2,
        'node/no-path-concat': 2,
        'node/no-process-exit': 1,
        'node/no-unpublished-bin': 2,
        'node/no-unpublished-import': 2,
        'node/no-unpublished-require': 2,
        'node/no-unsupported-features/es-builtins': [
            2,
            {
                version: '>=12.0.0',
                ignores: []
            }
        ],
        'node/no-unsupported-features/es-syntax': [
            2,
            {
                version: '>=12.0.0',
                ignores: []
            }
        ],
        'node/no-unsupported-features/node-builtins': [
            2,
            {
                version: '>=12.0.0',
                ignores: []
            }
        ],
        'node/process-exit-as-throw': 2,
        'node/shebang': 2,

        // Best Practices
        'node/no-deprecated-api': [
            2,
            {
                ignoreGlobalItems: []
            }
        ],

        // Stylistic Issues
        'node/callback-return': [
            1,
            [
                'callback',
                'cb',
                'next',
                'done',
                'send.error',
                'send.success'
            ]
        ],
        'node/exports-style': [
            0,
            'exports',
            {
                allowBatchAssign: true
            }
        ],
        'node/file-extension-in-import': [
            2,
            'always',
            {
                '.js': 'never'
            }
        ],
        'node/global-require': 1,
        'node/no-mixed-requires': [
            2,
            {
                grouping: true,
                allowCall: false
            }
        ],
        'node/no-process-env': 1,
        'node/no-restricted-import': [
            2,
            [
                {
                    name: 'lodash',
                    message: 'Please use lodash/xxx or lodash-es instead.'
                }
            ]
        ],
        'node/no-restricted-require': [
            2,
            [
                {
                    name: 'lodash',
                    message: 'Please use lodash/xxx or lodash-es instead.'
                }
            ]
        ],
        'node/no-sync': [
            0,
            {
                allowAtRootLevel: true
            }
        ],
        'node/prefer-global/buffer': [
            2,
            'always'
        ],
        'node/prefer-global/console': 0,
        'node/prefer-global/process': [
            2,
            'always'
        ],
        'node/prefer-global/text-decoder': [
            2,
            'always'
        ],
        'node/prefer-global/text-encoder': [
            2,
            'always'
        ],
        'node/prefer-global/url-search-params': [
            2,
            'always'
        ],
        'node/prefer-global/url': [
            2,
            'always'
        ],
        'node/prefer-promises/dns': 2,
        'node/prefer-promises/fs': 1,

        // Deprecated rules
        // 'node/no-hide-core-modules': 1,
        // 'node/no-unsupported-features': 1
    }
};
