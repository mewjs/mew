const overrides = {
    'indent': 0,
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
};

const rules = {
    // disable rules in Component
    'no-invalid-this': 0,
    // rules of eslint-plugin-vue
    'vue/html-indent': [
        2,
        4
    ],
    'vue/html-self-closing': [
        2,
        {
            html: {
                void: 'never',
                normal: 'never',
                component: 'always'
            }
        }
    ],
    'vue/max-attributes-per-line': [
        2,
        {
            singleline: 5,
            multiline: 1
        }
    ],
    'vue/mustache-interpolation-spacing': [
        2,
        'always'
    ],
    'vue/singleline-html-element-content-newline': 1,
    'vue/attributes-order': 1,
    'vue/no-v-html': 1,
    'vue/component-name-in-template-casing': [
        2,
        'PascalCase',
        {
            registeredComponentsOnly: true,
            ignores: [
                '/^xx-/'
            ]
        }
    ],
    'vue/match-component-file-name': [
        0,
        {
            extensions: ['vue'],
            shouldMatchCase: true
        }
    ],
    'vue/script-indent': [
        2,
        4,
        {
            baseIndent: 0,
            switchCase: 1
        }
    ],
    'vue/template-curly-spacing': [
        2,
        'always'
    ],
    'vue/component-tags-order': [
        2,
        {
            order: [
                ['template', 'script'],
                'style'
            ]
        }
    ],
    'vue/order-in-components': [
        2,
        {
            order: [
                'el',
                'name',
                'key',
                'parent',
                'functional',
                ['delimiters', 'comments'],
                ['components', 'directives', 'filters'],
                'extends',
                'mixins',
                ['provide', 'inject'],
                'ROUTER_GUARDS',
                'layout',
                'middleware',
                'validate',
                'scrollToTop',
                'transition',
                'loading',
                'inheritAttrs',
                'model',
                ['props', 'propsData'],
                'emits',
                'setup',
                'asyncData',
                'data',
                'fetch',
                'head',
                'computed',
                'watch',
                'watchQuery',
                'LIFECYCLE_HOOKS',
                'methods',
                ['template', 'render'],
                'renderError'
            ]
        }
    ]
};

module.exports = {
    overrides,
    rules,
};
