import { RuleTester } from 'eslint';
import rule from '../../src/rules/space-in-parens';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('space-in-parens', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                fn(arg)
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                fn( arg )
            }}
            </view>`,
            options: ['always']
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                fn( arg )
            }}
            </view>`,
            output: `<view>
            {{
                fn(arg)
            }}
            </view>`,
            errors: [
                {
                    message: 'There should be no space after this paren.',
                    line: 3,
                    column: 20,
                    endLine: 3,
                    endColumn: 21
                },
                {
                    message: 'There should be no space before this paren.',
                    line: 3,
                    column: 24,
                    endLine: 3,
                    endColumn: 25
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                fn(arg)
            }}
            </view>`,
            output: `<view>
            {{
                fn( arg )
            }}
            </view>`,
            options: ['always'],
            errors: [
                {
                    message: 'There must be a space after this paren.',
                    line: 3,
                    column: 19,
                    endLine: 3,
                    endColumn: 20
                },
                {
                    message: 'There must be a space before this paren.',
                    line: 3,
                    column: 23,
                    endLine: 3,
                    endColumn: 24
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                ( 1 + 2 ) * 3
            }}
            </view>`,
            output: `<view>
            {{
                (1 + 2) * 3
            }}
            </view>`,
            errors: [
                {
                    message: 'There should be no space after this paren.',
                    line: 3,
                    column: 18,
                    endLine: 3,
                    endColumn: 19
                },
                {
                    message: 'There should be no space before this paren.',
                    line: 3,
                    column: 24,
                    endLine: 3,
                    endColumn: 25
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                (1 + 2) * 3
            }}
            </view>`,
            output: `<view>
            {{
                ( 1 + 2 ) * 3
            }}
            </view>`,
            options: ['always'],
            errors: [
                {
                    message: 'There must be a space after this paren.',
                    line: 3,
                    column: 17,
                    endLine: 3,
                    endColumn: 18
                },
                {
                    message: 'There must be a space before this paren.',
                    line: 3,
                    column: 23,
                    endLine: 3,
                    endColumn: 24
                }
            ]
        }
    ]
});
