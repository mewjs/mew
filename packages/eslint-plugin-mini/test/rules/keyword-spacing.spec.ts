import { RuleTester } from 'eslint';
import rule from '../../src/rules/keyword-spacing';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('keyword-spacing', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view name="aaa">{{ () => {
                    if (1===1) {
                        return 2
                    } else if (1===2) {
                        return 3
                    }
                }
            }}</view>`
        },
        {
            filename: 'page.wxml',
            code: `<view name="aaa">{{ () => {
                    if(1===1) {
                        return 2
                    }else if(1===2) {
                        return 3
                    }
                }
            }}</view>`,
            options: [{ before: false, after: false }]
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view name="aaa">{{ () => {
                    if(1===1) {
                        return(2)
                    }else if(1===2) {
                        return 3
                    }
                }
            }}</view>`,
            output: `<view name="aaa">{{ () => {
                    if (1===1) {
                        return (2)
                    } else if (1===2) {
                        return 3
                    }
                }
            }}</view>`,
            errors: [
                {
                    message: 'Expected space(s) after "if".',
                    line: 2
                },
                {
                    message: 'Expected space(s) after "return".',
                    line: 3
                },
                {
                    message: 'Expected space(s) before "else".',
                    line: 4
                },
                {
                    message: 'Expected space(s) after "if".',
                    line: 4
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view name="aaa">{{ () => {
                    if (1===1) {
                        return 2
                    } else if (1===2) {
                        return 3
                    }
                }
            }}</view>`,
            output: `<view name="aaa">{{ () => {
                    if(1===1) {
                        return 2
                    }else if(1===2) {
                        return 3
                    }
                }
            }}</view>`,
            options: [{ before: false, after: false }],
            errors: [
                {
                    message: 'Unexpected space(s) after "if".',
                    line: 2
                },
                {
                    message: 'Unexpected space(s) before "else".',
                    line: 4
                },
                {
                    message: 'Unexpected space(s) after "if".',
                    line: 4
                }
            ]
        }
    ]
});
