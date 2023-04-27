Manis
==========

For build system plugins that need to fetch relative config files (like .mewrc).

## Install

```sh
npm install @mewjs/manis
```

## Usage

### Using `strip-json-comments`

```typescript
import Manis from '@mewjs/manis'
import stripJSONComments from 'strip-json-comments';

const loader = (text: string) => JSON.parse(stripJSONComments(text));

const manis = new Manis({
    files: [
        {
            // just for example, it should be loaded as yaml in fact.
            name: '.eslintrc',
            get(json: JSONObject) {
                return { eslint:json };
            }
        },
        '.mewrc',
        {
            name: 'package.json',
            get(json: JSONObject) {
                return json.mew || {};
            }
        }
    ],
    loader: loader
});

const configs = manis.from('path/to/file.js');

// do something cool with configs

```

### Loading `.yml` with `js-yaml`.

```javascript
var yaml = require('js-yaml')

var Manis = require('manis')

var loader = function (text) {
    return yaml.load(text);
};

var manis = new Manis('.travis.yml', {loader: loader});

var configs = manis.from('path/to/file.js');

// do something cool with configs

```

```css
.foo {
    color:red
}

```

```stylus
.foo
  color red
```

```html
<p class=foo><div>a</div>bar</p>
```
