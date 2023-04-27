# 检查属性调用点号位置 (dot-location)

## Rule Details

此规则检查属性调用时点号的位置

正确的代码示例:

```xml
<view>
    {{data.aaa.bbb
        .ccc}}
</view>
```

错误的代码示例:

```xml
<view>
    {{data.aaa.bbb.
        ccc}}
</view>
```

## Options
此规则的参数与eslint规则[dot-location](https://eslint.org/docs/rules/dot-location) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式