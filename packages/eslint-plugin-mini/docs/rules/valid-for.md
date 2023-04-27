# 检查 `for` 指令 (valid-for)

检查 `for` 指令，不同小程序平台指令前缀不一样，这里统一用 `微信小程序平台` 的指令进行讲解。

- wx:for 微信
- a:for 支付宝
- s-for 百度

## Rule Details

检查 `for` 是否合法。

正确的代码示例:

```xml
<view wx:for="{{list}}" wx:key="id"</view>

<view wx:for="{{list}}" wx:for-item="item" wx:key="id">
    <text>{{item.id}}</text>
</view>

<view wx:for-items="{{list}}" wx:for-item="item" wx:for-index="index" wx:key="id">
    <text>{{index}}. {{item.id}}</text>
</view>
```

错误的代码示例:

```xml
<!-- no 'key' directive -->
<view wx:for="{{list}}"></view>

<!-- 'for' value should be expression -->
<view wx:for="abc" wx:key="id"></view>

<!-- 'for-item' should be literal -->
<view wx:for="{{list}}" wx:key="id" wx:for-item="{{item}}"></view>

<!-- 'for-index' should be literal -->
<view wx:for="{{list}}" wx:key="id" wx:for-index="{{index}}"></view>

<!-- 'key' should be literal -->
<view wx:for="{{list}}" wx:key="{{key}}"  wx:for-item="item"></view>
```

## Options

```javascript
[
    {
        type: 'object',
        properties: {
            withKey: {
                type: 'boolean'
            },
            withItem: {
                type: 'boolean'
            }
        }
    }
]
```

### withKey

是否检查 `for-key` 指令，默认为 true， 必须定义 `for-key` 指令

### withItem

是否检查 `for-item` 指令，默认为 false，设置为 true，则必须定义 `for-item` 指令
