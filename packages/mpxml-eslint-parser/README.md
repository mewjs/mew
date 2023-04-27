# mpxml-eslint-parser

The ESLint custom parser for `.wxml`, `.axml`, `.swan` files.

The `.wxs` files will be parsed as js files, see `parserOptions`.

Inspire from [vue-eslint-parser](https://github.com/vuejs/vue-eslint-parser).

## 💿 Install

```sh
npm install --save-dev eslint @mewjs/mpxml-eslint-parser
```

- Requires Node.js 12 or later.
- Requires ESLint 7.0.0 or later.
- Requires `babel-eslint` 10.1.0 or later if you want it. (optional)
- Requires `@typescript-eslint/parser` 2.31 or later if you want it. (optional)

## 📖 Usage

1. Write `parser` option into your `.eslintrc.*` file.
2. Use glob patterns or `--ext .wxml` CLI option.

```json
{
    "extends": "eslint:recommended",
    "parser": "@mewjs/mpxml-eslint-parser"
}
```

```sh
$ eslint "src/**/*.{js,wxml,axml,swan,wxs}"
# or
$ eslint src --ext .wxml --ext .axml --ext .swan  --ext .wxs
```

## 🔧 Options

`parserOptions` has the same type as [espree](https://github.com/eslint/espree#usage), the default parser of ESLint, is supporting.
For example:

```json
{
    "parser": "@mewjs/mpxml-eslint-parser",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2018,
        "ecmaFeatures": {
            "globalReturn": false,
            "impliedStrict": false,
            "jsx": false
        }
    }
}
```

## 🍻 Contributing

Welcome contributing!


If you want to write code, please execute `npm install && npm run setup` after you cloned this repository.
The `npm install` command installs dependencies.
The `npm run setup` command initializes ESLint as git submodules for tests.

### Development Tools

- `npm test` runs tests and measures coverage.
- `npm run build` compiles TypeScript source code to `index.js`, `index.js.map`, and `index.d.ts`.
- `npm run coverage` shows the coverage result of `npm test` command with the default browser.
- `npm run clean` removes the temporary files which are created by `npm test` and `npm run build`.
- `npm run lint` runs ESLint.
- `npm run setup` setups submodules to develop.
- `npm run watch` runs `build`, `update-fixtures`, and tests with `--watch` option.
