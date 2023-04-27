# mini/no-duplicate-else-if
> `wx:if` / `wx:elif` 链中不允许出现重复的条件

- :gear: 该规则适用于这些分类： `"plugin:mini/essential"`、`"plugin:mini/strongly-recommended"`、`"plugin:mini/recommended"`。

## :book: 规则详情

1. 该规则不允许在同一个`wx:if` / `wx:elif` 链中出现重复条件。

+ 正确的代码示例：

```xml
<block>
  <view wx:if="{{isSomething(x)}}" />
  <view wx:elif="{{isSomethingElse(x)}}" />

  <view wx:if="{{a}}" />
  <view wx:elif="{{b}}" />
  <view wx:elif="{{c && d}}" />
  <view wx:elif="{{c && e}}" />

  <view wx:if="{{n === 1}}" />
  <view wx:elif="{{n === 2}}" />
  <view wx:elif="{{n === 3}}" />
  <view wx:elif="{{n === 4}}" />
  <view wx:elif="{{n === 5}}" />
</block>
```

+ 错误的代码示例：

```xml
<block>
  <view wx:if="{{isSomething(x)}}" />
  <view wx:elif="{{isSomething(x)}}" />

  <view wx:if="{{a}}" />
  <view wx:elif="{{b}}" />
  <view wx:elif="{{c && d}}" />
  <view wx:elif="{{c && d}}" />

  <view wx:if="{{n === 1}}" />
  <view wx:elif="{{n === 2}}" />
  <view wx:elif="{{n === 3}}" />
  <view wx:elif="{{n === 2}}" />
  <view wx:elif="{{n === 5}}" />
</block>
```


2. 此规则还可以检测虽然条件不完全相同，但由于`||` 和 `&&`运算符的逻辑导致分支永远无法执行的情况。

+ 错误的代码示例：

```xml
<block>
  <view wx:if="{{a || b}}" />
  <view wx:elif="a" />

  <view wx:if="{{a}}" />
  <view wx:elif="b" />
  <view wx:elif="{{a || b}}" />

  <view wx:if="{{a}}" />
  <view wx:elif="{{a && b}}" />

  <view wx:if="{{a && b}}" />
  <view wx:elif="{{a && b && c}}" />

  <view wx:if="{{a || b}}" />
  <view wx:elif="{{b && c}}" />

  <view wx:if="{{a}}" />
  <view wx:elif="{{b && c}}" />
  <view wx:elif="{{d && (c && e && b || a)}}" />
</block>
```

## :wrench: Options

无。

## :couple: 相关规则

- [no-dupe-else-if]

[no-dupe-else-if]: https://eslint.org/docs/rules/no-dupe-else-if

## :mag: 源码
