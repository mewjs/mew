import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-duplicate-attributes';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('no-duplicate-attributes', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view name="view"></view><input name="input"/>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:key="view"></view><input bindtap="ontap"/>'
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<view name="view" name="view1"></view>',
            errors: [
                {
                    message: 'Duplicate attribute \'name\'.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view bindtap="tap1" bind:tap="tap2"></view>',
            errors: [
                {
                    message: 'Duplicate attribute \'bind:tap\'.',
                    type: 'XAttribute'
                }
            ]
        }
    ]
});
