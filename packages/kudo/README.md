# @mewjs/kudo

@mewjs/kudo is for checking someone's code quality in git repository.

## Install

```sh
npm i -g @mewjs/kudo
```

## Usage

### in CLI

```sh
kudo author [3.months.ago]
```

```sh
kudo author [--since=3.months.ago]
```

### in Node.js

```js
const kudo = require('kudo');

kudo.deduce('kiddo', '3.days.ago');
```
