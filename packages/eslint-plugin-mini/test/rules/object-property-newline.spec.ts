import { RuleTester } from 'eslint';
import rule from '../../src/rules/object-property-newline';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('object-property-newline', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {a: 1,
                    b: [2, {a: 3,
                    b: 4}]}
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {a: 1,
                    b: 2}
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {a: 1, b: [2, {a: 3, b: 4}]}
            }}
            </view>`,
            options: [{ allowAllPropertiesOnSameLine: true }],
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {a: 1, b: [2, {a: 3, b: 4}]}
            }}
            </view>`,
            output: `<view>
            {{
                {a: 1,
b: [2, {a: 3,
b: 4}]}
            }}
            </view>`,
            errors: [
                {
                    message: 'Object properties must go on a new line.',
                    line: 3,
                    column: 24,
                    endLine: 3,
                    endColumn: 25
                },
                {
                    message: 'Object properties must go on a new line.',
                    line: 3,
                    column: 38,
                    endLine: 3,
                    endColumn: 39
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {a: 1, b: 2,
                    c: 3}
            }}
            </view>`,
            output: `<view>
            {{
                {a: 1,
b: 2,
                    c: 3}
            }}
            </view>`,
            options: [{ allowAllPropertiesOnSameLine: true }],
            errors: [
                {
                    message: 'Object properties must go on a new line if they aren\'t all on the same line.',
                }
            ]
        }
    ]
});
