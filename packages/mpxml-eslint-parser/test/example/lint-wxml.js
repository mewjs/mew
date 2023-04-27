/**
 * @file lint.ts
 */
/* eslint-disable import/unambiguous, @typescript-eslint/no-var-requires, import/no-commonjs */
const path = require('path');
const {Linter} = require('eslint');
const {readMpXmlFile, fixturesDir} = require('./util.js');

const PARSER_PATH = path.resolve(__dirname, '../../src/index.ts');

function lint() {
    const mpxmlFile = readMpXmlFile(`${fixturesDir}/expression.wxml`);
    const code = mpxmlFile.content;
    const config = {
        parser: PARSER_PATH,
        rules: {
            'test-rule': 'error',
            'no-useless-mustache': 'error'
        },
    };
    const linter = new Linter();
    // eslint-disable-next-line import/no-dynamic-require
    linter.defineParser(PARSER_PATH, require(PARSER_PATH));

    linter.defineRule('test-rule', {
        create(context) {
            return context.parserServices.defineTemplateBodyVisitor({
                'XElement[name=\'div\']': function (node) {
                    // console.log(node)
                    context.report({node, message: 'OK'});
                },
            });
        }
    });

    linter.defineRule('no-useless-mustache', require('./rules/no-useless-mustache'));


    const messages1 = linter.verify(code, config, mpxmlFile.filePath);
    console.log(messages1);
}

lint();

// const messages2 = linter.verify(linter.getSourceCode(), config, 'app.wxml')
// console.log(messages2);
