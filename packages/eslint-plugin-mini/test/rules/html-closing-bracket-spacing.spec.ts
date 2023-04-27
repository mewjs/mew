import { RuleTester } from 'eslint';
import rule from '../../src/rules/html-closing-bracket-spacing';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('html-closing-bracket-spacing', rule, {

    valid: [
        '',
        {
            filename: 'page.wxml',
            code: '<view><view></view><input /></view>',
        },
        {
            filename: 'page.wxml',
            code: '<view><view class="a"></view><view class="{{abc}}" /></view>',
        },
        {
            filename: 'page.wxml',
            code: '<view><view class="{{abc}}"></view><view hover-class="{{abc}}" /></view>',
        },
        {
            filename: 'page.wxml',
            code: '<view ><view ></view><view /></view>',
            options: [{ startTag: 'always' }]
        },
        {
            filename: 'page.wxml',
            code: '<view><view></view ><view /></view >',
            options: [{ endTag: 'always' }]
        },
        {
            filename: 'page.wxml',
            code: '<view><view></view><view/></view>',
            options: [{ selfClosingTag: 'never' }]
        },
        {
            filename: 'page.wxml',
            code: '<view><view',
        },
        {
            filename: 'page.wxml',
            code: '<view><view></view',
        },
        {
            filename: 'page.wxml',
            code: '<view><view',
            options: [{ startTag: 'never', endTag: 'never' }]
        },
        {
            filename: 'page.wxml',
            code: '<view><view></view',
            options: [{ startTag: 'never', endTag: 'never' }]
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<view>\n  <view >\n  </view >\n  <input/>\n</view    >',
            output: '<view>\n  <view>\n  </view>\n  <input />\n</view>',
            errors: [
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 2,
                    column: 8,
                    endColumn: 10
                },
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 3,
                    column: 9,
                    endColumn: 11
                },
                {
                    message: 'Expected a space before \'/>\', but not found.',
                    line: 4,
                    column: 9,
                    endColumn: 11
                },
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 5,
                    column: 7,
                    endColumn: 12
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>\n  <view class="{{abc}}" ></view>\n  <input placeholder="{{abc}}"/>\n</view>',
            output: '<view>\n  <view class="{{abc}}"></view>\n  <input placeholder="{{abc}}" />\n</view>',
            errors: [
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 2,
                    column: 24,
                    endColumn: 26
                },
                {
                    message: 'Expected a space before \'/>\', but not found.',
                    line: 3,
                    column: 31,
                    endColumn: 33
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view>\n  <view hover-class="abc" ></view>\n  <input value="{{abc}}"/>\n</view>',
            output: '<view>\n  <view hover-class="abc"></view>\n  <input value="{{abc}}" />\n</view>',
            errors: [
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 2,
                    column: 26,
                    endColumn: 28
                },
                {
                    message: 'Expected a space before \'/>\', but not found.',
                    line: 3,
                    column: 25,
                    endColumn: 27
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view >\n <view class="{{abc}}" hover-class="" >\n <input/>\n </view >\n </view>',
            output: '<view>\n <view class="{{abc}}" hover-class="">\n <input />\n </view>\n </view>',
            errors: [
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 1,
                    column: 6,
                    endColumn: 8
                },
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 2,
                    column: 38,
                    endColumn: 40
                },
                {
                    message: 'Expected a space before \'/>\', but not found.',
                    line: 3,
                    column: 8,
                    endColumn: 10
                },
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 4,
                    column: 8,
                    endColumn: 10
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view class="" >\n  <text class="{{abc}}" ></text>\n  <input value="{{abc}}"/>\n</view>',
            output: '<view class="">\n  <text class="{{abc}}"></text>\n  <input value="{{abc}}" />\n</view>',
            errors: [
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 1,
                    column: 15,
                    endColumn: 17
                },
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 2,
                    column: 24,
                    endColumn: 26
                },
                {
                    message: 'Expected a space before \'/>\', but not found.',
                    line: 3,
                    column: 25,
                    endColumn: 27
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view class="abc" >\n  <text class="{{abc}}" ></text>\n  <input value="{{abc}}"/>\n</view>',
            output: '<view class="abc">\n  <text class="{{abc}}"></text>\n  <input value="{{abc}}" />\n</view>',
            errors: [
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 1,
                    column: 18,
                    endColumn: 20
                },
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 2,
                    column: 24,
                    endColumn: 26
                },
                {
                    message: 'Expected a space before \'/>\', but not found.',
                    line: 3,
                    column: 25,
                    endColumn: 27
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view class="{{abc}}" >\n  <text class="{{abc}}" ></text>\n  <input value="{{abc}}"/>\n</view>',
            output: '<view class="{{abc}}">\n  <text class="{{abc}}"></text>\n  <input value="{{abc}}" />\n</view>',
            errors: [
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 1,
                    column: 22,
                    endColumn: 24
                },
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 2,
                    column: 24,
                    endColumn: 26
                },
                {
                    message: 'Expected a space before \'/>\', but not found.',
                    line: 3,
                    column: 25,
                    endColumn: 27
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view style="flex-direction:column;" >\n  <text ></text>\n  <input value="{{abc}}"/>\n</view>',
            output: '<view style="flex-direction:column;">\n  <text></text>\n  <input value="{{abc}}" />\n</view>',
            errors: [
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 1,
                    column: 37,
                    endColumn: 39
                },
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 2,
                    column: 8,
                    endColumn: 10
                },
                {
                    message: 'Expected a space before \'/>\', but not found.',
                    line: 3,
                    column: 25,
                    endColumn: 27
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view class="flex-item flex-item-V demo-text-1" >\n  <text ></text>\n  <input/>\n</view>',
            output: '<view class="flex-item flex-item-V demo-text-1">\n  <text></text>\n  <input />\n</view>',
            errors: [
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 1,
                    column: 48,
                    endColumn: 50
                },
                {
                    message: 'Expected no space before \'>\', but found.',
                    line: 2,
                    column: 8,
                    endColumn: 10
                },
                {
                    message: 'Expected a space before \'/>\', but not found.',
                    line: 3,
                    column: 9,
                    endColumn: 11
                }
            ]
        }
    ]
});
