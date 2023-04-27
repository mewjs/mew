# 检查对象内部属性键间距 (key-spacing)

## Rule Details

此规则检查对象内部属性的键间距

正确的代码示例:

```xml
<view>
    {{1 === 1 ? {a: 1} : 2}}
</view>
```

错误的代码示例:

```xml
<view>
    {{1 === 1 ? {a:1} : 2}}
</view>

<view>
    {{1 === 1 ? {a :1} : 2}}
</view>
```

## Options
此规则的参数与eslint规则[key-spacing](https://eslint.org/docs/rules/key-spacing) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式