# eslint-plugin-mini

eslint plugin for mini program.

support codes:

- `wxml` Wechat mini program tpl
- `wxs` Wechat mini program wxs module
- `axml` AliPay tpl
- `swan` Baidu smart program tpl
- `js` JavasScript code
- `json` Includes app.json, component.json

## Installation

You'll first need to install [ESLint](http://eslint.org):

```sh
npm i eslint --save-dev
```

Next, install `@mewjs/eslint-plugin-mini`:

```sh
npm install @mewjs/eslint-plugin-mini --save-dev
```

## Usage

Add `mini` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "@mewjs/mini"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@mewjs/mini/xml-indent": [2, 4]
    }
}
```

## Supported Rules

- [@mewjs/mini/comment-directive](./docs/rules/comment-directive.md)
- [@mewjs/mini/xml-indent](./docs/rules/xml-indent.md)
- [@mewjs/mini/no-parsing-error](./docs/rules/no-parsing-error.md)
- [@mewjs/mini/app-config-acceptable](./docs/rules/app-config-acceptable.md)
- [@mewjs/mini/sitemap-acceptable](./docs/rules/sitemap-acceptable.md)
- [@mewjs/mini/no-duplicate-attributes](./docs/rules/no-duplicate-attributes.md)
- [@mewjs/mini/no-useless-mustache](./docs/rules/no-useless-mustache.md)
- [@mewjs/mini/component-nesting](./docs/rules/component-nesting.md)
- [@mewjs/mini/not-empty](./docs/rules/not-empty.md)
- [@mewjs/mini/valid-for](./docs/rules/valid-for.md)
- [@mewjs/mini/valid-if](./docs/rules/valid-if.md)
- [@mewjs/mini/valid-elif](./docs/rules/valid-elif.md)
- [@mewjs/mini/valid-else](./docs/rules/valid-else.md)
- [@mewjs/mini/no-confusing-for-if](./docs/rules/no-confusing-for-if.md)
- [@mewjs/mini/valid-bind](./docs/rules/valid-bind.md)
- [@mewjs/mini/no-static-inline-styles](./docs/rules/no-static-inline-styles.md)
- [@mewjs/mini/component-attributes](./docs/rules/component-attributes.md)
- [@mewjs/mini/max-attributes-per-line](./docs/rules/max-attributes-per-line.md)
- [@mewjs/mini/html-end-tags](./docs/rules/html-end-tags.md)
- [@mewjs/mini/no-multi-spaces](./docs/rules/no-multi-spaces.md)
- [@mewjs/mini/html-closing-bracket-newline](./docs/rules/html-closing-bracket-newline.md)
- [@mewjs/mini/html-closing-bracket-spacing](./docs/rules/html-closing-bracket-spacing.md)
- [@mewjs/mini/no-duplicate-else-if](./docs/rules/no-duplicate-else-if.md)
- [@mewjs/mini/no-restricted-static-attribute](./docs/rules/no-restricted-static-attribute.md)
- [@mewjs/mini/singleline-html-element-content-newline](./docs/rules/singleline-html-element-content-newline.md)
- [@mewjs/mini/html-comment-content-newline](./docs/rules/html-comment-content-newline.md)
- [@mewjs/mini/html-comment-content-spacing](./docs/rules/html-comment-content-spacing.md)
- [@mewjs/mini/array-bracket-spacing](./docs/rules/array-bracket-spacing.md)
- [@mewjs/mini/arrow-spacing](./docs/rules/arrow-spacing.md)
- [@mewjs/mini/camelcase](./docs/rules/camelcase.md)
- [@mewjs/mini/comma-dangle](./docs/rules/comma-dangle.md)
- [@mewjs/mini/dot-location](./docs/rules/dot-location.md)
- [@mewjs/mini/dot-notation](./docs/rules/dot-notation.md)
- [@mewjs/mini/eqeqeq](./docs/rules/eqeqeq.md)
- [@mewjs/mini/func-call-spacing](./docs/rules/func-call-spacing.md)
- [@mewjs/mini/key-spacing](./docs/rules/key-spacing.md)
- [@mewjs/mini/keyword-spacing](./docs/rules/keyword-spacing.md)
- [@mewjs/mini/mustache-interpolation-spacing](./docs/rules/mustache-interpolation-spacing.md)
- [@mewjs/mini/no-spaces-around-equal-signs-in-attribute](./docs/rules/no-spaces-around-equal-signs-in-attribute.md)
- [@mewjs/mini/no-sparse-arrays](./docs/rules/no-sparse-arrays.md)
- [@mewjs/mini/object-curly-newline](./docs/rules/object-curly-newline.md)
- [@mewjs/mini/object-curly-spacing](./docs/rules/object-curly-spacing.md)
- [@mewjs/mini/space-in-parens](./docs/rules/space-in-parens.md)
- [@mewjs/mini/space-unary-ops](./docs/rules/space-unary-ops.md)
- [@mewjs/mini/attribute-value-spacing](./docs/rules/attribute-value-spacing.md)
- [@mewjs/mini/no-unknown-component-usage](./docs/rules/no-unknown-component-usage.md)
- [@mewjs/mini/no-useless-concat](./docs/rules/no-useless-concat.md)
- [@mewjs/mini/space-infix-ops](./docs/rules/space-infix-ops.md)
- [@mewjs/mini/resolve-src](./docs/rules/resolve-src.md)
