# 检查括号内的空格 (space-in-parens)

## Rule Details

此规则不允许开括号后和闭括号前存在空格

正确的代码示例:

```xml
<view>
    {{(1 + 1) * 3}}
</view>

<view wx:if="{{(a || b) && c}}">
    {{data}}
</view>
```

错误的代码示例:

```xml
<view>
    {{( 1 + 1 ) * 3}}
</view>

<view wx:if="{{( a | b ) && c}}">
    {{data}}
</view>
```

## Options
此规则的参数与eslint规则[space-in-parens](https://eslint.org/docs/rules/space-in-parens) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式