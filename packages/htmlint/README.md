# HTMLINT

HTML code style check & format tool.

## Install

```sh
npm i -g @mewjs/htmlint
```

## Usage

### in CLI

```shell
Usage: htmlint <command> [options] [target...]

Commands:
    hint    Do hint given file(s)
    format  Do format given file(s)

Options:
    -h, --help      Show help                                            [boolean]
    -c, --config    Path to custom configuration file.                    [string]
    --diff          Check code style and output char diff.               [boolean]
    -i, --in-place  Edit input files in place; use with care!            [boolean]
    -v, --version   Show version number                                  [boolean]

Examples:
    htmlint hint foo.html               do hint foo.html
    htmlint hint foo.html bar.html      do hint foo.html & bar.html
    htmlint hint ./                     do hint html files under ./
    htmlint format foo.html             do format foo.html
    htmlint format --diff foo.html      do format foo.html & show diff result
    htmlint format --in-place foo.html  do format foo.html & write file in place

```

### in Node.js

* hint file

```javascript
import htmlint from '@mewjs/htmlint';

const results = htmlint.hintFile(filePath);
results.forEach(result => console.log(result));
```

* hint code (string)

```javascript
import htmlint from '@mewjs/htmlint';

const results = htmlint.hint(code);
results.forEach(result => console.log(result));

// Or
htmlint.hintAsync(code).then(
    results => results.forEach(result => console.log(result))
);
```

* use hint results

```javascript
results.forEach(item => {
    console.log(
        '[%s] line %d, column %d: %s (%s, %s)',
        item.type,
        item.line,
        item.column,
        item.message,
        item.rule,
        item.code
    );
});
```

* format file

```javascript
import htmlint from '@mewjs/htmlint';

console.log(htmlint.formatFile(filePath));
```

* format code (string)

```javascript
import htmlint from '@mewjs/htmlint';

console.log(htmlint.format(code));
// Or
htmlint.formatAsync(code).then(
    html => console.log(html)
);
```

* add rule

```javascript
import htmlint from '@mewjs/htmlint';

htmlint.addRule({
    name: 'test-rule',
    desc: 'Just a test rule.',
    lint(getCfg, document, reporter) {
        reporter.warn(
            1,
            '099',
            'This is a test waring!'
        );
    }
});

const results = htmlint.hint(code);
results.forEach(item => {
    console.log(
        '[%s] line %d, column %d: %s (%s, %s)',
        item.type,
        item.line,
        item.column,
        item.message,
        item.rule,
        item.code
    );
});
```

## Rules

[src/rules/](./src/rules/)

## Config

### default: [src/default/config.ts](./src/default/config.ts)

### custom

Custom rule file (.htmlintrc) can be placed in the same/parent directory of target file, or the `~/` directory.

If found in neither paths, the default config will be used.

### inline

* disable

```html
<!-- htmlint-disable -->
<!-- htmlint-disable img-alt -->
<!-- htmlint-disable img-alt, img-src, attr-value-double-quotes -->
```

* enable

```html
<!-- htmlint-enable -->
<!-- htmlint-enable img-alt -->
<!-- htmlint-enable img-alt, img-src, attr-value-double-quotes -->
```

* config

```html
<!-- htmlint img-width-height: true -->
<!-- htmlint img-width-height: true, indent-char: "tab" -->
```
