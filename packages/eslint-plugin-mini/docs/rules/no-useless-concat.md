# 禁止不必要的字符串连接 (no-useless-concat)

## Rule Details

此规则禁止不必要的字符串字面量连接

正确的代码示例:

```xml
<view class="{{myClass}}">
    {{"hello world"}}
</view>

<view class="{{myClass}}">
    {{"hello " + name}}
</view>
```

错误的代码示例:

```xml
<view class="{{myClass}}">
    {{"hello " + "world"}}
</view>

<view class="{{myClass}}">
    {{"hello " + name + "!" + "\n"}}
</view>
```

## Options
此规则的参数与eslint规则[no-useless-concat](https://eslint.org/docs/rules/no-useless-concat) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式