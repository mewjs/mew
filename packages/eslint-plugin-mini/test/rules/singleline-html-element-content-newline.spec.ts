
// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
import { RuleTester } from 'eslint';
import rule from '../../src/rules/singleline-html-element-content-newline';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

tester.run('mini/singleline-html-element-content-newline', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code:
                `
                <block>
                    <view hover-class="panel"></view>
                </block>
                `
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view class="panel">
                content
                </view>
            </block>
            `
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view class="panel">
                <view>
                </view>
                </view>
            </block>
            `
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view class="panel">
                <!-- comment -->
                </view>
            </block>
            `
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view>
                content
                </view>
            </block>
            `
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
            <view>
                <view>
                </view>
            </view>
            </block>
            `
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view>
                <!-- comment -->
                </view>
            </block>
            `
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <navigation href="/">Home</navigation>
            </block>
            `
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <form>
                <label for="test">Home</label>
                <input class="test" placeholder="test">
                </form>
            </block>
            `
        },

        // ignoreWhenNoAttributes: true
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view>singleline content</view>
            </block>`
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view><text>singleline</text><text>children</text></view>
            </block>`
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view><!-- singleline comment --></view>
            </block>
            `
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view     >singleline element</view     >
            </block>`
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view></view>
            </block>`
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view>    </view>
            </block>`
        },

        // ignoreWhenNoAttributes: false
        {
            code: `
      <block>
        <view>
          content
        </view>
      </block>`,
            options: [{ ignoreWhenNoAttributes: false }],
            filename: 'page.wxml',
        },
        {
            code: `
      <block>
        <view>
          <view>
          </view>
        </view>
      </block>`,
            options: [{ ignoreWhenNoAttributes: false }],
            filename: 'page.wxml',
        },
        {
            code: `
      <block>
        <view>
          <!-- comment -->
        </view>
      </block>`,
            options: [{ ignoreWhenNoAttributes: false }],
            filename: 'page.wxml',
        },
        // self closing
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <self-closing />
            </block>`
        },
        // ignores
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <label>content</label>
                <label class="test">content</label>
                <label><text class="test">content</text></label>
                <audio poster="{{poster}}" src="{{src}}" id="myAudio" controls loop></audio>
                <video id="myVideo" binderror="videoErrorCallback"></video>
                <video id="myVideo" binderror="videoErrorCallback"></video>
                <canvas><text class="test">content</text></canvas>
            </block>`
        },
        {
            code: `
        <block>
          <ignore-tag>content</ignore-tag>
          <ignore-tag class="test">content</ignore-tag>
          <ignore-tag><text class="test">content</text></ignore-tag>
        </block>`,
            options: [
                {
                    ignores: ['ignore-tag']
                }
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <IgnoreTag>content</IgnoreTag>
          <IgnoreTag class="test">content</IgnoreTag>
          <IgnoreTag><span class="test">content</span></IgnoreTag>
        </block>`,
            options: [
                {
                    ignores: ['IgnoreTag']
                }
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <ignore-tag>content</ignore-tag>
          <ignore-tag class="test">content</ignore-tag>
          <ignore-tag><label class="test">content</label></ignore-tag>
        </block>`,
            options: [
                {
                    ignores: ['IgnoreTag']
                }
            ],
            filename: 'page.wxml',
        },
        // not target
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view>content
                </view>
            </block>`
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view>
                content</view>
            </block>`
        },
        // Ignore if no closing brackets
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view
                class=
                ""
            `
        }
    ],
    invalid: [
        {
            code: `
        <block>
          <view class="panel">content</view>
        </block>
      `,
            output: `
        <block>
          <view class="panel">
