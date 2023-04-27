import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-sparse-arrays';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('no-sparse-arrays', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                [1, 2, 3]
            }}
            </view>`
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                [1, 2][0]
            }}
            </view>`,
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                [, 2, 3]
            }}
            </view>`,
            errors: [
                {
                    message: 'Unexpected comma in middle of array.',
                    line: 3,
                    column: 17,
                    endLine: 3,
                    endColumn: 25
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                [[, , 1]]
            }}
            </view>`,
            errors: [
                {
                    message: 'Unexpected comma in middle of array.',
                    line: 3,
                    column: 18,
                    endLine: 3,
                    endColumn: 25
                }
            ]
        }
    ]
});
