import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-if';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('valid-if', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{expr}}"></view>'
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<view wx:if="expr"></view>',
            errors: [
                {
                    message: '\'wx:if\' value should be expression.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{}}"></view>',
            errors: [
                {
                    message: '\'wx:if\' value should be expression.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{abc}}" wx:else></view>',
            errors: [
                {
                    message: '\'wx:if\' and \'wx:else\' directives can\'t exist on the same element.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{abc}}" wx:elif="{{abc}}"></view>',
            errors: [
                {
                    message: '\'wx:if\' and \'wx:elif\' directives can\'t exist on the same element.',
                    type: 'XAttribute'
                }
            ]
        },
    ]
});
