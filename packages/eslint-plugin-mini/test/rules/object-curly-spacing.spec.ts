import { RuleTester } from 'eslint';
import rule from '../../src/rules/object-curly-spacing';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('object-curly-spacing', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view name="aaa">{{ 1==1 ? 2: {
                a: 2
            } }}</view>`
        },
        {
            filename: 'page.wxml',
            code: `<view name = "aaa" >
            {{
                {x} = y

            }}
            </view>`
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<view name="aaa">{{ 1==1 ? 2: { a: 2 } }}</view>',
            output: '<view name="aaa">{{ 1==1 ? 2: {a: 2} }}</view>',
            errors: [
                {
                    message: 'There should be no space after \'{\'.',
                    line: 1,
                    column: 32,
                    endLine: 1,
                    endColumn: 33
                },
                {
                    message: 'There should be no space before \'}\'.',
                    line: 1,
                    column: 37,
                    endLine: 1,
                    endColumn: 38
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view name = "aaa" >
            {{
                { x} = {x: 1, y: 2 }
            }}
            </view>`,
            output: `<view name = "aaa" >
            {{
                {x} = {x: 1, y: 2}
            }}
            </view>`,
            errors: [
                {
                    message: 'There should be no space after \'{\'.',
                    line: 3,
                    column: 18,
                    endLine: 3,
                    endColumn: 19
                },
                {
                    message: 'There should be no space before \'}\'.',
                    line: 3,
                    column: 35,
                    endLine: 3,
                    endColumn: 36
                }
            ]
        }
    ]
});
