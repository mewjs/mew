# mini/no-restricted-static-attribute
> 限制指定属性的使用

## :book: 规则详情

该规则允许用户定义其应用中限制使用的指定属性名。

## :wrench: Options

该规则使用字符串数组，其中每个字符串都是要限制的属性名或正则表达式：

```json
{
  "mini/no-restricted-static-attribute": ["error", "foo", "bar"]
}
```
### `['error', 'foo', 'bar']`
+ 错误的代码示例：

```xml
<block>
  <view foo="zhangsan" />
  <view bar="{{a}}" />
</block>
```

规则也可以是对象。

```json
{
  "mini/no-restricted-static-attribute": ["error",
    {
      "key": "stlye",
      "message": "Using \"stlye\" is not allowed. Use \"style\" instead."
    }
  ]
}
```

可以为对象指定以下属性。

- `key` ：指定属性键名称或正则表达式。
- `value` ：指定值为正则表达式或者“true”。如果指定，则仅在使用指定值时报错。如果为“true”，则只有在没有值或值和键相同时才会报错。
- `element` ：指定元素名字或正则表达式。如果指定了，则只有在使用到指定元素时会报错。
- `message` ：指定可选的自定义消息。

### `{ "key": "foo", "value": "bar"  }`

+ 正确的代码示例：

```xml
<block>
  <view hover-class="foo" />
</block>
```


+ 错误的代码示例：

```xml
<block>
  <view foo="bar" />
</block>
```


### `{ "key": "foo", "element": "MyButton"  }`

+ 正确的代码示例：

```xml
<view>>
  <cool-button hover-class="{{x}}" />
</view>
```


+ 错误的代码示例：

```xml
<view>
  <my-button foo="{{x}}" />
</view>
```


## :couple: 相关规则

- [mini/no-restricted-v-bind]

[mini/no-restricted-v-bind]: ./no-restricted-v-bind.md

## :mag: 源码

