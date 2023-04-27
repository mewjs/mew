import { RuleTester } from 'eslint';
import rule from '../../src/rules/array-bracket-spacing';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('array-bracket-spacing', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                [a, b]
            }}
            </view>`
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                [a, b]
            }}
            </view>`,
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                [ a, b ]
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
                [ a, b ]
            }}
            </view>`,
            output: `<view>
            {{
                [a, b]
            }}
            </view>`,
            errors: [
                {
                    message: 'There should be no space after \'[\'.',
                    line: 3
                },
                {
                    message: 'There should be no space before \']\'.',
                    line: 3
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                [a, b]
            }}
            </view>`,
            output: `<view>
            {{
                [ a, b ]
            }}
            </view>`,
            options: ['always'],
            errors: [
                {
                    message: 'A space is required after \'[\'.',
                    line: 3
                },
                {
                    message: 'A space is required before \']\'.',
                    line: 3
                }
            ]
        },
    ]
});
