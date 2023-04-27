import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-elif';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('valid-elif', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{1}}"></view> <view wx:elif="{{expr}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{1}}"></view>  \n\n <view wx:elif="{{expr}}"></view>'
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{1}}"></view><view wx:elif="expr"></view>',
            errors: [
                {
                    message: '\'wx:elif\' value should be expression.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{1}}"></view><view wx:elif="{{}}"></view>',
            errors: [
                {
                    message: '\'wx:elif\' value should be expression.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{1}}"></view>123<view wx:elif="{{1}}"></view>',
            errors: [
                {
                    message: '\'wx:elif\' should follow with \'wx:if\' or \'wx:elif\'.',
                    type: 'XAttribute'
                }
            ]
        }
    ]
});
