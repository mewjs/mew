import { RuleTester } from 'eslint';
import rule from '../../src/rules/dot-location';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('dot-location', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view wx:attr="{{foo.
                bar}}" />`
        },
        {
            filename: 'page.wxml',
            code: `<view wx:attr="{{foo
                .bar}}" />`,
            options: ['property']
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view wx:attr="{{
                a = foo
                    .bar
            }}" />`,
            output: `<view wx:attr="{{
                a = foo.
                    bar
            }}" />`,
            errors: [
                {
                    message: 'Expected dot to be on same line as object.',
                    line: 3
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view wx:attr="{{
                a = foo.
                    bar
            }}" />`,
            output: `<view wx:attr="{{
                a = foo
                    .bar
            }}" />`,
            options: ['property'],
            errors: [
                {
                    message: 'Expected dot to be on same line as property.',
                    line: 2
                }
            ]
        }
    ]
});
