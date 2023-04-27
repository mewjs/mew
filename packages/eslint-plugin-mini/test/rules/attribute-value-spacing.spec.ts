import { RuleTester } from 'eslint';
import rule from '../../src/rules/attribute-value-spacing';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('attribute-value-spacing', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: '<view name=""></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="     "></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="   abc    "></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="aaa   abc    bbb"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="{{abc}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="{{    abc   }}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="aaa{{abc}}bbb"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="aaa   {{abc}}     bbb"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="{{abc}}{{abc}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="{{/*   */}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="abc">   {{aaa}}   </view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="abc">"   {{aaa}}   "</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="\t\t\tabc\t\t\t"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view name="aaa\t\t\t{{abc}}\t\t\tbbb"></view>'
        },
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<view name="    {{abc}}    "></view>',
            output: '<view name="{{abc}}"></view>',
            errors: [
                {
                    message: 'Unexpected spaces found',
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 17
                },
                {
                    message: 'Unexpected spaces found',
                    line: 1,
                    column: 24,
                    endLine: 1,
                    endColumn: 28
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view name="  aaa  {{abc}}  bbb  "></view>',
            output: '<view name="aaa  {{abc}}  bbb"></view>',
            errors: [
                {
                    message: 'Unexpected spaces found',
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    message: 'Unexpected spaces found',
                    line: 1,
                    column: 32,
                    endLine: 1,
                    endColumn: 34
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view name="  {{abc}}"></view>',
            output: '<view name="{{abc}}"></view>',
            errors: [
                {
                    message: 'Unexpected spaces found',
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 15
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view name="{{abc}}  "></view>',
            output: '<view name="{{abc}}"></view>',
            errors: [
                {
                    message: 'Unexpected spaces found',
                    line: 1,
                    column: 20,
                    endLine: 1,
                    endColumn: 22
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view name="{{abc}}  "></view>',
            output: '<view name="{{abc}}"></view>',
            errors: [
                {
                    message: 'Unexpected spaces found',
                    line: 1,
                    column: 20,
                    endLine: 1,
                    endColumn: 22
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view name="  {{abc}}   {{abc}}  \t\t\t\n"></view>',
            output: '<view name="{{abc}}   {{abc}}"></view>',
            errors: [
                {
                    message: 'Unexpected spaces found',
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    message: 'Unexpected spaces found',
                    line: 1,
                    column: 32,
                    endLine: 2,
                    endColumn: 1
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view name=\'  {{abc}}   {{abc}}  \t\t\t\n\'></view>',
            output: '<view name=\'{{abc}}   {{abc}}\'></view>',
            errors: [
                {
                    message: 'Unexpected spaces found',
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    message: 'Unexpected spaces found',
                    line: 1,
                    column: 32,
                    endLine: 2,
                    endColumn: 1
                },
            ]
        },
    ]
});
