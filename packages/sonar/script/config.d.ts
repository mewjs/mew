export var eslintRulesDoc: {
    default: string;
    'import/': string;
    'babel/': string;
    'react/': string;
    'jsx-a11y/': string;
    'react-native/': string;
    'vue/': string;
    '@typescript-eslint/': string;
};
export var stylelintRulesDoc: {
    default: string;
    'mew/': string;
};
export var eslintRulesNames: {
    'no-misleading-character-class': string;
    'no-async-promise-executor': string;
    'require-atomic-updates': string;
    'no-useless-catch': string;
    'max-lines-per-function': string;
    'prefer-object-spread': string;
    'babel/new-cap': string;
    'babel/camelcase': string;
    'babel/no-invalid-this': string;
    'babel/object-curly-spacing': string;
    'babel/quotes': string;
    'babel/semi': string;
    'babel/no-unused-expressions': string;
    'babel/valid-typeof': string;
    'react/jsx-fragments': string;
    'react-hooks/rules-of-hooks': string;
    'jsx-a11y/control-has-associated-label': string;
    'jsx-a11y/label-has-associated-control': string;
    'react-native/no-color-literals': string;
    'react-native/no-inline-styles': string;
    'react-native/no-raw-text': string;
    'react-native/no-unused-styles': string;
    'react-native/split-platform-components': string;
    '@typescript-eslint/no-unused-vars': string;
    '@typescript-eslint/array-type': string;
    '@typescript-eslint/ban-types': string;
    '@typescript-eslint/member-delimiter-style': string;
    '@typescript-eslint/no-dynamic-delete': string;
    '@typescript-eslint/no-explicit-any': string;
    '@typescript-eslint/no-extra-non-null-assertion': string;
    '@typescript-eslint/no-extraneous-class': string;
    '@typescript-eslint/no-for-in-array': string;
    '@typescript-eslint/no-inferrable-types': string;
    '@typescript-eslint/no-namespace': string;
    '@typescript-eslint/no-var-requires': string;
    '@typescript-eslint/prefer-for-of': string;
    '@typescript-eslint/prefer-namespace-keyword': string;
    '@typescript-eslint/prefer-optional-chain': string;
    '@typescript-eslint/triple-slash-reference': string;
    '@typescript-eslint/unified-signatures': string;
    'vue/multiline-html-element-content-newline': string;
    'vue/no-spaces-around-equal-signs-in-attribute': string;
    'vue/no-template-shadow': string;
    'vue/singleline-html-element-content-newline': string;
    'vue/no-v-html': string;
};
export var eslintRules: {
    'constructor-super': number;
    'for-direction': number;
    'getter-return': number;
    'no-class-assign': number;
    'no-compare-neg-zero': number;
    'no-cond-assign': number;
    'no-const-assign': number;
    'no-constant-condition': number;
    'no-control-regex': number;
    'no-delete-var': number;
    'no-dupe-args': number;
    'no-dupe-class-members': number;
    'no-dupe-keys': number;
    'no-duplicate-case': number;
    'no-empty-character-class': number;
    'no-empty-pattern': number;
    'no-ex-assign': number;
    'no-extra-boolean-cast': number;
    'no-extra-semi': number;
    'no-fallthrough': number;
    'no-global-assign': number;
    'no-invalid-regexp': number;
    'no-irregular-whitespace': number;
    'no-misleading-character-class': number;
    'no-mixed-spaces-and-tabs': number;
    'no-new-symbol': number;
    'no-obj-calls': number;
    'no-regex-spaces': number;
    'no-self-assign': number;
    'no-sparse-arrays': number;
    'no-this-before-super': number;
    'no-undef': number;
    'no-unexpected-multiline': number;
    'no-unreachable': number;
    'no-unsafe-finally': number;
    'no-unsafe-negation': number;
    'no-unused-labels': number;
    'no-useless-escape': number;
    'require-yield': number;
    'use-isnan': number;
    'no-console': number;
    'no-debugger': number;
    'no-empty': number;
    'no-func-assign': number;
    'no-inner-declarations': number;
    'no-octal': number;
    'no-redeclare': number;
    'no-unused-vars': number;
    'no-async-promise-executor': number;
    'no-await-in-loop': number;
    'no-extra-parens': number;
    'no-prototype-builtins': number;
    'no-template-curly-in-string': number;
    'require-atomic-updates': number;
    'accessor-pairs': number;
    'array-callback-return': number;
    'block-scoped-var': number;
    'class-methods-use-this': number;
    complexity: number;
    curly: number;
    'dot-location': number;
    'dot-notation': number;
    eqeqeq: number;
    'guard-for-in': number;
    'no-alert': number;
    'no-caller': number;
    'no-case-declarations': number;
    'no-else-return': number;
    'no-empty-function': number;
    'no-eval': number;
    'no-extend-native': number;
    'no-extra-bind': number;
    'no-extra-label': number;
    'no-implied-eval': number;
    'no-invalid-this': number;
    'no-labels': number;
    'no-lone-blocks': number;
    'no-loop-func': number;
    'no-magic-numbers': number;
    'no-multi-spaces': number;
    'no-multi-str': number;
    'no-new-wrappers': number;
    'no-octal-escape': number;
    'no-proto': number;
    'no-return-assign': number;
    'no-return-await': number;
    'no-script-url': number;
    'no-self-compare': number;
    'no-sequences': number;
    'no-throw-literal': number;
    'no-unmodified-loop-condition': number;
    'no-unused-expressions': number;
    'no-useless-call': number;
    'no-useless-catch': number;
    'no-useless-concat': number;
    'no-useless-return': number;
    'no-warning-comments': number;
    'no-with': number;
    'prefer-promise-reject-errors': number;
    radix: number;
    'require-await': number;
    'wrap-iife': number;
    'no-restricted-globals': number;
    'no-shadow-restricted-names': number;
    'no-undefined': number;
    'no-use-before-define': number;
    'callback-return': number;
    'handle-callback-err': number;
    'no-buffer-constructor': number;
    'no-new-require': number;
    'array-bracket-newline': number;
    'array-bracket-spacing': number;
    'array-element-newline': number;
    'brace-style': number;
    'comma-dangle': number;
    'comma-spacing': number;
    'comma-style': number;
    'computed-property-spacing': number;
    'eol-last': number;
    'func-call-spacing': number;
    'function-paren-newline': number;
    'func-names': number;
    'id-blacklist': number;
    indent: number;
    'jsx-quotes': number;
    'key-spacing': number;
    'keyword-spacing': number;
    'linebreak-style': number;
    'lines-around-comment': number;
    'lines-between-class-members': number;
    'line-comment-position': number;
    'max-depth': number;
    'max-len': number;
    'max-lines': number;
    'max-lines-per-function': number;
    'max-nested-callbacks': number;
    'max-params': number;
    'max-statements': number;
    'max-statements-per-line': number;
    'multiline-comment-style': number;
    'multiline-ternary': number;
    'new-parens': number;
    'newline-per-chained-call': number;
    'no-array-constructor': number;
    'no-lonely-if': number;
    'no-multiple-empty-lines': number;
    'no-negated-condition': number;
    'no-new-object': number;
    'no-tabs': number;
    'no-trailing-spaces': number;
    'no-underscore-dangle': number;
    'no-unneeded-ternary': number;
    'no-whitespace-before-property': number;
    'object-curly-newline': number;
    'object-curly-spacing': number;
    'one-var': number;
    'operator-linebreak': number;
    'prefer-object-spread': number;
    'quote-props': number;
    quotes: number;
    semi: number;
    'semi-spacing': number;
    'semi-style': number;
    'space-before-blocks': number;
    'space-before-function-paren': number;
    'space-in-parens': number;
    'space-infix-ops': number;
    'space-unary-ops': number;
    'spaced-comment': number;
    'switch-colon-spacing': number;
    'template-tag-spacing': number;
    'unicode-bom': number;
    'arrow-body-style': number;
    'arrow-parens': number;
    'arrow-spacing': number;
    'generator-star-spacing': number;
    'no-confusing-arrow': number;
    'no-duplicate-imports': number;
    'no-useless-computed-key': number;
    'no-useless-constructor': number;
    'no-useless-rename': number;
    'no-var': number;
    'object-shorthand': number;
    'prefer-arrow-callback': number;
    'prefer-const': number;
    'prefer-destructuring': number;
    'prefer-rest-params': number;
    'prefer-spread': number;
    'prefer-template': number;
    'rest-spread-spacing': number;
    'symbol-description': number;
    'template-curly-spacing': number;
    'yield-star-spacing': number;
    'import/no-unresolved': number;
    'import/named': number;
    'import/default': number;
    'import/namespace': number;
    'import/no-absolute-path': number;
    'import/no-dynamic-require': number;
    'import/no-webpack-loader-syntax': number;
    'import/no-self-import': number;
    'import/no-useless-path-segments': number;
    'import/export': number;
    'import/no-named-as-default': number;
    'import/no-named-as-default-member': number;
    'import/no-deprecated': number;
    'import/no-extraneous-dependencies': number;
    'import/no-mutable-exports': number;
    'import/unambiguous': number;
    'import/no-commonjs': number;
    'import/no-amd': number;
    'import/first': number;
    'import/no-duplicates': number;
    'import/extensions': number;
    'import/order': number;
    'import/newline-after-import': number;
    'import/prefer-default-export': number;
    'import/no-named-default': number;
    'import/dynamic-import-chunkname': number;
    'new-cap': number;
    'babel/new-cap': number;
    camelcase: number;
    'babel/camelcase': number;
    'babel/no-invalid-this': number;
    'babel/object-curly-spacing': number;
    'babel/quotes': number;
    'babel/semi': number;
    'babel/no-unused-expressions': number;
    'babel/valid-typeof': number;
    'react/boolean-prop-naming': number;
    'react/button-has-type': number;
    'react/default-props-match-prop-types': number;
    'react/destructuring-assignment': number;
    'react/forbid-component-props': number;
    'react/forbid-foreign-prop-types': number;
    'react/forbid-prop-types': number;
    'react/no-access-state-in-setstate': number;
    'react/no-array-index-key': number;
    'react/no-children-prop': number;
    'react/no-danger': number;
    'react/no-danger-with-children': number;
    'react/no-deprecated': number;
    'react/no-did-mount-set-state': number;
    'react/no-did-update-set-state': number;
    'react/no-direct-mutation-state': number;
    'react/no-find-dom-node': number;
    'react/no-is-mounted': number;
    'react/no-multi-comp': number;
    'react/no-redundant-should-component-update': number;
    'react/no-render-return-value': number;
    'react/no-typos': number;
    'react/no-string-refs': number;
    'react/no-this-in-sfc': number;
    'react/no-unescaped-entities': number;
    'react/no-unknown-property': number;
    'react/no-unsafe': number;
    'react/no-unused-prop-types': number;
    'react/no-unused-state': number;
    'react/no-will-update-set-state': number;
    'react/prefer-es6-class': number;
    'react/prefer-stateless-function': number;
    'react/prop-types': number;
    'react/require-default-props': number;
    'react/require-render-return': number;
    'react/self-closing-comp': number;
    'react/sort-comp': number;
    'react/style-prop-object': number;
    'react/void-dom-elements-no-children': number;
    'react/jsx-boolean-value': number;
    'react/jsx-closing-bracket-location': number;
    'react/jsx-closing-tag-location': number;
    'react/jsx-curly-spacing': number;
    'react/jsx-equals-spacing': number;
    'react/jsx-filename-extension': number;
    'react/jsx-first-prop-new-line': number;
    'react/jsx-handler-names': number;
    'react/jsx-indent': number;
    'react/jsx-indent-props': number;
    'react/jsx-key': number;
    'react/jsx-max-depth': number;
    'react/jsx-max-props-per-line': number;
    'react/jsx-no-bind': number;
    'react/jsx-no-comment-textnodes': number;
    'react/jsx-no-duplicate-props': number;
    'react/jsx-no-target-blank': number;
    'react/jsx-no-undef': number;
    'react/jsx-one-expression-per-line': number;
    'react/jsx-curly-brace-presence': number;
    'react/jsx-fragments': number;
    'react/jsx-pascal-case': number;
    'react/jsx-props-no-multi-spaces': number;
    'react/jsx-tag-spacing': number;
    'react/jsx-uses-vars': number;
    'react/jsx-wrap-multilines': number;
    'react-hooks/rules-of-hooks': number;
    'jsx-a11y/accessible-emoji': number;
    'jsx-a11y/alt-text': number;
    'jsx-a11y/anchor-has-content': number;
    'jsx-a11y/anchor-is-valid': number;
    'jsx-a11y/aria-activedescendant-has-tabindex': number;
    'jsx-a11y/aria-props': number;
    'jsx-a11y/aria-proptypes': number;
    'jsx-a11y/aria-role': number;
    'jsx-a11y/aria-unsupported-elements': number;
    'jsx-a11y/click-events-have-key-events': number;
    'jsx-a11y/control-has-associated-label': number;
    'jsx-a11y/heading-has-content': number;
    'jsx-a11y/html-has-lang': number;
    'jsx-a11y/iframe-has-title': number;
    'jsx-a11y/img-redundant-alt': number;
    'jsx-a11y/interactive-supports-focus': number;
    'jsx-a11y/label-has-associated-control': number;
    'jsx-a11y/label-has-for': string;
    'jsx-a11y/media-has-caption': number;
    'jsx-a11y/mouse-events-have-key-events': number;
    'jsx-a11y/no-access-key': number;
    'jsx-a11y/no-autofocus': number;
    'jsx-a11y/no-distracting-elements': number;
    'jsx-a11y/no-interactive-element-to-noninteractive-role': number;
    'jsx-a11y/no-noninteractive-element-interactions': number;
    'jsx-a11y/no-noninteractive-element-to-interactive-role': number;
    'jsx-a11y/no-noninteractive-tabindex': number;
    'jsx-a11y/no-onchange': number;
    'jsx-a11y/no-redundant-roles': number;
    'jsx-a11y/no-static-element-interactions': number;
    'jsx-a11y/role-has-required-aria-props': number;
    'jsx-a11y/role-supports-aria-props': number;
    'jsx-a11y/scope': number;
    'jsx-a11y/tabindex-no-positive': number;
    'react-native/no-color-literals': number;
    'react-native/no-inline-styles': number;
    'react-native/no-raw-text': number;
    'react-native/no-unused-styles': number;
    'react-native/split-platform-components': number;
    '@typescript-eslint/no-unused-vars': number;
    '@typescript-eslint/array-type': number;
    '@typescript-eslint/ban-types': number;
    '@typescript-eslint/member-delimiter-style': number;
    '@typescript-eslint/no-dynamic-delete': number;
    '@typescript-eslint/no-explicit-any': number;
    '@typescript-eslint/no-extra-non-null-assertion': number;
    '@typescript-eslint/no-extraneous-class': number;
    '@typescript-eslint/no-for-in-array': number;
    '@typescript-eslint/no-inferrable-types': number;
    '@typescript-eslint/no-namespace': number;
    '@typescript-eslint/no-var-requires': number;
    '@typescript-eslint/prefer-for-of': number;
    '@typescript-eslint/prefer-namespace-keyword': number;
    '@typescript-eslint/prefer-optional-chain': number;
    '@typescript-eslint/triple-slash-reference': number;
    '@typescript-eslint/unified-signatures': number;
    'vue/attribute-hyphenation': number;
    'vue/html-closing-bracket-newline': number;
    'vue/html-closing-bracket-spacing': number;
    'vue/html-end-tags': number;
    'vue/html-indent': number;
    'vue/html-quotes': number;
    'vue/html-self-closing': number;
    'vue/max-attributes-per-line': number;
    'vue/multiline-html-element-content-newline': number;
    'vue/mustache-interpolation-spacing': number;
    'vue/name-property-casing': number;
    'vue/no-multi-spaces': number;
    'vue/no-spaces-around-equal-signs-in-attribute': number;
    'vue/no-template-shadow': number;
    'vue/prop-name-casing': number;
    'vue/require-default-prop': number;
    'vue/require-prop-types': number;
    'vue/singleline-html-element-content-newline': number;
    'vue/v-bind-style': number;
    'vue/v-on-style': number;
    'vue/attributes-order': number;
    'vue/no-v-html': number;
    'vue/order-in-components': number;
    'vue/this-in-template': number;
    'mini/comment-directive': number;
    'mini/xml-indent': number;
    'mini/no-parsing-error': number;
    'mini/app-config-acceptable': number;
    'mini/sitemap-acceptable': number;
    'mini/no-duplicate-attributes': number;
    'mini/no-useless-mustache': number;
    'mini/component-nesting': number;
    'mini/not-empty': number;
    'mini/valid-for': number;
    'mini/valid-if': number;
    'mini/valid-elif': number;
    'mini/valid-else': number;
    'mini/no-confusing-for-if': number;
    'mini/valid-bind': number;
    'mini/no-static-inline-styles': number;
    'mini/component-attributes': number;
    'mini/max-attributes-per-line': number;
    'mini/html-end-tags': number;
    'mini/no-multi-spaces': number;
    'mini/html-closing-bracket-newline': number;
    'mini/html-closing-bracket-spacing': number;
    'mini/no-duplicate-else-if': number;
    'mini/no-restricted-static-attribute': number;
    'mini/singleline-html-element-content-newline': number;
    'mini/html-comment-content-newline': number;
    'mini/html-comment-content-spacing': number;
    'mini/no-unknown-component-usage': number;
    'mini/attribute-value-spacing': number;
    'mini/resolve-src': number;
    'mini/array-bracket-spacing': number;
    'mini/arrow-spacing': number;
    'mini/camelcase': number;
    'mini/comma-dangle': number;
    'mini/dot-location': number;
    'mini/dot-notation': number;
    'mini/eqeqeq': number;
    'mini/func-call-spacing': number;
    'mini/key-spacing': number;
    'mini/keyword-spacing': number;
    'mini/mustache-interpolation-spacing': number;
    'mini/no-spaces-around-equal-signs-in-attribute': number;
    'mini/no-sparse-arrays': number;
    'mini/object-curly-newline': number;
    'mini/object-curly-spacing': number;
    'mini/space-in-parens': number;
    'mini/space-unary-ops': number;
    'mini/no-useless-concat': number;
    'mini/space-infix-ops': number;
};
export var stylelintRules: {
    'mew/white-space-between-values': number;
    'mew/use-hex-color': number;
    'mew/strict-values': number;
    'mew/stylus-colon': number;
    'mew/stylus-trailing-semicolon': number;
    'color-no-invalid-hex': number;
    'font-family-no-duplicate-names': number;
    'font-family-no-missing-generic-family-keyword': number;
    'function-calc-no-invalid': number;
    'function-calc-no-unspaced-operator': number;
    'function-linear-gradient-no-nonstandard-direction': number;
    'string-no-newline': number;
    'unit-no-unknown': number;
    'property-no-unknown': number;
    'keyframe-declaration-no-important': number;
    'declaration-block-no-duplicate-properties': number;
    'declaration-block-no-shorthand-property-overrides': number;
    'block-no-empty': number;
    'selector-pseudo-class-no-unknown': number;
    'selector-pseudo-element-no-unknown': number;
    'selector-type-no-unknown': number;
    'media-feature-name-no-unknown': number;
    'at-rule-no-unknown': number;
    'comment-no-empty': number;
    'no-descending-specificity': number;
    'no-duplicate-at-import-rules': number;
    'no-duplicate-selectors': number;
    'no-empty-source': number;
    'no-extra-semicolons': number;
    'no-invalid-double-slash-comments': number;
    'color-named': number;
    'function-blacklist': number;
    'function-url-scheme-blacklist': number;
    'function-url-scheme-whitelist': number;
    'shorthand-property-no-redundant-values': number;
    'value-no-vendor-prefix': number;
    'property-no-vendor-prefix': number;
    'declaration-block-no-redundant-longhand-properties': number;
    'declaration-block-single-line-max-declarations': number;
    'selector-max-attribute': number;
    'selector-max-class': number;
    'selector-max-combinators': number;
    'selector-max-compound-selectors': number;
    'selector-max-empty-lines': number;
    'selector-max-id': number;
    'selector-max-pseudo-class': number;
    'selector-max-universal': number;
    'selector-no-qualifying-type': number;
    'selector-no-vendor-prefix': number;
    'at-rule-no-vendor-prefix': number;
    'at-rule-property-requirelist': number;
    'max-nesting-depth': number;
    'no-unknown-animations': number;
    'color-hex-case': number;
    'color-hex-length': number;
    'font-family-name-quotes': number;
    'font-weight-notation': number;
    'function-comma-space-after': number;
    'function-comma-space-before': number;
    'function-max-empty-lines': number;
    'function-name-case': number;
    'function-parentheses-space-inside': number;
    'function-url-quotes': number;
    'function-whitespace-after': number;
    'number-leading-zero': number;
    'number-no-trailing-zeros': number;
    'string-quotes': number;
    'length-zero-no-unit': number;
    'unit-case': number;
    'value-keyword-case': number;
    'value-list-comma-newline-after': number;
    'value-list-comma-space-after': number;
    'value-list-comma-space-before': number;
    'custom-property-empty-line-before': number;
    'property-case': number;
    'declaration-bang-space-after': number;
    'declaration-bang-space-before': number;
    'declaration-colon-space-after': number;
    'declaration-colon-space-before': number;
    'declaration-block-semicolon-newline-after': number;
    'declaration-block-semicolon-space-after': number;
    'declaration-block-semicolon-space-before': number;
    'declaration-block-trailing-semicolon': number;
    'block-closing-brace-empty-line-before': number;
    'block-closing-brace-newline-after': number;
    'block-closing-brace-newline-before': number;
    'block-opening-brace-newline-after': number;
    'block-opening-brace-space-before': number;
    'selector-attribute-brackets-space-inside': number;
    'selector-attribute-operator-space-after': number;
    'selector-attribute-operator-space-before': number;
    'selector-attribute-quotes': number;
    'selector-combinator-space-after': number;
    'selector-combinator-space-before': number;
    'selector-descendant-combinator-no-non-space': number;
    'selector-pseudo-class-case': number;
    'selector-pseudo-class-parentheses-space-inside': number;
    'selector-pseudo-element-case': number;
    'selector-pseudo-element-colon-notation': number;
    'selector-type-case': number;
    'selector-list-comma-newline-after': number;
    'selector-list-comma-space-before': number;
    'rule-empty-line-before': number;
    'media-feature-colon-space-after': number;
    'media-feature-colon-space-before': number;
    'media-feature-name-case': number;
    'media-feature-parentheses-space-inside': number;
    'media-feature-range-operator-space-after': number;
    'media-feature-range-operator-space-before': number;
    'media-query-list-comma-space-after': number;
    'media-query-list-comma-space-before': number;
    'at-rule-empty-line-before': number;
    'at-rule-name-case': number;
    'at-rule-name-newline-after': number;
    'at-rule-name-space-after': number;
    'at-rule-semicolon-newline-after': number;
    'at-rule-semicolon-space-before': number;
    'comment-empty-line-before': number;
    'comment-whitespace-inside': number;
    indentation: number;
    linebreaks: number;
    'max-empty-lines': number;
    'max-line-length': number;
    'no-eol-whitespace': number;
    'no-missing-end-of-source-newline': number;
    'no-empty-first-line': number;
};
export var htmlintRules: {
    'asset-type': number;
    'bool-attribute-value': number;
    'button-name': number;
    'button-type': number;
    charset: number;
    'css-in-head': number;
    doctype: number;
    'html-lang': number;
    'ie-edge': number;
    'img-alt': number;
    'img-src': number;
    'img-title': number;
    'img-width-height': number;
    'indent-char': number;
    'lowercase-class-with-hyphen': number;
    'lowercase-id-with-hyphen': number;
    nest: number;
    'rel-stylesheet': number;
    'script-in-tail': number;
    'title-required': number;
    'unique-id': number;
    'no-duplication-id-and-name': number;
    'no-meta-css': number;
    'no-hook-class': number;
    'max-len': number;
    'no-bom': number;
    viewport: number;
    'label-for-input': number;
    'attr-lowercase': number;
    'attr-no-duplication': number;
    'attr-unsafe-chars': number;
    'attr-value-double-quotes': number;
    'id-class-ad-disabled': number;
    'spec-char-escape': number;
    'self-close': number;
    'style-disabled': number;
    'tag-pair': number;
    'tagname-lowercase': number;
    'script-content': number;
    'style-content': number;
};
