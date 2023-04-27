module.exports = {
    ...require('../../jest.config'),
    modulePathIgnorePatterns: ['node_modules/(?!(strip-json-comments|lodash-es|@mewjs/.*)/)', 'dist'],
    transformIgnorePatterns: [
        'node_modules/(?!(strip-json-comments|lodash-es|node-fetch|fetch-blob|formdata-polyfill|data-uri-to-buffer)/)'
    ]
};
