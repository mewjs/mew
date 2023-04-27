# 检查 `elif` 指令 (valid-elif)

检查 `elif` 指令，不同小程序平台指令前缀不一样，这里统一用 `微信小程序平台` 的指令进行讲解。

- wx:elif 微信
- a:elif 支付宝
- s-elif 百度

## Rule Details

检查 `elif` 是否有匹配的 `if` 或者 `elif` 指令。

正确的代码示例:

```xml
<view wx:if="{{a}}"></view>
<view wx:elif="{{b}}"></view>
<view wx:elif="{{c}}"></view>
<view wx:else></view>
```

错误的代码示例:

```xml
<!-- no previous if/elif matched -->
<view></view>
<view wx:elif="{{b}}"></view>

<!-- no value -->
<view wx:if="{{a}}"></view>
<view wx:elif=""></view>


<!-- empty expression -->
<view wx:if="{{a}}"></view>
<view wx:elif="{{}}"></view>
```

## Options

无
