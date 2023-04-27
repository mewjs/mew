# 检查html注释内部换行符 (html-comment-content-newline)

## Rule Details

此规则强制html注释`<!--`后和`-->`前的换行保持一致，可以设置换行前存在特殊字符。

正确的代码示例:

```xml
<!-- -->

<!-- comment -->

<!--
    multiline
    comment
-->

<!--

    multiline
    comment

-->
```

错误的代码示例:

```xml
<!--
    comment
-->

<!-- multiline
comment -->
```

## Options

```javascript
[
    'html-comment-content-newline': [
        'error',
        {
            'singleline': 'always' | 'never',
            'multiline': 'always' | 'never',
        },
        {
            'exceptions': []
        }
    ]
]
```

### singleline
-   'always':  单行注释`<!--`后和`-->`前必须存在换行
-   'never':  默认， 单行注释`<!--`后和`-->`前不能存在换行

### multiline
-   'always':  默认，多行注释`<!--`后和`-->`前必须换行
-   'never':  多行注释`<!--`后和`-->`前不能存在换行

当singleline和multiline设置相同时，可简写成一个，例如：`[2, 'always']`表示`[2, {singleline: 'always', multiline: 'always']`

### exceptions
设置`<!--`后和`-->`前可以存在特殊字符，例如: `[2, 'always', {exceptions: ['+-+']}]`

```xml
<!--+-++-+
    comment
+-++-+-->
```

