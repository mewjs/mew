const commaDangle = require('./parts/comma-dangle');
const noMagicNumbers = require('./parts/no-magic-numbers');
const indentConfig = require('./parts/indent');

module.exports = {
    parser: '@babel/eslint-parser',
    parserOptions: require('./parts/parser-options-babel'),
    extends: ['eslint:recommended', 'plugin:eslint-comments/recommended'],
    env: {
        amd: true,
        browser: true,
        commonjs: true,
        jasmine: true,
        jest: true,
        jquery: true,
        node: true,
        serviceworker: true,
        worker: true
    },
    rules: {
        // region: overrides eslint:recommended
        'no-console': 1,
        'no-debugger': 1,
        'no-empty': [
            1,
            {
                allowEmptyCatch: true
            }
        ],
        'no-func-assign': 1,
        'no-inner-declarations': 1,
        'no-octal': 1,
        'no-redeclare': 1,
        'no-unused-vars': [
            1,
            {
                vars: 'local',
                args: 'none'
            }
        ],
        'no-async-promise-executor': 1,
        'no-await-in-loop': 1,
        'no-extra-parens': [
            1,
            'functions'
        ],
        'no-prototype-builtins': 1,
        'no-template-curly-in-string': 1,
        'require-atomic-updates': 2,
        'accessor-pairs': 2,
        'array-callback-return': 2,
        'block-scoped-var': 2,
        'class-methods-use-this': 1,
        'complexity': 1,
        'curly': 2,
        'dot-location': [
            2,
            'property'
        ],
        'dot-notation': [
            2,
            {
                allowKeywords: true,
                allowPattern: '^catch$'
            }
        ],
        'eqeqeq': [
            2,
            'allow-null'
        ],
        'guard-for-in': 1,
        'no-alert': 2,
        'no-caller': 2,
        'no-case-declarations': 2,
        'no-else-return': [
            2,
            {
                allowElseIf: false
            }
        ],
        'no-empty-function': 1,
        'no-eval': 2,
        'no-extend-native': 2,
        'no-extra-bind': 1,
        'no-extra-label': 1,
        'no-implied-eval': 1,
        'no-invalid-this': 1,
        'no-labels': [
            1,
            {
                allowLoop: true
            }
        ],
        'no-lone-blocks': 1,
        'no-loop-func': 1,
        'no-magic-numbers': noMagicNumbers.js,
        'no-multi-spaces': [
            2,
            {
                exceptions: {
                    Property: true,
                    BinaryExpression: true,
                    // VariableDeclarator: true
                }
            }
        ],
        'no-multi-str': 1,
        'no-new-wrappers': 2,
        'no-octal-escape': 1,
        'no-proto': 2,
        'no-return-assign': 1,
        'no-return-await': 1,
        'no-script-url': 2,
        'no-self-compare': 2,
        'no-sequences': 1,
        'no-throw-literal': 1,
        'no-unmodified-loop-condition': 1,
        'no-unused-expressions': [
            1,
            {
                allowShortCircuit: true,
                allowTernary: true,
                allowTaggedTemplates: true
            }
        ],
        'no-useless-call': 1,
        'no-useless-catch': 1,
        'no-useless-concat': 2,
        'no-useless-return': 2,
        'no-constant-condition': [
            1,
            {
                checkLoops: false
            }
        ],
        'no-warning-comments': [
            2,
            {
                terms: ['fixme'],
                location: 'start'
            }
        ],
        'no-with': 2,
        'prefer-promise-reject-errors': 1,
        // 新规范不再需要
        // 'radix': 2,
        'require-await': 2,
        'wrap-iife': [
            2,
            'any'
        ],
        'no-restricted-globals': [
            2,
            'event'
        ],
        'no-shadow-restricted-names': 2,
        'no-undefined': 2,
        'no-use-before-define': [
            2,
            {
                functions: false,
                classes: true,
                variables: true
            }
        ],
        'array-bracket-newline': [
            2,
            'consistent'
        ],
        'array-bracket-spacing': [
            2,
            'never'
        ],
        'array-element-newline': [
            1,
            'consistent'
        ],
        'brace-style': [
            1,
            'stroustrup'
        ],
        'camelcase': [
            2,
            {
                properties: 'always',
                ignoreDestructuring: true,
                allow: ['^UNSAFE_']
            }
        ],
        'comma-dangle': commaDangle.js,
        'comma-spacing': 2,
        'comma-style': 2,
        'computed-property-spacing': 2,
        'eol-last': 2,
        'func-call-spacing': 2,
        'function-paren-newline': [
            1,
            'consistent'
        ],
        'func-names': [
            1,
            'as-needed',
            {
                generators: 'as-needed'
            }
        ],
        'id-denylist': [
            1,
            'err',
            'cb',
            'num',
            'arr',
            'str',
            'obj',
            'fun',
            'cls',
            'sym'
        ],
        'indent': indentConfig,
        'jsx-quotes': [
            2,
            'prefer-double'
        ],
        'key-spacing': [
            2,
            {
                beforeColon: false,
                afterColon: true
            }
        ],
        'keyword-spacing': 2,
        'linebreak-style': 1,
        'lines-around-comment': 1,
        'lines-between-class-members': [
            1,
            'always',
            {
                exceptAfterSingleLine: true
            }
        ],
        'line-comment-position': [
            2,
            {
                position: 'above'
            }
        ],
        'max-depth': [
            1,
            6
        ],
        'max-len': [
            2,
            120,
            4,
            {
                code: 120,
                tabWidth: 4,
                ignoreUrls: true,
                ignoreComments: true,
                ignoreRegExpLiterals: true
            }
        ],
        'max-lines': [
            1,
            {
                max: 500,
                skipBlankLines: true,
                skipComments: true
            }
        ],
        'max-lines-per-function': [
            1,
            {
                max: 100,
                skipBlankLines: true,
                skipComments: true,
                IIFEs: true
            }
        ],
        'max-nested-callbacks': [
            1,
            3
        ],
        'max-params': [
            1,
            6
        ],
        'max-statements': [
            1,
            100,
            {
                ignoreTopLevelFunctions: true
            }
        ],
        'max-statements-per-line': 2,
        'multiline-comment-style': [
            2,
            'separate-lines'
        ],
        'multiline-ternary': [
            1,
            'always-multiline'
        ],
        'new-cap': [
            2,
            {
                capIsNewExceptions: [
                    'T',
                    'AddToFavoritesBar'
                ]
            }
        ],
        'new-parens': 1,
        'newline-per-chained-call': 1,
        'no-array-constructor': 2,
        'no-lonely-if': 1,
        'no-multiple-empty-lines': [
            2,
            {
                max: 2,
                maxBOF: 1,
                maxEOF: 1
            }
        ],
        'no-negated-condition': 1,
        'no-new-object': 2,
        'no-tabs': 2,
        'no-trailing-spaces': 2,
        'no-underscore-dangle': 1,
        'no-unneeded-ternary': 2,
        'no-whitespace-before-property': 2,
        'object-curly-newline': [
            2,
            {
                multiline: true,
                consistent: true
            }
        ],
        'object-curly-spacing': [
            2,
            'always'
        ],
        'one-var': [
            2,
            'never'
        ],
        'operator-linebreak': [
            2,
            'before'
        ],
        'prefer-object-spread': 1,
        'quote-props': [
            2,
            'consistent-as-needed'
        ],
        'quotes': [
            2,
            'single'
        ],
        'semi': [
            2,
            'always'
        ],
        'semi-spacing': 2,
        'semi-style': [
            2,
            'last'
        ],
        'space-before-blocks': [
            2,
            'always'
        ],
        'space-before-function-paren': [
            2,
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always'
            }
        ],
        'space-in-parens': [
            2,
            'never'
        ],
        'space-infix-ops': 2,
        'space-unary-ops': 2,
        'spaced-comment': [
            2,
            'always',
            {
                markers: ['/'],
                exceptions: [
                    '-',
                    '+',
                    '"',
                    '/',
                    '*'
                ],
                block: {
                    balanced: true
                }
            }
        ],
        'switch-colon-spacing': 2,
        'template-tag-spacing': [
            1,
            'never'
        ],
        'unicode-bom': 1,
        // region: overrides eslint-comments
        'eslint-comments/no-unused-disable': 2,
        'eslint-comments/disable-enable-pair': [
            2,
            {
                allowWholeFile: true
            }
        ]
    }
};
