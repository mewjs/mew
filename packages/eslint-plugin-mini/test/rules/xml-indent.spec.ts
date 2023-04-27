import { RuleTester } from 'eslint';
import rule from '../../src/rules/xml-indent';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('mini/xml-indent', rule, {

    valid: [
        {
            filename: 'page.wxml',
            code: '<view wx:for="{{abc}}"  wx:for-item="i"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<wxs module="abc">var a = 1;</wxs>'
        },
        {
            filename: 'page.wxml',
            code: `<!--{}-->
<view>
  aaa
  bbb
  ccc
</view>`
        },
        {
            filename: 'page.wxml',
            code: `<block>
  <view
    aaa />
</block>`
        },
        {
            filename: 'page.wxml',
            code: `<block>
  <view
    wx:if="ab"
  />
</block>`
        },
        {
            filename: 'page.wxml',
            code: `<block>
  <view>abc
  </view>
</block>`
        },
        {
            filename: 'page.wxml',
            code: `<!--{}-->
<block
  class="a"
>
  <view>abc
  </view>
</block>`
        },
        {
            filename: 'page.wxml',
            code: `<!--{}-->
<block class="a"
>
  <view>abc
  </view>
</block>`
        }
    ],

    invalid: [
        {
            filename: 'page.wxml',
            code: '<view>\n<text></text>\n</view>',
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 0 spaces.'
                }
            ],
            output: '<view>\n  <text></text>\n</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view>\n<text />\n</view>',
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 0 spaces.'
                }
            ],
            output: '<view>\n  <text />\n</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view style="color: #ccc" >\n    <text />\n</view>',
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 4 spaces.'
                }
            ],
            output: '<view style="color: #ccc" >\n  <text />\n</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view style="color: #ccc" >\n  <text />\n  </view>',
            errors: [
                {
                    message: 'Expected indentation of 0 spaces but found 2 spaces.'
                }
            ],
            output: '<view style="color: #ccc" >\n  <text />\n</view>'
        },
        {
            filename: 'page.wxml',
            code: '<wxs module="abc">\n var a = 1;\n</wxs>',
            options: [2, { baseIndent: 0 }],
            errors: [
                {
                    message: 'Expected indentation of 0 spaces but found 1 space.'
                }
            ],
            output: '<wxs module="abc">\nvar a = 1;\n</wxs>'
        },
        {
            filename: 'page.wxml',
            code: `<!--{}-->
<block>
<view>aaa
  </view>
</block>`,
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 0 spaces.'
                }
            ],
            output: `<!--{}-->
<block>
  <view>aaa
  </view>
</block>`
        },
        {
            filename: 'page.wxml',
            code: `<!--{}-->
<block>
  <view>aaa
</view>
</block>`,
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 0 spaces.'
                }
            ],
            output: `<!--{}-->
<block>
  <view>aaa
  </view>
</block>`
        },
        {
            filename: 'page.wxml',
            code: `<!--{}-->
<block class="a"
  ></block>`,
            errors: [
                {
                    message: 'Expected indentation of 0 spaces but found 2 spaces.'
                }
            ],
            output: `<!--{}-->
<block class="a"
></block>`
        },
        {
            filename: 'page.wxml',
            code: `<!--{}-->
<block
class="a"
>
</block>`,
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 0 spaces.'
                }
            ],
            output: `<!--{}-->
<block
  class="a"
>
</block>`
        }
    ]
});
