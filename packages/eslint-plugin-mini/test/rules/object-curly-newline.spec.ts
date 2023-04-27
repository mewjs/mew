import { RuleTester } from 'eslint';
import rule from '../../src/rules/object-curly-newline';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('object-curly-newline', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {x: 2}
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {x: 2}
            }}
            </view>`,
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {
                    x: 2
                }
            }}
            </view>`,
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {
                    x: 2
                }
            }}
            </view>`,
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                { x: 2 }
            }}
            </view>`,
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {x: 2
                }
            }}
            </view>`,
            output: `<view>
            {{
                {x: 2}
            }}
            </view>`,
            errors: [
                {
                    message: 'Unexpected line break before this closing brace.',
                    line: 4,
                    column: 17
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {
                    x: 2}
            }}
            </view>`,
            output: `<view>
            {{
                {x: 2}
            }}
            </view>`,
            errors: [
                {
                    message: 'Unexpected line break after this opening brace.',
                    line: 3,
                    column: 17
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {x: 2}
            }}
            </view>`,
            output: `<view>
            {{
                {
x: 2
}
            }}
            </view>`,
            options: ['always'],
            errors: [
                'Expected a line break after this opening brace.',
                'Expected a line break before this closing brace.'
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                {
                    x
                }
            }}
            </view>`,
            output: `<view>
            {{
                {x}
            }}
            </view>`,
            options: ['never'],
            errors: [
                'Unexpected line break after this opening brace.',
                'Unexpected line break before this closing brace.'
            ]
        }
    ]
});
