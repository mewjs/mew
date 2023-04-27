import { RuleTester } from 'eslint';
import rule from '../../src/rules/space-unary-ops';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('space-unary-ops', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                -1
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                !1
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                ! 1
            }}
            </view>`,
            options: [{ nonwords: true }]
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                - 1
            }}
            </view>`,
            output: `<view>
            {{
                -1
            }}
            </view>`,
            errors: [
                {
                    message: 'Unexpected space after unary operator \'-\'.',
                    line: 3,
                    column: 17,
                    endLine: 3,
                    endColumn: 20
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                !(1 + 1)
            }}
            </view>`,
            output: `<view>
            {{
                ! (1 + 1)
            }}
            </view>`,
            options: [{ nonwords: true }],
            errors: [
                {
                    message: 'Unary operator \'!\' must be followed by whitespace.',
                    line: 3,
                    column: 17,
                    endLine: 3,
                    endColumn: 25
                }
            ]
        }
    ]
});
