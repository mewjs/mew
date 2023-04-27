module.exports = {
    extends: [
        require.resolve('./esnext')
    ],
    plugins: [
        'react',
        'jsx-a11y',
        'react-hooks'
    ],
    settings: {
        react: {
            version: '17.0.2'
        }
    },
    overrides: [
        {
            files: ['*.jsx'],
            rules: {
                'max-lines-per-function': [
                    1,
                    {
                        max: 200,
                        skipBlankLines: true,
                        skipComments: true,
                        IIFEs: true
                    }
                ],
                'max-statements': [
                    1,
                    200,
                    {
                        ignoreTopLevelFunctions: true
                    }
                ]
            }
        }
    ],
    rules: {
        // disable rules in Component
        'no-invalid-this': 0,
        'no-unused-vars': 0,
        // rules of eslint-plugin-react
        'react/boolean-prop-naming': [
            1,
            {
                rule: '^(?:(?:(?:is|has)[A-Z\\d][A-Za-z\\d]*)|(?:enabled|disabled|checked|visibled|hidden|on|off))$'
            }
        ],
        'react/button-has-type': 2,
        'react/default-props-match-prop-types': 2,
        'react/destructuring-assignment': [
            1,
            'always',
            {
                ignoreClassFields: true
            }
        ],
        'react/display-name': 0,
        'react/forbid-component-props': 1,
        'react/forbid-dom-props': 0,
        'react/forbid-elements': 0,
        'react/forbid-foreign-prop-types': 1,
        'react/forbid-prop-types': 1,
        'react/no-access-state-in-setstate': 2,
        'react/no-array-index-key': 2,
        'react/no-children-prop': 2,
        'react/no-danger': 1,
        'react/no-danger-with-children': 2,
        'react/no-deprecated': 2,
        'react/no-did-mount-set-state': 2,
        'react/no-did-update-set-state': 2,
        'react/no-direct-mutation-state': 2,
        'react/no-find-dom-node': 2,
        'react/no-is-mounted': 2,
        'react/no-multi-comp': [
            2,
            {
                ignoreStateless: true
            }
        ],
        'react/no-redundant-should-component-update': 2,
        'react/no-render-return-value': 2,
        'react/no-set-state': 0,
        'react/no-typos': 2,
        'react/no-string-refs': 2,
        'react/no-this-in-sfc': 2,
        'react/no-unescaped-entities': 2,
        'react/no-unknown-property': 2,
        'react/no-unsafe': 2,
        'react/no-unused-prop-types': 2,
        'react/no-unused-state': 2,
        'react/no-will-update-set-state': 2,
        'react/prefer-es6-class': 2,
        'react/prefer-stateless-function': [
            2,
            {
                ignorePureComponents: true
            }
        ],
        'react/prop-types': 1,
        'react/react-in-jsx-scope': 0,
        'react/require-default-props': [
            2,
            {
                forbidDefaultForRequired: true
            }
        ],
        'react/require-optimization': 0,
        'react/require-render-return': 2,
        'react/self-closing-comp': [
            2,
            {
                component: true,
                html: false
            }
        ],
        'react/sort-comp': [
            2,
            {
                order: [
                    'static-properties',
                    'static-methods',
                    'lifecycle',
                    'everything-else',
                    'rendering'
                ],
                groups: {
                    'static-properties': [
                        'displayName',
                        'propTypes',
                        'contextTypes',
                        'childContextTypes',
                        'mixins',
                        'statics'
                    ],
                    'lifecycle': [
                        'defaultProps',
                        'constructor',
                        'getDefaultProps',
                        'getInitialState',
                        'state',
                        'getChildContext',
                        'getDerivedStateFromProps',
                        'componentWillMount',
                        'UNSAFE_componentWillMount',
                        'componentDidMount',
                        'componentWillReceiveProps',
                        'UNSAFE_componentWillReceiveProps',
                        'shouldComponentUpdate',
                        'componentWillUpdate',
                        'UNSAFE_componentWillUpdate',
                        'getSnapshotBeforeUpdate',
                        'componentDidUpdate',
                        'componentDidCatch',
                        'componentWillUnmount',
                        '/^on[A-Z].+$/'
                    ],
                    'rendering': [
                        '/^render[A-Z].+$/',
                        'render'
                    ]
                }
            }
        ],
        'react/sort-prop-types': 0,
        'react/style-prop-object': 2,
        'react/void-dom-elements-no-children': 2,
        'react/jsx-boolean-value': [
            2,
            'never'
        ],
        'react/jsx-child-element-spacing': 0,
        'react/jsx-closing-bracket-location': [
            2,
            'line-aligned'
        ],
        'react/jsx-closing-tag-location': 2,
        'react/jsx-curly-spacing': [
            2,
            'never'
        ],
        'react/jsx-equals-spacing': [
            2,
            'never'
        ],
        'react/jsx-filename-extension': [
            2,
            {
                extensions: [
                    '.js',
                    '.jsx',
                    '.ts',
                    '.tsx'
                ]
            }
        ],
        'react/jsx-first-prop-new-line': [
            2,
            'multiline-multiprop'
        ],
        'react/jsx-handler-names': [
            1,
            {
                eventHandlerPrefix: '(handle|on)',
                eventHandlerPropPrefix: 'on'
            }
        ],
        'react/jsx-indent': [
            2,
            4
        ],
        'react/jsx-indent-props': [
            2,
            4
        ],
        'react/jsx-key': 2,
        'react/jsx-max-depth': [
            1,
            {
                max: 10
            }
        ],
        'react/jsx-max-props-per-line': [
            2,
            {
                maximum: 5,
                when: 'multiline'
            }
        ],
        'react/jsx-no-bind': [
            2,
            {
                ignoreRefs: false,
                allowArrowFunctions: false,
                allowBind: false,
                allowFunctions: false
            }
        ],
        'react/jsx-no-comment-textnodes': 2,
        'react/jsx-no-duplicate-props': [
            2,
            {
                ignoreCase: true
            }
        ],
        'react/jsx-no-literals': 0,
        'react/jsx-no-target-blank': [
            2,
            {
                enforceDynamicLinks: 'never'
            }
        ],
        'react/jsx-no-undef': 2,
        'react/jsx-one-expression-per-line': [
            1,
            {
                allow: 'literal'
            }
        ],
        'react/jsx-curly-brace-presence': [
            2,
            'never'
        ],
        'react/jsx-fragments': [
            1,
            'syntax'
        ],
        'react/jsx-pascal-case': [
            2,
            {
                allowAllCaps: true
            }
        ],
        'react/jsx-props-no-multi-spaces': 2,
        'react/jsx-sort-default-props': 0,
        'react/jsx-sort-props': 0,
        'react/jsx-tag-spacing': [
            2,
            {
                closingSlash: 'never',
                beforeSelfClosing: 'always',
                afterOpening: 'never'
            }
        ],
        'react/jsx-uses-react': 0,
        'react/jsx-uses-vars': 2,
        'react/jsx-wrap-multilines': [
            2,
            {
                declaration: 'parens-new-line',
                assignment: 'parens-new-line',
                return: 'parens-new-line',
                arrow: 'parens-new-line',
                condition: 'parens-new-line',
                logical: 'parens-new-line',
                prop: 'parens-new-line'
            }
        ],
        // rules of eslint-plugin-react-hooks
        'react-hooks/rules-of-hooks': 2,
        // rules of eslint-plugin-jsx-a11y
        'jsx-a11y/click-events-have-key-events': 0,
        'jsx-a11y/interactive-supports-focus': 1,
        'react-hooks/exhaustive-deps': 1
    }
};
