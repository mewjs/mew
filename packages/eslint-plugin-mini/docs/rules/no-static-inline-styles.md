# style 标签规则 (no-static-inline-styles)

检查 style 标签，配置是否允许内联style样式。

## Rule Details

默认设置为不允许 内联静态样式，允许内联动态样式。

正确的代码示例:

```xml
<view class="className"></view>

<view style="font-size:{{fontSize}}"></view>
```

错误的代码示例，内联静态样式:

```xml
<view style="font-size:10rpx"></view>
```

## Options

```javascript
[
    {
        type: 'object',
        properties: {
            allowBinding: {
                type: 'boolean'
            }
        }
    }
]
```

### allowBinding

是否允许 内联动态样式，设置为 `false`，则不允许在 wxml 等小程序模板中使用 style 标签。

例如设置规则：

```javascript
{
    'no-static-inline-styles': [2, {allowBinding: false}]
}
```

则如下代码不能通过代码检查：

```xml
<view style="font-size:{{fontSize}}"></view>

<view style="font-size:10rpx"></view>
```