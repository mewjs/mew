import { RuleTester } from 'eslint';
import rule from '../../src/rules/space-infix-ops';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('space-infix-ops', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{5 > 3 && 2 <= 5}}"></view>',
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                abc ? 1 : 2
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                1 + 1
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                1 - 1
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                1 * 2
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                2 / 2
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                3 % 2
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                (1 && 1) || 0
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                5 & 3
            }}
            </view>`,
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view >
            {{
                abc?1 : 2
            }}
            </view>`,
            output: `<view >
            {{
                abc ? 1 : 2
            }}
            </view>`,
            errors: [
                {
                    message: 'Operator \'?\' must be spaced.',
                    line: 3,
                    column: 20,
                    endLine: 3,
                    endColumn: 21
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view >
            {{
                abc ? 1:2
            }}
            </view>`,
            output: `<view >
            {{
                abc ? 1 : 2
            }}
            </view>`,
            errors: [
                {
                    message: 'Operator \':\' must be spaced.',
                    line: 3,
                    column: 24,
                    endLine: 3,
                    endColumn: 25
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view >
            {{
                1+1+ 2 +3
            }}
            </view>`,
            output: `<view >
            {{
                1 + 1 + 2 + 3
            }}
            </view>`,
            errors: [
                {
                    message: 'Operator \'+\' must be spaced.',
                    line: 3,
                    column: 18,
                    endLine: 3,
                    endColumn: 19
                },
                {
                    message: 'Operator \'+\' must be spaced.',
                    line: 3,
                    column: 20,
                    endLine: 3,
                    endColumn: 21
                },
                {
                    message: 'Operator \'+\' must be spaced.',
                    line: 3,
                    column: 24,
                    endLine: 3,
                    endColumn: 25
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view >
            {{
                (2-1)*2
            }}
            </view>`,
            output: `<view >
            {{
                (2 - 1) * 2
            }}
            </view>`,
            errors: [
                {
                    message: 'Operator \'-\' must be spaced.',
                    line: 3,
                    column: 19,
                    endLine: 3,
                    endColumn: 20
                },
                {
                    message: 'Operator \'*\' must be spaced.',
                    line: 3,
                    column: 22,
                    endLine: 3,
                    endColumn: 23
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view >
            {{
                (4/2)%2
            }}
            </view>`,
            output: `<view >
            {{
                (4 / 2) % 2
            }}
            </view>`,
            errors: [
                {
                    message: 'Operator \'/\' must be spaced.',
                    line: 3,
                    column: 19,
                    endLine: 3,
                    endColumn: 20
                },
                {
                    message: 'Operator \'%\' must be spaced.',
                    line: 3,
                    column: 22,
                    endLine: 3,
                    endColumn: 23
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view >
            {{
                (1||0)&&1
            }}
            </view>`,
            output: `<view >
            {{
                (1 || 0) && 1
            }}
            </view>`,
            errors: [
                {
                    message: 'Operator \'||\' must be spaced.',
                    line: 3,
                    column: 19,
                    endLine: 3,
                    endColumn: 21
                },
                {
                    message: 'Operator \'&&\' must be spaced.',
                    line: 3,
                    column: 23,
                    endLine: 3,
                    endColumn: 25
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view >
            {{5&3*2-1+6/abc}}
            </view>`,
            output: `<view >
            {{5 & 3 * 2 - 1 + 6 / abc}}
            </view>`,
            errors: [
                {
                    message: 'Operator \'&\' must be spaced.',
                    line: 2,
                    column: 16,
                    endLine: 2,
                    endColumn: 17
                },
                {
                    message: 'Operator \'*\' must be spaced.',
                    line: 2,
                    column: 18,
                    endLine: 2,
                    endColumn: 19
                },
                {
                    message: 'Operator \'-\' must be spaced.',
                    line: 2,
                    column: 20,
                    endLine: 2,
                    endColumn: 21
                },
                {
                    message: 'Operator \'+\' must be spaced.',
                    line: 2,
                    column: 22,
                    endLine: 2,
                    endColumn: 23
                },
                {
                    message: 'Operator \'/\' must be spaced.',
                    line: 2,
                    column: 24,
                    endLine: 2,
                    endColumn: 25
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{5>3&&2<=5}}"></view>',
            output: '<view wx:if="{{5 > 3 && 2 <= 5}}"></view>',
            errors: [
                {
                    message: 'Operator \'>\' must be spaced.',
                    line: 1,
                    column: 17,
                    endLine: 1,
                    endColumn: 18
                },
                {
                    message: 'Operator \'&&\' must be spaced.',
                    line: 1,
                    column: 19,
                    endLine: 1,
                    endColumn: 21
                },
                {
                    message: 'Operator \'<=\' must be spaced.',
                    line: 1,
                    column: 22,
                    endLine: 1,
                    endColumn: 24
                },
            ]
        },
    ]
});
