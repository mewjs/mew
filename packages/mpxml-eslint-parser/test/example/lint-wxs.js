/**
 * @file lint.ts
 */
/* eslint-disable import/unambiguous, @typescript-eslint/no-var-requires, import/no-commonjs */
const path = require('path');
const {Linter} = require('eslint');
const {readMpXmlFile, fixturesDir} = require('./util.js');

const PARSER_PATH = path.resolve(__dirname, '../../src/index.ts');

function lint() {
    const mpxmlFile = readMpXmlFile(`${fixturesDir}/page.wxs`);
    const code = mpxmlFile.content;
    const config = {
        parser: PARSER_PATH,
        parserOptions: {
            ecmaVersion: 2018,
            sourceType: 'module'
        },
        rules: {
            'no-var': 'error'
        },
    };
    const linter = new Linter();
    // eslint-disable-next-line import/no-dynamic-require
    linter.defineParser(PARSER_PATH, require(PARSER_PATH));

    linter.defineRule('no-var', require('./rules/no-var'));


    const messages1 = linter.verify(code, config, mpxmlFile.filePath);
    console.log(messages1);
}

lint();

// const messages2 = linter.verify(linter.getSourceCode(), config, 'app.wxml')
// console.log(messages2);
