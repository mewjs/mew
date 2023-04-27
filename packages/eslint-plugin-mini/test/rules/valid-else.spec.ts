import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-else';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('valid-else', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{expr}}">\n \r\t\b</view><view wx:else></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{expr}}"></view><view wx:else></view>'
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{expr}}"></view><view wx:else="expr"></view>',
            errors: [
                {
                    message: '\'wx:else\' should have no value.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{expr}}"></view><view wx:else="{{}}"></view>',
            errors: [
                {
                    message: '\'wx:else\' should have no value.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{1}}"></view>abc<view wx:else></view>',
            errors: [
                {
                    message: '\'wx:else\' should follow with \'wx:if\' or \'wx:elif\'.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{1}}"><view wx:else></view></view>',
            errors: [
                {
                    message: '\'wx:else\' should follow with \'wx:if\' or \'wx:elif\'.',
                    type: 'XAttribute'
                }
            ]
        }
    ]
});
