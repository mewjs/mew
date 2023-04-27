# 检查是否使用全等 (eqeqeq)

## Rule Details

此规则检查是否使用全等号`===`

正确的代码示例:

```xml
<view wx:if="{{a === b}}"></view>

<view wx:if="{{a !== b}}"></view>
```

错误的代码示例:

```xml
<view wx:if="{{a == b}}"></view>

<view wx:if="{{a != b}}"></view>
```

## Options
此规则的参数与eslint规则[eqeqeq](https://eslint.org/docs/rules/eqeqqe) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式