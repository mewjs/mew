# 禁止稀疏数组 (no-sparse-arrays)

## Rule Details

此规则不允许字面量数组中逗号前没有元素，即不允许稀疏数组。它不适用于最后一个元素后面的逗号。

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
    {{[1, 2, , 3]}}
</view>

<view wx:for="{{[, , 3]}}">
    <view wx:if="{{index === 2}}">
        {{item}}
    </view>
</view>
```

## Options
此规则的参数与eslint规则[no-sparse-arrays](https://eslint.org/docs/rules/no-sparse-arrays) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式