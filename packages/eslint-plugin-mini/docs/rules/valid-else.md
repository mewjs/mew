# 检查 `else` 指令 (valid-else)

检查 `else` 指令，不同小程序平台指令前缀不一样，这里统一用 `微信小程序平台` 的指令进行讲解。

- wx:else 微信
- a:else 支付宝
- s-else 百度

## Rule Details

检查 `else` 是否有匹配的 `if` 或者 `elif` 指令。

正确的代码示例:

```xml
<view wx:if="{{a}}"></view>
<view wx:else></view>


<view wx:if="{{b}}"></view>
<view wx:elif="{{c}}"></view>
<view wx:else></view>
```

错误的代码示例:

```xml
<!-- no previous if/elif matched -->
<view></view>
<view wx:else></view>

<!-- has value -->
<view wx:else="{{}}"></view>
<view wx:else=""></view>

```

## Options

无
