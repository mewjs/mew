# 代码缩进 (xml-indent)

检查小程序 xml 代码缩进是否正确。

## Rule Details

检查小程序 xml 代码缩进是否正确，包含标签和属性缩进。

正确的代码示例:

```xml
<view>
    <text>plain text</text>
</view>

<view><text>plain text</text></view>

<image />
```

正确的代码示例，属性缩进:

```xml
<view class="myclass"
    bindtap="onTap">
</view>


<view class="myclass"
    wx:if="{{cond}}"
>
    <text>plain text</text>
</view>
```

错误的代码示例:

```xml
<!-- invad whitespace -->
<view> <text>plain text</text></view>

<!-- no indent -->
<view>
<text>plain text</text>
</view>

<!-- indent 2 whitespace not 4 whitespace -->
<view>
  <text>plain text</text>
</view>

<!-- end tag indent error -->
<view>
    <text>plain text</text>
    </view>
```

错误的代码示例，属性缩进:

```xml
<!-- no indent -->
<view class="myclass"
bindtap="onTap">
</view>

<!-- indent 2 whitespace not 4 whitespace -->
<view class="myclass"
  wx:if="{{cond}}">
</view>

<!-- start tag end indent 2 whitespace not 4 whitespace -->
<view class="myclass"
    wx:if="{{cond}}"
  >
</view>
```

## Options

默认代码缩进为 4 空格，基础缩进 0， `wxs` 内嵌脚本缩进为 0 。

```javascript
[
    {
        anyOf: [{type: 'integer', minimum: 1}, {enum: ['tab']}]
    },
    {
        type: 'object',
        properties: {
            attribute: {type: 'integer', minimum: 0},
            baseIndent: {type: 'integer', minimum: 0},
            scriptBaseIndent: {type: 'integer', minimum: 0},
            closeBracket: {
                anyOf: [
                    {type: 'integer', minimum: 0},
                    {
                        type: 'object',
                        properties: {
                            startTag: {type: 'integer', minimum: 0},
                            endTag: {type: 'integer', minimum: 0},
                            selfClosingTag: {type: 'integer', minimum: 0}
                        },
                        additionalProperties: false
                    }
                ]
            },
            switchCase: {type: 'integer', minimum: 0},
            alignAttributesVertically: {type: 'boolean'},
            ignores: {
                type: 'array',
                items: {
                    allOf: [
                        {type: 'string'},
                        {not: {type: 'string', pattern: ':exit$'}},
                        {not: {type: 'string', pattern: '^\\s*$'}}
                    ]
                },
                uniqueItems: true,
                additionalItems: false
            }
        },
        additionalProperties: false
    }
]
```
