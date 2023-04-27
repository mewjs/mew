# 禁止属性调用使用中括号 (dot-notation)

## Rule Details

此规则强制属性调用时使用`.`而不使用中括号`[]`。

正确的代码示例:

```xml
<view>
    {{data.aaa}}
</view>
```

错误的代码示例:

```xml
<view>
    {{data['aaa']}}
</view>
```

## Options
此规则的参数与eslint规则[dot-notation](https://eslint.org/docs/rules/dot-notation) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式