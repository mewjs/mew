# 检查数组内部空格 (array-bracket-spacing)

## Rule Details

此规则强制数组开括号后和闭括号前的空格保持一致。

正确的代码示例:

```xml
<view wx:for="{{[1, 2, 3]}}">
    {{item}}
</view>

<view>
    {{[1, 2, 3]}}
</view>
```

错误的代码示例:

```xml
<view wx:for="{{[ 1, 2, 3 ]}}">
    {{item}}
</view>

<view>
    {{[ 1, 2, 3 ]}}
</view>
```

## Options
此规则的参数与eslint规则[array-bracket-spacing](https://eslint.org/docs/rules/array-bracket-spacing) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式