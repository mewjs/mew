# 不允许标签属性等号两边空格 (no-spaces-around-equal-signs-in-attribute)

## Rule Details

此规则不允许标签属性等号两边存在空格。

正确的代码示例:

```xml
<view class="myClass"></view>

<view
    class="myClass"
></view>
```

错误的代码示例:

```xml
<view class = "myClass"></view>

<view
    class     =      "myClass"
></view>

<view
    class
        ="myClass"
></view>
```

## Options

无

