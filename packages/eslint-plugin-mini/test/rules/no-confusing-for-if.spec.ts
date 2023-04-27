import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-confusing-for-if';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('no-confusing-for-if', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{abc}}" wx:if="{{def}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{[1,2,3]]}}" wx:key="item" wx:if="{{def}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{abc}}" wx:if="{{def}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{[1,2,3]]}}" wx:key="item" wx:if="{{def}}"></view>'
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{abc}}" wx:if="{{item}}"></view>',
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{abc}}" wx:for-item="d" wx:if="{{d}}"></view>',
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{abc}}" wx:if="{{item}}"></view>',
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{abc}}" wx:for-item="d" wx:if="{{d}}"></view>',
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    type: 'XAttribute'
                }
            ]
        }
    ]
});
