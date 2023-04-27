# 组件嵌套规则 (component-nesting)

检查组件嵌套规则，包含容器组件、文本组件、自闭合组件等。

## Rule Details

检查容器组件、文本组件、自闭合组件等嵌套规则是否合理。

组件嵌套正确的代码示例:

```xml
<view><text></text></view>

<block><view></view></block>
```

组件闭合正确的代码示例:

```xml
<image src="{{src}}" />
<image src="{{src}}"></image>
<image src="{{src}}"> </image>
```

错误的代码示例，不合法嵌套:

```xml
<!-- text 文本组件不可嵌套块组件 -->
<text><view></view></text>
<!-- block 不可以空 -->
<block></block>
```


错误的代码示例，不合法闭合:

```xml
<image src="{{src}}">1</image>
```


## Options

```javascript
[
    {
        type: 'object',
        properties: {
            allowEmptyBlock: {
                type: 'boolean'
            },
            ignoreEmptyBlock: {
                type: 'array',
                items: {
                    allOf: [{type: 'string'}]
                },
                uniqueItems: true
            }
        }
    }
]
```

### allowEmptyBlock

是否允许空 block 标签，block 标签如下：

- cover-image
- cover-view
- match-media
- movable-area
- movable-view
- scroll-view
- swiper
- swiper-item
- view
- block

### ignoreEmptyBlock

忽略的空 block 标签，默认为 `view` 标签。