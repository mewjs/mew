# html-code-gen

html-code-gen is a HTML-code generator. It generates HTML code with given dom(-like) object.

## Install

```sh
npm install @mewjs/html-code-gen
```

```javascript
import htmlCodeGen from '@mewjs/html-code-gen';
```

## Usage

```javascript
htmlCodeGen.print(dom, opt);
```

```javascript
htmlCodeGen.printAsync(dom, opt).then(console.log);
```

## Options

* `indent-size`: size of indent

    default: `4`

* `indent-char`: char of indent ( space / tab )

    default: `'space'`

* `max-char`: max char num in one line (TODO)

    default: `80`

* `no-format-tag`: tags whose content should not be formatted

    default: [`spec.tagTypeMap.structural`](./lib/spec.js#L26)

* `no-format`: no format

    default: `false`

* `inline-tag`: tags whose content should be inline

    default: [`spec.tagTypeMap.inline`](./lib/spec.js#L25)

* `formatter`: special formatters { tagName ( script / style ) : formatter )

    default: `{}`

* `bool-attribute-value`: hide value of boolean attribute or not ( 'remove' / 'preserve' )

    default: `'remove'`

* `self-close`: should void tags close themselves with "/" ( 'close' / 'no-close' )

    default: `'no-close'`

* `level`: current level

    default: `0`

## Development

* run test cases

```sh
npm run test
```
