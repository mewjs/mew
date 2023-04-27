import { RuleTester } from 'eslint';
import rule from '../../src/rules/mustache-interpolation-spacing';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('mustache-interpolation-spacing', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: ''
        },
        {
            filename: 'page.wxml',
            code: '   <view class="    ">    </view>   '
        },
        {
            filename: 'page.wxml',
            code: '<view>{{ "aaa" }}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view>{{ aaa }}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view>{{ ! aaa }}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view>{{\taaa\t}}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view>{{ }}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view>{{ }}</view>',
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: '<view>{{}}</view>',
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: '<view>{{ text }}</view>',
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: '<view>{{"text"}}</view>',
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: '<view>{{\'text\'}}</view>',
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: '<view>{{text}}</view>',
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: '<view>{{            }}</view>',
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: '<view>{{            }}</view>',
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: '<view>{{\n\n}}</view>',
            options: ['never']
        },
        {
            filename: 'page.wxml',
            code: '<view>{{\n\n}}</view>',
            options: ['always']
        },
        {
            filename: 'page.wxml',
            code: '<view>{{    text    }}</view>',
            options: ['always']
        },
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<view>{{text}}</view>',
            output: '<view>{{ text }}</view>',
            options: ['always'],
            errors: [
                {
                    message: 'Expected 1 space after \'{{\', but not found.'
                },
                {
                    message: 'Expected 1 space before \'}}\', but not found.',
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>{{ text}}</view>',
            output: '<view>{{ text }}</view>',
            options: ['always'],
            errors: [
                {
                    message: 'Expected 1 space before \'}}\', but not found.',
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>{{text }}</view>',
            output: '<view>{{ text }}</view>',
            options: ['always'],
            errors: [
                {
                    message: 'Expected 1 space after \'{{\', but not found.'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>{{text}}</view>',
            output: '<view>{{ text }}</view>',
            errors: [
                {
                    message: 'Expected 1 space after \'{{\', but not found.'
                },
                {
                    message: 'Expected 1 space before \'}}\', but not found.',
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>{{ text }}</view>',
            output: '<view>{{text}}</view>',
            options: ['never'],
            errors: [
                {
                    message: 'Expected no space after \'{{\', but found.'
                },
                {
                    message: 'Expected no space before \'}}\', but found.',
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>{{text }}</view>',
            output: '<view>{{text}}</view>',
            options: ['never'],
            errors: [
                {
                    message: 'Expected no space before \'}}\', but found.'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>{{ text}}</view>',
            output: '<view>{{text}}</view>',
            options: ['never'],
            errors: [
                {
                    message: 'Expected no space after \'{{\', but found.',
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>aaaa{{ "text" }}aaaa</view>',
            output: '<view>aaaa{{"text"}}aaaa</view>',
            options: ['never'],
            errors: [
                {
                    message: 'Expected no space after \'{{\', but found.'
                },
                {
                    message: 'Expected no space before \'}}\', but found.',
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>aaaa{{"text"}}aaaa</view>',
            output: '<view>aaaa{{ "text" }}aaaa</view>',
            options: ['always'],
            errors: [
                {
                    message: 'Expected 1 space after \'{{\', but not found.'
                },
                {
                    message: 'Expected 1 space before \'}}\', but not found.',
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view class="aaaa{{\'text\'}}aaaa"></view>',
            output: '<view class="aaaa{{ \'text\' }}aaaa"></view>',
            options: ['always'],
            errors: [
                {
                    message: 'Expected 1 space after \'{{\', but not found.'
                },
                {
                    message: 'Expected 1 space before \'}}\', but not found.',
                }
            ]
        },
    ]
});
