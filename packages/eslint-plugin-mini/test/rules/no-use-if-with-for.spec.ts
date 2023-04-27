import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-use-if-with-for';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('no-use-if-with-for', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: '<view><view wx:for="[1, 2, 3]" wx:if="{{index % 2 === 0}}"></view></view>',
        },
        {
            filename: 'page.wxml',
            code: '<view></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view><view wx:for="[1, 2, 3]"></view></view>',
        },
        {
            filename: 'page.wxml',
            code: '<view><view wx:if="{{x}}"></view></view>',
        },
        {
            filename: 'page.wxml',
            code: '<view><view wx:for="[1, 2, 3]" wx:if="{{index % 2 === 0}}"></view></view>',
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:if="{{item === 2}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:if="{{item === 2 && index % 2 === 0}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:for-item="aaa" wx:if="{{aaa === 2}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:for-index="aaa" wx:if="{{aaa === 2}}"></view>',
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:for-item="aaa" wx:if="{{index === 2}}"></view>',
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:for-index="aaa" wx:if="{{item === 2}}"></view>',
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:for-item="aa" wx:for-item="bb" wx:if="{{bb === 2}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:for-index="aa" wx:for-index="bb" wx:if="{{bb === 2}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:for-index="aa" wx:for-index="" wx:if="{{index === 2}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:for-item="aa" wx:for-item="" wx:if="{{item === 2}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{aa}}"><view wx:for="[1, 2, 3]"></view></view>'
        },
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<view><view wx:for="[1, 2, 3]" wx:if="{{}}"></view></view>',
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    line: 1
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:if="item"></view>',
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    line: 1
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="[1, 2, 3]" wx:if="{{}}"></view>',
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    line: 1
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view><view wx:for="[1, 2, 3]" wx:if="{{x}}"></view></view>',
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    line: 1
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view><view wx:for="[1, 2, 3]" wx:for-index="aaa" wx:if="{{index}}"></view></view>',
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    line: 1
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view><view wx:for="[1, 2, 3]" wx:for-item="aaa" wx:if="{{item}}"></view></view>',
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    line: 1
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view><view wx:for="[1, 2, 3]"
            wx:for-index="aaa"
            wx:for-item="bbb"
            wx:if="{{index && item}}">
            </view></view>`,
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    line: 4
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view><view wx:for="[1, 2, 3]"
            wx:for-index="aaa"
            wx:for-index="bbb"
            wx:if="{{index && aaa}}">
            </view></view>`,
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    line: 4
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view><view wx:for="[1, 2, 3]"
            wx:for-item="aaa"
            wx:for-item="bbb"
            wx:if="{{item && aaa}}">
            </view></view>`,
            errors: [
                {
                    message: 'This \'wx:if\' should be moved to the wrapper element.',
                    line: 4
                }
            ]
        },
    ]
});
