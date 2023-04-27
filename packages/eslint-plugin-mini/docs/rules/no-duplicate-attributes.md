# 检查重复的属性 (no-duplicate-attributes)


## Rule Details

检查重复的属性，不允许重复的属性值。

正确的代码示例:

```xml
<view class="{{myClass}}"></view>

<view bindtap="tap" bindclick="click"></view>
```

错误的代码示例:

```xml
<view class="{{myClass}}" class="newClass"></view>

<view bindtap="tap" bind:tap="tap1"></view>
```

## Options

无