# 禁止尾随逗号 (comma-dangle)

## Rule Details

此规则检查数组和对象内部末尾的逗号

正确的代码示例:

```xml
<view>
    {{[1, 2, 3]}}
</view>

<view wx:for="{{[1, 2, 3]}}">
    {{item}}
</view>
```

错误的代码示例:

```xml
<view>
    {{[1, 2, 3,]}}
</view>

<view wx:for="{{[1, 2, 3,,]}}">
    {{item}}
</view>
```

## Options
此规则的参数与eslint规则[comma-dangle](https://eslint.org/docs/rules/dangle) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式