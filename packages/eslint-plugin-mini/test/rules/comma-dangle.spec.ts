import { RuleTester } from 'eslint';
import rule from '../../src/rules/comma-dangle';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('comma-dangle', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                () => fn([a, b])
            }}
            </view>`
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                ( a ) => fn()
            }}
            </view>`,
            options: [{ functions: 'never' }]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                () => fn([a, b,])
            }}
            </view>`,
            options: [{ arrays: 'ignore' }]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                [a, b,] = c
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
                [a, b, ] = c
            }}
            </view>`,
            output: `<view>
            {{
                [a, b ] = c
            }}
            </view>`,
            errors: [
                {
                    message: 'Unexpected trailing comma.',
                    line: 3
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {a, b, } = c
            }}
            </view>`,
            output: `<view>
            {{
                {a, b } = c
            }}
            </view>`,
            errors: [
                {
                    message: 'Unexpected trailing comma.',
                    line: 3
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                (a, b,) => fn()
            }}
            </view>`,
            output: `<view>
            {{
                (a, b) => fn()
            }}
            </view>`,
            errors: [
                {
                    message: 'Unexpected trailing comma.',
                    line: 3
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                fn([
                    a,
                    b
                ])
            }}
            </view>`,
            options: ['always-multiline'],
            output: `<view>
            {{
                fn([
                    a,
                    b,
                ])
            }}
            </view>`,
            errors: [
                {
                    message: 'Missing trailing comma.',
                    line: 5
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                ([a, b,]) => fn()
            }}
            </view>`,
            output: `<view>
            {{
                ([a, b]) => fn()
            }}
            </view>`,
            errors: [
                {
                    message: 'Unexpected trailing comma.'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                [[a,b][1]] = c
            }}
            </view>`,
            output: `<view>
            {{
                [[a,b,][1],] = c
            }}
            </view>`,
            options: ['always'],
            errors: [
                {
                    message: 'Missing trailing comma.'
                },
                {
                    message: 'Missing trailing comma.'
                }
            ]
        }
    ]
});
