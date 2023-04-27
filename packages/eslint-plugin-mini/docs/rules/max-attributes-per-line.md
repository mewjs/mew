# mini/max-attributes-per-line
> 限制每行属性个数上限

- :gear: 该规则适用于这些分类： `"plugin:mini/recommended"`、`"plugin:mini/strongly-recommended"`。
- :wrench: [命令行]的`--fix` 选项可以自动修复该规则检查出来的一些问题（https://eslint.org/docs/user-guide/command-line-interface#fixing-problems）。

为提高代码可读性而设定每行代码属性个数上限，超过设定上限需要换行。

## :book: 规则详情

1. 该规则用于限定wxml文件中每行属性个数的最大值。
2. 该规则检查模板中的所有元素，并且验证每行的属性个数是否未超过定义的最大值。
3. 当两个属性之间有换行符时，属性被认为位于新行中。
4. 在单行和多行情况下属性个数最大值是可配置的（默认值均为1）。

+ 正确的代码示例：

```xml
<view>
  <my-component lorem="{{1}}"/><!-- 单行情况下默认属性个数上限为1 -->
  <my-component
    lorem="{{1}}"
    ipsum="{{2}}"
  /><!-- 多行情况下默认属性个数上限为1 -->
  <my-component
    lorem="{{1}}"
    ipsum="{{2}}"
    dolor="{{3}}"
  />
</view>
```

+ 错误的代码示例：

```xml
<view>
  <my-component lorem="{{1}}" ipsum="{{2}}"/>
  <my-component
    lorem="{{1}}" ipsum="{{2}}"
  />
  <my-component
    lorem="{{1}}" ipsum="{{2}}"
    dolor="{{3}}"
  />
</view>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "mini/max-attributes-per-line": ["error", {
    "singleline": 1,
    "multiline": {
      "max": 1,
      "allowFirstLine": false
    }
  }]
}
```

- `singleline` (`number`)： 当开始标签在单行时每行属性个数的最大值，默认值是`1`。
- `multiline.max` (`number`)：当开始标签在多行时每行属性个数的最大值，默认值是`1`。 如果用户不配置`allowFirstLine`属性，可以用 `{ multiline: 1 }` 代替 `{ multiline: { max: 1 }}`。
- `multiline.allowFirstLine` (`boolean`)：如果值为 `true`则允许属性与标签名位于同一行，默认值是 `false`。

### `"singleline": 3`

+ 正确的示例：

```xml
<view>
  <my-component lorem="{{1}}" ipsum="{{2}}" dolor="{{3}}" />
</view>
```

</eslint-code-block>

+ 错误的示例：
<eslint-code-block fix :rules="{'mini/max-attributes-per-line': ['error', {singleline: 3}]}">

```xml
<view>
  <my-component lorem="{{1}}" ipsum="{{2}}" dolor="{{3}}" sit="{{4}}" />
</view>
```

### `"multiline": 2`

+ 正确的示例：

```xml
<view>
  <my-component
    lorem="{{1}}" ipsum="{{2}}"
    dolor="{{3}}"
  />
</view>
```

</eslint-code-block>

+ 错误的示例：

```xml
<view>
  <my-component
    lorem="{{1}}" ipsum="{{2}}" dolor="{{3}}"
    sit="{{4}}"
  />
</view>
```


### `"multiline": 1, "allowFirstLine": true`

+ 正确的示例：

```xml
<view>
  <my-component lorem="{{1}}"
               ipsum="{{2}}"
               dolor="{{3}}"
  />
</view>
```


## :mag: 源码