content
</view>
        </block>
      `,
            errors: [
                {
                    message:
            'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                    line: 3,
                    column: 31,
                    type: 'HTMLTagClose',
                    endLine: 3,
                    endColumn: 31
                },
                {
                    message:
            'Expected 1 line break before closing tag (`</view>`), but no line breaks found.',
                    line: 3,
                    column: 38,
                    type: 'HTMLEndTagOpen',
                    endLine: 3,
                    endColumn: 38
                }
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view class="test"><view>singleline</view><view>children</view></view>
        </block>
      `,
            output: `
        <block>
          <view class="test">
<view>singleline</view><view>children</view>
</view>
        </block>
      `,
            errors: [
                'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</view>`), but no line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view class="test"><!-- singleline comment --></view>
        </block>
      `,
            output: `
        <block>
          <view class="test">
<!-- singleline comment -->
</view>
        </block>
      `,
            errors: [
                'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</view>`), but no line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view class="test"><!-- singleline --><!-- comments --></view>
        </block>
      `,
            output: `
        <block>
          <view class="test">
<!-- singleline --><!-- comments -->
</view>
        </block>
      `,
            errors: [
                'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</view>`), but no line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view class="test"     >content</view    >
        </block>
      `,
            output: `
        <block>
          <view class="test"     >
content
</view    >
        </block>
      `,
            errors: [
                'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</view>`), but no line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view class="test"     >content</view
          >
        </block>
      `,
            output: `
        <block>
          <view class="test"     >
content
</view
          >
        </block>
      `,
            errors: [
                'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</view>`), but no line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view class="test"></view>
        </block>
      `,
            output: `
        <block>
          <view class="test">
</view>
        </block>
      `,
            options: [{ ignoreWhenEmpty: false }],
            errors: ['Expected 1 line break after opening tag (`<view>`), but no line breaks found.'],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view class="test">    </view>
        </block>
      `,
            output: `
        <block>
          <view class="test">
</view>
        </block>
      `,
            errors: ['Expected 1 line break after opening tag (`<view>`), but no line breaks found.'],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view>singleline content</view>
        </block>
      `,
            options: [{ ignoreWhenNoAttributes: false }],
            output: `
        <block>
          <view>
singleline content
</view>
        </block>
      `,
            errors: [
                'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</view>`), but no line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view><view>singleline</view><view>children</view></view>
        </block>
      `,
            options: [{ ignoreWhenNoAttributes: false }],
            output: `
        <block>
          <view>
<view>
singleline
</view><view>
children
</view>
</view>
        </block>
      `,
            errors: [
                'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</view>`), but no line breaks found.',
                'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</view>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</view>`), but no line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view><!-- singleline comment --></view>
        </block>
      `,
            options: [{ ignoreWhenNoAttributes: false }],
            output: `
        <block>
          <view>
<!-- singleline comment -->
</view>
        </block>
      `,
            errors: [
                'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</view>`), but no line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view   >   singleline element   </view   >
        </block>
      `,
            options: [{ ignoreWhenNoAttributes: false }],
            output: `
        <block>
          <view   >
singleline element
</view   >
        </block>
      `,
            errors: [
                'Expected 1 line break after opening tag (`<view>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</view>`), but no line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view></view>
        </block>
      `,
            options: [{ ignoreWhenEmpty: false, ignoreWhenNoAttributes: false }],
            output: `
        <block>
          <view>
</view>
        </block>
      `,
            errors: ['Expected 1 line break after opening tag (`<view>`), but no line breaks found.'],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <view>    </view>
        </block>
      `,
            options: [{ ignoreWhenEmpty: false, ignoreWhenNoAttributes: false }],
            output: `
        <block>
          <view>
</view>
        </block>
      `,
            errors: ['Expected 1 line break after opening tag (`<view>`), but no line breaks found.'],
            filename: 'page.wxml',
        },
        {
            code: `
        <block>
          <View class="panel">content</View>
        </block>
      `,
            output: `
        <block>
          <View class="panel">
content
</View>
        </block>
      `,
            errors: [
                'Expected 1 line break after opening tag (`<View>`), but no line breaks found.',
                'Expected 1 line break before closing tag (`</View>`), but no line breaks found.'
            ],
            filename: 'page.wxml',
        }
    ]
});
