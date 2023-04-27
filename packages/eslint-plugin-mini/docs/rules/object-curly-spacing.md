# 检查对象括号间空格 (object-curly-spacing)

## Rule Details

此规则检查对象左括号`{`后和右括号前`}`的空格

正确的代码示例:

```xml
<template data="{{a, b, c}}"></template>

<template data="{{a: 1, b: 2, c: 3}}"></template>
```

错误的代码示例:

```xml
<template data="{{ a, b, c }}"></template>

<template data="{{   a: 1, b: 2, c: 3   }}"></template>
```

## Options
此规则的参数与eslint规则[object-curly-spacing](https://eslint.org/docs/rules/object-curly-spacing) 相同

## When Not To Use It

此规则仅适用于小程序模板中的表达式