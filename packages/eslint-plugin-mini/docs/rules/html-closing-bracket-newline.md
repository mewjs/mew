# mini/html-closing-bracket-newline
> 闭合标签的强制换行或强制不换行

- :gear: 该规则适用于这些分类： `"plugin:mini/recommended"`、`"plugin:mini/strongly-recommended"`。
- :wrench: [命令行]的`--fix` 选项可以自动修复该规则检查出来的一些问题（https://eslint.org/docs/user-guide/command-line-interface#fixing-problems）。

用户可以自定义闭合标签的换行偏好。
该规则校验 wxml 文件中闭合标签换行是否正确。


## :book: 规则详情

该规则用于警告没有位于配置位置的闭合标签。

+ 正确的代码示例：

```xml
<block>
    <view></view>  <!-- 单行情况下闭合标签默认不换行 -->
    <view
    class="{{a}}"
    ><!-- 多行情况下闭合标签默认换行 -->
    </view>
</block>
```

+ 错误的代码示例：

```xml
<block>
  <view hover-stay-time="{{foo}}" class="{{bar}}"
  >
  <view
    hover-stay-time="{{foo}}"
    class="{{bar}}">
</block>
```

## :wrench: Options

```json
{
  "mini/html-closing-bracket-newline": ["error", {
    "singleline": "never",
    "multiline": "always"
  }]
}
```

- `singleline`:单行元素的结束标签换行配置。单行元素：元素没有属性或最后一个属性与开始标签在同一行。
    - `"never"`（默认）：不允许在结束标签前换行。
    - `"always"`：必须在结束标签前换行。
- `multiline`：多航元素的结束标签换行配置. 多行元素：最后一个属性与开始标签不在同一行。
    - `"never"`：不允许在结束标签前换行。
    - `"always"`（默认）：必须在结束标签前换行。


### `"singleline": "always","multiline": "never"`

+ 正确的代码示例：

```xml
<block
>
  <view
      hover-stay-time="{{foo}}"
      class="{{bar}}">
  </view
  >
  <view
      hover-stay-time="{{a}}">
  </view
  >
</block
>
```


+ 错误的代码示例：

```xml
<block>
  <view
      hover-stay-time="{{foo}}"
      class="{{bar}}"
  >
  </view>
  <view
      hover-stay-time="{{a}}"
  >
  </view>
</block>
```


## :mag: 源码


