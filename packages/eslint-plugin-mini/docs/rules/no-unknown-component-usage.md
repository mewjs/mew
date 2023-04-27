# 检查未注册的自定义组件 (no-unknown-component-usage)

## Rule Details

此规则检查未在`usingComponents`注册的自定义组件

正确的代码示例:

```xml
<view><text>hello world</text></view>

<custom-component>abc</custom-component>
<!--
    "usingComponents": {
        "component-tag-name": "path/to/the/custom/component"
    }
-->
```

错误的代码示例:

```xml
<unknown-component>abc</unknown-component>
<!--
    "usingComponents": {}
-->
```

## Options

无
