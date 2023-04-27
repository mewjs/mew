# 强制运算符前后加空格 (space-infix-ops)

## Rule Details

此规则强制运算符`+、-、*、/、%、||、&&、&、|、?:、>、<、>=、<=、<<、>>`前后必须加上空格

正确的代码示例:

```xml
<view>{{3 << 2}}</view>

<view>{{(1 + 1) * 5 / (3 - 1) % 3}}</view>

<view wx:if="{{(abc || bcd) && cde}}"></view>

<view wx:if="{{abc >= 3 ? 5 & 3 : 9 | 5}}"></view>
```

错误的代码示例:

```xml
<view>{{3<<2}}</view>

<view>{{(1+1)* 5 /(3 -1)%3}}</view>

<view wx:if="{{(abc|| bcd)&&cde}}"></view>

<view wx:if="{{abc>=3?5&3:9|5}}"></view>
```

## Options
此规则的参数与eslint规则[space-infix-ops](https://eslint.org/docs/rules/space-infix-ops) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式