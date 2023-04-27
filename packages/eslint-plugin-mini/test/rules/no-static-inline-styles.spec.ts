import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-static-inline-styles';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('no-static-inline-styles', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view class="className"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view style="font-size:{{fontSize}}"></view>',
            options: [{ allowBinding: true }]
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<view style="font-size:10rpx"></view>',
            errors: [
                {
                    message: '`style` attributes are forbidden.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view style="font-size:10rpx"></view>',
            options: [{ allowBinding: true }],
            errors: [
                {
                    message: 'Static inline `style` are forbidden.',
                    type: 'XAttribute'
                }
            ]
        }
    ]
});
