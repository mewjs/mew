# 检查 mustache 是否包含无用的表达式 (no-useless-mustache)

检查 mustache 标签是否包含无用的表达式。

## Rule Details

mustache 标签内如果仅包含字符串常量，则为无用的表达式。

正确的代码示例:

```xml
<view class="{{className}}"></view>

<view>{{text}}</view>

<view>{{text + '1'}}</view>
```

错误的代码示例:

```xml
<view class="{{'my-class'}}"></view>

<view class="{{`my-class`}}"></view>

<view>{{'plain text'}}</view>
```

## Options

```javascript
[
    {
        type: 'object',
        properties: {
            ignoreIncludesComment: {
                type: 'boolean'
            },
            ignoreStringEscape: {
                type: 'boolean'
            }
        }
    }
]
```

### ignoreIncludesComment

是否忽略 comment 注释，默认 false。

### ignoreStringEscape

是否忽略包含转义字符的字符串，默认 true，如下代码可以检查通过：

```xml
<view class="{{'abc\n\r\t'}}"></view>
```

配置为 false，则任意字符串常量都不能通过检查。