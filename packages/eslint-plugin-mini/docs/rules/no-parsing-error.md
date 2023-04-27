# 检查是否存在解析错误 (no-parsing-error)


## Rule Details

检查是否存在解析错误，不允许出现 xml 解析错误。

正确的代码示例:

```xml
<view class="{{myClass}}"></view>
```

错误的代码示例:

```xml
<view class="{{myClass}}"></view>

<view class="
{{myClass}}"></view>

<view class="{{
    myClass}}"></view>

<view class="{{myClass}}"></ view>

<view class="{{myClass"></view>

<view>{{abc</view>

```

## Options

可以启用或者禁用某个解析错误报错，例如:

```javascript
{
    'no-parsing-error': [
        2,
        {
            'abrupt-closing-of-empty-comment': false
        }
    ]
}
```


已知的解析错误选项如下：

- abrupt-closing-of-empty-comment
- absence-of-digits-in-numeric-character-reference
- cdata-in-html-content
- character-reference-outside-unicode-range
- control-character-in-input-stream
- control-character-reference
- eof-before-tag-name
- eof-in-cdata
- eof-in-comment
- eof-in-tag
- incorrectly-closed-comment
- incorrectly-opened-comment
- invalid-first-character-of-tag-name
- missing-attribute-value
- missing-end-tag-name
- missing-semicolon-after-character-reference
- missing-whitespace-between-attributes
- nested-comment
- noncharacter-character-reference
- noncharacter-in-input-stream
- null-character-reference
- surrogate-character-reference
- surrogate-in-input-stream
- unexpected-character-in-attribute-name
- unexpected-character-in-unquoted-attribute-value
- unexpected-equals-sign-before-attribute-name
- unexpected-null-character
- unexpected-question-mark-instead-of-tag-name
- unexpected-solidus-in-tag
- unknown-named-character-reference
- end-tag-with-attributes
- duplicate-attribute
- end-tag-with-trailing-solidus
- non-void-html-element-start-tag-with-trailing-solidus 
- x-invalid-end-tag
- x-invalid-namespace
- attribute-value-invalid-unquoted
- unexpected-line-break
- missing-expression-end-tag