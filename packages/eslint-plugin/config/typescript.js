const commaDangle = require('./parts/comma-dangle');
const noMagicNumbers = require('./parts/no-magic-numbers');
// const indentConfig = require('./parts/indent');

const disabledProjectRules = {
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/consistent-type-exports': 0,
    '@typescript-eslint/no-meaningless-void-operator': 0,
    '@typescript-eslint/no-redundant-type-constituents': 0,
    '@typescript-eslint/no-throw-literal': 0,
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 0,
    '@typescript-eslint/no-unnecessary-type-arguments': 0,
    '@typescript-eslint/non-nullable-type-assertion-style': 0,
    '@typescript-eslint/prefer-includes': 0,
    '@typescript-eslint/prefer-reduce-type-parameter': 0,
    '@typescript-eslint/prefer-return-this-type': 0,
    '@typescript-eslint/prefer-string-starts-ends-with': 0,
    '@typescript-eslint/promise-function-async': 0,
    '@typescript-eslint/require-array-sort-compare': 0,
    '@typescript-eslint/require-await': 0,
    '@typescript-eslint/prefer-optional-chain': 0,
};

module.exports = {
    extends: [
        require.resolve('./esnext'),
        'plugin:@typescript-eslint/eslint-recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: require('./parts/parser-options-typescript'),
    plugins: ['@typescript-eslint'],
    settings: {
        'jsdoc': {
            mode: 'typescript'
        },
        'import/ignore': [
            '\\.(?:styl|less|css|scss|vue|json)$',
            'node_modules'
        ],
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                extensions: [
                    '.js',
                    '.jsx',
                    '.ts',
                    '.tsx',
                    '.vue'
                ],
                project: ['packages/*/tsconfig.json']
            }
        }
    },
    rules: {
        'brace-style': 0,
        '@typescript-eslint/brace-style': [
            1,
            'stroustrup'
        ],
        '@typescript-eslint/class-literal-property-style': [2, 'getters'],
        'comma-dangle': 0,
        '@typescript-eslint/comma-dangle': commaDangle.typescript,
        'comma-spacing': 0,
        '@typescript-eslint/comma-spacing': 2,
        '@typescript-eslint/consistent-type-assertions': [
            2,
            {
                assertionStyle: 'as',
            }
        ],
        '@typescript-eslint/consistent-type-definitions': [2, 'interface'],
        '@typescript-eslint/consistent-type-exports': [
            1,
            {
                fixMixedExportsWithInlineTypeSpecifier: false
            }
        ],
        '@typescript-eslint/consistent-type-imports': [
            1,
            {
                prefer: 'type-imports'
            }
        ],
        '@typescript-eslint/explicit-member-accessibility': [
            1,
            {
                accessibility: 'no-public',
                overrides: {
                    parameterProperties: 'off'
                }
            }
        ],
        // 由于目前问题太多，暂时禁用：
        // 见 https://github.com/typescript-eslint/typescript-eslint/issues/1824
        // 'indent': 0,
        // '@typescript-eslint/indent': indentConfig,
        'keyword-spacing': 0,
        '@typescript-eslint/keyword-spacing': 2,
        'no-invalid-this': 0,
        'func-call-spacing': 0,
        '@typescript-eslint/func-call-spacing': 2,
        'no-use-before-define': 0,
        '@typescript-eslint/no-use-before-define': [
            2,
            {
                functions: false,
                classes: true,
                variables: true,
                enums: true,
                typedefs: true,
                ignoreTypeReferences: true
            }
        ],
        'no-unused-vars': 0,
        '@typescript-eslint/no-unused-vars': [
            1,
            {
                vars: 'local',
                args: 'none',
                varsIgnorePattern: '^React$'
            }
        ],
        '@typescript-eslint/member-ordering': [
            1,
            {
                default: [
                    'public-static-field',
                    'protected-static-field',
                    'private-static-field',
                    'public-instance-field',
                    'protected-instance-field',
                    'private-instance-field',
                    'field',

                    'public-constructor',
                    'protected-constructor',
                    'private-constructor',
                    'constructor',


                    'public-static-method',
                    'protected-static-method',
                    'private-static-method',
                    'public-instance-method',
                    'protected-instance-method',
                    'private-instance-method',
                    'method'
                ],
                interfaces: [
                    'constructor',
                    'field',
                    'method',
                    'signature'
                ],
                typeLiterals: [
                    'constructor',
                    'field',
                    'method',
                    'signature'
                ]
            }
        ],
        // strict 模式下打开
        '@typescript-eslint/method-signature-style': 0,
        '@typescript-eslint/no-confusing-non-null-assertion': 1,
        'no-dupe-class-members': 0,
        '@typescript-eslint/no-dupe-class-members': 2,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/array-type': 2,
        '@typescript-eslint/ban-types': 2,
        '@typescript-eslint/member-delimiter-style': 1,
        '@typescript-eslint/no-dynamic-delete': 2,
        '@typescript-eslint/no-explicit-any': [
            1,
            {
                fixToUnknown: false,
                ignoreRestArgs: true
            }
        ],
        '@typescript-eslint/no-extra-non-null-assertion': 2,
        'no-extra-parens': 0,
        '@typescript-eslint/no-extra-parens': [
            1,
            'functions'
        ],
        '@typescript-eslint/no-extraneous-class': [
            2,
            {
                allowConstructorOnly: true,
                allowEmpty: false,
                allowStaticOnly: true,
                allowWithDecorator: true
            }
        ],
        '@typescript-eslint/no-invalid-void-type': 1,
        'no-loop-func': 0,
        '@typescript-eslint/no-loop-func': 1,
        'no-loss-of-precision': 0,
        '@typescript-eslint/no-loss-of-precision': 2,
        'no-magic-numbers': 0,
        '@typescript-eslint/no-magic-numbers': noMagicNumbers.typescript,
        'import/no-dynamic-require': 0,
        '@typescript-eslint/no-meaningless-void-operator': 2,
        '@typescript-eslint/no-inferrable-types': 1,
        '@typescript-eslint/no-namespace': 1,
        '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 2,
        '@typescript-eslint/no-redundant-type-constituents': 2,
        '@typescript-eslint/no-throw-literal': 2,
        '@typescript-eslint/no-type-alias': [
            1,
            {
                allowAliases: 'in-unions-and-intersections',
                allowCallbacks: 'always',
                allowConditionalTypes: 'always',
                allowConstructors: 'always',
                allowLiterals: 'in-unions-and-intersections',
                allowMappedTypes: 'always',
                allowTupleTypes: 'always',
                allowGenerics: 'always'
            }
        ],
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 2,
        '@typescript-eslint/no-unnecessary-type-arguments': 1,
        '@babel/no-unused-expressions': 0,
        '@typescript-eslint/no-unused-expressions': [
            1,
            {
                allowShortCircuit: true,
                allowTernary: true,
                allowTaggedTemplates: true
            }
        ],
        '@typescript-eslint/non-nullable-type-assertion-style': 1,
        '@typescript-eslint/no-var-requires': 2,
        '@babel/object-curly-spacing': 0,
        '@typescript-eslint/object-curly-spacing': [2, 'always'],
        '@typescript-eslint/prefer-for-of': 1,
        '@typescript-eslint/prefer-function-type': 1,
        '@typescript-eslint/prefer-includes': 1,
        '@typescript-eslint/prefer-namespace-keyword': 0,
        // 规则有 bug，暂时关闭
        '@typescript-eslint/prefer-nullish-coalescing': [
            0,
            {
                ignoreConditionalTests: true,
                ignoreMixedLogicalExpressions: true
            }
        ],
        '@typescript-eslint/prefer-optional-chain': 1,
        '@typescript-eslint/prefer-reduce-type-parameter': 1,
        '@typescript-eslint/prefer-return-this-type': 2,
        '@typescript-eslint/prefer-string-starts-ends-with': 1,
        '@typescript-eslint/prefer-ts-expect-error': 1,
        '@typescript-eslint/promise-function-async': 1,
        'quotes': 0,
        '@typescript-eslint/quotes': [2, 'single'],
        '@typescript-eslint/require-array-sort-compare': 1,
        'require-await': 0,
        '@typescript-eslint/require-await': 2,
        '@babel/semi': 0,
        '@typescript-eslint/semi': [2, 'always'],
        'space-infix-ops': 0,
        '@typescript-eslint/space-infix-ops': 2,
        '@typescript-eslint/triple-slash-reference': 1,
        '@typescript-eslint/type-annotation-spacing': 2,
        '@typescript-eslint/unified-signatures': 0,
        'no-useless-constructor': 0,
        '@typescript-eslint/no-useless-constructor': 2,
        'prefer-spread': 1
    },
    overrides: [
        // d.ts 文件解析变量有问题，会导致不必要的 warning
        {
            files: ['*.d.ts'],
            rules: {
                'no-var': 0,
                'no-duplicate-imports': 0,
                'import/unambiguous': 0,
                '@typescript-eslint/no-unused-vars': 0
            }
        },
        {
            files: ['*.{js,json}'],
            extends: [
                require.resolve('./esnext')
            ],
            parser: '@babel/eslint-parser',
            parserOptions: require('./parts/parser-options-babel'),
            rules: {
                '@typescript-eslint/no-var-requires': 0,
                '@typescript-eslint/brace-style': 0,
                'brace-style': [
                    1,
                    'stroustrup'
                ],
                '@typescript-eslint/comma-dangle': 0,
                'comma-dangle': commaDangle.js,
                '@typescript-eslint/comma-spacing': 0,
                'comma-spacing': 2,
                '@typescript-eslint/func-call-spacing': 0,
                'func-call-spacing': 2,
                // '@typescript-eslint/indent': 0,
                // 'indent': indentConfig,
                '@typescript-eslint/keyword-spacing': 0,
                'keyword-spacing': 2,
                '@typescript-eslint/no-dupe-class-members': 0,
                'no-dupe-class-members': 2,
                '@typescript-eslint/no-loop-func': 1,
                '@typescript-eslint/no-extra-parens': 0,
                'no-extra-parens': [
                    1,
                    'functions'
                ],
                'no-loop-func': 1,
                '@typescript-eslint/no-loss-of-precision': 0,
                'no-loss-of-precision': 2,
                '@typescript-eslint/no-magic-numbers': 0,
                'no-magic-numbers': noMagicNumbers.js,
                '@typescript-eslint/no-unused-expressions': 0,
                '@babel/no-unused-expressions': [
                    1,
                    {
                        allowShortCircuit: true,
                        allowTernary: true,
                        allowTaggedTemplates: true
                    }
                ],
                '@typescript-eslint/no-useless-constructor': 0,
                'no-useless-constructor': 2,
                '@typescript-eslint/object-curly-spacing': 0,
                '@babel/object-curly-spacing': [2, 'always'],
                '@typescript-eslint/quotes': 0,
                'quotes': [2, 'single'],
                '@typescript-eslint/semi': 0,
                '@typescript-eslint/space-infix-ops': 0,
                'space-infix-ops': 2,
                '@babel/semi': [2, 'always'],
                '@typescript-eslint/require-await': 0,
                'require-await': 2,
                '@typescript-eslint/consistent-type-exports': 0,
                ...disabledProjectRules

            }
        },
        {
            files: ['**/*.{md,markdown,htm,html}/*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: null
            }
        },
        {
            files: ['**/*.{md,markdown,htm,html}/*.{js,json}'],
            parser: '@babel/eslint-parser',
            parserOptions: require('./parts/parser-options-babel')
        },
        {
            files: ['**/*.{md,markdown,htm,html}/*.{js,json,ts}'],
            rules: {
                'no-unused-vars': 0,
                ...disabledProjectRules
            }
        }
    ]
};
