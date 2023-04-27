import { RuleTester } from 'eslint';
import rule from '../../src/rules/arrow-spacing';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('arrow-spacing', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view>
    {{
        (aa) => 1 + 2
    }}
</view>`
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                aa => 1 + 2
            }}
        </view>`
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                (aa, bb) => 1 + 2
            }}
        </view>`
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                aa   =>   1 + 2
            }}
        </view>`
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                aa=> {
                    1+2
                    bb =>cc
                }
            }}
        </view>`,
            output: `<view>
            {{
                aa => {
                    1+2
                    bb => cc
                }
            }}
        </view>`,
            errors: [
                {
                    message: 'Missing space before =>.',
                    line: 3,
                    column: 17,
                    endLine: 3,
                    endColumn: 19
                },
                {
                    message: 'Missing space after =>.',
                    line: 5,
                    column: 26,
                    endLine: 5,
                    endColumn: 28
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                a=>1 + 2
            }}
        </view>`,
            output: `<view>
            {{
                a => 1 + 2
            }}
        </view>`,
            errors: [
                {
                    message: 'Missing space before =>.',
                    line: 3,
                    column: 17,
                    endLine: 3,
                    endColumn: 18
                },
                {
                    message: 'Missing space after =>.',
                    line: 3,
                    column: 20,
                    endLine: 3,
                    endColumn: 21
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                (aa, bb)=>{
                    1 + 2
                    2 + 3
                }
            }}
        </view>`,
            output: `<view>
            {{
                (aa, bb) => {
                    1 + 2
                    2 + 3
                }
            }}
        </view>`,
            errors: [
                {
                    message: 'Missing space before =>.',
                    line: 3,
                    column: 24,
                    endLine: 3,
                    endColumn: 25
                },
                {
                    message: 'Missing space after =>.',
                    line: 3,
                    column: 27,
                    endLine: 3,
                    endColumn: 28
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view>
            {{
                (aa)=>1 + 2
            }}
        </view>`,
            output: `<view>
            {{
                (aa) => 1 + 2
            }}
        </view>`,
            errors: [
                {
                    message: 'Missing space before =>.',
                    line: 3,
                    column: 20,
                    endLine: 3,
                    endColumn: 21
                },
                {
                    message: 'Missing space after =>.',
                    line: 3,
                    column: 23,
                    endLine: 3,
                    endColumn: 24
                }
            ]
        }
    ]
});
