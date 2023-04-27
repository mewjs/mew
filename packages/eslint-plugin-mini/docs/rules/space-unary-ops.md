# 检查一元运算符前后空格 (space-unary-ops)

## Rule Details

此规则检查一元运算符`-，!，!!`后的空格

正确的代码示例:

```xml
<view>
    {{-(1 + 1)}}
</view>

<view wx:if="{{!a}}">
    {{data}}
</view>
```

错误的代码示例:

```xml
<view>
    {{- (1 + 1)}}
</view>

<view wx:if="{{! a}}">
    {{data}}
</view>
```

## Options
此规则的参数与eslint规则[space-unary-ops](https://eslint.org/docs/rules/space-unary-ops) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式