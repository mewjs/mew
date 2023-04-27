import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-parsing-error';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('no-parsing-error', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{abc}}"  wx:for-item="i"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<wxs module="abc">var a = 1;</wxs>'
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<view></view',
            errors: [
                {
                    message: 'Parsing error: eof-in-tag.'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<div name=\'\nabc\' wx:if=\'{{\nabc}}\'></div>',
            errors: [
                {
                    message: 'Parsing error: unexpected-line-break.'
                },
                {
                    message: 'Parsing error: unexpected-line-break.'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<div name=abc></div>',
            errors: [
                {
                    message: 'Parsing error: attribute-value-invalid-unquoted.'
                }
            ]
        }
    ]
});
