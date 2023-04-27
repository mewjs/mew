# Manis

For build system plugins that need to fetch relative config files (like .mewrc).

## Install

```sh
npm install @mewjs/manis
```

## Usage

### Using `strip-json-comments`

```typescript
import Manis from '@mewjs/manis';
import stripJSONComments from 'strip-json-comments';

const loader = (text: string) => JSON.parse(stripJSONComments(text));

const manis = new Manis({
    files: [
        {
            // just for example, it should be loaded as yaml in fact.
            name: '.eslintrc',
            get(json: JSONObject) {
                return {eslint: json};
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

### Loading `.yml` with `js-yaml`

```javascript
var yaml = require('js-yaml');

var Manis = require('manis');

var loader = function (text) {
    return yaml.load(text);
};

var manis = new Manis('.travis.yml', {loader: loader});

var configs = manis.from('path/to/file.js');

// do something cool with configs
```

### With defaults

```typescript
import Manis from '@mewjs/manis';

const manis = new Manis({
    files: [
        '.mewrc',
        {
            name: 'package.json',
            get: 'mew'
        }
    ]
});

manis.setDefault('default/path/to/config/mew.json');

const configs = manis.from('path/to/file.js');

// do something cool with configs
```

### User config

```typescript
import Manis from '@mewjs/manis';

const manis = new Manis({
    files: [
        '.mewrc',
        {
            name: 'package.json',
            get: 'mew'
        }
    ]
});

manis.setDefault('default/path/to/config/mew.json');

// will find `~/.mewrc`
manis.setUserConfig();

const configs = manis.from('path/to/file.js');

// do something cool with configs
```

### Within a gulp plugin

```javascript
var Manis = require('manis');
var map = require('map-stream');

module.exports = function MyGulpPlugin(options) {
    var manis = new Manis('.mewrc', options);

    return map(function (file, cb) {

        // get the configs for this file specifically
        var configs = manis.from(file.path);

        // do something cool

        // send the file along
        cb(null, file);

    });
};
```


## API

### new Manis(string fileName[, Object options])

### new Manis(string[] fileNames[, Object options])

### new Manis(Object[] finderOptions[, Object options])

### new Manis(Object options)

### void Manis#setDefault(Object defaultValue)

### void Manis#setDefault(string filePath[, Object finderOptions])

### void Manis#setUserConfig()

### void Manis#setUserConfig(Object userConfig)

### void Manis#setUserConfig(string userConfigPathOrName[, Object finderOptions])

### Object Manis#from(string path)

### Manis.yaml

Alias for `js-yaml` module.

### Object Manis.loader

The default loader, parse JSON or YAML content with `js-yaml`.

### Object Manis.from(string path)

#### options

- `files`, Array or string, items could be string or Object.

- `loader`, Function，parser for config content.

- `lookup`, Boolean, Find all up-level config files. default is true.

- `merge`, Boolean, Merge all config objects. default is true.

- `cache`, Boolean, Cache config files. default is true.

- `rootName`, String, The name of flag when `enableRoot` set to true. default is 'root'.

- `enableRoot`, Boolean, Enable the root flag to stop lookup in up-level directory. default is false.

- `stopper`, Function, the predicate for stopping search. default is null.

#### finderOptions

- `name`, string, the file name to be searched.

- `loader`, Function, the same as options.loader above;

- `stopper`, Function, the predicate for stopping search.

- `get`, string or Function, the field name to retrieve from config object.

- `cache`, Boolean, Cache config files. default is true.
