# mini/singleline-html-element-content-newline
> require a line break before and after the contents of a singleline element

- :gear: 该规则适用于这些分类： `"plugin:mini/strongly-recommended"`、`"plugin:mini/recommended"`。
- :wrench: [命令行]的`--fix` 选项可以自动修复该规则检查出来的一些问题（https://eslint.org/docs/user-guide/command-line-interface#fixing-problems）。

## :book: Rule Details

该规则强制对行内元素的内容前后进行换行。

+ 正确的代码示例：

```xml
<block>
    <label>content</label>
    <label class="label-2-text">content</label>
    <label class="label-2-text"><text>{{item.name}}</text></label>
    <audio poster="{{poster}}" src="{{src}}" id="myAudio" controls loop></audio>
    <video id="myVideo" binderror="videoErrorCallback"></video>
    <video id="myVideo" binderror="videoErrorCallback"></video>
    <canvas><text>content</text></canvas>
</block>
```

+ 错误的代码示例：

```xml
<block>
    <view class="panel">content</view>
    <textarea class="panel">content</textarea>
</block>
```

## :wrench: Options

```js
{
  "mini/singleline-html-element-content-newline": ["error", {
    "ignoreWhenNoAttributes": true,
    "ignoreWhenEmpty": true,
    "ignores": ["pre", "textarea", ...INLINE_ELEMENTS]
  }]
}
```

- `ignoreWhenNoAttributes`：当给定元素没有属性时，允许在一行中包含内容。
    默认值： `true`
- `ignoreWhenEmpty`： 当元素没有内容时不报错。
    默认值： `true`
- `ignores`： 忽略换行的元素名称的配置项。
    默认值: `[...INLINE_ELEMENTS]`。


::: info
  
:::

### `"ignoreWhenNoAttributes": false`

+ 错误的代码示例：

```xml
<block>
  <view>content</div>
  <form><input>{{ data1 }}</input><input>{{ data2 }}</input></form>

  <view><!-- 注释 --></view>
</block>
```

## :mag: 源码

