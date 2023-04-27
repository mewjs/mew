import path from 'path';
import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-unknown-component-usage';


const filePath = path.resolve(
    __dirname,
    '../fixtures/miniprogram/pages/unknown-component-test/index.wxml'
);

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('no-unknown-component-usage', rule, {
    valid: [
        {
            filename: filePath,
            code: '<view><button>abc</button></view>'
        },
        {
            filename: filePath,
            code: '<custom-component>abc</custom-component>'
        },
        {
            filename: filePath,
            code: '<block>abc</block>'
        },
    ],
    invalid: [
        {
            filename: filePath,
            code: '<unknown>hello world</unknown>',
            errors: [
                {
                    message: 'Unknown tag \'unknown\'.',
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 9
                }
            ]
        }
    ]
});
