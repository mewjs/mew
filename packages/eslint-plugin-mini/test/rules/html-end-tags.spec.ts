import { RuleTester } from 'eslint';
import rule from '../../src/rules/html-end-tags';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('html-end-tags', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view><text></text></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view><text><p></p></text></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view><text><br /></text></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view><text><input /></text></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view><text><image /></text></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view><text><input /></text></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view><text><text/></text></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view><block><!-- hello --></block></view>'
        },
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<view><block><text></block></view>',
            errors: [
                {
                    message: '\'<text>\' should have end tag.',
                    type: 'XStartTag'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view><text><p></text></view>',
            errors: [
                {
                    message: '\'<p>\' should have end tag.',
                    type: 'XStartTag'
                }
            ]
        }
    ]
});
