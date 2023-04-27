# 检查属性表达式两边空格 (attribute-value-spacing)

## Rule Details

此规则检查属性的表达式两边是否存在不允许出现的空格

正确的代码示例:

```xml
<view class="{{abc}}"></view>

<view class="myClass {{abc}} className"></view>

<view class="header-{{abc}}-className"></view>
```

错误的代码示例:

```xml
<view class=" {{abc}} "></view>

<view class="    myClass {{abc}} className   "></view>

<view class="     header-{{abc}}-className   "></view>
```

## Options

无
