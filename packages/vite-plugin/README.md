# @mewjs/vite-plugin

Mew plugin for vite.

## Install

```sh
npm install @mewjs/vite-plugin --save-dev
# or
yarn add @mewjs/vite-plugin --dev
```

## Usage

```js
import { defineConfig } from 'vite';
import mew from '@mewjs/vite-plugin';

export default defineConfig({
  plugins: [mew()],
});
```

## Options

### `include`

- Type: `string | string[]`
- Default: `['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue']`

A single file, or array of files, to include when linting.

### `exclude`

- Type: `string | string[]`
- Default: `'node_modules'`

A single file, or array of files, to exclude when linting.

### `throwOnWarning`

- Type: `boolean`
- Default: `true`

The warnings found will be emitted, default to true.

### `throwOnError`

- Type: `boolean`
- Default: `true`

The errors found will be emitted, default to true.
