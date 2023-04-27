import { RuleTester } from 'eslint';
import rule from '../../src/rules/dot-notation';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('dot-notation', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: '<view class="{{foo.bar}}" />'
        },
        {
            filename: 'page.wxml',
            code: '<view class="{{foo[\'bar\']" />',
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `<view class="{{
                foo['bar']
            }}" />`,
            output: `<view class="{{
                foo.bar
            }}" />`,
            errors: [
                {
                    message: '["bar"] is better written in dot notation.'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view class="{{
                [foo['bar']] = a
            }}" />`,
            output: `<view class="{{
                [foo.bar] = a
            }}" />`,
            errors: [
                {
                    message: '["bar"] is better written in dot notation.'
                }
            ]
        },
    ]
});
