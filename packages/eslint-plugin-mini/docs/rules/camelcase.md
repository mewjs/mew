# 检查是否驼峰命名 (camelcase)

## Rule Details

此规则将检查表达式中变量是否有下滑线`_`, 并强制使用驼峰命名，忽略变量的前导和尾随下划线，仅检查变量名中间的下划线

正确的代码示例:

```xml
<view>
    {{myPref}}
</view>

<view class="{{myClass}}"></view>
```

错误的代码示例:

```xml
<view>
    {{my_pref}}
</view>

<view class="{{my_class}}"></view>
```

## Options
此规则的参数与eslint规则[camelcase](https://eslint.org/docs/rules/camelcase) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式