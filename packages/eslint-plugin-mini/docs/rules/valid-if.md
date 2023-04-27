# 检查 `if` 指令 (valid-if)

检查 `if` 指令，不同小程序平台指令前缀不一样，这里统一用 `微信小程序平台` 的指令进行讲解。

- wx:if 微信
- a:if 支付宝
- s-if 百度

## Rule Details

检查 `if` 是否合法。

正确的代码示例:

```xml
<view wx:if="{{a}}"></view>
<view wx:else></view>
```

错误的代码示例:

```xml
<!-- empty value expression -->
<view wx:if=""></view>
<view wx:if="{{}}"></view>

<!-- 'if' shouldn't use with 'else' -->
<view wx:if="{{a}}" wx:else></view>

<!-- 'if' shouldn't use with 'elif' -->
<view wx:if="{{a}}" wx:elif="{{b}}"></view>
```

## Options

无
