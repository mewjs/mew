import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-bind';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('valid-bind', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view bindtap="tap"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view bind:tap="tap"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view onTap="tap"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view catchtap="tap"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view capture-bindtap="tap"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view capture-catchtap="tap"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view bindtap="tap"></view><view bindtap="{{tap}}"></view>',
            options: [{ allowExpression: true }]
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<view bindtap="{{tap}}"></view>',
            errors: [
                {
                    message: '\'bindtap\' value should be literal.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view bind:tap="{{tap}}"></view>',
            errors: [
                {
                    message: '\'bind:tap\' value should be literal.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view onTap=""></view>',
            errors: [
                {
                    message: '\'onTap\' value should be literal.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view catchtap="{{tap}}"></view>',
            errors: [
                {
                    message: '\'catchtap\' value should be literal.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view capture-bind:tap="{{tap}}"></view>',
            errors: [
                {
                    message: '\'capture-bind:tap\' value should be literal.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view capture-catch:tap="{{tap}}"></view>',
            errors: [
                {
                    message: '\'capture-catch:tap\' value should be literal.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view bindtap="{{}}"></view>',
            options: [{ allowExpression: true }],
            errors: [
                {
                    message: '\'bindtap\' value should be expression or literal.',
                    type: 'XAttribute'
                }
            ]
        }
    ]
});
