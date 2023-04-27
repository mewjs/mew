const { join } = require('path');
const { readdirSync } = require('fs');

exports.configs = ((dir, matcher) =>
    readdirSync(dir)
        .reduce(
            (configs, file) => {
                const name = file.replace(matcher, '');
                // .js file only
                if (name !== file) {
                    configs[name] = require(`${ dir }/${ name }`);
                }
                return configs;
            },
            Object.create(null)
        )
)(join(__dirname, 'config'), /\.js$/);
