
import { RuleTester } from 'eslint';
import rule from '../../src/rules/component-attributes';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('component-attributes', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view class="className"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class=""></view>',
            options: [{ allowEmpty: true }]
        },
        {
            filename: 'page.wxml',
            code: '<view unknown="abc"></view>',
            options: [{ allowUnknown: true }]
        },
        {
            filename: 'page.wxml',
            code: '<view style="font-size:{{fontSize}}"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view hover-class="none"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view hover-start-time="1"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<icon color="rgba(1, 1, 1, .4)"></icon>'
        },
        {
            filename: 'page.wxml',
            code: '<icon color="#cccccccc"></icon>'
        },
        {
            filename: 'page.wxml',
            code: '<navigator target="self"></navigator>'
        },
        {
            filename: 'page.wxml',
            code: '<form report-submit="false"></form>'
        },
        {
            filename: 'page.wxml',
            code: '<form report-submit="false"></form>'
        },
        {
            filename: 'page.wxml',
            code: '<cover-image src="{{userInfo.avatarUrl}}"></cover-image>'
        },
        {
            filename: 'page.wxml',
            code: '<cover-image bindload="onClick"></cover-image>'
        },
        {
            filename: 'page.wxml',
            code: '<cover-image binderror="onError">'
        },
        {
            filename: 'page.wxml',
            code: '<cover-image src="{{img}}"></cover-image>'
        },
        {
            filename: 'page.wxml',
            code: '<cover-image src="abc.gif"></cover-image>'
        },
        {
            filename: 'page.wxml',
            code: '<cover-image src="abc.JPEG"></cover-image>'
        },
        {
            filename: 'page.wxml',
            code: '<cover-image bindload=""></cover-image>'
        },
        {
            filename: 'page.wxml',
            code: '<cover-view scroll-top="{{abc}}"></cover-view>'
        },
        {
            filename: 'page.wxml',
            code: '<cover-view scroll-top="2"></cover-view>'
        },
        {
            filename: 'page.wxml',
            options: [{ allowEmpty: true }],
            code: '<cover-view scroll-top=""></cover-view>'
        },
        {
            filename: 'page.wxml',
            code: '<view aria-role="button" aria-valuenow="1"></view>'
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<cover-image src=""></cover-image>',
            errors: [
                {
                    message: '\'src\' value shouldn\'t be empty.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<cover-image unknown="abc"></cover-image>',
            options: [{ allowUnknown: false }],
            errors: [
                {
                    message: 'unknown attribute \'unknown\'.',
                    type: 'XIdentifier'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<cover-view scorll-top=""></cover-view>',
            errors: [
                {
                    message: '\'scorll-top\' value shouldn\'t be empty.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<cover-view unknown="abc"></cover-view>',
            options: [{ allowUnknown: false }],
            errors: [
                {
                    message: 'unknown attribute \'unknown\'.',
                    type: 'XIdentifier'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view class=""></view>',
            errors: [
                {
                    message: '\'class\' value shouldn\'t be empty.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view unknown="abc"></view>',
            options: [{ allowUnknown: false }],
            errors: [
                {
                    message: 'unknown attribute \'unknown\'.',
                    type: 'XIdentifier'
                }
            ]
        },
        {
            filename: 'page.wxml',
            /* eslint-disable-next-line max-len */
            code: '<view hover-stay-time="abc" hover-start-time="abc" hover-calss="" hover-stop-propagation="1"></view>',
            errors: [
                {
                    message: 'invalid \'hover-stay-time\' value.',
                    type: 'XAttribute'
                },
                {
                    message: 'invalid \'hover-start-time\' value.',
                    type: 'XAttribute'
                },
                {
                    message: '\'hover-calss\' value shouldn\'t be empty.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<icon type="abc"></icon>',
            errors: [
                {
                    message: 'invalid \'type\' value.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<canvas type="abc"></canvas>',
            errors: [
                {
                    message: 'invalid \'type\' value.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view aria-role="abc"></view>',
            errors: [
                {
                    message: 'invalid \'aria-role\' value.',
                    type: 'XAttribute'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view aria-valuenow="abc"></view>',
            errors: [
                {
                    message: 'invalid \'aria-valuenow\' value.',
                    type: 'XAttribute'
                }
            ]
        }
    ]
});
