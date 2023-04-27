// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
import { RuleTester } from 'eslint';
import rule from '../../src/rules/max-attributes-per-line';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('max-attributes-per-line', rule, {
    valid: [
        {
            code:
'<view><component></component></view>',
            filename: 'page.wxml',
        },
        {
            code:
`<view><component
name="John Doe"
age="30"
job="Vet"
></component></view>`,
            filename: 'page.wxml',
        },
        {
            code:
`<view><component
name="John Doe"
age="30"
job="Vet"
></component></view>`,
            options: [{ multiline: { allowFirstLine: true } }],
            filename: 'page.wxml',
        },
        {
            code:
`<view><component
name="John Doe"
age="30"
>
</component></view>`,
            filename: 'page.wxml',
        },
        {
            code:
`<view><component
name="John Doe"
age="30">
</component>
</view>`,
            options: [{ singleline: 1 }],
            filename: 'page.wxml',
        },
        {
            code:
'<view><component></component></view>',
            options: [{ singleline: 1, multiline: { max: 1, allowFirstLine: false } }],
            filename: 'page.wxml',
        },
        {
            code:
'<view><component name="John Doe" age="30" job="Vet"></component></view>',
            options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false } }],
            filename: 'page.wxml',
        },
        {
            code:
`<view><component name="John Doe"
age="30">
</component>
</view>`,
            options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: true } }],
            filename: 'page.wxml',
        },
        {
            code:
`<view><component
name="John Doe"
age="30">
</component>
</view>`,
            options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false } }],
            filename: 'page.wxml',
        },
        {
            code:
`<view><component
name="John Doe" age="30"
job="Vet">
</component>
</view>`,
            options: [{ singleline: 3, multiline: { max: 2, allowFirstLine: false } }],
            filename: 'page.wxml',
        }
    ],

    invalid: [
        {
            code:
'<view><component name="John Doe" age="30"></component></view>',
            output:
`<view><component name="John Doe"
age="30"></component></view>`,
            errors: ['\'age\' should be on a new line.'],
            filename: 'page.wxml',
        },
        {
            code:
        '<view><component name="{{user.name}}" age="{{user.age}}"></component></view>',
            output:
        `<view><component name="{{user.name}}"
age="{{user.age}}"></component></view>`,
            errors: ['\'age\' should be on a new line.'],
            filename: 'page.wxml',
        },
        {
            code:
'<view><component :is="test" wx:data="{{user}}"></component></view>',
            output:
`<view><component :is="test"
wx:data="{{user}}"></component></view>`,
            errors: ['\'wx:data\' should be on a new line.'],
            filename: 'page.wxml',
        },
        {
            code:
        '<view><component name="{{user.name}}" wx:if="{{something}}"></component></view>',
            output:
        `<view><component name="{{user.name}}"
wx:if="{{something}}"></component></view>`,
            errors: ['\'wx:if\' should be on a new line.'],
            filename: 'page.wxml',
        },
        {
            code:
        '<view><component name="John Doe"    age="{{user.age}}"></component></view>',
            output:
        `<view><component name="John Doe"
age="{{user.age}}"></component></view>`,
            errors: ['\'age\' should be on a new line.'],
            filename: 'page.wxml',
        },
        {
            code:
`<view><component job="Vet"
name="John Doe"
age="30">
</component>
</view>`,
            output:
`<view><component
job="Vet"
name="John Doe"
age="30">
</component>
</view>`,
            errors: [
                {
                    message: '\'job\' should be on a new line.',
                    type: 'XAttribute',
                    line: 1
                }
            ],
            filename: 'page.wxml',
        },
        {
            code:
'<view><component name="John Doe" age="30" job="Vet"></component></view>',
            options: [{ singleline: { max: 2 } }],
            output:
`<view><component name="John Doe" age="30"
job="Vet"></component></view>`,
            errors: [
                {
                    message: '\'job\' should be on a new line.',
                    type: 'XAttribute',
                    line: 1
                }
            ],
            filename: 'page.wxml',
        },
        {
            code:
'<view><component name="John Doe" age="30" job="Vet"></component></view>',
            options: [{ singleline: 1, multiline: { max: 1, allowFirstLine: false } }],
            output:
`<view><component name="John Doe"
age="30" job="Vet"></component></view>`,
            errors: [
                {
                    message: '\'age\' should be on a new line.',
                    type: 'XAttribute',
                    line: 1
                },
                {
                    message: '\'job\' should be on a new line.',
                    type: 'XAttribute',
                    line: 1
                }
            ],
            filename: 'page.wxml',
        },
        {
            code:
`<view><component name="John Doe"
age="30">
</component>
</view>`,
            options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false } }],
            output:
`<view><component
name="John Doe"
age="30">
</component>
</view>`,
            errors: [
                {
                    message: '\'name\' should be on a new line.',
                    type: 'XAttribute',
                    line: 1
                }
            ],
            filename: 'page.wxml',
        },
        {
            code:
`<view><component
name="John Doe" age="30"
job="Vet">
</component>
</view>`,
            options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false } }],
            output:
`<view><component
name="John Doe"
age="30"
job="Vet">
</component>
</view>`,
            errors: [
                {
                    message: '\'age\' should be on a new line.',
                    type: 'XAttribute',
                    line: 2
                }
            ],
            filename: 'page.wxml',
        },
        {
            code: `<view><component
                        name="John Doe" age="30"
                        job="Vet">
                        </component>
                      </view>`,
            options: [{ singleline: 3, multiline: 1 }],
            output: `<view><component
                        name="John Doe"
age="30"
                        job="Vet">
                        </component>
                      </view>`,
            errors: [
                {
                    message: '\'age\' should be on a new line.',
                    type: 'XAttribute',
                    line: 2
                }
            ],
            filename: 'page.wxml',
        },
        {
            code: `<view><component
                        name="John Doe" age="30"
                        job="Vet" pet="dog" petname="Snoopy">
                        </component>
                      </view>`,
            options: [{ singleline: 3, multiline: { max: 2, allowFirstLine: false } }],
            output: `<view><component
                        name="John Doe" age="30"
                        job="Vet" pet="dog"
petname="Snoopy">
                        </component>
                      </view>`,
            errors: [
                {
                    message: '\'petname\' should be on a new line.',
                    type: 'XAttribute',
                    line: 3
                }
            ],
            filename: 'page.wxml',
        },
        {
            code: `<view><component
                        name="John Doe" age="30"
                        job="Vet" pet="dog" petname="Snoopy" extra="foo">
                        </component>
                      </view>`,
            options: [{ singleline: 3, multiline: { max: 2, allowFirstLine: false } }],
            output: `<view><component
                        name="John Doe" age="30"
                        job="Vet" pet="dog"
petname="Snoopy" extra="foo">
                        </component>
                      </view>`,
            errors: [
                {
                    message: '\'petname\' should be on a new line.',
                    type: 'XAttribute',
                    line: 3
                },
                {
                    message: '\'extra\' should be on a new line.',
                    type: 'XAttribute',
                    line: 3
                }
            ],
            filename: 'page.wxml',
        },
        {
            code: '<view><component name="{{user.name}}" bindtab="buyProduct"></component></view>',
            output: `<view><component name="{{user.name}}"
bindtab="buyProduct"></component></view>`,
            errors: ['\'bindtab\' should be on a new line.'],
            filename: 'page.wxml',
        },
        {
            code: '<view><component name="{{user.name}}" catchtap></component></view>',
            output: `<view><component name="{{user.name}}"
catchtap></component></view>`,
            errors: ['\'catchtap\' should be on a new line.'],
            filename: 'page.wxml',
        },
    ]
});
