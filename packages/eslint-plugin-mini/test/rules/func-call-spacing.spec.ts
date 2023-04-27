import { RuleTester } from 'eslint';
import rule from '../../src/rules/func-call-spacing';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('func-call-spacing', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view class="{{
                foo()
            }}" />`
        },
        {
            filename: 'page.wxml',
            code: `<view class="{{
                foo ()
            }}" />`,
            options: ['always']
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view class="{{
                foo ()
            }}" />`,
            output: `<view class="{{
                foo()
            }}" />`,
            errors: [
                {
                    message: 'Unexpected whitespace between function name and paren.',
                    line: 2
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view class="{{
                foo()
            }}" />`,
            output: `<view class="{{
                foo ()
            }}" />`,
            options: ['always'],
            errors: [
                {
                    message: 'Missing space between function name and paren.',
                    line: 2
                }
            ]
        },
    ]
});
