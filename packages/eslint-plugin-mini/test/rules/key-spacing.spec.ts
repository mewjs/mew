import { RuleTester } from 'eslint';
import rule from '../../src/rules/key-spacing';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('key-spacing', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `<view name="aaa">{{ 1==1 ? 2: {
                a: 2
            } }}</view>`
        },
        {
            filename: 'page.wxml',
            code: `<view name="aaa">{{ 1==1 ? 2: {
                a : 2
            } }}</view>`,
            options: [{ beforeColon: true }]
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<view name="aaa">{{ 1==1 ? 2: { a :2 } }}</view>',
            output: '<view name="aaa">{{ 1==1 ? 2: { a: 2 } }}</view>',
            errors: [
                'Extra space after key \'a\'.',
                'Missing space before value for key \'a\'.'
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view name="aaa">{{ 1==1 ? 2: { a:2 } }}</view>',
            options: [{ beforeColon: true }],
            output: '<view name="aaa">{{ 1==1 ? 2: { a : 2 } }}</view>',
            errors: [
                'Missing space after key \'a\'.',
                'Missing space before value for key \'a\'.'
            ]
        }
    ]
});
