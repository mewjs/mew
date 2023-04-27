/**
 * See LICENSE file in root directory for full license.
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
import { RuleTester } from 'eslint';
import rule from '../../src/rules/html-closing-bracket-newline';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('html-closing-bracket-newline', rule, {
    valid: [
        {
            code: '<block><view></view></block>',
            filename: 'page.wxml',
        },
        {
            code:
`
<block>
    <view
    class=""
    >
    </view>
</block>`,
            filename: 'page.wxml',
        },
        {
            code: '<block><view></view></block>',
            options: [
                {
                    singleline: 'never',
                    multiline: 'never'
                }
            ],
            filename: 'page.wxml',
        },
        {
            code:
`
    <block>
    <view
        class="">
    </view>
    </block>
`,
            options: [
                {
                    singleline: 'never',
                    multiline: 'never'
                }
            ],
            filename: 'page.wxml',
        },
        {
            code:
`
    <block>
    <view
        class=""
        >
    </view>
    </block>
`,
            options: [
                {
                    singleline: 'never',
                    multiline: 'always'
                }
            ],
            filename: 'page.wxml',
        },
        {
            code:
`
    <block>
    <view class="">
    </view>
    </block>
`,
            options: [
                {
                    singleline: 'never',
                    multiline: 'always'
                }
            ],
            filename: 'page.wxml',
        },
        {
            code:
`
    <block
    >
    <view
        class="">
    </view
    >
    </block
    >
`,
            options: [
                {
                    singleline: 'always',
                    multiline: 'never'
                }
            ],
            filename: 'page.wxml',
        },
        {
            code:
`
    <block
    >
    <view class=""
    >
    </view
    >
    </block
    >
`,
            options: [
                {
                    singleline: 'always',
                    multiline: 'never'
                }
            ],
            filename: 'page.wxml',
        },
        // Ignore if no closing brackets
        {
            code:
`
    <block>
    <view
        id=
        ""
`,
            filename: 'page.wxml',
        }
    ],
    invalid: [
        {
            code:
`
<block>
    <view
    ></view

    >
</block>
`,
            output:
`
<block>
    <view></view>
</block>
`,
            errors: [
                'Expected no line breaks before closing bracket, but 1 line break found.',
                'Expected no line breaks before closing bracket, but 2 line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code:
`
<block>
    <view
        class="">
    </view>
</block>
`,
            output:
`
<block>
    <view
        class=""
>
    </view>
</block>
`,
            errors: ['Expected 1 line break before closing bracket, but no line breaks found.'],
            filename: 'page.wxml',
        },
        {
            code:
`
<block>
    <view
    ></view

    >
</block>
`,
            output:
`
<block>
    <view></view>
</block>
`,
            options: [
                {
                    singleline: 'never',
                    multiline: 'never'
                }
            ],
            errors: [
                'Expected no line breaks before closing bracket, but 1 line break found.',
                'Expected no line breaks before closing bracket, but 2 line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code:
`
    <block>
    <view
        class=""
        >
    </view>
    </block>
`,
            output:
`
    <block>
    <view
        class="">
    </view>
    </block>
`,
            options: [
                {
                    singleline: 'never',
                    multiline: 'never'
                }
            ],
            errors: ['Expected no line breaks before closing bracket, but 1 line break found.'],
            filename: 'page.wxml',
        },
        {
            code:
`
    <block>
    <view
        class="">
    </view>
    </block>
`,
            output:
`
    <block>
    <view
        class=""
>
    </view>
    </block>
`,
            options: [
                {
                    singleline: 'never',
                    multiline: 'always'
                }
            ],
            errors: ['Expected 1 line break before closing bracket, but no line breaks found.'],
            filename: 'page.wxml',
        },
        {
            code:
`
    <block>
    <view class=""
    >
    </view
    >
    </block>
`,
            output:
`
    <block>
    <view class="">
    </view>
    </block>
`,
            options: [
                {
                    singleline: 'never',
                    multiline: 'always'
                }
            ],
            errors: [
                'Expected no line breaks before closing bracket, but 1 line break found.',
                'Expected no line breaks before closing bracket, but 1 line break found.'
            ],
            filename: 'page.wxml',
        },
        {
            code:
`
    <block
    >
    <view
        class=""
        >
    </view>
    </block
    >
`,
            output:
`
    <block
    >
    <view
        class="">
    </view
>
    </block
    >
`,
            options: [
                {
                    singleline: 'always',
                    multiline: 'never'
                }
            ],
            errors: [
                'Expected no line breaks before closing bracket, but 1 line break found.',
                'Expected 1 line break before closing bracket, but no line breaks found.'
            ],
            filename: 'page.wxml',
        },
        {
            code:
`
    <block
    >
    <view class="">
    </view>
    </block
    >
`,
            output:
`
    <block
    >
    <view class=""
>
    </view
>
    </block
    >
`,
            options: [
                {
                    singleline: 'always',
                    multiline: 'never'
                }
            ],
            errors: [
                'Expected 1 line break before closing bracket, but no line breaks found.',
                'Expected 1 line break before closing bracket, but no line breaks found.'
            ],
            filename: 'page.wxml',
        }
    ]
});
