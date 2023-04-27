import { RuleTester } from 'eslint';
import rule from '../../src/rules/component-nesting';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('component-nesting', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view><text></text></view>'
        },
        {
            filename: 'page.wxml',
            code: '<image>   \n  </image>'
        },
        {
            filename: 'page.wxml',
            code: '<image/>'
        },
        {
            filename: 'page.wxml',
            code: '<view><view></view></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view><template is="abc"></template></view>',
        },
        {
            filename: 'page.wxml',
            code: '<import src="abc"/>',
        },
        {
            filename: 'page.wxml',
            code: '<wxs module="abc">1</wxs>',
        },
        {
            filename: 'page.wxml',
            code: '<form></form>',
            options: [{ allowEmptyBlock: true }]
        },
        {
            filename: 'page.wxml',
            code: '<form></form>',
            options: [{ allowEmptyBlock: false, ignoreEmptyBlock: ['form'] }]
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<rich-text><view></view></rich-text>',
            errors: [
                {
                    message: 'component \'view\' shouldn\'t nested in component \'rich-text\'.',
                    type: 'XElement'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<text><form>1</form></text>',
            errors: [
                {
                    message: 'component \'form\' shouldn\'t nested in component \'text\'.',
                    type: 'XElement'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<image>invalid</image>',
            errors: [
                {
                    message: 'self close component shouldn\'t have children.',
                    type: 'XElement'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view><template name="abc"></template></view>',
            errors: [
                {
                    message: 'top level component shouldn\'t nested in other component.',
                    type: 'XElement'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<import src="abc">1</import>',
            errors: [
                {
                    message: 'self close component shouldn\'t have children.',
                    type: 'XElement'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<wxs src="abc" module="abc">1</wxs>',
            errors: [
                {
                    message: '\'wxs\' with \'src\' shouldn\'t have children.',
                    type: 'XElement'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view></view>',
            options: [{ ignoreEmptyBlock: [] }],
            errors: [
                {
                    message: 'component \'view\' should have children.',
                    type: 'XElement'
                }
            ]
        },
    ]
});
