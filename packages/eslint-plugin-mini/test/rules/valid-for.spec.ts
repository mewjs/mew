import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-for';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('valid-for', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{expr}}" wx:key="item"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{expr}}" wx:for="{{expr}}" wx:for-index="idx"></view>',
            options: [{ withKey: false }],
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{[1,2,3]}}" wx:for-index="idx" wx:key="item" wx:for-item="item"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{expr}}" wx:for-index="idx" wx:key="item"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{expr}}" wx:for-index="idx"></view>',
            options: [{ withKey: false }],
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{[1,2,3]}}" wx:key="item" wx:for-item="item" wx:for-index="idx"></view>'
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<view wx:for="abc"></view>',
            errors: [
                {
                    message: '\'wx:for\' should provide \'wx:key\' to improve performance.',
                    type: 'XAttribute'
                },
                {
                    message: '\'wx:for\' value should be expression.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{}}"></view>',
            options: [{ withKey: false }],
            errors: [
                {
                    message: '\'wx:for\' value should be expression.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-item="abc"></view>',
            errors: [
                {
                    message: '\'wx:for-item\' should has \'wx:for\'.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:key="abc"></view>',
            errors: [
                {
                    message: '\'wx:key\' should has \'wx:for\'.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{1}}" wx:key=""></view>',
            errors: [
                {
                    message: '\'wx:key\' value should be literal text.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{1}}" wx:key="{{123}}"></view>',
            errors: [
                {
                    message: '\'wx:key\' value should be literal text.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{1}}" wx:for-item=""></view>',
            options: [{ withKey: false }],
            errors: [
                {
                    message: '\'wx:for-item\' value should be literal text.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{1}}" wx:for-item="{{123}}"></view>',
            options: [{ withKey: false }],
            errors: [
                {
                    message: '\'wx:for-item\' value should be literal text.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-index="abc"></view>',
            options: [{ withKey: false }],
            errors: [
                {
                    message: '\'wx:for-index\' should has \'wx:for\'.',
                    type: 'XAttribute'
                }
            ]
        },
        // for-items
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="abc"></view>',
            errors: [
                {
                    message: '\'wx:for-items\' should provide \'wx:key\' to improve performance.',
                    type: 'XAttribute'
                },
                {
                    message: '\'wx:for-items\' value should be expression.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{}}"></view>',
            options: [{ withKey: false }],
            errors: [
                {
                    message: '\'wx:for-items\' value should be expression.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{1}}" wx:key=""></view>',
            errors: [
                {
                    message: '\'wx:key\' value should be literal text.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{1}}" wx:key="{{123}}"></view>',
            errors: [
                {
                    message: '\'wx:key\' value should be literal text.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{1}}" wx:for-item=""></view>',
            options: [{ withKey: false }],
            errors: [
                {
                    message: '\'wx:for-item\' value should be literal text.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for-items="{{1}}" wx:for-item="{{123}}"></view>',
            options: [{ withKey: false }],
            errors: [
                {
                    message: '\'wx:for-item\' value should be literal text.',
                    type: 'XAttribute'
                }
            ]
        }
    ]
});
