import { RuleTester } from 'eslint';
import rule from '../../src/rules/not-empty';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('not-empty', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: '<view></view><input name="input"/>'
        },
        {
            filename: 'page.wxml',
            code: '<view class="view" style="{{styleName}}">{{text}}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view wx:if="{{condition > 1}}" wx:for="{{[1,2,3,4]}}">{{item}}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<template data="{{data, ...dataExtend}}" />'
        },
        {
            filename: 'page.wxml',
            code: '<!-- wxml -->',
        },
        {
            filename: 'page.wxml',
            code: '<!-- wxml -->',
            options: [{ allowComment: true }],
        },
        {
            filename: 'page.js',
            code: ''
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '',
            errors: [
                {
                    message: 'disallow empty file content'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<!-- wxml -->',
            options: [{ allowComment: false }],
            errors: [
                {
                    message: 'disallow empty file content',
                    type: 'XDocumentFragment'
                }
            ]
        }
    ]
});
