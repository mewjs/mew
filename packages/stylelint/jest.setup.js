'use strict';

const getTestRule = require('jest-preset-stylelint/getTestRule');

global.testMewRule = getTestRule({
    // customSyntax: require.resolve('./src/test/stylus'),
    plugins: [require.resolve('./src')]
});

