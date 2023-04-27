import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-useless-mustache';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('no-useless-mustache', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{/* aaa */}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{[1,2,3]}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view>{{abc}}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view>{{[1,2,3]}}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view>{{/* abc */}}</view>',
            options: [{ ignoreIncludesComment: true }]
        },
        {
            filename: 'page.wxml',
            code: '<view>{{"\\n"}}</view>',
            options: [{ ignoreStringEscape: true }]
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{      }}"></view>',
            output: '<view wx:if=""></view>',
            errors: [
                {
                    message: 'Unexpected empty mustache interpolation.',
                    type: 'XExpressionContainer'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view wx:if="{{}}">{{

            }}</view>`,
            output: '<view wx:if=""></view>',
            errors: [
                {
                    message: 'Unexpected empty mustache interpolation.',
                    type: 'XExpressionContainer'
                },
                {
                    message: 'Unexpected empty mustache interpolation.',
                    type: 'XExpressionContainer'
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{\'abc\'}}"></view>',
            output: '<view wx:if="abc"></view>',
            errors: [
                {
                    message: 'Unexpected mustache interpolation with a string literal value.',
                    type: 'XExpressionContainer'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>{{"abc"}}</view>',
            output: '<view>abc</view>',
            errors: [
                {
                    message: 'Unexpected mustache interpolation with a string literal value.',
                    type: 'XExpressionContainer'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>{{"\\n"}}</view>',
            output: '<view>{{"\\n"}}</view>',
            errors: [
                {
                    message: 'Unexpected mustache interpolation with a string literal value.',
                    type: 'XExpressionContainer'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>{{ \'abc\' }}</view>',
            output: '<view>abc</view>',
            errors: [
                {
                    message: 'Unexpected mustache interpolation with a string literal value.',
                    type: 'XExpressionContainer'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>{{`abc`}}</view>',
            output: '<view>{{`abc`}}</view>',
            errors: [
                {
                    message: 'Unexpected mustache interpolation with a string literal value.',
                    type: 'XExpressionContainer'
                }
            ]
        }
    ]
});
