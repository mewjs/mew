# 检查事件绑定 (valid-bind)

检查事件绑定是否为正确的绑定值。

## Rule Details

检查绑定的事件名称以及事件值。

正确的代码示例:

```xml
<view bindtap="onTap"></view>

<view bind:tap="onTap"></view>
```

错误的代码示例:

```xml
<view bind="onTap"></view>

<view bindtap=""></view>
<view bind:tap="{{onTap}}"></view>
<view bind:tap="{{}}"></view>
<view bind:tap="{{t}}-abc"></view>
```

## Options

```javascript
[
    {
        type: 'object',
        properties: {
            allowExpression: {
                type: 'boolean'
            }
        }
    }
]
```

### allowExpression

是否允许事件值包含表达式，默认 false。

设置为 true,则以下代码可以检查通过。

```xml
<view bind:tap="{{onTap}}"></view>
```