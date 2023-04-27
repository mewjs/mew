import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-spaces-around-equal-signs-in-attribute';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('no-spaces-around-equal-signs-in-attribute', rule, {
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
            code: '<view class=view style={{styleName}}>{{text}}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class="    view     " style={{    styleName   }}>{{text}}</view>'
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<view class= "view"></view><input name = "input"/>',
            output: '<view class="view"></view><input name="input"/>',
            errors: [
                {
                    message: 'Unexpected spaces found around equal signs.',
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    message: 'Unexpected spaces found around equal signs.',
                    line: 1,
                    column: 39,
                    endLine: 1,
                    endColumn: 43
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view class ="view" style= "{{styleName}}">{{text}}</view>',
            output: '<view class="view" style="{{styleName}}">{{text}}</view>',
            errors: [
                {
                    message: 'Unexpected spaces found around equal signs.',
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    message: 'Unexpected spaces found around equal signs.',
                    line: 1,
                    column: 26,
                    endLine: 1,
                    endColumn: 29
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view class      =    "view" style= "{{styleName}}">{{text}}</view>',
            output: '<view class="view" style="{{styleName}}">{{text}}</view>',
            errors: [
                {
                    message: 'Unexpected spaces found around equal signs.',
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 24
                },
                {
                    message: 'Unexpected spaces found around equal signs.',
                    line: 1,
                    column: 35,
                    endLine: 1,
                    endColumn: 38
                }
            ]
        }
    ]
});
